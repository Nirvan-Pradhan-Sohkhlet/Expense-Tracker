import React, { useState, useEffect } from 'react';
import { fetchBudgets, setBudget, fetchExpenses, fetchIncome, updateIncome } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Edit2, Wallet, PieChart, AlertCircle, Info } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState(0);
  const [formData, setFormData] = useState({ category: 'Food', limit: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bRes, eRes, iRes] = await Promise.all([
        fetchBudgets(),
        fetchExpenses(),
        fetchIncome()
      ]);
      setBudgets(bRes.data);
      setExpenses(eRes.data);
      setSalary(iRes.data.amount || 0);
    } catch (err) {
      console.error("Error loading budget data");
    }
  };

  const totalPlanned = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
  const remainingSalary = salary - totalPlanned;

  const handleSalaryUpdate = async (val) => {
    const amount = Number(val);
    setSalary(amount);
    try {
      await updateIncome(amount);
    } catch (err) {
      console.error("Failed to save salary");
    }
  };

  const handleEditClick = (budget) => {
    setFormData({ category: budget.category, limit: budget.limit });
    // Smooth scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    const newLimit = Number(formData.limit);

    // Calculate if update is valid against salary
    const existingBudget = budgets.find(b => b.category === formData.category);
    const oldLimit = existingBudget ? Number(existingBudget.limit) : 0;

    if ((totalPlanned - oldLimit + newLimit) > salary) {
      alert(`❌ This exceeds your salary! Available to plan: ₹${salary - (totalPlanned - oldLimit)}`);
      return;
    }

    try {
      await setBudget(formData);
      await loadData(); // Refresh list
      setFormData({ ...formData, limit: '' }); // Clear only the limit
    } catch (err) {
      alert("Failed to set budget. Please check server.");
    }
  };

  const calculateSpent = (category) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getBarColor = (percent) => {
    if (percent >= 90) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'; 
    if (percent >= 70) return 'bg-yellow-500'; 
    return 'bg-blue-500';
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Sticky Sidebar included inside your Sidebar component via our previous fix */}
      <Sidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Budget Monitoring</h1>
          <p className="text-gray-500 dark:text-gray-400">Plan your monthly limits and track your spending health.</p>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
              <Wallet size={16} /> Monthly Salary (Income)
            </h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2 dark:text-white">₹</span>
              <input 
                type="number" 
                className="text-2xl font-bold w-full bg-transparent border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 outline-none dark:text-white transition-all"
                value={salary}
                onChange={(e) => handleSalaryUpdate(e.target.value)}
              />
            </div>
          </div>

          <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 transition-colors ${remainingSalary >= 0 ? 'border-blue-500' : 'border-red-500'}`}>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
              <PieChart size={16} /> Remaining to Plan
            </h3>
            <p className={`text-2xl font-bold ${remainingSalary < 0 ? 'text-red-600' : 'text-blue-600'}`}>
              ₹{remainingSalary}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total Planned: ₹{totalPlanned}</p>
          </div>
        </div>

        {/* Action Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-10 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center gap-2">
            Set Category Limit
          </h3>
          <form onSubmit={handleAddBudget} className="flex flex-wrap gap-4">
            <select 
              className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 ring-blue-500/20"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Miscellaneous'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Limit (₹)" 
              className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 outline-none focus:ring-2 ring-blue-500/20"
              value={formData.limit}
              onChange={(e) => setFormData({...formData, limit: e.target.value})}
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              {budgets.find(b => b.category === formData.category) ? 'Update Limit' : 'Set Limit'}
            </button>
          </form>
        </div>

        {/* Budget List */}
        <div className="grid grid-cols-1 gap-4">
          {budgets.length > 0 ? (
            budgets.map((b) => {
              const spent = calculateSpent(b.category);
              const percent = Math.min((spent / b.limit) * 100, 100);
              return (
                <div key={b._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.01]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-700 dark:text-gray-100 text-lg">{b.category}</span>
                      <button 
                        onClick={() => handleEditClick(b)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                        title="Edit Limit"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block">
                        Spent: ₹{spent} / Target: ₹{b.limit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ease-out ${getBarColor(percent)}`}
                      style={{ width: `${percent}%` }} 
                    ></div>
                  </div>
                  
                  {percent >= 100 && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">
                      <AlertCircle size={12} /> You have exceeded this budget limit!
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <Info className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No budgets set yet. Start by setting a limit above!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Budgets;