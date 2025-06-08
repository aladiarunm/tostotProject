import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect called')
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    console.log(userData)
    
    if (accessToken && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      console.log('userData')
      console.log(userData)
    }
    console.log('  ........')
    console.log(userData)
    setLoading(false);
  }, []);

  const handleLogin = (accessToken, userData) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {isAuthenticated ? (
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1">
            <Topbar user={user} onLogout={handleLogout} />
            <div className="p-3">
              <AppRoutes />
            </div>
          </div>
        </div>
      ) : (
        <AppRoutes onLogin={handleLogin} />
      )}
    </Router>
  );
};

export default App;