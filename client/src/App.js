import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Groups from './pages/Groups';
import UserProfile from './pages/UserProfile';
import AuthModal from './components/AuthModal';
import ChatRoom from './pages/ChatRoom';

function App() {
  // 1. PERSISTENCE LOGIC
  const [view, setView] = useState(() => {
    return localStorage.getItem('study_sync_view') || 'home';
  });

  // New state to remember which group was active
  const [selectedGroup, setSelectedGroup] = useState(() => {
    const savedGroup = localStorage.getItem('activeChatGroup');
    return (savedGroup && savedGroup !== "undefined") ? JSON.parse(savedGroup) : null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('study_sync_user_obj');
    return savedUser ? JSON.parse(savedUser) : { 
      username: "Guest", 
      avatar: "https://i.pravatar.cc/150?u=guest",
      status: "Set a status...",
      isDefaultAvatar: true,
      stats: { groups: 0, saved: 0, downloads: 0 },
      activities: []
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('study_sync_logged_in') === 'true';
  });

  const [showAuth, setShowAuth] = useState(false);

  // 2. SYNC TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('study_sync_view', view);
    if (user) {
      localStorage.setItem('study_sync_user_obj', JSON.stringify(user));
    }
    localStorage.setItem('study_sync_logged_in', isLoggedIn);
    
    // Save selected group whenever it changes
    if (selectedGroup) {
      localStorage.setItem('activeChatGroup', JSON.stringify(selectedGroup));
    } else {
      localStorage.removeItem('activeChatGroup');
    }
  }, [view, user, isLoggedIn, selectedGroup]);

  // 3. HANDLERS
  const handleAuthSuccess = (name) => {
    const newUser = { 
      username: name, 
      avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
      status: "Focus Mode: Active",
      isDefaultAvatar: true,
      stats: { groups: 8, saved: 24, downloads: 12 },
      activities: [
        { time: 'Just now', event: `Session initialized as ${name}` },
        { time: '2 mins ago', event: 'Security protocol verified' }
      ]
    };
    setUser(newUser);
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleUpdateStatus = (newStatus) => {
    setUser(prevUser => ({
      ...prevUser,
      status: newStatus
    }));
  };

  const handleUpdateAvatar = (imageData) => {
    setUser(prevUser => ({
      ...prevUser,
      avatar: imageData,
      isDefaultAvatar: false 
    }));
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    setUser({ 
      username: "Guest", 
      avatar: "https://i.pravatar.cc/150?u=guest",
      status: "Offline",
      isDefaultAvatar: true,
      stats: { groups: 0, saved: 0, downloads: 0 },
      activities: []
    });
    setSelectedGroup(null);
    setView('home');
  };

  const handleExplore = () => {
    if (isLoggedIn) {
      setView('explore');
    } else {
      setShowAuth(true);
    }
  };

  const handleOpenProfile = () => {
    if (isLoggedIn) {
      setView('profile');
    } else {
      setShowAuth(true);
    }
  };

  const handleBackToHome = () => {
    setView('home');
  };

  // Handler to enter a specific chat
  const handleEnterChat = (group) => {
    setSelectedGroup(group);
    setView('chat');
  };

  // 4. RENDER ENGINE
  const renderView = () => {
    switch (view) {
      case 'profile':
        return (
          <UserProfile
            user={user} 
            onBack={handleBackToHome} 
            onLogout={handleLogout} 
            onUpdateStatus={handleUpdateStatus}
            onUpdateAvatar={handleUpdateAvatar}
          />
        );
      
      case 'explore':
        // Pass the enter chat handler to the Groups page
        return <Groups onBack={handleBackToHome} onEnterChat={handleEnterChat} />;
      
      case 'chat':
        // Render ChatRoom if we have a group selected
        if (selectedGroup) {
          return (
            <ChatRoom 
              group={selectedGroup} 
              user={user} 
              onLeave={() => {
                setSelectedGroup(null);
                setView('explore');
              }} 
            />
          );
        }
        return <Groups onBack={handleBackToHome} onEnterChat={handleEnterChat} />;

      case 'home':
      default:
        return (
          <Home 
            onOpenAuth={() => setShowAuth(true)} 
            onExplore={handleExplore} 
            onOpenProfile={handleOpenProfile}
            isLoggedIn={isLoggedIn} 
            user={user} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] transition-colors duration-500">
      {renderView()}

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
}

export default App;