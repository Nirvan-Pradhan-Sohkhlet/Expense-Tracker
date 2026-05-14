const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Essential for parsing JSON bodies [cite: 7]
app.use(cors()); // Allows your React frontend to talk to this API [cite: 102]

// Database Connection Logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); 
  }
};

connectDB();

// API Routes [cite: 172]
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes')); 
app.use('/api/ocr', require('./routes/ocrRoutes')); 
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));