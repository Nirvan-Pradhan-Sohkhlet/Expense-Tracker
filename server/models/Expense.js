const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  title: { type: String, required: true }, 
  amount: { type: Number, required: true }, 
  category: { 
    type: String, 
    required: true, 
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Education', 'Healthcare', 'Miscellaneous'] 
  },
  date: { type: Date, default: Date.now },
  notes: { type: String } 
});

module.exports = mongoose.model('Expense', ExpenseSchema);