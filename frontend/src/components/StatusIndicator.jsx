import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';

const StatusIndicator = () => {
  const [status, setStatus] = useState({ status: 'checking', model_loaded: false });

  useEffect(() => {
    const checkStatus = async () => {
      const health = await checkHealth();
      setStatus(health);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    if (status.status === 'healthy' && status.model_loaded) {
      return {
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        icon: <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />,
        text: 'Ready'
      };
    } else if (status.status === 'healthy' && !status.model_loaded) {
      return {
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        icon: <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />,
        text: 'Model Not Loaded'
      };
    }
    return {
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      icon: <WifiOff className="w-3.5 h-3.5" strokeWidth={2.5} />,
      text: 'Offline'
    };
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg ${config.bgColor} border ${config.borderColor} text-xs`}
    >
      <div className={config.color}>
        {config.icon}
      </div>
      <span className={`${config.color} font-semibold tracking-wide`}>
        {config.text}
      </span>
    </motion.div>
  );
};

export default StatusIndicator;

