# Frontend Startup Guide

## Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app should be available at `http://localhost:3000`
   - Check the browser console (F12) for any errors

## Troubleshooting

### Frontend not loading?
- Check if port 3000 is already in use
- Try: `npm run dev -- --port 3001`
- Check browser console for errors (F12 → Console tab)

### "Offline" status indicator?
- Make sure the backend is running on `http://localhost:8000`
- Check backend console for errors
- Verify CORS is enabled in backend

### API connection errors?
- Verify backend is running: `python backend/main.py`
- Check backend is on port 8000
- Check browser console for CORS errors

### Build errors?
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Common Issues

1. **Module not found errors**: Run `npm install`
2. **Port already in use**: Change port in `vite.config.js` or kill the process using port 3000
3. **Backend connection failed**: Make sure backend is running and CORS is enabled

