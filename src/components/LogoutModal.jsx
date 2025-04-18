import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('receptoLoggedUser');
    
    // Set flag to prevent login prompts
    sessionStorage.setItem('manualLogout', 'true');
    
    // Close modal before navigation
    onClose();
    
    // Navigate to login page
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="p-5 text-center">
          {/* Recepto Logo */}
          <div className="flex justify-center mb-2">
            <h1 className="text-xl font-bold text-blue-600">Recepto</h1>
          </div>
          
          {/* Logout Message */}
          <h3 className="text-xl font-medium text-gray-800 mb-3">Log out ?</h3>
          <p className="text-gray-600 mb-6">You'd have to login again to the platform.</p>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;