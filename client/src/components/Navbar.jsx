// client/src/components/Navbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Helper to get initials if photo fails
  const getInitials = () => {
    if (currentUser?.displayName) return currentUser.displayName.charAt(0).toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <span className="text-3xl filter drop-shadow-lg">📈</span>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">EconSim</h1>
        </div>
      </div>

      {/* CENTER: Spacious Tabs (Hidden on small screens) */}
      <div className="hidden md:flex gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/10">
        {['dashboard', 'income-tax', 'gst', 'policy-sim', 'learn'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* RIGHT: Profile Section */}
      <div className="flex items-center justify-end gap-6 font-sans">
        {currentUser ? (
          // --- LOGGED IN STATE ---
          <div className="flex items-center gap-4">
             {/* User Info & Avatar */}
             <div className="flex items-center gap-3 text-right">
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-white leading-tight">
                    {currentUser.displayName?.split(' ')[0] || "User"}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium tracking-wide">
                    ONLINE
                  </div>
               </div>

               {/* Avatar */}
               <div className="relative h-10 w-10">
                 {currentUser.photoURL ? (
                   <img 
                     src={currentUser.photoURL} 
                     alt="Profile" 
                     className="h-full w-full rounded-full border-2 border-slate-700 object-cover shadow-sm"
                     onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}}
                   />
                 ) : null}
                 {/* Fallback Initial */}
                 <div className={`${currentUser.photoURL ? 'hidden' : 'flex'} h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-sm font-bold text-white border-2 border-slate-800 absolute top-0 left-0`}>
                     {getInitials()}
                 </div>
                 {/* Online Status Dot */}
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
               </div>
             </div>

             {/* SEPARATOR */}
             <div className="w-px h-8 bg-slate-800/50"></div>

             {/* LOGOUT BUTTON (Turns Red on Hover) */}
             <button 
               onClick={handleLogout}
               className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-sm hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all shadow-sm"
             >
               Logout
             </button>
          </div>
        ) : (
          // --- GUEST STATE ---
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-slate-400">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <span className="text-xl opacity-70">👤</span>
                </div>
                <div className="hidden sm:block">
                    <div className="text-sm font-medium leading-tight text-slate-300">Guest Mode</div>
                    <div className="text-[10px] opacity-60">Data not saved</div>
                </div>
             </div>
             
             {/* SEPARATOR */}
             <div className="w-px h-8 bg-slate-800/50"></div>

             {/* EXIT BUTTON (Turns Red on Hover) */}
             <button 
               onClick={() => navigate('/')}
               className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-sm hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all shadow-sm"
             >
               Exit
             </button>
          </div>
        )}
      </div>
    </nav>
  );
}