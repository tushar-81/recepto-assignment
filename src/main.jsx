import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Profile images utility - Import all profile images
const profileImages = {
  male1: '/src/assets/profiles/male1.jpg',
  male2: '/src/assets/profiles/male2.jpg',
  male3: '/src/assets/profiles/male3.jpg',
  male4: '/src/assets/profiles/male4.jpeg',
  male5: '/src/assets/profiles/male5.jpg',
  female1: '/src/assets/profiles/female1.jpeg',
  female2: '/src/assets/profiles/female2.jpeg',
  female3: '/src/assets/profiles/female3.jpeg',
  female4: '/src/assets/profiles/female4.jpeg',
  female5: '/src/assets/profiles/female5.jpeg',
};

// Helper function to get a consistent profile image based on ID
export const getProfileImage = (userId) => {
  const imageKeys = Object.keys(profileImages);
  // Use modulo to get a consistent image based on user ID
  const imageIndex = userId % imageKeys.length;
  return profileImages[imageKeys[imageIndex]];
};

// Function to get a consistent random profile image based on ID
export const getRandomProfileImage = (userId) => {
  // Ensure userId is a number and convert it if needed
  const id = typeof userId === 'string' ? parseInt(userId.replace(/\D/g, ''), 10) || 1 : userId || 1;
  
  // Determine gender based on user ID (even = men, odd = women)
  const gender = id % 2 === 0 ? 'men' : 'women';
  // Get a consistent number between 1-90 based on user ID
  const imageNumber = (id % 90) + 1; // Ensure it's never 0
  
  // Add cache-busting parameter to prevent caching issues
  return `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg?nocache=${id}`;
};

// Initialize users in localStorage if they don't exist
export const initializeUsers = () => {
  const users = localStorage.getItem('receptoUsers');
  
  if (!users) {
    const defaultUsers = [
      { id: 'user1', username: 'admin', password: 'admin123', role: 'Admin', name: 'Anand Kumar' },
      { id: 'user2', username: 'user', password: 'user123', role: 'Member', name: 'Olivia Rhye' },
      { id: 'user3', username: 'demo', password: 'demo123', role: 'Member', name: 'Phoenix Baker' }
    ];
    
    localStorage.setItem('receptoUsers', JSON.stringify(defaultUsers));
    console.log('Default users initialized in localStorage');
  }
};

// Call the initialize function
initializeUsers();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
