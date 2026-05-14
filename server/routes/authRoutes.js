const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register [cite: 174]
router.post('/register', register);

// POST /api/auth/login [cite: 175]
router.post('/login', login);

module.exports = router;