import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Groups from './pages/Groups';
import UserProfile from './pages/UserProfile';
import AuthModal from './components/AuthModal';

function App() {
  // 1. PERSISTENCE LOGIC
  // Load view, user object, and login status from localStorage
  const [view, setView] = useState(() => {
    return localStorage.getItem('study_sync_view') || 'home';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('study_sync_user_obj');
    return savedUser ? JSON.parse(savedUser) : { 
      username: "Guest", 
      avatar: "https://i.pravatar.cc/150?u=guest",
      status: "Offline Node"
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('study_sync_logged_in') === 'true';
  });

  const [showAuth, setShowAuth] = useState(false);

  // 2. SYNC TO LOCALSTORAGE
  // Automatically saves state whenever view, user, or login status changes
  useEffect(() => {
    localStorage.setItem('study_sync_view', view);
    if (user) {
      localStorage.setItem('study_sync_user_obj', JSON.stringify(user));
    }
    localStorage.setItem('study_sync_logged_in', isLoggedIn);
  }, [view, user, isLoggedIn]);

  // 3. HANDLERS
  const handleAuthSuccess = (name) => {
    const newUser = { 
      username: name, 
      avatar: `https://i.pravatar.cc/150?u=${name}`,
      status: "Active Node" 
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

  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    setUser({ 
      username: "Guest", 
      avatar: "https://i.pravatar.cc/150?u=guest",
      status: "Offline Node"
    });
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
          />
        );
      
      case 'explore':
        return <Groups onBack={handleBackToHome} />;
      
      case 'home':
      default:
        return (
          <Home 
            onOpenAuth={() => setShowAuth(true)} 
            onExplore={handleExplore} 
            onOpenProfile={handleOpenProfile}
            isLoggedIn={isLoggedIn} 
            user={user?.username || 'Guest'} 
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