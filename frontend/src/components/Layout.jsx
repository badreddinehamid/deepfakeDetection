import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Scene3D from './Scene3D';

const Layout = ({ children, isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/detect', label: 'Detect' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen transition-colors duration-300 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* 3D Background Scene */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{ zIndex: 0 }}>
        <Scene3D className="w-full h-full" />
      </div>
      
      {/* Subtle background pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
          opacity: isDarkMode ? 0.02 : 0.04,
          zIndex: 1
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 group-hover:bg-primary-500/20 transition-colors">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary-500" strokeWidth={2} />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                VeriFrame
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-500/10 text-primary-500'
                      : 'hover:bg-neutral-800/50'
                  }`}
                  style={{
                    color: isActive(item.path) ? '#6366f1' : 'var(--text-secondary)',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)'
                }}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" strokeWidth={2} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <Moon className="w-5 h-5" strokeWidth={2} style={{ color: 'var(--text-primary)' }} />
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)'
                }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={2} style={{ color: 'var(--text-primary)' }} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={2} style={{ color: 'var(--text-primary)' }} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t py-4"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      isActive(item.path)
                        ? 'bg-primary-500/10 text-primary-500'
                        : 'hover:bg-neutral-800/50'
                    }`}
                    style={{
                      color: isActive(item.path) ? '#6366f1' : 'var(--text-secondary)',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10" style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

