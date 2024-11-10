// src/App.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/dashboard/dashboard.js';
import Calculator from './components/calculator/calculator.js';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg fixed top-0 w-full z-10">
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="max-w-7xl mx-auto px-6 lg:px-8"
        >
          <div className="flex justify-between h-16">
            <div className="flex space-x-6 items-center w-full justify-center">
              <motion.h1 
                className="text-2xl font-bold text-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resi Media Analytics
              </motion.h1>
              <div className="flex space-x-4">
                <motion.button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentView === 'dashboard' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  SDR Dashboard
                </motion.button>
                <motion.button 
                  onClick={() => setCurrentView('calculator')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentView === 'calculator' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ROI Calculator
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </nav>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 lg:p-8"
            >
              {currentView === 'dashboard' ? <Dashboard /> : <Calculator />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;