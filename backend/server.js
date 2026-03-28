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

// --- USER SCHEMA ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// --- SECURITY ---
const hashPassword = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');

// --- ROUTES ---

// LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password: hashPassword(password) });

        if (user) {
            console.log(`[LOGIN] Success: ${email}`);
            res.json({ success: true, message: "Login Successful", user: { name: user.name } });
        } else {
            console.log(`[LOGIN] Failed: Invalid credentials for ${email}`);
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (err) {
        console.error(`[LOGIN ERROR]:`, err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// SIGNUP (OTP verified on frontend via EmailJS)
app.post('/api/signup-email', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`[SIGNUP] Failed: Email already exists (${email})`);
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashPassword(password)
        });

        console.log(`[SIGNUP] ✅ New User Created: ${name} (${email})`);
        res.status(201).json({ success: true, message: "Account Created!", user: { name, email } });
    } catch (err) {
        console.error(`[SIGNUP ERROR]:`, err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// RESET PASSWORD (OTP verified on frontend via EmailJS)
app.post('/api/reset-password-email', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashPassword(newPassword) },
            { new: true }
        );

        if (!user) {
            console.log(`[RESET] Failed: User not found (${email})`);
            return res.status(400).json({ success: false, message: "User not found" });
        }

        console.log(`[RESET] 🔑 Password Reset for: ${email}`);
        res.json({ success: true, message: "Password reset successfully!" });
    } catch (err) {
        console.error(`[RESET ERROR]:`, err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send("✅ Backend is working! EmailJS handles OTP emails on frontend.");
});

app.listen(5000, '0.0.0.0', () => {
    console.log("🚀 Server running on Port 5000");
    console.log("📧 OTP emails are now sent via EmailJS (frontend)");
});