# 🛡️ VeriFrame - AI-Powered Image Verification System

<div align="center">

![VeriFrame Logo](https://img.shields.io/badge/VeriFrame-AI%20Image%20Verification-6366f1?style=for-the-badge&logo=shield-check&logoColor=white)

**Advanced deep learning platform for detecting tampered, manipulated, and deepfake images**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure) • [Team](#-team)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Team](#-team)
- [License](#-license)

## 🎯 About

VeriFrame is a cutting-edge web application that leverages advanced deep learning models to detect image tampering, manipulation, and deepfake content. Built with modern web technologies and state-of-the-art AI algorithms, VeriFrame provides real-time image analysis with high accuracy confidence scores.

### Key Capabilities

- **Error Level Analysis (ELA)**: Advanced preprocessing technique that highlights compression artifacts and manipulation traces
- **Deep Learning Detection**: Convolutional neural networks trained to identify subtle signs of image manipulation
- **Real-Time Processing**: Fast image analysis with detailed confidence scores and probability breakdowns
- **User-Friendly Interface**: Modern, responsive web interface with dark/light mode support

## ✨ Features

### 🎨 Frontend Features
- **Multi-Page Application**: Professional landing page, detection interface, and about page
- **3D Animations**: Interactive Three.js background animations
- **Responsive Design**: Fully responsive layout for desktop and mobile devices
- **Dark/Light Mode**: Seamless theme switching with smooth transitions
- **Real-Time Status**: Backend connection status indicator
- **Detailed Results**: Comprehensive analysis with confidence scores, probabilities, and raw logits

### 🤖 Backend Features
- **FastAPI REST API**: High-performance async API for image processing
- **PyTorch Model Inference**: Efficient deep learning model serving
- **ELA Preprocessing**: Error Level Analysis pipeline matching training specifications
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Tech Stack

### Frontend

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 18.2.0 |
| **Build Tool** | Vite | 5.0.8 |
| **Routing** | React Router DOM | 7.11.0 |
| **Styling** | Tailwind CSS | 3.3.6 |
| **Animations** | Framer Motion | 10.16.16 |
| **3D Graphics** | Three.js | 0.160.0 |
| **3D React** | @react-three/fiber | 8.15.19 |
| **3D Helpers** | @react-three/drei | 9.88.13 |
| **HTTP Client** | Axios | 1.6.2 |
| **Icons** | Lucide React | 0.294.0 |

### Backend

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | FastAPI | 0.104.1 |
| **Server** | Uvicorn | 0.24.0 |
| **Deep Learning** | PyTorch | ≥2.0.0 |
| **Computer Vision** | Torchvision | ≥0.15.0 |
| **Image Processing** | Pillow (PIL) | ≥10.0.0 |
| **Numerical Computing** | NumPy | ≥1.24.0 |
| **File Upload** | python-multipart | 0.0.6 |

### Development Tools

- **TypeScript Types**: @types/react, @types/react-dom
- **CSS Processing**: PostCSS, Autoprefixer
- **Code Quality**: ESLint (recommended)

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)
- **CUDA** (optional, for GPU acceleration)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/veriframe.git
cd veriframe
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r ../frontend/requirements.txt

# Ensure model.pth is in the backend directory
# (The model file should be placed in backend/model.pth)
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Usage

### Starting the Backend Server

```bash
# From the backend directory
cd backend

# Activate virtual environment (if not already activated)
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Starting the Frontend Development Server

```bash
# From the frontend directory
cd frontend

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
# Build the frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

## 📁 Project Structure

```
veriframe/
├── backend/
│   ├── main.py              # FastAPI application and model inference
│   └── model.pth            # Trained PyTorch model (not included in repo)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx      # Image upload component
│   │   │   ├── ResultDisplay.jsx    # Results display component
│   │   │   ├── Layout.jsx          # Main layout with navigation
│   │   │   ├── Scene3D.jsx          # 3D background animation
│   │   │   └── StatusIndicator.jsx  # Backend status indicator
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Landing page
│   │   │   ├── Detection.jsx       # Image detection page
│   │   │   └── About.jsx            # About page with team info
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles and CSS variables
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── requirements.txt             # Backend Python dependencies
│
└── README.md                         # This file
```

## 📡 API Documentation

### Endpoints

#### `POST /predict`
Upload an image for analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Image file (JPEG, PNG, or WebP)

**Response:**
```json
{
  "prediction": "Authentic" | "Tampered",
  "class": 0 | 1,
  "confidence": 0.0-1.0,
  "probabilities": {
    "authentic": 0.0-1.0,
    "tampered": 0.0-1.0
  },
  "raw_logits": {
    "class_0": float,
    "class_1": float
  }
}
```

#### `GET /health`
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

#### `GET /load-model`
Manually trigger model loading.

**Response:**
```json
{
  "status": "success",
  "message": "Model loaded successfully"
}
```

### Interactive API Documentation

When the backend server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 👥 Team

### Software Engineering Team

- **Badreddien Hamid** - Software Engineer
- **Ilyas Ahalal** - Software Engineer

### Data Science Team

- **Adnane Abdelghani** - Data Scientist
- **Zakaria Charifi** - Data Scientist
- **Sbiaa Ayoub** - Data Scientist

## 🔬 How It Works

### Image Preprocessing Pipeline

1. **Image Loading**: Image is loaded and converted to RGB format
2. **Error Level Analysis (ELA)**:
   - Image is saved to JPEG with quality 90
   - Reloaded and compared with original using `ImageChops.difference`
   - Differences are amplified using `ImageEnhance.Brightness` (10x factor)
   - ELA image is resized to 224x224 pixels
3. **Tensor Conversion**: ELA image is converted to PyTorch tensor (normalized to [0, 1])
4. **Batch Dimension**: Single image tensor is expanded to batch format (1, 3, 224, 224)

### Model Inference

1. **Forward Pass**: Preprocessed tensor is passed through the deep learning model
2. **Logits Extraction**: Raw logits for both classes are obtained
3. **Probability Calculation**: Softmax is applied to get class probabilities
4. **Prediction**: Class 1 probability > 0.5 indicates "Tampered", otherwise "Authentic"


## 🔒 Security Notes

- The CORS middleware is currently configured to allow all origins (`allow_origins=["*"]`). In production, replace this with specific allowed origins.


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


---

<div align="center">

**Built with ❤️ by the VeriFrame Team**

© 2025 VeriFrame. All rights reserved.

</div>

