import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Settings, Phone, Paperclip, Send, X, Star, Trash2, 
  CornerUpLeft, Download, User, Users, Pin, Copy, CheckCircle2, 
  ShieldCheck, Moon, Sun, Forward, Save, Palette, Bell, Lock, Eye, Camera, LogOut, Eraser, FileText, Image as ImageIcon, History, Calendar as CalendarIcon,
  Video, MicOff, PhoneOff, VideoOff, Mic
} from 'lucide-react';

const ChatRoom = ({ group: initialGroup, onLeave, user: initialUser }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') !== 'light');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accent') || '#238636');
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [showCallDropdown, setShowCallDropdown] = useState(false);
  const [activeCall, setActiveCall] = useState(null); 
  const [callTimer, setCallTimer] = useState(0);

  // --- FUNCTIONAL MEDIA STATE ---
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef(null);
  // ------------------------------

  const [group, setGroup] = useState(() => {
    const saved = localStorage.getItem('activeChatGroup');
    return saved ? JSON.parse(saved) : (initialGroup || { name: 'Sarees Den - Dev', _id: 'default', image: null });
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : (initialUser || { username: 'Shubha', savedActivities: [] });
  });

  const [members, setMembers] = useState([]);
  useEffect(() => {
    setMembers([{ name: user.username, role: 'Admin', status: 'online', isYou: true }]);
  }, [user.username]);

  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem(`messages_${group?._id}`)) || []);
  const [starredMessages, setStarredMessages] = useState(() => JSON.parse(localStorage.getItem(`starred_${group?._id}`)) || []);
  const [sharedMedia, setSharedMedia] = useState(() => JSON.parse(localStorage.getItem(`media_${group?._id}`)) || []);
  const [pinnedMessages, setPinnedMessages] = useState(() => JSON.parse(localStorage.getItem(`pinned_${group?._id}`)) || []);

  const [activeSidebar, setActiveSidebar] = useState(null); 
  const [message, setMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const dpInputRef = useRef(null);

  // --- CALL LOGIC & STREAM HANDLING ---
  const startCall = async (type) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      });
      setStream(mediaStream);
      setActiveCall(type);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      showToast("Permission Denied: Cannot access Camera/Mic");
      console.error(err);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setActiveCall(null);
    setCallTimer(0);
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setIsMuted(!stream.getAudioTracks()[0].enabled);
    }
  };

  const toggleVideo = () => {
    if (stream && activeCall === 'video') {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
      setIsVideoOff(!stream.getVideoTracks()[0].enabled);
    }
  };

  useEffect(() => {
    let interval;
    if (activeCall) {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('accent', accentColor);
    localStorage.setItem('activeChatGroup', JSON.stringify(group));
    if (group?._id) {
      localStorage.setItem(`messages_${group._id}`, JSON.stringify(messages));
      localStorage.setItem(`starred_${group._id}`, JSON.stringify(starredMessages));
      localStorage.setItem(`media_${group._id}`, JSON.stringify(sharedMedia));
      localStorage.setItem(`pinned_${group._id}`, JSON.stringify(pinnedMessages));
    }
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [messages, starredMessages, sharedMedia, pinnedMessages, user, group, isDarkMode, accentColor]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const msgData = { 
      id: `msg-${Date.now()}`,
      text: message, 
      sender: user.username, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyingTo
    };
    setMessages([...messages, msgData]);
    setReplyingTo(null);
    setMessage('');
  };

  const handleSaveActivity = (msg) => {
    const isAlreadySaved = user.savedActivities?.find(a => a.id === msg.id);
    if (isAlreadySaved) {
        showToast("Already in Activities");
        return;
    }
    const updatedUser = {
        ...user,
        savedActivities: [msg, ...(user.savedActivities || [])]
    };
    setUser(updatedUser);
    showToast("Saved to Profile Activities");
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure?")) {
      setMessages([]);
      setSharedMedia([]);
      setPinnedMessages([]);
      setStarredMessages([]);
      showToast("Chat cleared");
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const isImg = file.type.startsWith('image/');
      const msg = { 
        id: `msg-${Date.now()}`, 
        text: isImg ? "" : file.name, 
        fileUrl: reader.result, 
        isImage: isImg, 
        sender: user.username, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages([...messages, msg]);
      setSharedMedia([msg, ...sharedMedia]);
    };
    reader.readAsDataURL(file);
  };

  const theme = {
    bg: isDarkMode ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]',
    header: isDarkMode ? 'bg-[#161b22] border-white/10' : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-[#c9d1d9]' : 'text-gray-900',
    subText: isDarkMode ? 'text-[#8b949e]' : 'text-gray-500',
    msgUser: isDarkMode ? 'bg-[#21262d] border-[#30363d]' : 'bg-white border-gray-200 shadow-sm',
    msgOther: isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200',
    sidebar: isDarkMode ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200',
    input: isDarkMode ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-300',
    dropdown: isDarkMode ? 'bg-[#1c2128] border-[#30363d]' : 'bg-white border-gray-200 shadow-xl'
  };

  return (
    <div className={`flex h-screen ${theme.bg} ${theme.text} font-sans overflow-hidden transition-colors duration-300`}>
      
      {/* FUNCTIONAL CALL OVERLAY UI */}
      {activeCall && (
        <div className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="text-center space-y-6 w-full max-w-2xl px-6">
                <div className="relative">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl mx-auto ring-4 ring-white/10 p-1 overflow-hidden bg-gray-800 shadow-2xl relative">
                        {activeCall === 'video' && !isVideoOff ? (
                           <video 
                              ref={localVideoRef} 
                              autoPlay 
                              muted 
                              playsInline 
                              className="w-full h-full object-cover scale-x-[-1]" 
                           />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white" style={{ backgroundColor: accentColor }}>
                              {group.image ? <img src={group.image} className="w-full h-full object-cover" alt="Call DP" /> : group.name.charAt(0)}
                          </div>
                        )}
                    </div>
                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-3xl border-4 border-white/20 animate-pulse pointer-events-none"></div>
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tight">{group.name}</h2>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">
                        {activeCall === 'video' ? 'Video Meeting' : 'Voice Call'}
                    </p>
                    <p className="text-white font-mono text-2xl mt-4 tracking-widest">{formatTime(callTimer)}</p>
                </div>
                <div className="flex gap-6 mt-12 justify-center">
                    <button onClick={toggleMute} className={`p-5 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                      {isMuted ? <MicOff size={24}/> : <Mic size={24}/>}
                    </button>
                    {activeCall === 'video' && (
                      <button onClick={toggleVideo} className={`p-5 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        {isVideoOff ? <VideoOff size={24}/> : <Video size={24}/>}
                      </button>
                    )}
                    <button onClick={endCall} className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 hover:scale-110 transition-all shadow-2xl shadow-red-500/40">
                      <PhoneOff size={24}/>
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col flex-1 border-r border-black/5 relative">
        <header className={`h-16 px-6 ${theme.header} border-b flex items-center justify-between z-50 shadow-sm`}>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveSidebar('info')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-lg overflow-hidden bg-gray-500" style={{ backgroundColor: accentColor }}>
               {group.image ? <img src={group.image} className="w-full h-full object-cover" alt="DP"/> : group.name.charAt(0)}
            </div>
            <div>
                <h3 className="font-bold text-sm tracking-tight">{group.name}</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.subText}`}>Online • {user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            
            <div className="relative">
                <button onClick={() => { setShowCallDropdown(!showCallDropdown); setShowCalendar(false); }} className="p-2.5 rounded-full hover:bg-black/5">
                    <Phone size={18} style={{ color: showCallDropdown ? accentColor : 'inherit' }}/>
                </button>
                {showCallDropdown && (
                    <div className={`absolute top-12 right-0 p-2 rounded-2xl border z-[1000] w-48 animate-in fade-in zoom-in-95 duration-200 ${theme.dropdown}`}>
                        <button onClick={() => { startCall('audio'); setShowCallDropdown(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors text-left">
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-600"><Phone size={14}/></div>
                            <span className="text-[11px] font-black uppercase tracking-wider">Audio Call</span>
                        </button>
                        <button onClick={() => { startCall('video'); setShowCallDropdown(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors text-left">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Video size={14}/></div>
                            <span className="text-[11px] font-black uppercase tracking-wider">Video Call</span>
                        </button>
                    </div>
                )}
            </div>

            <button onClick={() => { setShowCalendar(!showCalendar); setShowCallDropdown(false); }} className="p-2.5 rounded-full hover:bg-black/5">
                <CalendarIcon size={18} style={{ color: showCalendar ? accentColor : 'inherit' }}/>
            </button>
            {showCalendar && (
              <div className={`absolute top-12 right-0 p-4 rounded-2xl border z-[1000] w-64 animate-in fade-in zoom-in-95 duration-200 ${theme.dropdown}`}>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Jump to Date</div>
                <input 
                  type="date" 
                  className="w-full bg-transparent border-b border-black/10 outline-none pb-2 text-xs font-bold"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setShowCalendar(false);
                    showToast(`View updated for ${e.target.value}`);
                  }}
                />
              </div>
            )}

            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full hover:bg-black/5">
                {isDarkMode ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-indigo-600"/>}
            </button>
            <button onClick={() => setActiveSidebar('settings')} className="p-2.5 rounded-full hover:bg-black/5"><Settings size={18}/></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:px-24 space-y-6" style={{ backgroundImage: isDarkMode ? `radial-gradient(#21262d 0.5px, transparent 0.5px)` : `radial-gradient(#d0d7de 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }}>
            {messages.map((m) => (
               <div key={m.id} className={`flex ${m.sender === user.username ? 'justify-end' : 'justify-start'} group relative`}>
                  <div className={`relative px-5 py-3 rounded-2xl border transition-all max-w-[80%] ${m.sender === user.username ? theme.msgUser : theme.msgOther}`}>
                    <div className="flex justify-between items-start gap-4">
                        <p className="text-[10px] font-black uppercase mb-1" style={{ color: accentColor }}>{m.sender}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleSaveActivity(m)} title="Save to Profile" className="hover:scale-110 transition-transform"><Save size={12} className="text-gray-400 hover:text-blue-500"/></button>
                            {m.fileUrl && <a href={m.fileUrl} download={m.text || 'file'} title="Download" className="hover:scale-110 transition-transform"><Download size={12} className="text-gray-400 hover:text-green-500"/></a>}
                        </div>
                    </div>
                    
                    {m.text && <p className="text-[13px] leading-relaxed font-medium">{m.text}</p>}
                    {m.isImage && <img src={m.fileUrl} className="max-w-xs rounded-xl mt-3 shadow-md" alt="shared"/>}
                    {!m.isImage && m.fileUrl && (
                        <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-black/5 border border-black/5">
                            <FileText size={18} style={{ color: accentColor }}/>
                            <span className="text-xs font-bold truncate max-w-[150px]">{m.text}</span>
                        </div>
                    )}
                    <div className="flex justify-end mt-2 opacity-30 text-[9px] font-bold">{m.time}</div>
                  </div>
               </div>
            ))}
            <div ref={scrollRef} />
        </div>

        <footer className={`p-5 border-t ${theme.header}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => fileInputRef.current.click()} className="p-2 hover:scale-125 transition-transform"><Paperclip size={22}/></button>
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" />
            <form onSubmit={handleSend} className="flex-1">
              <input className={`w-full rounded-2xl border px-6 py-3.5 text-sm outline-none transition-all focus:ring-4 ${theme.input}`} style={{ borderColor: `${accentColor}33` }} placeholder="Compose message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </form>
            <button onClick={handleSend} className="p-4 text-white rounded-2xl shadow-xl hover:brightness-110" style={{ backgroundColor: accentColor }}><Send size={22}/></button>
          </div>
        </footer>
      </div>

      {activeSidebar && (
        <div className={`w-[400px] ${theme.sidebar} border-l z-[100] flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl`}>
          <header className={`h-16 px-6 ${theme.header} border-b flex items-center justify-between`}>
            <h3 className="text-xs font-black uppercase tracking-widest">{activeSidebar}</h3>
            <button onClick={() => setActiveSidebar(null)} className="p-2 hover:bg-black/5 rounded-full"><X size={18}/></button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {activeSidebar === 'settings' && (
              <div className="space-y-8">
                <section className="text-center space-y-6">
                  <div className="relative inline-block mx-auto">
                    <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl overflow-hidden" style={{ backgroundColor: accentColor }}>
                       {group.image ? <img src={group.image} className="w-full h-full object-cover" alt="DP"/> : group.name.charAt(0)}
                    </div>
                    <button onClick={() => dpInputRef.current.click()} className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl border border-black/5 hover:scale-110 transition-all"><Camera size={16}/></button>
                    <input type="file" ref={dpInputRef} onChange={(e) => {
                         const reader = new FileReader();
                         reader.onloadend = () => setGroup({...group, image: reader.result});
                         reader.readAsDataURL(e.target.files[0]);
                    }} className="hidden" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-black text-lg">{user.username}</h4>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">Workspace Administrator</p>
                  </div>
                </section>

                <section className="space-y-4 pt-6 border-t border-black/5">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                      <History size={12}/> Recent Profile Activities
                   </div>
                   <div className="space-y-3">
                      {(user.savedActivities || []).length > 0 ? (
                        user.savedActivities.map((act) => (
                          <div key={act.id} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} group/act`}>
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-black uppercase opacity-40" style={{ color: accentColor }}>Saved Chat</span>
                                <button onClick={() => {
                                    const filtered = user.savedActivities.filter(a => a.id !== act.id);
                                    setUser({...user, savedActivities: filtered});
                                }} className="opacity-0 group-hover/act:opacity-100 text-red-500 transition-opacity"><Trash2 size={12}/></button>
                             </div>
                             {act.text && <p className="text-xs font-medium line-clamp-2 italic">"{act.text}"</p>}
                             {act.isImage && <div className="mt-2 h-20 w-full rounded-lg overflow-hidden"><img src={act.fileUrl} className="w-full h-full object-cover"/></div>}
                             {!act.isImage && act.fileUrl && <div className="mt-2 flex items-center gap-2 text-[10px] font-bold"><FileText size={10}/> {act.text}</div>}
                             <p className="text-[8px] mt-2 opacity-30 font-bold">{act.time}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-[10px] font-bold opacity-30 italic">No activities saved yet.</p>
                      )}
                   </div>
                </section>

                <section className="space-y-3 pt-6 border-t border-black/5">
                  <button onClick={handleClearChat} className="w-full p-4 flex items-center justify-center gap-3 bg-orange-500/10 text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                    <Eraser size={14}/> Clear Chat History
                  </button>
                  <button onClick={onLeave} className="w-full p-4 flex items-center justify-center gap-3 bg-red-500/10 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    <LogOut size={14}/> Exit Group
                  </button>
                </section>
              </div>
            )}
            
            {activeSidebar === 'info' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                   <div className="text-center space-y-4">
                    <div className="w-28 h-28 rounded-3xl mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl overflow-hidden" style={{ backgroundColor: accentColor }}>
                        {group.image ? <img src={group.image} className="w-full h-full object-cover" alt="DP"/> : group.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{group.name}</h2>
                        <button onClick={() => setActiveSidebar('settings')} className="mt-3 flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-full border hover:bg-black/5 transition-all" style={{ color: accentColor, borderColor: `${accentColor}33` }}>
                            <Settings size={12}/> Edit Profile
                        </button>
                    </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Shared Media & Files ({sharedMedia.length})</p>
                      {sharedMedia.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                           {sharedMedia.map((m, i) => (
                             <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black/5 border border-black/5 flex items-center justify-center relative group">
                                {m.isImage ? <img src={m.fileUrl} className="w-full h-full object-cover" alt="gallery"/> : <FileText size={20} className="opacity-40" />}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                                    <a href={m.fileUrl} download={m.text || 'file'}><Download size={14}/></a>
                                    <button onClick={() => handleSaveActivity(m)}><Save size={14}/></button>
                                </div>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="p-8 border-2 border-dashed border-black/5 rounded-3xl text-center opacity-30">
                            <ImageIcon className="mx-auto mb-2" size={24}/>
                            <p className="text-[10px] font-black uppercase tracking-widest">No resources shared</p>
                        </div>
                      )}
                   </div>
                </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/90 text-white text-[11px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border border-white/10 z-[2000] shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> {toast}</div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;