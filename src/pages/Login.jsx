import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's already a logged in user
    const loggedInUser = localStorage.getItem('receptoLoggedUser');
    
    // Check if user manually logged out 
    const manualLogout = sessionStorage.getItem('manualLogout');
    
    if (loggedInUser) {
      navigate('/dashboard');
    } else if (manualLogout === 'true') {
      // Clear the manual logout flag but don't show prompt
      console.log('Manual logout detected, clearing flag');
      sessionStorage.removeItem('manualLogout');
    } else {
      // Show login prompt for normal navigation to login page
      showLoginPrompt();
    }
  }, [navigate]);
  
  const showLoginPrompt = () => {
    const username = prompt('Enter your username:');
    if (username === null) return; // User clicked Cancel
    
    const password = prompt('Enter your password:');
    if (password === null) return; // User clicked Cancel
    
    // Get users from localStorage
    const usersJson = localStorage.getItem('receptoUsers');
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    // Authenticate user
    const user = users.find(
      user => user.username === username && user.password === password
    );
    
    if (user) {
      // Store user info in localStorage (excluding password)
      const userInfo = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      };
      localStorage.setItem('receptoLoggedUser', JSON.stringify(userInfo));
      
      setIsClicked(true);
      
      // Navigate to dashboard after a short delay to show the underline effect
      setTimeout(() => {
        navigate('/dashboard');
      }, 200);
    } else {
      alert('Invalid username or password');
      showLoginPrompt(); // Try again
    }
  };
  
  const handleClick = () => {
    showLoginPrompt();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <h1 
        className={`text-6xl font-bold text-gray-500 cursor-pointer transition-all duration-300 ${isClicked ? 'border-b-4 border-blue-500' : ''}`}
        onClick={handleClick}
      >
        LOGIN
      </h1>
    </div>
  );
}

export default Login;