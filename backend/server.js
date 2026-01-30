const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE SETUP ---
const DB_FILE = 'users.json';

const getUsers = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE));
};

const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

const updateUser = (updatedUser) => {
    let users = getUsers();
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
        users[index] = updatedUser;
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    }
};

// Security: Hash Function
const hashPassword = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');

// --- ROUTES ---

// LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === hashPassword(password));

    if (user) {
        res.json({ success: true, message: "Login Successful", user: { name: user.name } });
    } else {
        res.status(400).json({ success: false, message: "Invalid email or password" });
    }
});

// SIGNUP (OTP verified on frontend via EmailJS)
app.post('/api/signup-email', (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashPassword(password),
        createdAt: new Date().toISOString()
    };

    saveUser(newUser);
    console.log(`✅ New User Created: ${name} (${email})`);
    res.status(201).json({ success: true, message: "Account Created!", user: { name, email } });
});

// RESET PASSWORD (OTP verified on frontend via EmailJS)
app.post('/api/reset-password-email', (req, res) => {
    const { email, newPassword } = req.body;

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
    }

    // Update password
    user.password = hashPassword(newPassword);
    updateUser(user);
    console.log(`🔑 Password Reset for: ${email}`);
    res.json({ success: true, message: "Password reset successfully!" });
});

// Health check
app.get('/', (req, res) => {
    res.send("✅ Backend is working! EmailJS handles OTP emails on frontend.");
});

app.listen(5000, '0.0.0.0', () => {
    console.log("🚀 Server running on Port 5000");
    console.log("📧 OTP emails are now sent via EmailJS (frontend)");
});