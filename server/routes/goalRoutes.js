const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getGoals, createGoal, updateGoal } = require('../controllers/goalController');

router.get('/', auth, getGoals);
router.post('/', auth, createGoal);
router.put('/:id', auth, updateGoal);

module.exports = router;