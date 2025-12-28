import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ onImageSelect, selectedImage, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return false;
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 10MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFiles = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onImageSelect(file);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative w-full h-72 rounded-xl border-2 border-dashed transition-all duration-200
          ${dragActive 
            ? 'border-primary-500 bg-primary-500/5 scale-[1.01]' 
            : 'hover:scale-[1.005]'
          }
          ${selectedImage ? 'border-primary-500/50 bg-primary-500/5' : ''}
          ${isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        `}
        style={{
          borderColor: dragActive 
            ? '#6366f1' 
            : selectedImage 
              ? 'rgba(99, 102, 241, 0.5)' 
              : 'var(--border-primary)',
          backgroundColor: dragActive 
            ? 'rgba(99, 102, 241, 0.05)' 
            : selectedImage 
              ? 'rgba(99, 102, 241, 0.05)' 
              : 'var(--bg-card)'
        }}
        onMouseEnter={(e) => {
          if (!dragActive && !selectedImage) {
            e.currentTarget.style.borderColor = 'var(--border-secondary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!dragActive && !selectedImage) {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {selectedImage ? (
            <>
              <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 hover:bg-red-500/90 backdrop-blur-sm rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-card-elevated)',
                    border: '1px solid var(--border-primary)'
                  }}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" strokeWidth={2.5} style={{ color: 'var(--text-primary)' }} />
                </motion.button>
              </div>
              <p className="mt-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Click to change image
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <Upload className="w-7 h-7 text-primary-500" strokeWidth={2} />
                </div>
                <div className="text-center space-y-1.5">
                  <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Drop your image here or click to browse
                  </p>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Supports JPEG, PNG, WebP • Maximum 10MB
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" strokeWidth={2.5} />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;

