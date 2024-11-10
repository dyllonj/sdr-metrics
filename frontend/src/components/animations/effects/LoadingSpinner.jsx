// src/components/animations/effects/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <motion.div
      className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </div>
);

export default LoadingSpinner;