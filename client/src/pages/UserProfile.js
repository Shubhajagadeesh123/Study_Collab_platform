import React, { useState, useRef } from 'react';

const UserProfile = ({ user, onBack, onLogout, onUpdateStatus, onUpdateAvatar }) => {
  const [activeTab, setActiveTab] = useState('groups');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(user.status || "");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'groups', label: 'Joined Groups', icon: '👥' },
    { id: 'files', label: 'File Vault', icon: '📁' },
    { id: 'history', label: 'Recent Activity', icon: '⏳' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans">
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={onBack} className="font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2">
          <span className="text-xl">←</span> Back to Home
        </button>
        <button onClick={onLogout} className="px-5 py-2 bg-rose-50 text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-100 transition-all">
          Sign Out
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-10 items-center mb-12">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="w-36 h-36 rounded-full bg-white border-4 border-white shadow-2xl overflow-hidden ring-4 ring-indigo-50">
              <img src={user.avatar} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Photo</span>
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">
              {user?.username || "User_Node"} {/* FIXED: Strictly using user.username */}
            </h1>
            
            {isEditingStatus ? (
              <form onSubmit={(e) => { e.preventDefault(); onUpdateStatus(tempStatus); setIsEditingStatus(false); }}>
                <input 
                  autoFocus
                  className="bg-white border-2 border-indigo-500 px-4 py-2 rounded-xl text-sm font-bold w-full max-w-sm outline-none"
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  onBlur={() => setIsEditingStatus(false)}
                />
              </form>
            ) : (
              <p onClick={() => setIsEditingStatus(true)} className="text-lg text-slate-500 hover:text-indigo-600 cursor-pointer italic font-medium">
                {user.status || "Click to set a status..."} <span className="text-xs opacity-30 ml-2">✎</span>
              </p>
            )}
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-[24px] border border-slate-200 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined</p>
            <p className="text-2xl font-black text-indigo-600">12 Groups</p>
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-200 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saved</p>
            <p className="text-2xl font-black text-indigo-600">45 Files</p>
          </div>
          <div className="bg-white p-5 rounded-[24px] border border-slate-200 text-center shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Downloads</p>
            <p className="text-2xl font-black text-indigo-600">89 Items</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm min-h-[350px]">
          {activeTab === 'groups' && (
            <div className="space-y-4">
              {['Engineering Main', 'Project Collaboration', 'Design Sync'].map((group) => (
                <div key={group} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600">{group[0]}</div>
                    <p className="font-bold text-slate-700">{group}</p>
                  </div>
                  <button className="text-xs font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">View Group</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-3">
              {[
                { name: 'Semester_Project.zip', size: '12.4 MB', type: 'Downloaded' },
                { name: 'Notes_Unit_3.pdf', size: '1.1 MB', type: 'Saved' },
                { name: 'Wireframes_v2.fig', size: '5.8 MB', type: 'Saved' }
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{file.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{file.size} • {file.type}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-indigo-100 transition-all">↓</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {[
                { time: 'Just now', event: 'Profile sync complete' },
                { time: '1h ago', event: 'Updated status message' },
                { time: 'Yesterday', event: 'Downloaded Semester_Project.zip' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div>
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{item.time}</p>
                    <p className="text-sm font-bold text-slate-600 italic">"{item.event}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;