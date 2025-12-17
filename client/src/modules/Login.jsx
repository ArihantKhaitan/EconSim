// client/src/modules/Login.jsx
import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, googleSignIn } = useAuth(); // Get googleSignIn
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/dashboard");
    } catch {
      setError("Failed to sign in. Check email/password.");
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      await googleSignIn();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600 rounded-full blur-[100px]"></div>
        </div>

      <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏦</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">EconSim</h2>
          <p className="text-slate-400 mt-2">Intelligent Policy Impact Simulator</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

        {/* GOOGLE BUTTON */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 mb-6"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-slate-500">Or continue with email</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="email" ref={emailRef} required className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" placeholder="Email address"/>
          </div>
          <div>
            <input type="password" ref={passwordRef} required className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" placeholder="Password"/>
          </div>
          
          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20">
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          Continue as Guest →
        </button>

        <div className="mt-6 text-center text-slate-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}