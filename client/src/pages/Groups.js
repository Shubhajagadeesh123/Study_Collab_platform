import React, { useState, useEffect } from 'react';
import CreateGroupModal from '../components/CreateGroupModal';
import ChatRoom from './ChatRoom';

const Groups = ({ onBack }) => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Groups from Backend API (So everyone sees every group)
  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups');
      const data = await response.json();
      setAllGroups(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load groups:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 2. Logic to create group on the server
  const handleCreate = async (name, category, img) => {
    const groupData = {
      name,
      subject: category || "General Study",
      members: [ "Creator" ], // Initial member
      img: img || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
    };

    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      });
      
      if (response.ok) {
        fetchGroups(); // Refresh the list
        setShowModal(false);
      }
    } catch (err) {
      alert("Error creating group");
    }
  };

  if (activeGroup) {
    return <ChatRoom group={activeGroup} onLeave={() => setActiveGroup(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <button onClick={onBack} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2 mb-4">
            ← Back to Dashboard
          </button>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Study Groups
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Join a room and start collaborating with others.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search groups..."
              className="w-full md:w-72 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            + Create New Group
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : allGroups.length === 0 ? (
          <div className="py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-slate-500 font-bold text-lg">No study groups found.</p>
            <p className="text-slate-400 text-sm mb-6">Be the first to create a community for your subject!</p>
            <button onClick={() => setShowModal(true)} className="text-indigo-600 font-bold underline">Create a group now</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGroups
              .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((group) => (
              <div key={group._id} className="group bg-white border border-slate-200 p-5 rounded-[32px] hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300">
                <div className="relative h-40 w-full mb-5 overflow-hidden rounded-[24px]">
                  <img src={group.img || 'https://via.placeholder.com/400x200'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Group" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-600 shadow-sm">
                    {group.subject || "Study Room"}
                  </div>
                </div>

                <div className="px-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">{group.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-slate-600">{group.members?.length || 1} members</p>
                    </div>
                    <button 
                      onClick={() => setActiveGroup(group)}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors shadow-md"
                    >
                      Join Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onCreate={handleCreate} 
      />
    </div>
  );
};

export default Groups;