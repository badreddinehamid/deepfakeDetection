import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Brain, CheckCircle2, ArrowRight, Scan } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced deep learning models analyze images for signs of tampering and manipulation',
    },
    {
      icon: Zap,
      title: 'Real-Time Analysis',
      description: 'Get instant results with high accuracy confidence scores',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your images are processed securely with state-of-the-art verification technology',
    },
  ];

  const benefits = [
    'Error Level Analysis (ELA) preprocessing',
    'Deep learning model with high accuracy',
    'Detailed confidence scores and probabilities',
    'Support for JPEG, PNG, and WebP formats',
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-20 md:mb-32"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-8"
        >
          <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary-500" strokeWidth={2} />
        </motion.div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Verify Image Authenticity
          <br />
          <span className="text-gradient">with AI Technology</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          VeriFrame uses advanced deep learning algorithms to detect tampering, manipulation, and deepfake images
          with unprecedented accuracy. Protect yourself from misinformation and verify image authenticity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/detect">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-semibold text-white text-base bg-primary-600 hover:bg-primary-500 transition-all duration-200 flex items-center gap-2 shadow-medium hover:shadow-strong"
            >
              <Scan className="w-5 h-5" strokeWidth={2.5} />
              Start Detection
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center gap-2"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)'
              }}
            >
              Learn More
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-20 md:mb-32"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="card-elevated p-8"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary-500" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-20 md:mb-32"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            How It Works
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Simple, fast, and accurate image verification
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '1', title: 'Upload Image', desc: 'Select or drag and drop your image file' },
            { step: '2', title: 'AI Analysis', desc: 'Our model analyzes the image for tampering indicators' },
            { step: '3', title: 'Get Results', desc: 'Receive detailed analysis with confidence scores' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-500">{item.step}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="card-elevated p-8 md:p-12 max-w-3xl mx-auto mb-20"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {benefit}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center"
      >
        <div className="card-elevated p-12 md:p-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to Verify Images?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Start detecting tampered and manipulated images with our AI-powered tool
          </p>
          <Link to="/detect">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-semibold text-white text-base bg-primary-600 hover:bg-primary-500 transition-all duration-200 flex items-center gap-2 shadow-medium hover:shadow-strong mx-auto"
            >
              <Scan className="w-5 h-5" strokeWidth={2.5} />
              Try It Now
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;

