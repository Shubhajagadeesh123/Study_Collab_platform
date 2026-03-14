import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });

  if (!isOpen) return null;

  const handleAuth = async () => {
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isRegister) {
          setIsRegister(false);
          alert("Registration successful! Please login.");
        } else {
          localStorage.setItem('token', data.token);
          onAuthSuccess(data.username || "Student"); 
        }
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-[48px] p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-slate-200 animate-in zoom-in-95 duration-300">
        
        {/* TOP ACCENT LINE */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-indigo-600 rounded-b-full"></div>

        <button onClick={onClose} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600 transition-colors font-black uppercase text-xs tracking-widest">
          Close_Esc
        </button>

        <div className="mb-10">
          <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.4em] mb-4">Security Protocol</p>
          <h2 className="text-5xl font-[1000] tracking-tighter text-slate-900 leading-none uppercase italic">
            {isRegister ? "Join_Sync" : "Welcome_Back"}
          </h2>
        </div>

        <div className="space-y-5">
          {isRegister && (
            <input 
              type="text" 
              placeholder="USERNAME_ID" 
              className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-indigo-400 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm font-bold tracking-widest transition-all"
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          )}
          <input 
            type="email" 
            placeholder="EMAIL_ACCESS" 
            className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-indigo-400 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm font-bold tracking-widest transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="SECURE_PASS" 
            className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-indigo-400 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm font-bold tracking-widest transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          
          <button 
            onClick={handleAuth} 
            className="w-full py-6 bg-indigo-600 text-white rounded-[28px] text-xs font-[1000] uppercase tracking-[0.3em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all mt-6"
          >
            {isRegister ? "Create Account" : "Authorize Session"}
          </button>
        </div>

        <p className="mt-10 text-center text-xs font-black uppercase tracking-widest text-slate-400">
          {isRegister ? "Existing User?" : "New Arrival?"} 
          <button onClick={() => setIsRegister(!isRegister)} className="ml-3 text-indigo-600 hover:underline underline-offset-4">
            {isRegister ? "Log_In" : "Register_Now"}
          </button>
        </p>

        {/* BOTTOM DECORATIVE LINE */}
        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      </div>
    </div>
  );
};

export default AuthModal;