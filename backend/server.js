const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const crypto = require('crypto'); // Built-in Node module for security

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- 1. WHATSAPP SETUP ---
console.log("Initializing WhatsApp Client...");
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE WITH WHATSAPP:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => console.log('✅ WhatsApp Ready!'));
client.initialize();

// --- 2. DATABASE SETUP ---
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

// Security: Simple Hash Function (Scrambles password)
const hashPassword = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');

// --- 3. OTP STORAGE ---
let otpStore = {}; 

// --- 4. ROUTES ---

// A. SEND OTP (For Signup OR Forgot Password)
app.post('/api/send-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    let formattedNum = phone.replace(/\D/g, ''); 
    if(!formattedNum.startsWith('91')) formattedNum = '91' + formattedNum;
    
    const chatId = `${formattedNum}@c.us`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = otp;

    console.log(`Generated OTP for ${phone}: ${otp}`); // Log for testing

    const message = `*RMJ Groups Verification*\n\nYour Code is: *${otp}*\n\nDo not share this.`;

    try {
        const isRegistered = await client.isRegisteredUser(chatId);
        if(isRegistered) {
            await client.sendMessage(chatId, message);
            return res.json({ success: true, message: "OTP sent to WhatsApp!" });
        }
        res.json({ success: true, message: "OTP Generated (Check Console)" });
    } catch (error) {
        res.json({ success: true, message: "OTP Generated (Check Console)" });
    }
});

// B. SIGNUP (Hashes Password)
app.post('/api/signup', (req, res) => {
    const { name, email, phone, password, otp } = req.body;

    try {
        if (otpStore[phone] !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

        const users = getUsers();
        if (users.find(u => u.email === email)) return res.status(400).json({ success: false, message: "Email already exists" });

        // Save HASHED password, not real one
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            phone, 
            password: hashPassword(password), 
            date: new Date() 
        };
        saveUser(newUser);
        delete otpStore[phone];

        console.log(`✅ New User: ${name} (Password Secured)`);
        res.status(201).json({ success: true, message: "Account Created!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// C. LOGIN (Checks Hash)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    
    // Compare Hashed Passwords
    const user = users.find(u => u.email === email && u.password === hashPassword(password));

    if (user) {
        res.json({ success: true, message: "Login Successful", user: { name: user.name } });
    } else {
        res.status(400).json({ success: false, message: "Invalid email or password" });
    }
});

// D. FORGOT PASSWORD (Reset)
app.post('/api/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) return res.status(400).json({ success: false, message: "Email not found" });
    
    // Verify OTP using user's phone number
    if (otpStore[user.phone] !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Update Password
    user.password = hashPassword(newPassword);
    updateUser(user);
    delete otpStore[user.phone];

    res.json({ success: true, message: "Password Reset Successfully!" });
});

// E. FIND USER PHONE (Helper for Forgot Password)
app.post('/api/get-phone', (req, res) => {
    const { email } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) res.json({ success: true, phone: user.phone });
    else res.status(400).json({ success: false, message: "Email not registered" });
});
app.get('/', (req, res) => {
    res.send("✅ Backend is working! You can connect.");
});
app.listen(5000, '0.0.0.0', () => {
    console.log("🚀 Server running on Port 5000 (Accessible via Tunnel)");
});