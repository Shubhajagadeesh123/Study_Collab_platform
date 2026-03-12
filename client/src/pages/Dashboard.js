import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard = ({ onLogout }) => {
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const fileInputRef = useRef(null); // Reference for the hidden file input
  
  // Initialize with your demo data, but we'll prepare it for real uploads
  const [resources, setResources] = useState([
    { id: 1, title: "Calculus Notes.pdf", type: "PDF" },
    { id: 2, title: "Algorithm_Visualizer.mp4", type: "Video" }
  ]);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off('receive-message');
  }, []);

  // --- FILE UPLOAD LOGIC ---
  const handleFileClick = () => {
    fileInputRef.current.click(); // Trigger the hidden input
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // For now, we update the UI instantly (Aesthetic "Ease of Access")
    const newResource = {
      id: Date.now(),
      title: file.name,
      type: file.type.includes('pdf') ? 'PDF' : 'Video'
    };
    
    setResources(prev => [newResource, ...prev]);

    // --- BACKEND INTEGRATION START ---
    // const formData = new FormData();
    // formData.append('file', file);
    // await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
    // --- BACKEND INTEGRATION END ---
    
    alert(`${file.name} uploaded successfully to your repository!`);
  };

  const joinGroup = () => {
    if (groupId) {
      socket.emit('join-group', groupId);
      alert(`Joined room: ${groupId}`);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const data = { groupId, text: message, sender: "You" };
      socket.emit('send-message', data);
      setChat((prev) => [...prev, data]);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 animate-in fade-in duration-500">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="text-xl font-black text-indigo-600 mb-8 tracking-tighter">STUDYSYNC.</div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm">Dashboard</button>
          <button className="w-full text-left px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-50 text-sm font-medium">Study Groups</button>
          <button className="w-full text-left px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-50 text-sm font-medium">Materials</button>
        </nav>
        
        {/* RESOURCE REPOSITORY SECTION */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Library</h3>
            <button 
              onClick={handleFileClick}
              className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-lg font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
            >
              +
            </button>
            {/* Hidden Input File */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.mp4,.doc,.docx"
            />
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
            {resources.map(res => (
              <div key={res.id} className="px-4 py-2.5 text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer rounded-xl flex items-center transition-all group">
                <span className="mr-3 opacity-70 group-hover:opacity-100 transition-opacity">
                  {res.type === 'PDF' ? '📄' : '🎥'}
                </span>
                <span className="truncate font-medium">{res.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-xl shadow-indigo-200">
          <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Premium Plan</p>
          <p className="text-xs font-medium mb-3">Get 10GB cloud storage</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all">Upgrade</button>
        </div>
      </div>

      {/* MAIN CHAT INTERFACE */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input 
              className="bg-gray-50 border-none rounded-2xl px-5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-inner"
              placeholder="Enter Group ID (e.g. CS101)" 
              onChange={(e) => setGroupId(e.target.value)}
            />
            <button onClick={joinGroup} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100">
              Join Room
            </button>
          </div>
          <button onClick={onLogout} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all">Logout</button>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight tracking-tighter">Virtual Study Room</h2>
              <p className="text-sm text-gray-400 font-medium italic">Active: <span className="text-indigo-600 font-bold">{groupId || 'Lobby'}</span></p>
            </div>
            <div className="flex space-x-3">
              <button className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 text-xl">🎥</button>
              <button className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 text-xl">🎤</button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col mb-4 overflow-hidden">
            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md px-5 py-3 rounded-2xl shadow-sm ${msg.sender === "You" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">{msg.sender}</p>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50/50 backdrop-blur-sm flex items-center space-x-4">
              <input 
                className="flex-1 bg-white rounded-2xl px-6 py-4 text-sm border-none focus:ring-2 focus:ring-indigo-500 shadow-sm outline-none"
                placeholder="Message your group..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-indigo-600 p-4 rounded-2xl text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-90">
                <svg className="w-5 h-5 fill-current rotate-90" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;