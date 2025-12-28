from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageChops, ImageEnhance
import io
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from typing import Optional
import traceback
import os
import numpy as np

app = FastAPI(title="VeriFrame API", version="1.0.0", description="AI-powered deepfake detection")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store the model
model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pth")
_last_logits = None  # Track last prediction to detect constant outputs

def apply_ela(image, quality=90):
    """
    Apply Error Level Analysis (ELA) preprocessing to the image.
    Matches the training pipeline exactly:
    1. Save image to JPEG with specified quality
    2. Reload the compressed JPEG
    3. Calculate pixel-wise difference using ImageChops.difference
    4. Amplify differences using ImageEnhance.Brightness
    5. Resize to (224, 224)
    
    Args:
        image: PIL Image object (RGB)
        quality: JPEG quality for recompression (default 90, matching training)
    
    Returns:
        ELA processed PIL Image resized to (224, 224)
    """
    # Save original image to temporary buffer as JPEG with specified quality
    temp_buffer = io.BytesIO()
    image.save(temp_buffer, format='JPEG', quality=quality)
    temp_buffer.seek(0)
    
    # Reload the compressed JPEG image
    reloaded_image = Image.open(temp_buffer)
    
    # Calculate pixel-wise difference between original and re-compressed image
    # Using ImageChops.difference (matches training code)
    diff_image = ImageChops.difference(image, reloaded_image)
    
    # Amplify the differences to make artifacts more visible
    # Using ImageEnhance.Brightness (matches training code)
    enhancer = ImageEnhance.Brightness(diff_image)
    ela_image = enhancer.enhance(10.0)  # Amplify by 10x (common value, adjust if needed)
    
    # Resize to (224, 224) - matching training pipeline
    ela_image = ela_image.resize((224, 224), Image.Resampling.LANCZOS)
    
    return ela_image

# Image preprocessing pipeline - matches training exactly
# After ELA (which already resizes to 224x224), just convert to tensor
# ToTensor() normalizes pixel values to [0, 1] range
transform = transforms.Compose([
    transforms.ToTensor()  # Converts PIL Image to tensor and normalizes to [0, 1]
    # No resize needed - ELA already resizes to (224, 224)
    # No ImageNet normalization - training only uses ToTensor()
])

def load_model(model_path: str = MODEL_PATH):
    """
    Load the PyTorch model from a .pth file.
    """
    global model
    
    try:
        print(f"Loading model from: {model_path}")
        print(f"Device: {device}")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        
        # Load the checkpoint
        checkpoint = torch.load(model_path, map_location=device)
        
        # Try to determine the model structure
        # Check if it's a state dict or a full model
        if isinstance(checkpoint, dict):
            # Check if it contains 'state_dict' or 'model_state_dict'
            if 'state_dict' in checkpoint:
                state_dict = checkpoint['state_dict']
                # Try to infer model architecture from state dict keys
                model = create_model_from_state_dict(state_dict)
            elif 'model_state_dict' in checkpoint:
                state_dict = checkpoint['model_state_dict']
                model = create_model_from_state_dict(state_dict)
            elif 'model' in checkpoint:
                # Full model object
                model = checkpoint['model']
                if isinstance(model, nn.Module):
                    model.eval()
                    model.to(device)
                    print(f"Model loaded successfully on {device}")
                    return model
            else:
                # Assume the entire dict is the state dict
                model = create_model_from_state_dict(checkpoint)
        else:
            # Assume it's a full model
            model = checkpoint
            if isinstance(model, nn.Module):
                model.eval()
                model.to(device)
                print(f"Model loaded successfully on {device}")
                return model
        
        print(f"Model loaded successfully on {device}")
        return model
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error loading model: {str(e)}")
        print(f"Traceback: {error_trace}")
        raise Exception(f"Error loading model: {str(e)}")

