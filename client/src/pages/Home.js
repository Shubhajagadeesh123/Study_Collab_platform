import React from 'react';

const Home = ({ onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-hidden relative">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100 relative z-10 bg-white/80 backdrop-blur-md">
        <div className="text-2xl font-black tracking-tighter text-indigo-600">STUDYSYNC.</div>
        <button onClick={onOpenAuth} className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all">Login</button>
      </nav>
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center relative z-10">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 bg-indigo-50 rounded-full uppercase">Collaboration Redefined</span>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent">StudySync</h1>
        <p className="max-w-2xl text-lg text-gray-500 mb-10 leading-relaxed">Connect with peers, share resources, and study smarter in real-time.</p>
        <button onClick={onOpenAuth} className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all">Get Started Free</button>
      </main>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-0 w-full max-w-4xl h-96 bg-indigo-100/50 blur-[120px] rounded-full"></div>
    </div>
  );
};

export default Home;