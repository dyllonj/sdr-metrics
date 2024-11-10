// api/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

app.use(express.json());

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// GET endpoint for daily stats
app.get('/api/stats/daily', (req, res) => {
  // For testing, return sample data
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
    // ... add more sample data entries
  ];
  
  res.json(sampleData);
});

// POST endpoint for activities
app.post('/api/activities', (req, res) => {
  console.log('Received activity data:', req.body);
  res.status(201).json({ message: 'Data received successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});