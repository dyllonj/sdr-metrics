// src/components/calculator/calculator.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import LoadingSpinner from '../animations/effects/LoadingSpinner.jsx';
import ErrorState from '../animations/effects/ErrorState.jsx';
import AnimatedCard from '../animations/effects/AnimatedCard.jsx';
import AnimatedInput from '../animations/effects/AnimatedInput.jsx';
import { containerVariants, itemVariants } from '../animations/variants/motionVariants.js';

const Calculator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputs, setInputs] = useState({
    weeklyAttendance: '',
    averageGiving: '',
    streamingCost: '',
    equipmentCost: '',
    staffHours: '',
    onlineEngagement: ''
  });
  const [projections, setProjections] = useState([]);

  const calculateProjections = () => {
    const months = 12;
    const data = [];
    
    for (let i = 0; i < months; i++) {
      const onlineViewers = Math.floor(inputs.weeklyAttendance * 
        (inputs.onlineEngagement/100) * (1 + (i * 0.05)));
      
      const onlineGiving = onlineViewers * 
        (inputs.averageGiving * 0.6) * 4;
      
      const monthlyCosts = inputs.streamingCost + 
        (inputs.equipmentCost/12) + 
        (inputs.staffHours * 25 * 4);
      
      const roi = ((onlineGiving - monthlyCosts) / monthlyCosts) * 100;
      
      data.push({
        month: i + 1,
        viewers: onlineViewers,
        revenue: onlineGiving,
        costs: monthlyCosts,
        roi: Math.round(roi)
      });
    }
    
    setProjections(data);
  };

  useEffect(() => {
    if (Object.values(inputs).every(value => value !== '')) {
      calculateProjections();
    }
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto"
    >
      <AnimatedCard className="mb-6">
        <motion.h2 
          className="text-2xl font-bold mb-6"
          variants={itemVariants}
        >
          Church Streaming ROI Calculator
        </motion.h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <AnimatedInput
            label="Weekly In-Person Attendance"
            type="number"
            value={inputs.weeklyAttendance}
            onChange={(e) => handleInputChange('weeklyAttendance', e.target.value)}
          />
          <AnimatedInput
            label="Average Weekly Giving per Person ($)"
            type="number"
            value={inputs.averageGiving}
            onChange={(e) => handleInputChange('averageGiving', e.target.value)}
          />
          <AnimatedInput
            label="Monthly Streaming Cost ($)"
            type="number"
            value={inputs.streamingCost}
            onChange={(e) => handleInputChange('streamingCost', e.target.value)}
          />
          <AnimatedInput
            label="Equipment Investment ($)"
            type="number"
            value={inputs.equipmentCost}
            onChange={(e) => handleInputChange('equipmentCost', e.target.value)}
          />
          <AnimatedInput
            label="Weekly Staff Hours"
            type="number"
            value={inputs.staffHours}
            onChange={(e) => handleInputChange('staffHours', e.target.value)}
          />
          <AnimatedInput
            label="Expected Online Engagement (%)"
            type="number"
            value={inputs.onlineEngagement}
            onChange={(e) => handleInputChange('onlineEngagement', e.target.value)}
          />
        </div>
      </AnimatedCard>

      {projections.length > 0 && (
        <AnimatedCard>
          <motion.h3 
            className="text-lg font-semibold mb-4"
            variants={itemVariants}
          >
            12 Month Projection
          </motion.h3>
          <LineChart width={700} height={300} data={projections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="roi" 
              stroke="#8884d8" 
              name="ROI %" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="viewers" 
              stroke="#82ca9d" 
              name="Viewers"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>

          <motion.div 
            className="mt-6 grid grid-cols-2 gap-4"
            variants={containerVariants}
          >
            <AnimatedCard>
              <p className="font-medium">First Year ROI</p>
              <p className="text-2xl">{projections[11]?.roi}%</p>
            </AnimatedCard>
            <AnimatedCard>
              <p className="font-medium">Monthly Revenue Potential</p>
              <p className="text-2xl">${Math.round(projections[11]?.revenue).toLocaleString()}</p>
            </AnimatedCard>
          </motion.div>
        </AnimatedCard>
      )}
    </motion.div>
  );
};

export default Calculator;