def create_model_from_state_dict(state_dict):
    """
    Create a model architecture from state dict by inferring the structure.
    """
    # Get the keys to understand the architecture
    keys = list(state_dict.keys())
    
    print(f"DEBUG - State dict has {len(keys)} keys")
    print(f"DEBUG - First 10 keys: {keys[:10]}")
    
    # Try to determine if it's a ResNet, EfficientNet, or custom CNN
    # For now, we'll try to load it as a generic model or use a common architecture
    
    # Check if it looks like a ResNet
    if any('resnet' in k.lower() or 'layer' in k.lower() for k in keys):
        print("DEBUG - Detected ResNet-like architecture")
        try:
            # Try ResNet18 as a common architecture
            from torchvision.models import resnet18
            model = resnet18(pretrained=False)
            # Modify the final layer for binary classification
            model.fc = nn.Linear(model.fc.in_features, 2)
            missing_keys, unexpected_keys = model.load_state_dict(state_dict, strict=False)
            print(f"DEBUG - ResNet18: Missing {len(missing_keys)} keys, Unexpected {len(unexpected_keys)} keys")
            if len(missing_keys) > 0:
                print(f"DEBUG - First 5 missing keys: {missing_keys[:5]}")
        except Exception as e:
            print(f"DEBUG - ResNet18 loading failed: {e}")
            model = create_generic_cnn()
            try:
                missing_keys, unexpected_keys = model.load_state_dict(state_dict, strict=False)
                print(f"DEBUG - Generic CNN: Missing {len(missing_keys)} keys, Unexpected {len(unexpected_keys)} keys")
            except Exception as e2:
                print(f"DEBUG - Generic CNN loading failed: {e2}")
                print("WARNING: Could not load state dict. Using default architecture with random weights!")
    else:
        # Try to create a generic CNN
        print("DEBUG - Using generic CNN architecture")
        model = create_generic_cnn()
        try:
            missing_keys, unexpected_keys = model.load_state_dict(state_dict, strict=False)
            print(f"DEBUG - Generic CNN: Missing {len(missing_keys)} keys, Unexpected {len(unexpected_keys)} keys")
            if len(missing_keys) > len(keys) * 0.3:  # If more than 30% keys are missing
                print(f"WARNING: {len(missing_keys)} out of {len(keys)} keys failed to load ({len(missing_keys)/len(keys)*100:.1f}%)!")
                print("WARNING: Model may not work correctly with random weights!")
        except Exception as e:
            print(f"WARNING: Could not load state dict exactly: {e}")
            print("WARNING: Using default architecture with random weights!")
    
    model.eval()
    model.to(device)
    
    # Test the model with dummy inputs to verify it works and varies outputs
    try:
        print("DEBUG - Testing model with random inputs...")
        test_input1 = torch.randn(1, 3, 224, 224).to(device)
        test_input2 = torch.randn(1, 3, 224, 224).to(device)
        with torch.no_grad():
            test_output1 = model(test_input1)
            test_output2 = model(test_input2)
        print(f"DEBUG - Model test output 1: {test_output1[0].tolist()}")
        print(f"DEBUG - Model test output 2: {test_output2[0].tolist()}")
        
        # Check if outputs are different (model should vary)
        diff = torch.abs(test_output1 - test_output2).sum().item()
        if diff < 0.01:
            print(f"WARNING: Model outputs are identical for different inputs! Model may not be working.")
            print(f"WARNING: This suggests model weights may not be loaded correctly.")
        else:
            print(f"DEBUG - Model outputs vary (difference: {diff:.4f}), model appears to be working.")
    except Exception as e:
        print(f"DEBUG - Model test failed: {e}")
    
    return model

