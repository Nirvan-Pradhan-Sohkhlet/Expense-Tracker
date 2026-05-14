import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../services/api';
import Sidebar from '../components/Sidebar';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = async (e) => {
    setIsScanning(true);
    // Here you would call your /api/ocr endpoint
    // and use the response to populate formData
    setIsScanning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense(formData);
      navigate('/dashboard');
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Add New Expense</h1>
        
        <div className="max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          {/* OCR Upload Section */}
          <div className="mb-8 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
            <p className="text-gray-500 mb-2">Have a receipt? Scan it to auto-fill details.</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
              id="receipt-upload" 
            />
            <label 
              htmlFor="receipt-upload" 
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {isScanning ? 'Scanning...' : 'Upload Receipt'}
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <input 
                name="title" 
                placeholder="e.g., Lunch at McDonald's" 
                onChange={handleChange} 
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700" 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Amount (₹)</label>
                <input 
                  type="number" 
                  name="amount" 
                  onChange={handleChange} 
                  className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select 
                  name="category" 
                  onChange={handleChange} 
                  className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700"
                >
                  <option value="">Auto-Detect</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Date</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Save Expense
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddExpense;