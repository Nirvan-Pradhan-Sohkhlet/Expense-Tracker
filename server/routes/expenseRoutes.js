const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getExpenses, 
  addExpense, 
  deleteExpense, 
  resetExpenses 
} = require('../controllers/expenseController');

router.get('/', auth, getExpenses);
router.post('/', auth, addExpense);
router.delete('/reset', auth, resetExpenses);
router.delete('/:id', auth, deleteExpense);

module.exports = router;