def create_generic_cnn():
    """
    Create a generic CNN architecture for binary image classification.
    """
    class DeepfakeCNN(nn.Module):
        def __init__(self):
            super(DeepfakeCNN, self).__init__()
            self.features = nn.Sequential(
                # First block
                nn.Conv2d(3, 64, kernel_size=3, padding=1),
                nn.BatchNorm2d(64),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2),
                
                # Second block
                nn.Conv2d(64, 128, kernel_size=3, padding=1),
                nn.BatchNorm2d(128),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2),
                
                # Third block
                nn.Conv2d(128, 256, kernel_size=3, padding=1),
                nn.BatchNorm2d(256),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2),
                
                # Fourth block
                nn.Conv2d(256, 512, kernel_size=3, padding=1),
                nn.BatchNorm2d(512),
                nn.ReLU(inplace=True),
                nn.MaxPool2d(2, 2),
            )
            
            self.classifier = nn.Sequential(
                nn.AdaptiveAvgPool2d((1, 1)),
                nn.Flatten(),
                nn.Dropout(0.5),
                nn.Linear(512, 256),
                nn.ReLU(inplace=True),
                nn.Dropout(0.5),
                nn.Linear(256, 2)
            )
        
        def forward(self, x):
            x = self.features(x)
            x = self.classifier(x)
            return x
    
    return DeepfakeCNN()

def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """
    Preprocess the uploaded image to match the exact training pipeline.
    
    Steps (matching training exactly):
    1. Load image from bytes and convert to RGB
    2. Compute ELA (Error Level Analysis):
       - Save to JPEG with quality 90
       - Reload compressed JPEG
       - Calculate difference using ImageChops.difference
       - Amplify using ImageEnhance.Brightness
       - Resize to (224, 224)
    3. Convert to PyTorch tensor using ToTensor() (normalizes to [0, 1])
    4. Add batch dimension using unsqueeze(0)
    5. Move to device (CPU/GPU)
    
    Returns a tensor of shape (1, 3, 224, 224).
    """
    try:
        # Step 1: Load original image and convert to RGB
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Step 2: Compute ELA (includes resize to 224x224)
        print("DEBUG - Computing ELA...")
        ela_image = apply_ela(image, quality=90)  # Quality 90 matches training
        
        # Step 3: Convert to PyTorch tensor
        # ToTensor() normalizes pixel values to [0, 1] and converts to (C, H, W) = (3, 224, 224)
        image_tensor = transform(ela_image)
        
        # Verify tensor shape: should be (3, 224, 224)
        if image_tensor.shape != (3, 224, 224):
            print(f"WARNING: Tensor shape is {image_tensor.shape}, expected (3, 224, 224)")
        
        # Step 4: Add batch dimension: (3, 224, 224) -> (1, 3, 224, 224)
        image_tensor = image_tensor.unsqueeze(0)
        
        # Step 5: Move to device (CPU/GPU)
        image_tensor = image_tensor.to(device)
        
        print(f"DEBUG - Final tensor shape: {image_tensor.shape}, device: {device}")
        
        return image_tensor
    
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error in preprocessing: {str(e)}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(status_code=400, detail=f"Error preprocessing image: {str(e)}")

