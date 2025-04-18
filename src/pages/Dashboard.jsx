import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LeadCard from '../components/LeadCard';

function Dashboard() {
  // Current user info
  const [currentUser, setCurrentUser] = useState({
    id: 'user1',
    name: 'Anand Kumar',
    role: 'Admin',
    organizationId: 'org1',
    credits: 10,
  });
  
  // Organization users
  const [organizationUsers, setOrganizationUsers] = useState([
    { id: 'user1', name: 'Anand Kumar', role: 'Admin', avatar: null },
    { id: 'user2', name: 'Olivia Rhye', role: 'Member', avatar: null },
    { id: 'user3', name: 'Phoenix Baker', role: 'Member', avatar: null },
  ]);
  
  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterButtonPosition, setFilterButtonPosition] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    locations: [],
    score: [0, 100]
  });
  const filterButtonRef = useRef(null);
  
  // Get lead data from local storage or use initial data
  const getInitialLeads = () => {
    const savedLeads = localStorage.getItem('receptoLeads');
    if (savedLeads) {
      return JSON.parse(savedLeads);
    }
    
    // Initial lead data
    return [
      {
        id: 'lead1',
        name: 'Jen',
        location: 'Mumbai, India',
        description: 'Looking for recommendations on product analytics tools for our B2B SaaS platform. Currently evaluating options for a team of 50 ...',
        foundTime: '2 hour ago',
        isRecepNet: true,
        isLocked: true,
        unlockCost: '3',
        score: '99',
        likedBy: [],
        dislikedBy: [],
      },
      {
        id: 'lead2',
        name: 'Jennifer Markus',
        location: 'Mumbai, India',
        description: 'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business opportunities...',
        group: 'Group name',
        organization: 'Org\'s Network',
        timePosted: '3 hours ago',
        score: '74',
        isLocked: false,
        likedBy: [],
        dislikedBy: [],
        assignedTo: null,
      },
      {
        id: 'lead3',
        name: 'Jen',
        location: 'Mumbai, India',
        description: 'Looking for recommendations on product analytics tools for our B2B SaaS platform. Currently evaluating options for a team of 50 ...',
        foundTime: '2 hour ago',
        isRecepNet: true,
        isLocked: false,
        unlockCost: '0',
        score: '99',
        likedBy: [],
        dislikedBy: [],
      },
      {
        id: 'lead4',
        name: 'Jennifer Markus',
        location: 'Mumbai, India',
        description: 'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business opportunities...',
        group: 'Group name',
        timePosted: 'Today',
        score: '74',
        isLocked: true,
        unlockCost: '3',
        organization: 'Org\'s Network',
        likedBy: [],
        dislikedBy: [],
      },
      {
        id: 'lead5',
        name: 'Jennifer Markus',
        location: 'Mumbai, India',
        description: 'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business opportunities...',
        group: 'Group name',
        timePosted: '3 hours ago',
        score: '74',
        isLocked: false,
        organization: 'Org\'s Network',
        likedBy: [],
        dislikedBy: [],
        assignedTo: null,
      },
      {
        id: 'lead6',
        name: 'Elizabeth',
        location: 'Mumbai, India',
        description: 'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business opportunities...',
        group: 'Group name',
        timePosted: '3 hours ago',
        score: '74',
        isLocked: false,
        organization: 'Org\'s Network',
        likedBy: [],
        dislikedBy: [],
        assignedTo: null,
      },
      {
        id: 'lead7',
        name: 'Natasha',
        location: 'Mumbai, India',
        description: 'A team from "company name mentioned" is seeking a highly motivated Business Development Executive to outreach and secure business opportunities...',
        group: 'Group name',
        timePosted: '3 hours ago',
        score: '74',
        isLocked: false,
        organization: 'Org\'s Network',
        likedBy: [],
        dislikedBy: [],
        assignedTo: null,
      }
    ];
  };
  
  const [leads, setLeads] = useState(getInitialLeads());
  
  // Save leads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('receptoLeads', JSON.stringify(leads));
  }, [leads]);
  
  // Handle unlocking a lead
  const handleUnlock = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const cost = parseInt(lead.unlockCost);
    
    // Check if user has enough credits
    if (currentUser.credits < cost) {
      alert("You don't have enough credits to unlock this lead.");
      return;
    }
    
    // Update user credits
    const updatedUser = {
      ...currentUser,
      credits: currentUser.credits - cost
    };
    setCurrentUser(updatedUser);
    
    // Update lead status
    setLeads(leads.map(l => 
      l.id === leadId ? { ...l, isLocked: false } : l
    ));
  };
  
  // Handle liking a lead
  const handleLike = (leadId) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const isAlreadyLiked = lead.likedBy?.includes(currentUser.id);
        const likedBy = isAlreadyLiked 
          ? lead.likedBy.filter(id => id !== currentUser.id) 
          : [...(lead.likedBy || []), currentUser.id];
        
        const dislikedBy = lead.dislikedBy?.filter(id => id !== currentUser.id) || [];
        
        return {
          ...lead,
          likedBy,
          dislikedBy
        };
      }
      return lead;
    }));
  };
  
  // Handle disliking a lead
  const handleDislike = (leadId) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const isAlreadyDisliked = lead.dislikedBy?.includes(currentUser.id);
        const dislikedBy = isAlreadyDisliked 
          ? lead.dislikedBy.filter(id => id !== currentUser.id) 
          : [...(lead.dislikedBy || []), currentUser.id];
        
        const likedBy = lead.likedBy?.filter(id => id !== currentUser.id) || [];
        
        return {
          ...lead,
          likedBy,
          dislikedBy
        };
      }
      return lead;
    }));
  };
  
  // Handle assigning a lead to a user
  const handleAssign = (leadId, userId) => {
    const assignedUser = organizationUsers.find(user => user.id === userId);
    if (!assignedUser) return;
    
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, assignedTo: assignedUser } : lead
    ));
  };
  
  // Open filter modal
  const handleOpenFilterModal = () => {
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setFilterButtonPosition({
        top: rect.top,
        left: rect.left
      });
    }
    setShowFilterModal(true);
  };
  
  // Apply filters when the Apply button is clicked
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };
  
  // Filter leads based on active filters
  const filteredLeads = leads.filter(lead => {
    // Location filter
    if (activeFilters.locations && activeFilters.locations.length > 0) {
      // Extract country from location (e.g., "Mumbai, India" -> "India")
      const country = lead.location.split(',').pop().trim();
      if (!activeFilters.locations.includes(country)) {
        return false;
      }
    }
    
    // Score filter
    if (activeFilters.score) {
      const score = parseInt(lead.score);
      if (score < activeFilters.score[0] || score > activeFilters.score[1]) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          credits={currentUser.credits} 
          onApplyFilters={handleApplyFilters}
          initialFilters={activeFilters}
        />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Filter Controls */}
          <div className="max-w-5xl mx-auto mb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Leads</h1>
            
            {/* Filter button */}
            {/* <button 
              ref={filterButtonRef}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 hover:bg-gray-50"
              onClick={handleOpenFilterModal}
            >
              <svg className="w-4 h-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter
              {(activeFilters.locations.length > 0 || activeFilters.score[0] > 0 || activeFilters.score[1] < 100) && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {activeFilters.locations.length + (activeFilters.score[0] > 0 || activeFilters.score[1] < 100 ? 1 : 0)}
                </span>
              )}
            </button> */}
          </div>
          
          {/* Lead Cards */}
          <div className="max-w-5xl mx-auto">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="mb-2">
                  <LeadCard 
                    lead={lead} 
                    onUnlock={handleUnlock}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onAssign={handleAssign}
                    organizationUsers={organizationUsers}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No leads match your current filters.</p>
                <button 
                  className="mt-3 text-blue-600 text-sm hover:underline"
                  onClick={() => setActiveFilters({ locations: [], score: [0, 100] })}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;