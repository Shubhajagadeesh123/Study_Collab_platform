import React, { useState, useEffect } from 'react';
import CreateGroupModal from '../components/CreateGroupModal';
import ChatRoom from './ChatRoom';

const Groups = ({ onBack }) => {
  const [activeGroup, setActiveGroup] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // 1. Initialize State
  const [allGroups, setAllGroups] = useState(() => {
    const saved = localStorage.getItem('study_sync_groups');
    return (saved && saved !== "[]") ? JSON.parse(saved) : [];
  });

  // 2. Keep storage in sync (HOOK IS NOW ALWAYS CALLED)
  useEffect(() => {
    localStorage.setItem('study_sync_groups', JSON.stringify(allGroups));
  }, [allGroups]);

  // 3. Logic Functions
  const clearAllData = () => {
    if (window.confirm("Clear all nodes?")) {
      localStorage.removeItem('study_sync_groups');
      setAllGroups([]);
    }
  };

  const handleCreate = (name, img) => {
    const newGroup = {
      id: Date.now(),
      name,
      category: "Node",
      members: Math.floor(Math.random() * 10) + 1,
      status: "Live",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      img: img || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
    };
    setAllGroups([newGroup, ...allGroups]);
    setShowModal(false);
  };

  const deleteNode = (id) => {
    setAllGroups(allGroups.filter(g => g.id !== id));
  };

  // 4. THE FIX: Conditional Return moved AFTER all Hooks
  if (activeGroup) {
    return <ChatRoom group={activeGroup} onLeave={() => setActiveGroup(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] p-8 md:p-20 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
          <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2">← BACK</button>
          <h2 className="text-6xl font-[1000] tracking-tighter uppercase italic text-slate-900">Explore_Nodes</h2>
          {allGroups.length > 0 && (
            <button onClick={clearAllData} className="mt-4 text-[9px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">
              Reset_All_Stored_Data
            </button>
          )}
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="FILTER..."
            className="flex-1 md:w-64 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-400"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100">+ Create_Node</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-4">
        {allGroups.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Nodes Active. Initialize a new one.</p>
          </div>
        ) : (
          allGroups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).map((group) => (
            <div key={group.id} className="flex flex-col md:flex-row items-center justify-between bg-white border border-slate-100 p-6 rounded-[32px] hover:shadow-xl transition-all">
               <div className="flex items-center gap-6">
                <img src={group.img} className="w-20 h-20 rounded-2xl object-cover" alt="Node" />
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-600">{group.category}</span>
                  <h3 className="text-2xl font-black text-slate-800 uppercase leading-none">{group.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <p className="text-lg font-bold text-slate-700">{group.members} Online</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveGroup(group)}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors"
                  >
                    Join
                  </button>
                  <button 
                    onClick={() => deleteNode(group.id)}
                    className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateGroupModal isOpen={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />
    </div>
  );
};

export default Groups;