// src/components/animations/effects/AnimatedCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 ${className}`}
  >
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

export default AnimatedCard;