def predict_image(image_tensor: torch.Tensor) -> dict:
    """
    Run inference on the preprocessed image tensor.
    Returns prediction results.
    """
    global model
    
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please load the model first.")
    
    try:
        # Set model to evaluation mode
        model.eval()
        
        # Disable gradient computation for inference
        with torch.no_grad():
            # Forward pass
            outputs = model(image_tensor)
            
            # DEBUG: Print raw logits
            global _last_logits
            raw_logit_0 = outputs[0][0].item()
            raw_logit_1 = outputs[0][1].item()
            print(f"DEBUG - Raw logits: Class 0 = {raw_logit_0:.4f}, Class 1 = {raw_logit_1:.4f}")
            
            # Check if model is outputting constant values
            if _last_logits is not None:
                if abs(_last_logits[0] - raw_logit_0) < 0.01 and abs(_last_logits[1] - raw_logit_1) < 0.01:
                    print(f"WARNING: Model output is constant! Same logits as previous prediction.")
                    print(f"WARNING: This suggests model weights may not be loading correctly or model is broken.")
            _last_logits = (raw_logit_0, raw_logit_1)
            
            # Match the training code pattern exactly:
            # prob = torch.softmax(output, dim=1)[0, 1].item()
            # label = "FAKE" if prob > 0.5 else "AUTHENTIC"
            # So: Class 0 = AUTHENTIC, Class 1 = FAKE/TAMPERED
            
            # Get probabilities using softmax (same as training code)
            probabilities = torch.softmax(outputs, dim=1)
            
            # Get probability of class 1 (FAKE/TAMPERED) - matching training code
            prob_class_1 = probabilities[0, 1].item()  # Probability of FAKE/TAMPERED
            prob_class_0 = probabilities[0, 0].item()  # Probability of AUTHENTIC
            
            print(f"DEBUG - Probabilities: Class 0 (AUTHENTIC) = {prob_class_0:.4f}, Class 1 (TAMPERED) = {prob_class_1:.4f}")
            
            # Determine prediction using same logic as training code
            # label = "FAKE" if prob > 0.5 else "AUTHENTIC"
            if prob_class_1 > 0.5:
                prediction = "Tampered"  # FAKE
                predicted_class_idx = 1
                confidence = prob_class_1
            else:
                prediction = "Authentic"  # AUTHENTIC
                predicted_class_idx = 0
                confidence = prob_class_0
            
            print(f"DEBUG - Prediction: {prediction} (prob_class_1 = {prob_class_1:.4f}, threshold = 0.5)")
            print(f"DEBUG - Confidence: {confidence:.4f}")
            
            # Check if logits are suspicious
            if abs(raw_logit_0 - raw_logit_1) < 0.1:
                print(f"WARNING: Logits are very close! Model may not be working correctly.")
            
            # Check if model always predicts the same class
            if prob_class_1 > 0.99:
                print(f"WARNING: Model always predicting TAMPERED with very high confidence!")
            elif prob_class_0 > 0.99:
                print(f"WARNING: Model always predicting AUTHENTIC with very high confidence!")
            
            return {
                "prediction": prediction,
                "class": predicted_class_idx,
                "confidence": round(confidence, 4),
                "probabilities": {
                    "authentic": round(prob_class_0, 4),  # Class 0 = AUTHENTIC
                    "tampered": round(prob_class_1, 4)    # Class 1 = TAMPERED/FAKE
                },
                "raw_logits": {
                    "class_0": round(raw_logit_0, 4),  # Class 0 = AUTHENTIC
                    "class_1": round(raw_logit_1, 4)   # Class 1 = TAMPERED/FAKE
                }
            }
    
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error during prediction: {str(e)}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Load the local PyTorch model when the application starts."""
    global model
    try:
        print("=" * 50)
        print("Starting VeriFrame API")
        print("=" * 50)
        model = load_model()
        print("=" * 50)
        print("API ready to accept requests")
        print("=" * 50)
    except Exception as e:
        print(f"Error loading model on startup: {str(e)}")
        print("The API will still start, but predictions will fail until the model is loaded.")
        print("You can try to load the model manually using the /load-model endpoint.")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "VeriFrame API - Deepfake Detection",
        "status": "running",
        "model": "Local PyTorch Model",
        "model_path": MODEL_PATH,
        "model_loaded": model is not None,
        "device": str(device),
        "version": "1.0.0"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict whether an uploaded image is Authentic or Tampered.
    
    - **file**: Image file (JPEG, PNG, etc.)
    
    Returns:
    - prediction: "Authentic" or "Tampered"
    - class: 0 (Authentic) or 1 (Tampered)
    - confidence: Confidence score for the prediction
    - probabilities: Probability scores for both classes
    - raw_logits: Raw model output before softmax
    """
    # Check if model is loaded
    if model is None:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please wait for the model to load or use /load-model endpoint."
        )
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Preprocess image
        image_tensor = preprocess_image(image_bytes)
        
        # Make prediction
        result = predict_image(image_tensor)
        
        return JSONResponse(content=result)
    
    except HTTPException:
        raise
    except Exception as e:
        # Log the full error for debugging
        error_trace = traceback.format_exc()
        print(f"Error in prediction: {str(e)}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/load-model")
async def load_model_endpoint(model_path: Optional[str] = None):
    """
    Manually load or reload the local PyTorch model.
    """
    global model
    try:
        path = model_path if model_path else MODEL_PATH
        model = load_model(path)
        return {
            "message": "Model loaded successfully",
            "model_path": path,
            "device": str(device)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "device": str(device)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

