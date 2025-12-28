import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Shield, TrendingUp } from 'lucide-react';

const ResultDisplay = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card-elevated p-10"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Analyzing image...</p>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return null;
  }

  const isAuthentic = result.prediction === 'Authentic';
  const confidence = result.confidence;
  const authenticProb = result.probabilities.authentic;
  const tamperedProb = result.probabilities.tampered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-elevated p-8 md:p-10 space-y-8"
    >
      {/* Main Result */}
      <div className="flex items-start gap-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`
            p-3.5 rounded-xl flex-shrink-0
            ${isAuthentic 
              ? 'bg-emerald-500/10 border border-emerald-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
            }
          `}
        >
          {isAuthentic ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={2} />
          ) : (
            <XCircle className="w-7 h-7 text-red-500" strokeWidth={2} />
          )}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {isAuthentic ? 'Image is Authentic' : 'Image is Tampered'}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {isAuthentic 
              ? 'This image appears to be genuine and unaltered based on our analysis.' 
              : 'This image shows signs of tampering or manipulation.'
            }
          </p>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-primary-500" strokeWidth={2} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Confidence Score</span>
          </div>
          <span className="text-3xl font-bold text-primary-500">
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`
              h-full rounded-full
              ${isAuthentic 
                ? 'bg-emerald-500' 
                : 'bg-red-500'
              }
            `}
          />
        </div>
      </div>

      {/* Probability Breakdown */}
      <div className="grid grid-cols-2 gap-6 pt-6" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Authentic</span>
            <span className="text-base font-bold text-emerald-500">
              {(authenticProb * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${authenticProb * 100}%` }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Tampered</span>
            <span className="text-base font-bold text-red-500">
              {(tamperedProb * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tamperedProb * 100}%` }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="h-full bg-red-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Raw Logits Info */}
      <details className="pt-6" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <summary className="cursor-pointer text-sm transition-colors flex items-center gap-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
          <TrendingUp className="w-4 h-4" strokeWidth={2} />
          View Technical Details
        </summary>
        <div className="mt-4 p-4 rounded-xl space-y-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Class 0 (Authentic) Logit:</span>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{result.raw_logits.class_0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Class 1 (Tampered) Logit:</span>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{result.raw_logits.class_1}</span>
          </div>
        </div>
      </details>
    </motion.div>
  );
};

export default ResultDisplay;

