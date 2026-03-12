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
          localStorage.setItem('token', data.token); // Store session
          onAuthSuccess(data.username);
        }
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition">✕</button>
        <h2 className="text-4xl font-black mb-2 tracking-tighter">{isRegister ? "Join StudySync" : "Welcome Back"}</h2>
        <div className="space-y-4 mt-8">
          {isRegister && (
            <input type="text" placeholder="Username" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
              onChange={(e) => setFormData({...formData, username: e.target.value})} />
          )}
          <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button onClick={handleAuth} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl transition-all">
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          {isRegister ? "Already have an account?" : "New here?"} 
          <button onClick={() => setIsRegister(!isRegister)} className="ml-2 text-indigo-600 font-bold">{isRegister ? "Log In" : "Register Now"}</button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;