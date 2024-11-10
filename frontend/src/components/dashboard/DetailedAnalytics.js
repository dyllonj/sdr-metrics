// src/components/dashboard/DetailedAnalytics.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Calendar, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import AnimatedCard from '../animations/effects/AnimatedCard.jsx';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DetailedAnalytics = ({ activityData }) => {
  const [timeframe, setTimeframe] = useState('week');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate key metrics
  const calculateMetrics = (data) => {
    const totalDials = data.reduce((sum, day) => sum + (parseInt(day.dials) || 0), 0);
    const totalConversations = data.reduce((sum, day) => sum + (parseInt(day.conversations) || 0), 0);
    const totalMeetings = data.reduce((sum, day) => sum + (parseInt(day.meetings) || 0), 0);
    
    return {
      conversionRate: ((totalConversations / totalDials) * 100).toFixed(1),
      meetingRate: ((totalMeetings / totalConversations) * 100).toFixed(1),
      averageDials: (totalDials / data.length).toFixed(1),
      averageConversations: (totalConversations / data.length).toFixed(1)
    };
  };

  const metrics = calculateMetrics(activityData);

  // Calculate activity distribution
  const activityDistribution = [
    { name: 'Calls', value: activityData.reduce((sum, day) => sum + (parseInt(day.calls) || 0), 0) },
    { name: 'Emails', value: activityData.reduce((sum, day) => sum + (parseInt(day.emails) || 0), 0) },
    { name: 'LinkedIn', value: activityData.reduce((sum, day) => sum + (parseInt(day.linkedIn) || 0), 0) },
    { name: 'Meetings', value: activityData.reduce((sum, day) => sum + (parseInt(day.meetings) || 0), 0) }
  ];

  // Calculate trend data
  const calculateTrends = () => {
    const trends = activityData.map((day, index, array) => {
      const previousDay = array[index - 1] || day;
      return {
        date: day.day,
        dialTrend: ((day.dials - previousDay.dials) / previousDay.dials * 100).toFixed(1),
        conversionTrend: ((day.conversations - previousDay.conversations) / previousDay.conversations * 100).toFixed(1)
      };
    });
    return trends.slice(1); // Remove first day as it has no comparison
  };

  const trends = calculateTrends();

  // Calculate peak performance times
  const peakTimes = activityData.reduce((acc, day) => {
    const total = parseInt(day.conversations) || 0;
    acc.push({ day: day.day, performance: total });
    return acc;
  }, []).sort((a, b) => b.performance - a.performance);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Detailed Analytics</h2>
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            <Filter size={16} />
            Filters
          </motion.button>
        </div>
      </div>

      {showFilters && (
        <AnimatedCard>
          <div className="grid grid-cols-3 gap-4 p-4">
            <input
              type="date"
              className="px-3 py-2 border rounded-md"
              placeholder="Start Date"
            />
            <input
              type="date"
              className="px-3 py-2 border rounded-md"
              placeholder="End Date"
            />
            <select className="px-3 py-2 border rounded-md">
              <option value="all">All Activities</option>
              <option value="calls">Calls Only</option>
              <option value="meetings">Meetings Only</option>
            </select>
          </div>
        </AnimatedCard>
      )}

      <div className="grid grid-cols-2 gap-4">
        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Activity Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={activityDistribution}
              cx={200}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {activityDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <LineChart width={500} height={300} data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="dialTrend" stroke="#8884d8" name="Dial Trend %" />
            <Line type="monotone" dataKey="conversionTrend" stroke="#82ca9d" name="Conversion Trend %" />
          </LineChart>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Conversion Rate</span>
              <span className="font-bold">{metrics.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Meeting Rate</span>
              <span className="font-bold">{metrics.meetingRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg. Daily Dials</span>
              <span className="font-bold">{metrics.averageDials}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg. Daily Conversations</span>
              <span className="font-bold">{metrics.averageConversations}</span>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Peak Performance</h3>
          <div className="space-y-4">
            {peakTimes.slice(0, 5).map((peak, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{peak.day}</span>
                <span className="font-bold">{peak.performance} conversations</span>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Activity Comparison</h3>
          <BarChart width={300} height={300} data={activityData.slice(-5)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="dials" fill="#8884d8" />
            <Bar dataKey="conversations" fill="#82ca9d" />
          </BarChart>
        </AnimatedCard>
      </div>

      <AnimatedCard>
        <h3 className="text-lg font-semibold mb-4">Daily Performance Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Dials</th>
                <th className="px-4 py-2">Conversations</th>
                <th className="px-4 py-2">Conversion %</th>
                <th className="px-4 py-2">Meetings</th>
                <th className="px-4 py-2">Trend</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((day, index) => {
                const convRate = ((day.conversations / day.dials) * 100).toFixed(1);
                const prevDay = activityData[index - 1];
                const trend = prevDay
                  ? ((day.conversations - prevDay.conversations) / prevDay.conversations * 100).toFixed(1)
                  : 0;

                return (
                  <tr key={day.day} className="border-t">
                    <td className="px-4 py-2">{day.day}</td>
                    <td className="px-4 py-2">{day.dials}</td>
                    <td className="px-4 py-2">{day.conversations}</td>
                    <td className="px-4 py-2">{convRate}%</td>
                    <td className="px-4 py-2">{day.meetings}</td>
                    <td className="px-4 py-2 flex items-center">
                      {trend > 0 ? (
                        <ArrowUp className="text-green-500" size={16} />
                      ) : (
                        <ArrowDown className="text-red-500" size={16} />
                      )}
                      {Math.abs(trend)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </motion.div>
  );
};

export default DetailedAnalytics;