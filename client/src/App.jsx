import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';
import SavingsGoals from './pages/SavingsGoals';

function App() {
  // Simple check to see if user is logged in
  const isAuthenticated = !!localStorage.getItem('user');

  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/add-expense" 
          element={isAuthenticated ? <AddExpense /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/analytics" 
          element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/budgets" 
          element={isAuthenticated ? <Budgets /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/savings-goals" 
          element={isAuthenticated ? <SavingsGoals /> : <Navigate to="/login" />} 
        />

        {/* Redirect root to login or dashboard */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;