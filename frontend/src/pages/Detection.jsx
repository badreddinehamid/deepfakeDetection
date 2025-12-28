import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import ResultDisplay from '../components/ResultDisplay';
import StatusIndicator from '../components/StatusIndicator';
import { predictImage } from '../services/api';

const Detection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictImage(selectedImage);
      setResult(prediction);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 md:mb-16"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Image Detection
            </h1>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Upload an image to detect signs of tampering or manipulation
            </p>
          </div>
          <StatusIndicator />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card-elevated p-8 md:p-10"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Analyze Image
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Upload an image to detect signs of tampering or manipulation using advanced deep learning models
            </p>
          </div>

          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            isLoading={isLoading}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handlePredict}
            disabled={!selectedImage || isLoading}
            className={`
              mt-8 w-full py-3.5 px-6 rounded-xl font-semibold text-white text-base
              bg-primary-600 hover:bg-primary-500
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-600
              transition-all duration-200
              flex items-center justify-center gap-2.5
              shadow-medium hover:shadow-strong
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing image...</span>
              </>
            ) : (
              <>
                <Scan className="w-5 h-5" strokeWidth={2.5} />
                <span>Analyze Image</span>
              </>
            )}
          </motion.button>
        </motion.section>

        {/* Results Section */}
        {(result || isLoading) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <ResultDisplay result={result} isLoading={isLoading} />
          </motion.section>
        )}

        {/* Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card p-8"
        >
          <h3 className="text-xl font-semibold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <span className="text-primary-500 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Upload Image</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Select or drag and drop your image file for analysis</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <span className="text-primary-500 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>AI Analysis</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Advanced deep learning models analyze the image for tampering indicators</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <span className="text-primary-500 font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Get Results</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Receive detailed analysis with confidence scores and probability breakdown</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Detection;

