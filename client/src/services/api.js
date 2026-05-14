import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add a request interceptor to attach the JWT token automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers['x-auth-token'] = user.token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API Calls
export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/register', formData);

// Expense API Calls
export const fetchExpenses = () => API.get('/expenses');
export const addExpense = (newExpense) => API.post('/expenses', newExpense);
export const resetExpenses = () => API.delete('/expenses/reset');
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);


// Budget API Calls
export const fetchBudgets = () => API.get('/budgets');
export const setBudget = (budgetData) => API.post('/budgets', budgetData);

// Goal API Calls (New - Added these)
export const fetchGoals = () => API.get('/goals');
export const addGoal = (goalData) => API.post('/goals', goalData);
export const updateGoal = (id, goalData) => API.put(`/goals/${id}`, goalData);

export const fetchIncome = () => API.get('/income');
export const updateIncome = (amount) => API.post('/income', { amount });

export default API;