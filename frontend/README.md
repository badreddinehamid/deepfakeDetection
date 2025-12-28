# Deepfake Detection API

A FastAPI backend for deepfake/tampered image detection using PyTorch.

## Features

- Image upload endpoint for prediction
- Automatic model loading on startup
- Preprocessing pipeline (resize to 224x224, normalization)
- Binary classification: Authentic (0) or Tampered (1)
- Returns prediction, confidence scores, and raw logits

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Place your PyTorch model file (`.pth` extension) in the working directory.

3. Run the API:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### `GET /`
Root endpoint with API information and model status.

### `POST /predict`
Main prediction endpoint. Upload an image file to get predictions.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: image file (JPEG, PNG, etc.)

**Response:**
```json
{
  "prediction": "Authentic",
  "class": 0,
  "confidence": 0.9876,
  "probabilities": {
    "authentic": 0.9876,
    "tampered": 0.0124
  },
  "raw_logits": {
    "class_0": 4.5234,
    "class_1": -2.1234
  }
}
```

### `POST /load-model`
Manually load or reload the model.

**Request:**
- Method: POST
- Query parameter: `model_path` (optional, default: "model.pth")

### `GET /health`
Health check endpoint.

## Testing the API

Using curl:
```bash
curl -X POST "http://localhost:8000/predict" -F "file=@path/to/your/image.jpg"
```

Using Python:
```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("path/to/image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## Model Requirements

- Input shape: `(batch_size, 3, 224, 224)`
- Output shape: `(batch_size, 2)` - raw logits for binary classification
- Classes: 0 = Authentic, 1 = Tampered

## Notes

- The model is automatically loaded on startup if a `.pth` file is found in the working directory
- Images are automatically resized to 224x224 and normalized using ImageNet statistics
- The API uses GPU if available, otherwise falls back to CPU

