import React, { useState, useEffect } from 'react';
import { fetchGoals, addGoal, updateGoal } from '../services/api'; 
import Sidebar from '../components/Sidebar';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({ name: '', targetAmount: '', deadline: '' });

  // Load goals when the page opens
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const res = await fetchGoals();
      setGoals(res.data);
    } catch (err) {
      console.error("Error loading goals:", err);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await addGoal(formData);
      setFormData({ name: '', targetAmount: '', deadline: '' });
      loadGoals(); // Refresh the list after adding
    } catch (err) {
      console.error("Error adding goal:", err);
      alert("Error adding goal. Check console for details.");
    }
  };

  const handleAddSavings = async (id, currentAmount, addedAmount) => {
    try {
      const newAmount = Number(currentAmount) + Number(addedAmount);
      await updateGoal(id, { currentAmount: newAmount });
      loadGoals(); // Refresh list to show updated progress bar
    } catch (err) {
      console.error("Error updating savings:", err);
      alert("Error updating savings.");
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Savings Goals</h1>

        {/* Form to Add Goal */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Create New Goal</h3>
          <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              placeholder="Goal Name (e.g. Laptop)" 
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="Target Amount (₹)" 
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              required
            />
            <input 
              type="date" 
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition">
              Add Goal
            </button>
          </form>
        </div>

        {/* Display Goals List */}
        <div className="grid gap-6">
          {goals.length === 0 ? (
            <p className="text-gray-500 italic">No savings goals yet. Start by adding one above!</p>
          ) : (
            goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-xl font-bold dark:text-white">{goal.name}</h4>
                      <p className="text-sm text-gray-500">Target: ₹{goal.targetAmount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold dark:text-white">₹{goal.currentAmount} Saved</p>
                      <p className="text-xs font-bold text-blue-500">{progress.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const amount = prompt(`How much would you like to add to your ${goal.name} goal?`);
                        if(amount && !isNaN(amount)) {
                          handleAddSavings(goal._id, goal.currentAmount, amount);
                        }
                      }}
                      className="text-sm bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition"
                    >
                      + Add Savings
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default SavingsGoals;