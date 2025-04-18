import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getProfileImage } from '../main.jsx';

function Analytics() {
  // Current user info
  const [currentUser] = useState({
    id: 'user1',
    role: 'Admin',
    organizationId: 'org1',
    credits: 0,
  });
  
  // Generate realistic time-series data for lead generation
  const generateTimeSeriesData = (startMonth = 0, count = 12) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    const getRandomIncrease = (base, min = 10, max = 50) => {
      return base + Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    let receptoValue = 150;
    let orgValue = 200;
    
    for (let i = 0; i < count; i++) {
      const monthIndex = (startMonth + i) % 12;
      
      // Generate realistic increasing trends with some randomness
      receptoValue = getRandomIncrease(receptoValue);
      orgValue = getRandomIncrease(orgValue);
      
      data.push({
        name: months[monthIndex],
        receptoNet: receptoValue,
        orgNetwork: orgValue
      });
    }
    
    return data;
  };

  // Team members data with extended properties
  const [teamMembers, setTeamMembers] = useState([
    { 
      id: 'user1', 
      name: 'Anand Kumar', 
      lastActive: '2min ago', 
      role: 'Admin',
      status: 'Active',
      generated: 123,
      unlocked: 123,
      assigned: 40,
      avatar: null,
      email: 'anand.kumar@company.com',
      joinedDate: '12 Jan 2025'
    },
    { 
      id: 'user2', 
      name: 'Olivia Rhye', 
      lastActive: '5min ago', 
      role: 'Member',
      status: 'Active',
      generated: 56,
      unlocked: 56,
      assigned: 25,
      avatar: null,
      email: 'olivia.rhye@company.com',
      joinedDate: '3 Feb 2025'
    },
    { 
      id: 'user3', 
      name: 'Phoenix Baker', 
      lastActive: '1hr ago', 
      role: 'Member',
      status: 'Inactive',
      generated: 23,
      unlocked: 23,
      assigned: 15,
      avatar: null,
      email: 'phoenix.baker@company.com',
      joinedDate: '15 Feb 2025'
    },
    { 
      id: 'user4', 
      name: 'Lana Steiner', 
      lastActive: '3hrs ago', 
      role: 'Admin',
      status: 'Active',
      generated: 89,
      unlocked: 82,
      assigned: 32,
      avatar: null,
      email: 'lana.steiner@company.com',
      joinedDate: '1 Mar 2025'
    },
    { 
      id: 'user5', 
      name: 'Demi Wilkinson', 
      lastActive: '2days ago', 
      role: 'Member',
      status: 'Removed',
      generated: 12,
      unlocked: 12,
      assigned: 5,
      avatar: null,
      email: 'demi.wilkinson@company.com',
      joinedDate: '20 Jan 2025'
    },
  ]);
  
  // Generate larger dataset for charts
  const [leadGenerationData, setLeadGenerationData] = useState(() => 
    generateTimeSeriesData(0, 12)
  );
  
  // Analytics stats with real-time updates
  const [stats, setStats] = useState({
    receptoNetLeads: {
      total: 404,
      unlocked: 179,
      yetToUnlock: 225,
      liked: 234,
      disliked: 45,
      assigned: 156,
    },
    orgNetworkLeads: {
      total: 594,
      contacted: 179,
      yetToContact: 415,
      liked: 245,
      disliked: 63,
      assigned: 187,
    }
  });

  // Get data from localStorage or initialize
  useEffect(() => {
    const savedStats = localStorage.getItem('receptoAnalyticsStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    const savedLeadData = localStorage.getItem('receptoLeadGenerationData');
    if (savedLeadData) {
      setLeadGenerationData(JSON.parse(savedLeadData));
    }
  }, []);

  // Save stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('receptoAnalyticsStats', JSON.stringify(stats));
  }, [stats]);

  // Save lead generation data to localStorage
  useEffect(() => {
    localStorage.setItem('receptoLeadGenerationData', JSON.stringify(leadGenerationData));
  }, [leadGenerationData]);

  // Get lead data from localStorage 
  const getLeadsFromStorage = useCallback(() => {
    const savedLeads = localStorage.getItem('receptoLeads');
    if (savedLeads) {
      return JSON.parse(savedLeads);
    }
    return [];
  }, []);

  // Update stats based on leads data
  useEffect(() => {
    const updateStatsFromLeads = () => {
      const leads = getLeadsFromStorage();
      if (leads && leads.length > 0) {
        // Count different types of leads
        const receptoNetLeads = leads.filter(lead => lead.isRecepNet);
        const orgNetworkLeads = leads.filter(lead => !lead.isRecepNet);
        
        // Count unlocked/locked ReceptoNet leads
        const unlockedReceptoNet = receptoNetLeads.filter(lead => !lead.isLocked);
        const lockedReceptoNet = receptoNetLeads.filter(lead => lead.isLocked);
        
        // Count liked and assigned leads
        const likedReceptoNet = receptoNetLeads.filter(lead => lead.likedBy && lead.likedBy.length > 0);
        const dislikedReceptoNet = receptoNetLeads.filter(lead => lead.dislikedBy && lead.dislikedBy.length > 0);
        const assignedReceptoNet = receptoNetLeads.filter(lead => lead.assignedTo);
        
        // Count org network stats
        const contactedOrgNetwork = orgNetworkLeads.filter(lead => lead.contacted);
        const notContactedOrgNetwork = orgNetworkLeads.filter(lead => !lead.contacted);
        const likedOrgNetwork = orgNetworkLeads.filter(lead => lead.likedBy && lead.likedBy.length > 0);
        const dislikedOrgNetwork = orgNetworkLeads.filter(lead => lead.dislikedBy && lead.dislikedBy.length > 0);
        const assignedOrgNetwork = orgNetworkLeads.filter(lead => lead.assignedTo);
        
        // Update stats based on current leads
        setStats({
          receptoNetLeads: {
            total: receptoNetLeads.length,
            unlocked: unlockedReceptoNet.length,
            yetToUnlock: lockedReceptoNet.length,
            liked: likedReceptoNet.length,
            disliked: dislikedReceptoNet.length,
            assigned: assignedReceptoNet.length,
          },
          orgNetworkLeads: {
            total: orgNetworkLeads.length,
            contacted: contactedOrgNetwork.length,
            yetToContact: notContactedOrgNetwork.length,
            liked: likedOrgNetwork.length,
            disliked: dislikedOrgNetwork.length,
            assigned: assignedOrgNetwork.length,
          }
        });
      }
    };
    
    // Initial update
    updateStatsFromLeads();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'receptoLeads') {
        updateStatsFromLeads();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [getLeadsFromStorage]);

  
  
  // Action menu state
  const [actionMenuVisible, setActionMenuVisible] = useState(null);
  const actionMenuRef = useRef(null);

  // Role edit modal state
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const roleModalRef = useRef(null);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenuVisible(null);
      }
      
      if (roleModalRef.current && !roleModalRef.current.contains(event.target)) {
        setRoleModalVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle action menu toggle
  const toggleActionMenu = (userId) => {
    setActionMenuVisible(actionMenuVisible === userId ? null : userId);
  };

  // Handle manage role action
  const handleManageRole = (userId) => {
    const user = teamMembers.find(member => member.id === userId);
    setSelectedUser(user);
    setRoleModalVisible(true);
    setActionMenuVisible(null);
  };

  // Handle remove from team action
  const handleRemoveFromTeam = (userId) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === userId 
        ? { ...member, status: 'Removed', role: 'Removed' } 
        : member
    ));
    setActionMenuVisible(null);
  };

  // Handle role change in modal
  const handleRoleChange = (role) => {
    if (selectedUser) {
      setTeamMembers(teamMembers.map(member => 
        member.id === selectedUser.id 
          ? { ...member, role } 
          : member
      ));
    }
  };
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(teamMembers.length / itemsPerPage);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return teamMembers.slice(startIndex, endIndex);
  };

  // Helper function to get badge color based on assigned count
  const getAssignedBadgeColor = (count) => {
    if (count >= 30) return 'bg-orange-500';
    if (count >= 15) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header credits={currentUser.credits} />

        {/* Analytics Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            
           
            
            {/* Analytics Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
              {/* ReceptoNet Leads Section - Left */}
              <div className="col-span-8 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-medium text-gray-800">ReceptoNet Leads</h2>
                  <div className="ml-2 cursor-help group relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute left-0 -bottom-12 w-48 bg-black text-white text-xs p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                      ReceptoNet leads are generated from your network
                    </div>
                  </div>
                </div>
                
                {/* Two-column layout for this section */}
                <div className="flex">
                  {/* Left column with stats */}
                  <div className="w-1/2 pr-4">
                    <div className="flex flex-col mb-3">
                      <h3 className="text-3xl font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">{stats.receptoNetLeads.total}</h3>
                      <p className="text-xs text-gray-500">Total Leads</p>
                    </div>

                    <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${stats.receptoNetLeads.unlocked / stats.receptoNetLeads.total * 100}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600 mb-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 bg-blue-600 rounded-full mr-1.5"></div>
                        <span>Unlocked</span>
                        <span className="ml-1 text-blue-600 font-medium">{stats.receptoNetLeads.unlocked} leads</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 bg-gray-300 rounded-full mr-1.5"></div>
                        <span>Yet to Unlock</span>
                        <span className="ml-1 text-gray-500 font-medium">{stats.receptoNetLeads.yetToUnlock} leads</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column with chart */}
                  <div className="w-1/2">
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={leadGenerationData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorReceptoNet" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              borderRadius: '0.5rem',
                              border: 'none',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="receptoNet" 
                            name="ReceptoNet Leads"
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#colorReceptoNet)" 
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liked Leads Card - Right Top */}
              <div className="col-span-2 bg-white py-1.5 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-start ml-2">
                  <div className="p-1.5 bg-blue-100 rounded-md mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Liked Leads</p>
                  <p className="text-xl font-semibold">
                    {stats.receptoNetLeads.liked}
                  </p>
                </div>
              </div>

              {/* Assigned Leads Card - Right Bottom */}
              <div className="col-span-2 bg-white py-1.5 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-start ml-2">
                  <div className="p-1.5 bg-green-100 rounded-md mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Assigned Leads</p>
                  <p className="text-xl font-semibold">
                  {stats.receptoNetLeads.assigned}
                  </p>
                </div>
              </div>

              {/* Org Network Leads Section - Left */}
              <div className="col-span-8 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-base font-medium text-gray-800">Org Network Leads</h2>
                  <div className="ml-2 cursor-help group relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute left-0 -bottom-12 w-48 bg-black text-white text-xs p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                      Leads from your organization's network
                    </div>
                  </div>
                </div>
                
                {/* Two-column layout for this section */}
                <div className="flex">
                  {/* Left column with stats */}
                  <div className="w-1/2 pr-4">
                    <div className="flex flex-col mb-3">
                      <h3 className="text-3xl font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">{stats.orgNetworkLeads.total}</h3>
                      <p className="text-xs text-gray-500">Total Leads</p>
                    </div>

                    <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${stats.orgNetworkLeads.contacted / stats.orgNetworkLeads.total * 100}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600 mb-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 bg-orange-500 rounded-full mr-1.5"></div>
                        <span>Contacted</span>
                        <span className="ml-1 text-orange-600 font-medium">{stats.orgNetworkLeads.contacted} leads</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 bg-gray-300 rounded-full mr-1.5"></div>
                        <span>Yet to Contact</span>
                        <span className="ml-1 text-gray-500 font-medium">{stats.orgNetworkLeads.yetToContact} leads</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column with chart */}
                  <div className="w-1/2">
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={leadGenerationData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorOrgNetwork" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              borderRadius: '0.5rem',
                              border: 'none',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="orgNetwork" 
                            name="Org Network Leads"
                            stroke="#f97316" 
                            fillOpacity={1} 
                            fill="url(#colorOrgNetwork)" 
                            activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liked Leads Card for Org Network - Right */}
              <div className="col-span-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-start ml-2">
                  <div className="p-1.5 bg-orange-100 rounded-md mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Liked Leads</p>
                  <p className="text-xl font-semibold">
                   {stats.orgNetworkLeads.liked}
                  </p>
                </div>
              </div>

              {/* Assigned Leads Card for Org Network */}
              <div className="col-span-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-start ml-2">
                  <div className="p-1.5 bg-orange-100 rounded-md mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">Assigned Leads</p>
                  <p className="text-xl font-semibold">
                    {stats.orgNetworkLeads.assigned}
                  </p>
                </div>
              </div>
            </div>

            
            

            {/* Team Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-2">
              <table className="min-w-full">
                <thead>
                  <tr className="text-gray-500 text-xs">
                    <th className="py-3 font-medium text-left w-1/3">
                      Team
                    </th>
                    <th className="flex items-center py-3 font-medium text-left w-1/6">
                      Role
                      <span className="ml-1 cursor-help inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </th>
                    <th className="py-3 font-medium text-left w-1/6">
                      Generated
                      <span className="ml-1 cursor-help inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </th>
                    <th className="py-3 font-medium text-left w-1/6">
                      Unlocked
                      <span className="ml-1 cursor-help inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </th>
                    <th className="py-3 font-medium text-left w-1/6">
                      Assigned
                      <span className="ml-1 cursor-help inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </th>
                    <th className="py-3 font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((member, index) => (
                    <tr key={member.id} className="border-t border-gray-200">
                      <td className="py-4 w-1/3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3 overflow-hidden relative">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                            ) : (
                              <img 
                                src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`} 
                                alt={member.name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            )}
                            {/* Online status indicator - Moved outside of the image bounds */}
                            <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${member.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-gray-500">Last active {member.lastActive}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 w-1/6">
                        {member.role === "Admin" && (
                          <span className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full max-w-min whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {member.role}
                          </span>
                        )}
                        {member.role === "Removed" && (
                          <span className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full max-w-min whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {member.role}
                          </span>
                        )}
                        {member.role === "Member" && (
                          <span className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full max-w-min whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {member.role}
                          </span>
                        )}
                      </td>
                      <td className="py-4 w-1/6">{member.generated}</td>
                      <td className="py-4 w-1/6">{member.unlocked}</td>
                      <td className="py-4 w-1/6">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${getAssignedBadgeColor(member.assigned)} text-white text-xs font-medium`}>
                          {member.assigned}
                        </span>
                      </td>
                      <td className="py-4 text-right w-12">
                        <button 
                          className="text-gray-400 hover:text-gray-600 relative"
                          onClick={() => toggleActionMenu(member.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                          
                          {/* Action Menu */}
                          {actionMenuVisible === member.id && (
                            <div 
                              ref={actionMenuRef}
                              className="absolute right-0 top-0 z-10 w-48 bg-white rounded-md shadow-lg overflow-hidden"
                            >
                              <div className="py-1">
                                <h3 className="flex item-left ml-4 text-sm font-semibold  text-gray-700">Actions</h3>
                                
                                {/* Border between heading and first action button */}
                                <div className="border-t border-gray-300 mt-1 mb-1"></div>
                                
                                <button 
                                  onClick={() => handleManageRole(member.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left "
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Manage Role
                                </button>
                                
                                {/* Border between action buttons */}
                                <div className="border-t border-gray-300"></div>
                                
                                <button 
                                  onClick={() => handleRemoveFromTeam(member.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                  </svg>
                                  Remove from team
                                </button>
                              </div>
                            </div>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 mt-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 text-xs border rounded-md ${
                    currentPage === 1 
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        currentPage === i + 1
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 text-xs border rounded-md ${
                    currentPage === totalPages
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Management Modal */}
      {roleModalVisible && selectedUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div 
            ref={roleModalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="flex flex-col items-left py-6 px-6 bg-gray-50 border-b">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M14 14.252V16.3414C13.3744 16.1203 12.7013 16 12 16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">Edit Team Member</h2>
                <p className="text-sm text-gray-500">Make changes to team member information</p>
              </div>
            </div>
            
            <div className="p-6">
              {/* Email Address Field */}
              <div className="mb-5">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email-address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="colleague@company.com"
                  defaultValue={selectedUser.email}
                />
              </div>
              
              {/* Role Dropdown */}
              <div className="mb-7">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <select 
                    id="role"
                    className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={selectedUser.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex  gap-2">
              <button 
                  onClick={() => setRoleModalVisible(false)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setRoleModalVisible(false)}
                  className="w-full px-4 py-2.5 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;