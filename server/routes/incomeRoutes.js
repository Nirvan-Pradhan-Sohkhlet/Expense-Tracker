const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Income = require('../models/Income');

// Get income
router.get('/', auth, async (req, res) => {
  try {
    const income = await Income.findOne({ userId: req.user.id });
    res.json(income || { amount: 0 });
  } catch (err) { res.status(500).send('Server Error'); }
});

// Update or Set income
router.post('/', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    let income = await Income.findOneAndUpdate(
      { userId: req.user.id },
      { amount },
      { new: true, upsert: true }
    );
    res.json(income);
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;