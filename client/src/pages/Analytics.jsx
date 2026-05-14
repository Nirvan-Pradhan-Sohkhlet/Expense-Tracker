import React, { useEffect, useState } from 'react';
import { fetchExpenses } from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const [insights, setInsights] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const res = await fetchExpenses();
        const data = res.data;

        // 1. Prepare Chart Data (Group by Date)
        const grouped = data.reduce((acc, curr) => {
          const date = new Date(curr.date).toLocaleDateString();
          acc[date] = (acc[date] || 0) + curr.amount;
          return acc;
        }, {});
        
        setBarData(Object.keys(grouped).map(date => ({ 
          date, 
          amount: grouped[date] 
        })));

        // 2. Logic for AI Insights
        const generateLocalInsights = (expenses) => {
          if (expenses.length === 0) return [];
          const list = [];
          const total = expenses.reduce((sum, e) => sum + e.amount, 0);

          // Category Insight
          const categories = {};
          expenses.forEach(e => {
            categories[e.category] = (categories[e.category] || 0) + e.amount;
          });
          const topCategory = Object.keys(categories).reduce((a, b) => 
            categories[a] > categories[b] ? a : b
          );
          list.push({
            text: `Your biggest spending is in ${topCategory} (₹${categories[topCategory]}).`,
            icon: <TrendingUp className="text-blue-500" size={20} />
          });

          // Daily Average Insight
          const uniqueDays = new Set(expenses.map(e => new Date(e.date).toLocaleDateString())).size;
          const avg = Math.round(total / (uniqueDays || 1));
          list.push({
            text: `You're spending an average of ₹${avg} per day.`,
            icon: <Lightbulb className="text-yellow-500" size={20} />
          });

          // Weekend Insight
          const weekendSpend = expenses
            .filter(e => [0, 6].includes(new Date(e.date).getDay()))
            .reduce((sum, e) => sum + e.amount, 0);
          
          if (weekendSpend > 0) {
            const percent = Math.round((weekendSpend / total) * 100);
            list.push({
              text: `${percent}% of your total spending happened on weekends.`,
              icon: <AlertCircle className="text-orange-500" size={20} />
            });
          }

          return list;
        };

        setInsights(generateLocalInsights(data));
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    };
    getAnalytics();
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Smart Analytics</h1> 
          <p className="text-gray-500 dark:text-gray-400">Intelligent financial insights and trends based on your data.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 dark:text-white">Daily Spending Trend</h3> 
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-6 dark:text-white">AI Financial Insights</h3> 
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                    <div className="mr-4 mt-1 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                      {insight.icon}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                      {insight.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 italic">
                  <p>Add at least one expense to unlock smart insights.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;