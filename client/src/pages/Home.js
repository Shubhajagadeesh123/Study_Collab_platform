import React from 'react';

const Home = ({ onOpenAuth, onExplore, onOpenProfile, isLoggedIn, user }) => {
  
  const handleAction = () => {
    if (!isLoggedIn) {
      onOpenAuth(); 
    } else {
      onExplore();
    }
  };

  const categories = [
    { title: "Hackathon", icon: "🚀", color: "from-blue-400 to-indigo-500", bg: "bg-blue-50/50", border: "border-blue-100", text: "text-blue-900" },
    { title: "Engineering", icon: "⚙️", color: "from-teal-400 to-emerald-500", bg: "bg-teal-50/50", border: "border-teal-100", text: "text-teal-900" },
    { title: "Medical Sci", icon: "🧬", color: "from-rose-300 to-pink-500", bg: "bg-rose-50/50", border: "border-rose-100", text: "text-rose-900" },
    { title: "Business", icon: "📈", color: "from-amber-300 to-orange-400", bg: "bg-orange-50/50", border: "border-orange-100", text: "text-orange-900" },
    { title: "AI Labs", icon: "🤖", color: "from-violet-400 to-purple-500", bg: "bg-purple-50/50", border: "border-purple-100", text: "text-purple-900" },
    { title: "Design", icon: "🎨", color: "from-fuchsia-300 to-pink-500", bg: "bg-fuchsia-50/50", border: "border-fuchsia-100", text: "text-fuchsia-900" },
    { title: "Physics", icon: "⚛️", color: "from-sky-400 to-blue-500", bg: "bg-sky-50/50", border: "border-sky-100", text: "text-sky-900" },
    { title: "Law Hub", icon: "⚖️", color: "from-slate-400 to-gray-500", bg: "bg-slate-100/50", border: "border-slate-200", text: "text-slate-900" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans selection:bg-blue-200">
      
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black tracking-tighter">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic uppercase">STUDY</span>
          <span className="text-slate-800 uppercase tracking-tight">SYNC</span>
        </div>
        
        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            <button 
              onClick={onOpenAuth} 
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Access Portal
            </button>
          ) : (
            /* CLICKABLE USER PROFILE ICON - Updated as requested */
            <button 
              onClick={onOpenProfile}
              className="group flex items-center gap-4 p-1.5 pr-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black relative overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-lg">{user?.charAt(0) || 'U'}</span>
                )}
                {/* Visual Status Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="text-left hidden sm:block">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 leading-none mb-1">View Profile</p>
                <p className="text-sm font-bold text-slate-700 truncate max-w-[100px]">{user || 'User_Node'}</p>
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="max-w-6xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
          Network Status: Optimal
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900">
          Focus Better. <br/>
          <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-500 bg-clip-text text-transparent italic">
            Study Together.
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-slate-500 text-lg font-medium leading-relaxed mb-12">
          Escape the noise. A soft, high-performance environment designed for deep collaboration and shared intelligence.
        </p>

        <button 
          onClick={handleAction}
          className="group flex items-center gap-6 mx-auto px-10 py-5 bg-white rounded-3xl border border-slate-200 hover:border-indigo-400 transition-all shadow-xl shadow-slate-300/30 active:scale-95"
        >
          <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-700">
            {isLoggedIn ? "Enter Workspaces" : "Initialize Session"}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg shadow-indigo-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </div>
        </button>
      </header>

      {/* 3. TINTED GRID CARDS */}
      <section className="max-w-7xl mx-auto px-8 pb-40 pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              onClick={handleAction}
              className={`group relative aspect-square ${cat.bg} border ${cat.border} rounded-[48px] p-10 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:bg-white`}
            >
              <div className={`w-20 h-20 rounded-[32px] bg-gradient-to-br ${cat.color} flex items-center justify-center text-4xl mb-12 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                {cat.icon}
              </div>

              <div>
                <h3 className={`text-3xl font-[1000] tracking-tighter mb-3 ${cat.text} uppercase`}>
                  {cat.title}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Active Room</span>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                 <span className="text-xl font-black text-indigo-600">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50 rounded-t-[60px]">
        <p className="text-[11px] font-black tracking-[0.5em] uppercase text-slate-400">Zen_Protocol_v2.0 // 2026</p>
        <div className="flex gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">Nodes</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;