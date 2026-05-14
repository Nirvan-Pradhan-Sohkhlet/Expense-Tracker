const Budget = require('../models/Budget');

/**
 * @route   GET api/budgets
 * @desc    Get all budgets for the logged-in user
 */
exports.getBudgets = async (req, res) => {
  try {
    // req.user.id is populated by the 'auth' middleware
    const budgets = await Budget.find({ userId: req.user.id });
    res.status(200).json(budgets);
  } catch (err) {
    console.error("Fetch Budgets Error:", err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

/**
 * @route   POST api/budgets
 * @desc    Set or Update a budget limit (Upsert)
 */
exports.setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    // 1. Basic Validation
    if (!category || limit === undefined) {
      return res.status(400).json({ msg: "Category and limit are required" });
    }

    // 2. Check for User Authorization
    if (!req.user || !req.user.id) {
      console.error("AUTH ERROR: No user ID found in request. Check budgetRoutes.js for 'auth' middleware.");
      return res.status(401).json({ msg: "User not authorized" });
    }

    // 3. Search for an existing budget for THIS user and THIS category
    // This prevents duplicates and allows for the "Edit" functionality
    let budget = await Budget.findOne({ userId: req.user.id, category: category });

    if (budget) {
      // UPDATE: If it exists, overwrite the old limit
      budget.limit = Number(limit);
      await budget.save();
      console.log(`✅ Updated: ${category} limit set to ${limit} for user ${req.user.id}`);
    } else {
      // CREATE: If it doesn't exist, create a fresh entry
      budget = new Budget({
        userId: req.user.id,
        category: category,
        limit: Number(limit)
      });
      await budget.save();
      console.log(`✅ Created: New ${category} budget for user ${req.user.id}`);
    }

    // Return the updated/created budget object to the frontend
    res.status(200).json(budget);

  } catch (err) {
    console.error("SERVER CRASH IN setBudget:", err.message);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};