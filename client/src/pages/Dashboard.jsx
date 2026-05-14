import React, { useEffect, useState } from 'react';
import { fetchExpenses, fetchBudgets, resetExpenses } from '../services/api'; 
import ExpenseChart from '../components/ExpenseChart';
import Sidebar from '../components/Sidebar';
import { RotateCcw } from 'lucide-react'; // Icon for the reset button

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]); 
  const [total, setTotal] = useState(0);

  const getData = async () => {
    try {
      const [expenseRes, budgetRes] = await Promise.all([
        fetchExpenses(),
        fetchBudgets()
      ]);

      setExpenses(expenseRes.data);
      setBudgets(budgetRes.data);
      
      const sum = expenseRes.data.reduce((acc, curr) => acc + curr.amount, 0);
      setTotal(sum);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleReset = async () => {
    const confirmReset = window.confirm(
      "Are you sure? This will permanently delete ALL expenses for this month. This cannot be undone."
    );

    if (confirmReset) {
      try {
        await resetExpenses();
        // Clear local state immediately for instant UI feedback
        setExpenses([]);
        setTotal(0);
        alert("All monthly expenses have been cleared.");
      } catch (err) {
        alert("Failed to reset expenses. Please try again.");
      }
    }
  };

  const calculateBudgetUsage = () => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    
    if (totalLimit === 0) return 0; 
    return Math.round((totalSpent / totalLimit) * 100);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Financial Overview</h1>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors border border-red-200 font-medium"
          >
            <RotateCcw size={18} />
            Reset Monthly Data
          </button>
        </div>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="text-2xl font-bold dark:text-white">₹{total}</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Monthly Budget Usage</p>
            <h2 className="text-2xl font-bold dark:text-white">{calculateBudgetUsage()}%</h2>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Spending by Category</h3>
          <ExpenseChart data={expenses} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;