require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const app = express();

// --- RATE LIMITING ---
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: "Too many requests, please try again later." }
});
app.use('/api/', apiLimiter);
app.use(cors());
app.use(bodyParser.json());

// --- MONGODB CONNECTION ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.send("✅ Backend is working! MVC Architecture enabled.");
});

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on Port ${PORT}`);
    console.log("📧 OTP emails are now sent via EmailJS (frontend)");
});