import React, { useState, useRef } from 'react';
import FilterModal from './FilterModal';

const Header = ({ credits, onApplyFilters, initialFilters = { locations: [], score: [0, 100] } }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterButtonPosition, setFilterButtonPosition] = useState(null);
  const filterButtonRef = useRef(null);

  const handleFilterClick = () => {
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setFilterButtonPosition({
        top: rect.top,
        right: rect.right
      });
    }
    setShowFilterModal(true);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-300 py-2 px-4">
        <div className="flex items-center justify-between">
          {/* Company Name */}
          <div className="flex items-center  rounded-md">
            <div className="p-2 bg-gray-50 ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            {/* <input 
              type="text" 
              placeholder="Company name" 
              className="p-2 text-sm outline-none w-40"
            /> */}
            <h1>Company Name</h1>
          </div>

          {/* Center Search */}
          <div className="flex-grow mx-4 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="What is the best tool for XYZ XYZ..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Credits Badge */}
            <div className="px-3 py-1.5 bg-blue-600 rounded-md text-sm font-medium text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              0 credits
            </div>

            {/* User Profile */}
            <div className="flex items-center border-l pl-3">
              <div>
                <p className="text-sm font-semibold text-right">Anand Kumar</p>
                <p className="text-xs text-gray-500 text-right">Admin</p>
              </div>
              <button className="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex justify-end mt-3">
          <button 
            ref={filterButtonRef}
            className="relative flex items-center px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-sm"
            onClick={handleFilterClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
          </button>
        </div>
      </header>

      {/* Filter Modal */}
      <FilterModal 
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(filters) => {
          onApplyFilters(filters);
          setShowFilterModal(false);
        }}
        buttonPosition={filterButtonPosition}
        initialFilters={initialFilters}
      />
    </>
  );
};

export default Header;