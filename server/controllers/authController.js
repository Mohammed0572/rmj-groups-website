const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Secret for JWT (fallback for dev)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                success: true,
                message: "Login Successful",
                token: generateToken(user._id),
                user: { id: user._id, name: user.name, email: user.email }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                success: true,
                message: "Account Created!",
                token: generateToken(user._id),
                user: { id: user._id, name: user.name, email: user.email }
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Generate OTP (Mock - prints to console instead of email)
// @route   POST /api/auth/generate-otp
// @access  Public
exports.generateOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, send email via Nodemailer here.
    console.log(`\n============================`);
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`[MOCK EMAIL] OTP: ${otp}`);
    console.log(`============================\n`);

    res.json({ success: true, message: "OTP generated successfully (check server console)", otp }); // Returning OTP for dev only
};
