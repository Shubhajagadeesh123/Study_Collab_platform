import React, { useState, useRef } from 'react';

const ChatRoom = ({ group, onLeave }) => {
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  
  // Real-time state
  const [activeMembers, setActiveMembers] = useState(group.participants || [
    { id: 'admin-1', name: "Admin_Lead", role: "Group admin", status: "System Active", avatar: "https://i.pravatar.cc/150?u=admin" }
  ]);
  const [sharedMedia, setSharedMedia] = useState([]); // Tracks images & docs separately
  const [messages, setMessages] = useState([
    { id: 1, text: `NODE_UPLINK: ${group.name.toUpperCase()}`, type: 'system' }
  ]);

  const fileInputRef = useRef(null);
  //const menuRef = useRef(null);

  const addNewMember = () => {
    const name = prompt("Enter Username:");
    if (name) {
      const newMember = {
        id: Date.now(),
        name: name.trim(),
        role: "Member",
        status: "Online",
        avatar: `https://i.pravatar.cc/150?u=${name}`
      };
      setActiveMembers([...activeMembers, newMember]);
      setMessages([...messages, { id: Date.now(), text: `${name} has joined the node.`, type: 'system' }]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = {
      id: Date.now(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type.startsWith('image/') ? 'img' : 'doc',
      url: URL.createObjectURL(file),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSharedMedia([fileData, ...sharedMedia]);
    setMessages([...messages, { 
      id: Date.now(), 
      text: `SENT_PAYLOAD: ${file.name}`, 
      sender: 'You', 
      time: fileData.time,
      isFile: true 
    }]);
    setShowUploadMenu(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sender: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0b0b0d] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* --- MAIN CHAT ENGINE --- */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        <header className={`h-24 px-8 flex items-center justify-between border-b ${isDarkMode ? 'border-white/5 bg-[#121214]' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowSidebar(true)}>
            <img src={group.img} className="w-12 h-12 rounded-full object-cover" alt="" />
            <div>
              <h3 className="text-xl font-bold leading-none">{group.name}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">{activeMembers.length} ACTIVE_NODES</p>
            </div>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 bg-white/5 rounded-xl">{isDarkMode ? '🌙' : '☀️'}</button>
        </header>

        <div className={`flex-1 overflow-y-auto p-10 space-y-6 ${isDarkMode ? 'bg-[#0b0b0d]' : 'bg-[#f1f5f9]'}`}>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl px-6 py-4 rounded-3xl ${
                m.type === 'system' ? 'mx-auto opacity-30 text-[9px] font-black tracking-[0.4em] uppercase' :
                (m.sender === 'You' ? 'bg-indigo-600 text-white rounded-br-none shadow-xl' : (isDarkMode ? 'bg-[#1e1e22]' : 'bg-white border text-slate-800 rounded-bl-none'))
              }`}>
                <p className="text-lg font-medium">{m.text}</p>
                {m.time && <p className="text-[8px] mt-2 opacity-40 text-right font-black uppercase">{m.time}</p>}
              </div>
            </div>
          ))}
        </div>

        <footer className={`p-8 relative ${isDarkMode ? 'bg-[#121214]' : 'bg-white'} border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
          {showUploadMenu && (
            <div className={`absolute bottom-28 left-8 p-6 rounded-[32px] shadow-2xl grid grid-cols-3 gap-6 animate-in slide-in-from-bottom-5 ${isDarkMode ? 'bg-[#1e1e22]' : 'bg-white border'}`}>
              {['Gallery', 'Docs', 'Camera'].map((item) => (
                <button key={item} onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-2 group">
                  <div className="bg-indigo-600 w-14 h-14 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📁</div>
                  <span className="text-[10px] font-black uppercase opacity-60">{item}</span>
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="max-w-5xl mx-auto flex items-center gap-4">
            <button type="button" onClick={() => setShowUploadMenu(!showUploadMenu)} className={`p-2 transition-all ${showUploadMenu ? 'rotate-45 text-indigo-500' : 'opacity-40 hover:opacity-100'}`}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <input className="flex-1 bg-transparent px-4 text-xl font-bold outline-none" placeholder="Transmit_Message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button type="submit" className="bg-indigo-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">Send</button>
          </form>
        </footer>
      </div>

      {/* --- SIDEBAR: ASSET & NODE MANAGER --- */}
      <div className={`w-[480px] flex flex-col border-l transition-all ${isDarkMode ? 'bg-[#121214] border-white/5' : 'bg-white border-slate-200'} ${showSidebar ? 'block' : 'hidden'}`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <span className="font-black text-xl uppercase italic tracking-tighter opacity-50">Hub_Intelligence</span>
          <button onClick={() => setShowSidebar(false)} className="opacity-40 hover:opacity-100">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Identity Section */}
          <div className="flex flex-col items-center p-12 border-b border-white/5">
            <img src={group.img} className="w-44 h-44 rounded-[40px] object-cover shadow-2xl mb-8 ring-4 ring-indigo-500/10" alt="" />
            <h2 className="text-3xl font-[1000] italic uppercase leading-none">{group.name}</h2>
            
            <div className="flex gap-4 mt-10 w-full">
              <button onClick={addNewMember} className="flex-1 py-5 bg-white/5 hover:bg-emerald-500/10 rounded-[28px] transition-all border border-white/5 flex flex-col items-center gap-2">
                <span className="text-emerald-500 text-xl font-bold">👤+</span>
                <span className="text-[9px] font-black uppercase tracking-widest">Add_Member</span>
              </button>
              <button onClick={() => setIsSearching(!isSearching)} className={`flex-1 py-5 rounded-[28px] transition-all border border-white/5 flex flex-col items-center gap-2 ${isSearching ? 'bg-indigo-600' : 'bg-white/5'}`}>
                <span className="text-xl">🔍</span>
                <span className="text-[9px] font-black uppercase tracking-widest">Search</span>
              </button>
            </div>
          </div>

          {/* ASSET VAULT (Media & Docs) */}
          <div className="p-8 border-b border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500">Asset_Vault</h5>
              <span className="text-[10px] font-bold opacity-30 italic">{sharedMedia.length} ITEMS</span>
            </div>
            
            {/* Horizontal Media Grid (Images) */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {sharedMedia.filter(m => m.type === 'img').length === 0 ? (
                [1,2,3,4].map(i => <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-dashed border-white/10" />)
              ) : (
                sharedMedia.filter(m => m.type === 'img').map(img => (
                  <a key={img.id} href={img.url} download className="aspect-square rounded-2xl overflow-hidden border border-white/10 group relative">
                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-black uppercase">Save</div>
                  </a>
                ))
              )}
            </div>

            {/* DOCUMENT LIST (The "Doc thing" you requested) */}
            <div className="space-y-3">
              {sharedMedia.filter(m => m.type === 'doc').map(doc => (
                <a key={doc.id} href={doc.url} download className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-10 h-10 bg-indigo-600/10 text-indigo-500 rounded-xl flex items-center justify-center text-lg">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate">{doc.name}</p>
                    <p className="text-[9px] font-bold opacity-30 uppercase tracking-tighter mt-1">{doc.size} • {doc.time}</p>
                  </div>
                  <div className="opacity-30 group-hover:opacity-100 text-xs">↓</div>
                </a>
              ))}
              {sharedMedia.filter(m => m.type === 'doc').length === 0 && (
                <p className="text-[10px] text-center italic opacity-30 py-4 uppercase tracking-widest">No Documents Transmitted</p>
              )}
            </div>
          </div>

          {/* REAL-TIME PARTICIPANTS */}
          <div className="p-8">
            {isSearching && (
              <input 
                autoFocus className="w-full mb-8 bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-indigo-500"
                placeholder="Filter members..." onChange={(e) => setMemberSearch(e.target.value)}
              />
            )}
            <div className="space-y-8">
              {activeMembers.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase())).map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <img src={m.avatar} className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/10" alt="" />
                    <div>
                      <p className="font-black text-xl leading-none mb-1">{m.name}</p>
                      <p className="text-xs opacity-40 font-bold italic">{m.status}</p>
                    </div>
                  </div>
                  {m.role === 'Group admin' && (
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 uppercase">Admin</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;