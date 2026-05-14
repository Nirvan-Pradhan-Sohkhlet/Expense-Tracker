const Expense = require('../models/Expense');


exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const { autoCategorize } = require('../utils/categorizer');

exports.addExpense = async (req, res) => {
  const { title, amount, date, notes } = req.body;

  const category = req.body.category || autoCategorize(title); 

  try {
    const newExpense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      date,
      notes
    });
    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/expenses/reset
exports.resetExpenses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Authorization failed' });
    }
    const result = await Expense.deleteMany({ userId: req.user.id });
    console.log(`✅ Reset triggered: Deleted ${result.deletedCount} items for user ${req.user.id}`);

    res.status(200).json({ 
      msg: 'Reset successful', 
      count: result.deletedCount 
    });
  } catch (err) {

    console.error("❌ Reset Controller Error:", err.message);
    res.status(500).json({ msg: 'Server Error during reset', error: err.message });
  }
};