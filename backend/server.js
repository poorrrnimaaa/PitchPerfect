const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const pitchRoutes = require('./routes/pitch');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'pitch-perfect-black.vercel.app'
    : 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pitch', pitchRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Server error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PitchPerfect backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
