exports.generateInsights = (expenses, budgets) => {
  const insights = [];
  
  // Example Logic: Weekend Spending Insight [cite: 68]
  const weekendExpenses = expenses.filter(exp => {
    const day = new Date(exp.date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });

  if (weekendExpenses.length > (expenses.length / 2)) {
    insights.push("Most of your spending occurs on weekends.");
  }

  // Example Logic: Budget Warning [cite: 57]
  budgets.forEach(budget => {
    const totalSpentInCategory = expenses
      .filter(exp => exp.category === budget.category)
      .reduce((sum, exp) => sum + exp.amount, 0);

    if (totalSpentInCategory >= budget.limit * 0.9) {
      insights.push(`Warning: You have used 90% of your ${budget.category} budget.`);
    }
  });

  return insights;
};