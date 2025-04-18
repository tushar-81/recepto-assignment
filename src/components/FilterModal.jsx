import React, { useState, useEffect } from 'react';

const FilterModal = ({ isOpen, onClose, onApply, buttonPosition, initialFilters = { locations: [], score: [0, 100] } }) => {
  const [activeFilter, setActiveFilter] = useState('location');
  const [selectedLocations, setSelectedLocations] = useState(initialFilters.locations || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreRange, setScoreRange] = useState(initialFilters.score || [0, 100]);
  
  // Initialize state from props when the modal opens
  useEffect(() => {
    if (isOpen && initialFilters) {
      setSelectedLocations(initialFilters.locations || []);
      setScoreRange(initialFilters.score || [0, 100]);
    }
  }, [isOpen, initialFilters]);
  
  // Sample country list
  const countries = [
    "India", 
    "United Kingdom",
    "United States of America",
    "Taiwan",
    "France",
    "Saudi Arabia",
    "Germany", 
    "Singapore",
    "China"
  ];
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleLocationToggle = (country) => {
    if (selectedLocations.includes(country)) {
      setSelectedLocations(selectedLocations.filter(loc => loc !== country));
    } else {
      setSelectedLocations([...selectedLocations, country]);
    }
  };
  
  const handleApply = () => {
    onApply({
      locations: selectedLocations,
      score: scoreRange
    });
    onClose();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };
  
  const clearAllFilters = () => {
    setSelectedLocations([]);
    setScoreRange([0, 100]);
  };
  
  if (!isOpen) return null;
  
  // Count active filters
  const activeFilterCount = selectedLocations.length + 
    ((scoreRange[0] > 0 || scoreRange[1] < 100) ? 1 : 0);
  
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div 
        className="absolute bg-white shadow-lg border border-blue-100 rounded-lg w-full overflow-hidden"
        style={{
          top: buttonPosition?.top + 45 || "5rem",
          left: buttonPosition?.left || "50%",
          transform: buttonPosition ? "none" : "translateX(-50%)",
          maxWidth: "500px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-sm font-medium">Filters</h3>
              {activeFilterCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-sm">
                  {activeFilterCount} applied
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button 
                className="text-xs text-blue-600 hover:underline"
                onClick={clearAllFilters}
              >
                Clear all
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            See results in your view based on the filters you select here.
          </p>
        </div>

        {/* Main content - filter tabs on left, filter content on right */}
        <div className="flex">
          {/* Filter tabs - stacked vertically on the left */}
          <div className="w-1/3 border-r border-gray-100 p-2">
            <button 
              className={`w-full flex items-center px-3 py-2.5 rounded-lg mb-2 ${activeFilter === 'location' ? 'bg-blue-100 text-blue-700' : 'bg-white border border-gray-200 text-gray-700'}`}
              onClick={() => setActiveFilter('location')}
            >
              <svg className={`w-4 h-4 ${activeFilter === 'location' ? 'text-blue-600' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm">Location</span>
              {selectedLocations.length > 0 && (
                <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedLocations.length}
                </span>
              )}
            </button>
            
            <button 
              className={`w-full flex items-center px-3 py-2.5 rounded-lg ${activeFilter === 'score' ? 'bg-blue-100 text-blue-700' : 'bg-white border border-gray-200 text-gray-700'}`}
              onClick={() => setActiveFilter('score')}
            >
              <svg className={`w-4 h-4 ${activeFilter === 'score' ? 'text-blue-600' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-2 text-sm">Score</span>
              {(scoreRange[0] > 0 || scoreRange[1] < 100) && (
                <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Filter content - right side */}
          <div className="w-2/3">
            {/* Location filter content */}
            {activeFilter === 'location' && (
              <div className="p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-700">Location</h4>
                      {selectedLocations.length > 0 && (
                        <span className="ml-2 text-xs text-blue-600">{selectedLocations.length} selected</span>
                      )}
                    </div>
                    {selectedLocations.length > 0 && (
                      <button 
                        className="text-xs text-blue-600 hover:underline"
                        onClick={() => setSelectedLocations([])}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Search box */}
                <div className="mb-3 relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search countries"
                    />
                    {searchTerm && (
                      <button 
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg className="h-4 w-4 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Country list */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <div 
                        key={country}
                        className="mb-2 flex items-center"
                      >
                        <input
                          id={`location-${country}`}
                          type="checkbox"
                          checked={selectedLocations.includes(country)}
                          onChange={() => handleLocationToggle(country)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`location-${country}`}
                          className="ml-3 block text-sm text-gray-700"
                        >
                          {country}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No countries match your search.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Score filter content */}
            {activeFilter === 'score' && (
              <div className="p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Score</h4>
                    {(scoreRange[0] > 0 || scoreRange[1] < 100) && (
                      <button 
                        className="text-xs text-blue-600 hover:underline"
                        onClick={() => setScoreRange([0, 100])}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Filter leads based on their quality score</p>
                </div>
                
                {/* Score range display */}
                <div className="flex justify-between mb-2 text-sm">
                  <span>{scoreRange[0]}</span>
                  <span>{scoreRange[1]}</span>
                </div>
                
                {/* Range slider for min score */}
                <div className="mb-4">
                  <label htmlFor="min-score" className="block text-xs font-medium text-gray-700 mb-1">
                    Minimum Score: {scoreRange[0]}
                  </label>
                  <input
                    type="range"
                    id="min-score"
                    min="0"
                    max="100"
                    step="1"
                    value={scoreRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      // Ensure min doesn't exceed max
                      if (value <= scoreRange[1]) {
                        setScoreRange([value, scoreRange[1]]);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Range slider for max score */}
                <div>
                  <label htmlFor="max-score" className="block text-xs font-medium text-gray-700 mb-1">
                    Maximum Score: {scoreRange[1]}
                  </label>
                  <input
                    type="range"
                    id="max-score"
                    min="0"
                    max="100"
                    step="1"
                    value={scoreRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      // Ensure max doesn't go below min
                      if (value >= scoreRange[0]) {
                        setScoreRange([scoreRange[0], value]);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="border-t border-gray-100 p-3 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;