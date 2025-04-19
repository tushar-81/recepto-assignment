import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
   
    const loggedInUser = localStorage.getItem('receptoLoggedUser');
    
   
    const manualLogout = sessionStorage.getItem('manualLogout');
    
    if (loggedInUser) {
      
      navigate('/dashboard');
    } else if (manualLogout === 'true') {
      
      console.log('Manual logout detected, clearing flag');
      sessionStorage.removeItem('manualLogout');
      
    }
    
  }, [navigate]);
  
  const showLoginPrompt = () => {
    const username = prompt('Enter your username:');
    if (username === null) return; 
    
    const password = prompt('Enter your password:');
    if (password === null) return; 
    
    
    const usersJson = localStorage.getItem('receptoUsers');
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    
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
      showLoginPrompt(); 
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