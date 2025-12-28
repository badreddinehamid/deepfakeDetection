# Deepfake Detection Frontend

A modern, secure-looking React frontend for the Deepfake Detection API.

## Features

- 🎨 **Modern Design**: Glassmorphism effects, gradients, and smooth animations
- 🔒 **Secure Vibe**: Dark theme with professional security-focused aesthetics
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast**: Built with Vite for optimal performance
- 🎭 **Animations**: Smooth transitions using Framer Motion
- 🎯 **User-Friendly**: Intuitive drag-and-drop image upload

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Configuration

The frontend connects to the FastAPI backend at `http://localhost:8000` by default.

To change the API URL, create a `.env` file:
```
VITE_API_URL=http://your-api-url:8000
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
  ├── components/
  │   ├── ImageUpload.jsx    # Image upload component with drag & drop
  │   ├── ResultDisplay.jsx  # Results display with animations
  │   └── StatusIndicator.jsx # API health status indicator
  ├── services/
  │   └── api.js             # API service layer
  ├── App.jsx                # Main application component
  ├── main.jsx               # Application entry point
  └── index.css              # Global styles and Tailwind directives
```

## Design Features

- **Glassmorphism**: Frosted glass effects on cards and containers
- **Gradient Backgrounds**: Animated gradient backgrounds
- **Smooth Animations**: Framer Motion for fluid transitions
- **Dark Theme**: Professional dark color scheme
- **Status Indicators**: Real-time API health monitoring
- **Responsive Layout**: Mobile-first responsive design

## Usage

1. Upload an image by clicking the upload area or dragging and dropping
2. Click "Analyze Image" to send it to the backend
3. View the results with confidence scores and probabilities
4. Check the status indicator to see if the API is online and the model is loaded

