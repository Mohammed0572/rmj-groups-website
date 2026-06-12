const express = require('express');
const router = express.Router();
const { login, signup, generateOtp } = require('../controllers/authController');

router.post('/login', login);
router.post('/signup', signup);
router.post('/generate-otp', generateOtp);

module.exports = router;
