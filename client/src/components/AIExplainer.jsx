// client/src/components/AIExplainer.jsx
import React, { useState } from 'react';

const AIExplainer = ({ taxData, gstData, userProfile }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('simple'); // 'simple', 'detailed', 'hinglish'
  const [error, setError] = useState('');

  const getExplanation = async () => {
    setLoading(true);
    setError('');
    
    // 1. Construct the prompt based on mode
    const prompts = {
      simple: `Explain simply in 50 words how someone earning ₹${taxData.income} is affected by Budget 2025. Their tax: ₹${taxData.totalTax}. Use everyday examples.`,
      detailed: `Provide detailed analysis of tax implications for income ₹${taxData.income}. Compare Old vs New regime. Include specific savings tips.`,
      hinglish: `Hinglish mein batao ki ₹${taxData.income} kamaane wale ko Budget 2025 se kya fayda hai. Tax: ₹${taxData.totalTax}. Simple language use karo.`
    };

    try {
      // 2. Call the Real Backend
      const response = await fetch('http://localhost:5000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompts[mode],
          taxData,
          gstData,
          userProfile
        })
      });
      
      if (!response.ok) throw new Error("Server Offline");

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error("AI Fetch Error:", err);
      // 3. Explicit Error State (So you know if it's real or fake)
      setError("⚠️ Server disconnected. Showing offline estimate:");
      setExplanation(generateFallbackExplanation(taxData, mode));
    }
    
    setLoading(false);
  };

  const generateFallbackExplanation = (data, mode) => {
    const monthly = Math.round(data.totalTax / 12);
    const savings = data.savings || 0;
    
    if (mode === 'hinglish') {
      return `Aapki salary ₹${data.income.toLocaleString()} pe ${data.betterRegime === 'new' ? 'New' : 'Old'} Regime best hai. Total tax sirf ₹${data.totalTax.toLocaleString()} (₹${monthly}/month). ${savings > 0 ? `Yeh choose karke aap ₹${savings.toLocaleString()} bacha rahe ho!` : ''} Budget 2025 ne middle class ko bada relief diya hai! 🎉`;
    }
    
    return `With an income of ₹${data.income.toLocaleString()}, the ${data.betterRegime === 'new' ? 'New' : 'Old'} Tax Regime saves you more. Your annual tax is ₹${data.totalTax.toLocaleString()} (₹${monthly}/month). ${savings > 0 ? `By choosing this regime, you save ₹${savings.toLocaleString()} annually!` : ''}`;
  };

  return (
    <div className="w-full">
      {/* CONTROLS (Moved inside content area) */}
      <div className="flex justify-end gap-2 mb-4">
        {['simple', 'detailed', 'hinglish'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all border ${
              mode === m 
                ? 'bg-purple-500 text-white border-purple-400 shadow-glow-sm' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ERROR WARNING */}
      {error && (
        <div className="text-xs text-orange-400 mb-2 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20">
          {error} (Check if 'node index.js' is running)
        </div>
      )}

      {/* OUTPUT BOX */}
      {explanation ? (
        <div className="bg-slate-900/60 rounded-xl p-4 mb-4 border border-purple-500/20 shadow-inner">
          <p className="text-slate-200 leading-relaxed text-sm md:text-base animate-fade-in">
            {explanation}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/30 rounded-xl p-6 mb-4 border border-dashed border-slate-700 text-center">
          <p className="text-slate-500 text-sm">
            Select a mode and click analyze to get personalized advice.
          </p>
        </div>
      )}

      {/* ACTION BUTTON */}
      <button
        onClick={getExplanation}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Consulting AI Advisor...</span>
          </>
        ) : (
          <>
            <span className="text-lg group-hover:scale-110 transition-transform">✨</span>
            <span>Generate Analysis</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIExplainer;