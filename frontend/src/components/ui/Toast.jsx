// src/components/ui/Toast.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, show }) => {
  const icons = {
    success: <Check className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-2 z-50`}
        >
          {icons[type]}
          <span className="text-gray-700">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;