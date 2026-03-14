import React, { useState, useRef } from 'react';

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle file selection and conversion to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // This is the Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Pass the name and the local image string back to Groups.js
    onCreate(name, imagePreview); 
    
    // Reset form
    setName('');
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[48px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <h3 className="text-3xl font-[1000] tracking-tighter uppercase italic mb-8 text-slate-900">Initialize_Node</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* UPLOAD & PREVIEW AREA */}
          <div 
            onClick={() => fileInputRef.current.click()}
            className="group relative w-full h-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 transition-all"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <div className="text-3xl mb-2">📸</div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Click to Upload Image</p>
                <p className="text-[9px] text-slate-300 uppercase mt-1">Supports: JPG, PNG, WEBP</p>
              </div>
            )}
            
            {/* Hidden Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Node Title</label>
            <input 
              autoFocus
              type="text" 
              placeholder="E.G. ADVANCED ROBOTICS..." 
              className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-indigo-400 font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-5 text-xs font-black uppercase text-slate-400"
            >
              Abort
            </button>
            <button 
              type="submit" 
              className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Confirm_Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;