// src/components/animations/effects/AnimatedInput.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedInput = ({ label, value, onChange, type = "text", className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`w-full ${className}`}
  >
    <label className="block text-sm font-medium mb-1">
      {label}
    </label>
    <motion.input
      type={type}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-all"
      value={value}
      onChange={onChange}
      whileFocus={{ scale: 1.02 }}
    />
  </motion.div>
);

export default AnimatedInput;