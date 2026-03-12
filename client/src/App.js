import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './output.css';

const socket = io('http://localhost:5000');

function App() {
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

  const joinGroup = () => {
    if (groupId) {
      socket.emit('join-group', groupId);
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
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar - Institutional Branding Space */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-brand mb-8">StudySync</h1>
        <nav className="flex-1 space-y-4">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-indigo-50 text-brand font-medium">Dashboard</button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Study Groups</button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Materials</button>
        </nav>
        {/* Ad Space Placeholder for Revenue Model [cite: 51] */}
        <div className="mt-auto p-4 bg-gray-100 rounded-xl text-xs text-center text-gray-400 border border-dashed border-gray-300">
          Partner Ad Space
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input 
              className="border border-gray-300 rounded-full px-4 py-1.5 text-sm focus:ring-2 focus:ring-brand outline-none"
              placeholder="Enter Group ID..." 
              onChange={(e) => setGroupId(e.target.value)}
            />
            <button onClick={joinGroup} className="bg-brand text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
              Join Session
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">JD</span>
            <span className="text-sm font-medium text-gray-700">Jane Doe</span>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Virtual Study Room: {groupId || 'General'}</h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 shadow-sm">🎥</button>
              <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 shadow-sm">🎤</button>
            </div>
          </div>

          {/* Chat/Interaction Window  */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col mb-4 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender === "You" ? "bg-brand text-white" : "bg-white border border-gray-200"}`}>
                    <p className="font-bold text-[10px] uppercase mb-1">{msg.sender}</p>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex items-center space-x-4">
              <input 
                className="flex-1 bg-gray-100 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Share a doubt or a PDF link..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-brand p-3 rounded-full text-white hover:scale-105 transition">
                ➔
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;