// src/components/animations/effects/ErrorState.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center h-64"
  >
    <motion.div
      animate={{ 
        rotate: [0, 10, -10, 10, -10, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 0.5 }}
    >
      <AlertCircle className="w-16 h-16 text-red-500" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-lg text-gray-600"
    >
      {message}
    </motion.p>
  </motion.div>
);

export default ErrorState;