const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// This must match the names in your controller exactly!
const { getBudgets, setBudget } = require('../controllers/budgetController');

// If getBudgets is not exported in the controller, this line crashes the server
router.get('/', auth, getBudgets); 

// This handles the POST request to set/update limits
router.post('/', auth, setBudget);

module.exports = router;