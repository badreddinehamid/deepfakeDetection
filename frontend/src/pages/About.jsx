import { motion } from 'framer-motion';
import { Shield, Code, Brain, Users } from 'lucide-react';

const About = () => {
  const teamMembers = {
    software: [
      { initials: 'BH', name: 'Badreddien Hamid', role: 'Software Engineer' },
      { initials: 'IA', name: 'Ilyas Ahalal', role: 'Software Engineer' },
    ],
    dataScience: [
      { initials: 'AA', name: 'Adnane Abdelghani', role: 'Data Scientist' },
      { initials: 'ZC', name: 'Zakaria Charifi', role: 'Data Scientist' },
      { initials: 'SA', name: 'Sbiaa Ayoub', role: 'Data Scientist' },
    ],
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-8"
        >
          <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary-500" strokeWidth={2} />
        </motion.div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
          About VeriFrame
        </h1>

        <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          VeriFrame is an advanced AI-powered image verification system designed to detect tampering,
          manipulation, and deepfake images with high accuracy. Built by a dedicated team of software
          engineers and data scientists.
        </p>
      </motion.section>

      {/* Project Description */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="card-elevated p-8 md:p-12 mb-16 md:mb-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-14 h-14 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-primary-500" strokeWidth={2} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Advanced AI Technology
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              VeriFrame leverages state-of-the-art deep learning models trained on extensive datasets
              to identify subtle signs of image manipulation. Our system uses Error Level Analysis (ELA)
              preprocessing combined with convolutional neural networks to achieve high accuracy.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The platform provides real-time analysis with detailed confidence scores, helping users
              verify image authenticity in an era of increasing digital manipulation.
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
              <Code className="w-7 h-7 text-primary-500" strokeWidth={2} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Modern Web Platform
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Built with modern web technologies including React, FastAPI, and PyTorch, VeriFrame
              delivers a seamless user experience with fast processing times and reliable results.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Our responsive design ensures the platform works perfectly on desktop and mobile devices,
              making image verification accessible to everyone.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mb-16 md:mb-24"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-500/10 border border-primary-500/20 mb-6">
            <Users className="w-8 h-8 text-primary-500" strokeWidth={2} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Our Team
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            A dedicated group of professionals working together to fight digital misinformation
          </p>
        </div>

        {/* Software Engineering Team */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-primary-500 mb-6 text-center uppercase tracking-wider">
            Software Engineering Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {teamMembers.software.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="text-center p-6 rounded-xl bg-primary-500/5 border border-primary-500/20 card"
              >
                <div className="w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-500 font-bold text-lg">{member.initials}</span>
                </div>
                <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {member.name}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Science Team */}
        <div>
          <h3 className="text-lg font-semibold text-primary-500 mb-6 text-center uppercase tracking-wider">
            Data Science Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {teamMembers.dataScience.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center p-6 rounded-xl bg-primary-500/5 border border-primary-500/20 card"
              >
                <div className="w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-500 font-bold text-lg">{member.initials}</span>
                </div>
                <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {member.name}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center card p-8 md:p-12 max-w-2xl mx-auto"
      >
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
          Powered by advanced deep learning technology
        </p>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          © 2025 VeriFrame. All rights reserved.
        </p>
      </motion.section>
    </div>
  );
};

export default About;

