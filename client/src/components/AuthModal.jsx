import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // ✅ State for Name
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle, loginAsGuest } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // ✅ Validate Name
        if (!name.trim()) throw new Error("Please enter your Full Name");
        await signup(email, password, name);
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl text-3xl">
                🏛️
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">EconSim</h2>
            <p className="text-slate-400">Intelligent Policy Impact Simulator</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 text-center border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ✅ Added Name Input for Signup */}
            {!isLogin && (
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                    <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="e.g. Arihant Khaitan"
                    />
                </div>
            )}

            <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-emerald-500 transition-all"
                    placeholder="name@example.com"
                />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button 
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
                {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
            </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
            <div className="h-[1px] bg-slate-800 flex-1"></div>
            <span className="text-slate-500 text-xs">OR</span>
            <div className="h-[1px] bg-slate-800 flex-1"></div>
        </div>

        <button 
            onClick={loginWithGoogle}
            className="w-full mt-6 py-3 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
            Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-400 font-bold hover:underline">
                {isLogin ? 'Sign Up' : 'Log In'}
            </button>
        </div>
        
        {/* ✅ Guest Button handles guest logic correctly */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <button onClick={loginAsGuest} className="text-slate-500 hover:text-emerald-400 text-sm transition-colors flex items-center justify-center gap-1 mx-auto">
                Continue as Guest <span>→</span>
            </button>
        </div>
    </div>
  );
}