const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // One salary record per user
  },
  amount: { type: Number, required: true, default: 0 },
  month: { type: String, required: true } // Format: "YYYY-MM"
});

module.exports = mongoose.model('Income', IncomeSchema);