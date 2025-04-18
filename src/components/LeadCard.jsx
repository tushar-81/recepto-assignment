import React, { useState, useRef, useEffect, useMemo } from 'react';
import { getRandomProfileImage } from '../main';

const LeadCard = ({ lead, onUnlock, onLike, onDislike, onAssign, organizationUsers = [] }) => {
  const { 
    id,
    name,
    avatar,
    location,
    description,
    group,
    organization,
    timePosted,
    score,
    isLocked,
    unlockCost,
    foundTime,
    isRecepNet,
    likedBy,
    dislikedBy,
    assignedTo
  } = lead;

  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(organizationUsers);
  const searchRef = useRef(null);

  // Cache profile images for consistent rendering
  const cachedProfileImage = useMemo(() => getRandomProfileImage(id), [id]);
  
  // Cache profile images for organization users to avoid re-rendering
  const cachedOrgUserImages = useMemo(() => {
    return organizationUsers.reduce((acc, user) => {
      acc[user.id] = getRandomProfileImage(user.id);
      return acc;
    }, {});
  }, [organizationUsers]);
  
  // Cache profile image for assigned user
  const assignedUserImage = useMemo(() => {
    if (!assignedTo) return null;
    return assignedTo.avatar || assignedTo.avatarUrl || getRandomProfileImage(assignedTo.id);
  }, [assignedTo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowAssignDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = organizationUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(organizationUsers);
    }
  }, [searchQuery, organizationUsers]);

  const handleUnlock = () => {
    if (onUnlock) {
      onUnlock(id);
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(id);
    }
  };

  const handleDislike = () => {
    if (onDislike) {
      onDislike(id);
    }
  };

  const handleAssign = (userId) => {
    if (onAssign) {
      // Find the selected user to get their details including avatar
      const selectedUser = organizationUsers.find(user => user.id === userId);
      
      // Get a consistent profile image for this user from randomuser.me
      const profileImage = getRandomProfileImage(userId);
      
      // Create a complete user object with consistent avatar
      const userWithAvatar = {
        ...selectedUser,
        avatarUrl: selectedUser.avatar || profileImage
      };
      
      // Call the onAssign with the enhanced user object
      onAssign(id, userId, userWithAvatar);
      setShowAssignDropdown(false);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Border color based on lead type
  const borderColor = isRecepNet ? 'border-blue-500' : 'border-green-500';

  return (
    <div className={`bg-white border-l-4 ${borderColor} rounded-sm shadow-sm hover:shadow transition-shadow relative`}>
      <div className="flex p-3 items-start">
        {/* Left Section - User Avatar */}
        <div className="mr-3 relative">
          {avatar ? (
            <img src={avatar} alt={name} className="h-10 w-10 rounded-md object-cover" />
          ) : (
            <div className={`h-10 w-10 rounded-md flex items-center justify-center text-white font-medium ${isRecepNet ? 'bg-blue-500' : 'bg-green-500'}`}>
              <img src={cachedProfileImage} alt={name} className="h-full w-full rounded-md object-cover" />
            </div>
          )}

          {/* Removing the assigned picture badge from the avatar */}
        </div>

        {/* Middle Content */}
        <div className="flex-grow">
          {/* User name and location */}
          <div className="flex items-center">
            <div className="font-medium text-sm">
              {isRecepNet && isLocked ? (
                <span className="bg-gray-200 px-2 py-0.5 rounded">{name}</span>
              ) : (
                name
              )}
            </div>
            <div className="mx-1 text-gray-400">·</div>
            <div className="text-sm text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {location}
            </div>
            
            {/* Organization icon and name - Now appears right after location */}
            {organization && (
              <div className="flex items-center ml-2">
                {!isRecepNet && (
                  <div className="flex -space-x-1 mr-1">
                    {organizationUsers.slice(0, 3).map((user, idx) => (
                      <div 
                        key={idx} 
                        className="h-5 w-5 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs border border-white overflow-hidden"
                      >
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <img src={cachedOrgUserImages[user.id]} alt={user.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-gray-700">{organization}</span>
              </div>
            )}
            
            {/* Assigned person indicator */}
            {assignedTo && (
              <div className="flex items-center ml-auto px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full border border-green-500">
                <div className="h-5 w-5 rounded-full overflow-hidden mr-1.5">
                  {assignedUserImage ? (
                    <img src={assignedUserImage} alt={assignedTo.name} className="h-full w-full object-cover" />
                  ) : (
                    <img src={getRandomProfileImage(assignedTo.id)} alt={assignedTo.name} className="h-full w-full object-cover" />
                  )}
                </div>
                Assigned
              </div>
            )}
          </div>

          {/* Message */}
          <p className="text-sm text-gray-800 my-1 line-clamp-1">
            {description}
          </p>

          {/* Tags row */}
          <div className="flex items-center text-xs mt-2">
            {foundTime && (
              <span className="flex items-center text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Found {foundTime}
              </span>
            )}
            
            {isRecepNet && (
              <span className="flex items-center text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 mr-2">
                ReceptoNet
              </span>
            )}
            {timePosted && (
              <span className="flex items-center text-gray-500 rounded-full bg-gray-100 px-2 py-0.5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-sm">{timePosted}</span>
              </span>
            )}


            {group && (
              <span className="flex items-center text-green-600 bg-gray-100 rounded-full px-2 py-0.5 mr-2">
               
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path></svg>
                <span className="font-semibold text-sm">{group}</span>
              </span>
            )}

            
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center ml-4 space-x-2">
          {isLocked ? (
            <button 
              onClick={handleUnlock}
              className="bg-blue-600 text-white rounded-md px-3 py-1 flex items-center text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
              Unlock
              <span className="ml-1 text-yellow-300">
                {unlockCost}
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              {assignedTo ? (
                <button className="border border-amber-500 text-amber-600 rounded-full px-5 py-1 text-sm hover:bg-amber-50 w-30 text-center">
                  View Details
                </button>
              ) : (
                <>
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowAssignDropdown(!showAssignDropdown);
                        setSearchQuery('');
                      }}
                      className="border border-amber-500 text-amber-600 rounded-full px-5 py-1 text-sm hover:bg-amber-50 w-24 text-center"
                    >
                      Assign
                    </button>
                    {showAssignDropdown && (
                      <div 
                        ref={searchRef}
                        className="absolute left-0 top-full mt-1 w-64 bg-white border rounded-md shadow-lg z-50"
                      >
                        <div className="p-2 relative">
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                            autoFocus
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                          {searchQuery && (
                            <button 
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setSearchQuery('')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, idx) => (
                              <button
                                key={idx}
                                className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 text-left"
                                onClick={() => handleAssign(user.id)}
                              >
                                <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs mr-2 overflow-hidden">
                                  {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <img src={cachedOrgUserImages[user.id]} alt={user.name} className="h-full w-full object-cover" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span>{user.name}</span>
                                  {user.role && <span className="text-xs text-gray-500">{user.role}</span>}
                                </div>
                                {user.selected && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No matching users found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="border border-amber-500 text-amber-600 rounded-full px-5 py-1 text-sm hover:bg-amber-50 w-30 text-center">
                    View Details
                  </button>
                </>
              )}
            </div>
          )}

          <div className={`h-7 w-7 rounded-md flex items-center justify-center text-white text-sm font-medium ${parseInt(score) >= 90 ? 'bg-green-500' : 'bg-blue-600'}`}>
            {score}
          </div>

          <button 
            className={`text-gray-400 hover:text-blue-500 ${likedBy?.length ? 'text-blue-500' : ''}`}
            onClick={handleLike}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={likedBy?.length ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>
          <button 
            className={`text-gray-400 hover:text-red-500 ${dislikedBy?.length ? 'text-red-500' : ''}`}
            onClick={handleDislike}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={dislikedBy?.length ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;