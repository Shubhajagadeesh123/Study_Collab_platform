import React, { useState } from 'react';

const UserProfile = ({ user, onBack, onLogout, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState('groups');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(user.status || "Active Node");

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(tempStatus);
    setIsEditingStatus(false);
  };

  const categories = [
    { id: 'groups', label: 'Joined Nodes', icon: '🌐' },
    { id: 'saved', label: 'Vault', icon: '🔒' },
    { id: 'activity', label: 'Pulse', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans selection:bg-indigo-100">
      
      {/* --- TOP NAV --- */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center gap-2 group text-slate-500 hover:text-indigo-600 transition-colors">
          <span className="text-xl font-black group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-[11px] font-black uppercase tracking-widest">Return to Sync</span>
        </button>
        
        <button 
          onClick={onLogout}
          className="px-6 py-2 border border-rose-200 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
        >
          Terminate Session
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-16">
        
        {/* --- HERO SECTION: REAL-TIME IDENTITY --- */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
          <div className="relative">
            <div className="w-44 h-44 rounded-[48px] bg-white p-2 shadow-2xl shadow-indigo-200/50 overflow-hidden border border-slate-100 relative z-10">
              <img src={user.avatar} className="w-full h-full object-cover rounded-[40px]" alt="User" />
            </div>
            {/* Real-time Pulse Animation */}
            <div className="absolute inset-0 w-44 h-44 bg-indigo-500/20 rounded-[48px] animate-ping opacity-20"></div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-3">
              <h1 className="text-6xl font-[1000] tracking-tighter text-slate-900 uppercase italic">
                {user.username}
              </h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 border border-emerald-200">
                Online
              </span>
            </div>
            
            {/* REAL-TIME STATUS TERMINAL */}
            <div className="mb-8">
              {isEditingStatus ? (
                <form onSubmit={handleStatusSubmit} className="flex items-center gap-2">
                  <input 
                    autoFocus
                    className="bg-white border-2 border-indigo-500 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 outline-none w-full max-w-sm shadow-lg"
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value)}
                    onBlur={() => setIsEditingStatus(false)}
                  />
                </form>
              ) : (
                <div 
                  onClick={() => setIsEditingStatus(true)}
                  className="group flex items-center gap-3 cursor-pointer"
                >
                  <p className="text-lg font-medium text-slate-500 italic hover:text-indigo-600 transition-colors">
                    "{user.status || "Set a status..."}"
                  </p>
                  <span className="opacity-0 group-hover:opacity-100 text-indigo-400 text-xs font-black">EDIT</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8 opacity-60">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Node_ID</p>
                <p className="text-sm font-bold text-slate-700">#SYNC_{user.username.toUpperCase().slice(0,3)}_2026</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Uplink_Stability</p>
                <p className="text-sm font-bold text-emerald-600">99.9%</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SYSTEM STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Encryption', val: 'AES-256-GCM', sub: 'E2E Active' },
            { label: 'Cloud Cache', val: '128 MB', sub: 'Synced' },
            { label: 'Node Region', val: 'ASIA-SOUTH', sub: 'Verified' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 italic">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* --- DASHBOARD NAVIGATION --- */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-3 px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === cat.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 translate-y-[-2px]' : 'bg-white text-slate-400 border border-slate-100 hover:text-slate-700'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <div className="bg-white p-12 rounded-[56px] border border-slate-200 shadow-sm min-h-[400px]">
          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Hackathon Alpha', 'Medical Sci 24', 'Design Hub', 'AI Ethics'].map((node) => (
                <div key={node} className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] flex justify-between items-center group cursor-pointer hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600">{node.charAt(0)}</div>
                    <div>
                      <h4 className="font-black text-xl tracking-tighter text-slate-800 uppercase italic">{node}</h4>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">● Live Now</p>
                    </div>
                  </div>
                  <span className="p-3 bg-white rounded-xl text-indigo-600 font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">→</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="flex flex-col items-center justify-center py-24 opacity-20">
              <div className="w-24 h-24 border-4 border-dashed border-slate-900 rounded-full flex items-center justify-center text-4xl mb-6 font-black">!</div>
              <p className="text-[12px] font-black uppercase tracking-[0.5em]">No Secure Payloads Archived</p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-10">
              {[
                { time: '14:20', text: 'Secured new uplink with "Hackathon Alpha" node' },
                { time: '11:05', text: 'Encrypted and stored "Project_v1.zip"' },
                { time: 'Yesterday', text: 'Node authentication parameters refreshed' }
              ].map((log, i) => (
                <div key={i} className="flex gap-8 items-start relative">
                  {i !== 2 && <div className="absolute left-[11px] top-8 w-[2px] h-12 bg-slate-100"></div>}
                  <div className="w-6 h-6 rounded-full border-4 border-indigo-500 bg-white z-10"></div>
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{log.time}</span>
                    <p className="text-lg font-bold text-slate-700 italic mt-1 leading-tight">{log.text}</p>
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