import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutModal from './LogoutModal';

const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="bg-white shadow-sm h-screen w-48 flex flex-col border-r border-gray-300">
        {/* Logo */}
        <div className="p-4">
          <h1 className="text-xl font-bold text-blue-600">Recepto</h1>
        </div>
        
        {/* Section Label */}
        <div className="px-4 py-2">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">MAIN</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 px-2">
          <Link 
            to="/dashboard" 
            className={`flex items-center py-2 px-3 rounded-md mb-1 hover:bg-gray-100 font-medium ${
              location.pathname === '/dashboard' ? ' text-blue-400' : 'text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              location.pathname === '/dashboard' ? 'text-blue-400' : 'text-gray-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Leads
          </Link>
          
          <Link 
            to="/analytics" 
            className={`flex items-center py-2 px-3 rounded-md mb-1 hover:bg-gray-100 font-medium ${
              location.pathname === '/analytics' ? ' text-blue-400' : 'text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${
              location.pathname === '/analytics' ? 'text-blue-400' : 'text-gray-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Link>
          
          {/* More Section moved here */}
          <div className="px-2 py-2 mt-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">MORE</p>
          </div>
          
          {/* Logout button that shows the modal instead of direct logout */}
          <button 
            className="flex items-center py-2 px-3 rounded-md mb-1 hover:bg-gray-100 font-medium text-gray-700 text-left"
            onClick={() => setShowLogoutModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </nav>
        
        {/* Removed the MORE section from bottom */}
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Sidebar;