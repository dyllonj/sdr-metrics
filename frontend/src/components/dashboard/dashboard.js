// src/components/dashboard/dashboard.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Calendar, Users, Phone, Mail, Linkedin, Target, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import LoadingSpinner from '../animations/effects/LoadingSpinner.jsx';
import ErrorState from '../animations/effects/ErrorState.jsx';
import AnimatedCard from '../animations/effects/AnimatedCard.jsx';
import DataEntryForm from './DataEntryForm.js';
import Toast from '../ui/Toast.jsx';
import { containerVariants, itemVariants } from '../animations/variants/motionVariants.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [activityFilter, setActivityFilter] = useState('all');
  const [metrics, setMetrics] = useState({
    dialToConversion: 0,
    meetingRate: 0,
    totalLeads: 0,
    pipelineValue: 0,
    averageDials: 0,
    averageConversations: 0
  });
  // Add sample data for development/testing
  const sampleData = [
    {
      day: '2024-01-01',
      dials: 120,
      conversations: 15,
      calls: 45,
      emails: 30,
      linkedIn: 25,
      meetings: 3
    },
    {
      day: '2024-01-02',
      dials: 135,
      conversations: 18,
      calls: 50,
      emails: 35,
      linkedIn: 30,
      meetings: 4
    },
    {
      day: '2024-01-03',
      dials: 110,
      conversations: 14,
      calls: 40,
      emails: 28,
      linkedIn: 22,
      meetings: 3
    },
    {
      day: '2024-01-04',
      dials: 145,
      conversations: 20,
      calls: 55,
      emails: 38,
      linkedIn: 32,
      meetings: 5
    },
    {
      day: '2024-01-05',
      dials: 125,
      conversations: 16,
      calls: 48,
      emails: 33,
      linkedIn: 27,
      meetings: 4
    }
  ];
  useEffect(() => {
    fetchDashboardData();
  }, [timeframe, dateRange, activityFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/stats/daily');
      const data = await response.json();
      
      // Filter data based on timeframe and date range
      let filteredData = filterDataByTimeframe(data);
      
      // Calculate metrics
      calculateMetrics(filteredData);
      
      setActivityData(filteredData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
      setToast({
        show: true,
        message: 'Failed to fetch dashboard data',
        type: 'error'
      });
    }
  };

  const filterDataByTimeframe = (data) => {
    const now = new Date();
    let filteredData = [...data];

    switch (timeframe) {
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filteredData = data.filter(item => new Date(item.day) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filteredData = data.filter(item => new Date(item.day) >= monthAgo);
        break;
      case 'quarter':
        const quarterAgo = new Date(now.setMonth(now.getMonth() - 3));
        filteredData = data.filter(item => new Date(item.day) >= quarterAgo);
        break;
    }

    if (dateRange.start && dateRange.end) {
      filteredData = filteredData.filter(item => {
        const date = new Date(item.day);
        return date >= new Date(dateRange.start) && date <= new Date(dateRange.end);
      });
    }

    return filteredData;
  };

  const calculateMetrics = (data) => {
    const totalDials = data.reduce((sum, day) => sum + (parseInt(day.dials) || 0), 0);
    const totalConversations = data.reduce((sum, day) => sum + (parseInt(day.conversations) || 0), 0);
    const totalMeetings = data.reduce((sum, day) => sum + (parseInt(day.meetings) || 0), 0);
    
    setMetrics({
      dialToConversion: totalDials ? ((totalConversations / totalDials) * 100).toFixed(1) : 0,
      meetingRate: totalConversations ? ((totalMeetings / totalConversations) * 100).toFixed(1) : 0,
      totalLeads: totalConversations,
      pipelineValue: totalMeetings * 5000,
      averageDials: data.length ? (totalDials / data.length).toFixed(1) : 0,
      averageConversations: data.length ? (totalConversations / data.length).toFixed(1) : 0
    });
  };

  const handleSubmitData = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit data');
      }

      // Add the new data to the existing data
      setActivityData(prevData => [...prevData, {
        day: new Date().toISOString().split('T')[0],
        ...formData
      }]);

      setToast({
        show: true,
        message: 'Data successfully submitted!',
        type: 'success'
      });

      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);

    } catch (error) {
      console.error('Error in handleSubmitData:', error);
      setToast({
        show: true,
        message: 'Failed to submit data',
        type: 'error'
      });
    }
  };
  // Activity distribution calculation
  const activityDistribution = [
    { name: 'Calls', value: activityData.reduce((sum, day) => sum + (parseInt(day.calls) || 0), 0) },
    { name: 'Emails', value: activityData.reduce((sum, day) => sum + (parseInt(day.emails) || 0), 0) },
    { name: 'LinkedIn', value: activityData.reduce((sum, day) => sum + (parseInt(day.linkedIn) || 0), 0) },
    { name: 'Meetings', value: activityData.reduce((sum, day) => sum + (parseInt(day.meetings) || 0), 0) }
  ];

  const renderMetricCard = ({ title, value, icon: Icon, color }) => (
    <AnimatedCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </AnimatedCard>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Main Dashboard Header */}
      <div className="flex justify-between items-center">
        <motion.h2 
          className="text-2xl font-bold"
          variants={itemVariants}
        >
          SDR Dashboard
        </motion.h2>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Daily Metrics
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </motion.button>
        </div>
      </div>

      {/* Metric Cards */}
      <motion.div 
        className="grid grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {renderMetricCard({
          title: "Dial to Conversation %",
          value: `${metrics.dialToConversion}%`,
          icon: Phone,
          color: "text-blue-500"
        })}
        {renderMetricCard({
          title: "Meeting Conversion %",
          value: `${metrics.meetingRate}%`,
          icon: Calendar,
          color: "text-green-500"
        })}
        {renderMetricCard({
          title: "Total Leads",
          value: metrics.totalLeads,
          icon: Users,
          color: "text-purple-500"
        })}
        {renderMetricCard({
          title: "Pipeline Value",
          value: `$${metrics.pipelineValue.toLocaleString()}`,
          icon: Target,
          color: "text-blue-600"
        })}
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Daily Activity Metrics</h3>
          <LineChart width={500} height={300} data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="dials" 
              stroke="#ff7300" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="conversations" 
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Activity Distribution</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={activityDistribution}
              cx={250}
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
      </div>

      {/* Detailed Analytics Section */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Analytics Filters */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Detailed Analytics</h3>
              <div className="flex gap-4">
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

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AnimatedCard>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="px-3 py-2 border rounded-md"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="px-3 py-2 border rounded-md"
                      />
                      <select
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="all">All Activities</option>
                        <option value="calls">Calls Only</option>
                        <option value="meetings">Meetings Only</option>
                      </select>
                    </div>
                  </AnimatedCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analytics Data Table */}
            <AnimatedCard>
              <h3 className="text-lg font-semibold mb-4">Performance Breakdown</h3>
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
                          <td className="px-4 py-2 flex items-center gap-1">
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

            {/* Analytics Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <AnimatedCard>
                <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Dials/Day</span>
                    <span className="font-bold">{metrics.averageDials}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Conversations/Day</span>
                    <span className="font-bold">{metrics.averageConversations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Overall Conversion Rate</span>
                    <span className="font-bold">{metrics.dialToConversion}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Meeting Success Rate</span>
                    <span className="font-bold">{metrics.meetingRate}%</span>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard>
                <h3 className="text-lg font-semibold mb-4">Top Performing Days</h3>
                {activityData
                  .sort((a, b) => b.conversations - a.conversations)
                  .slice(0, 5)
                  .map((day, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span>{day.day}</span>
                      <span className="font-bold">{day.conversations} conversations</span>
                    </div>
                  ))}
              </AnimatedCard>

              <AnimatedCard>
                <h3 className="text-lg font-semibold mb-4">Activity Breakdown</h3>
                <BarChart width={300} height={200} data={activityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </AnimatedCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Entry Form */}
      <DataEntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitData}
      />

      {/* Toast Notifications */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </motion.div>
  );
};

export default Dashboard;