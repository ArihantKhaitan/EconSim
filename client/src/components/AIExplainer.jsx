// File: client/src/components/AIExplainer.jsx

import React, { useState } from 'react';

const AIExplainer = ({ taxData, gstData, userProfile }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('simple'); // 'simple', 'detailed', 'hinglish'

  const getExplanation = async () => {
    setLoading(true);
    
    const prompts = {
      simple: `Explain simply in 50 words how someone earning ₹${taxData.income} is affected by Budget 2025. Their tax: ₹${taxData.totalTax}. Use everyday examples.`,
      detailed: `Provide detailed analysis of tax implications for income ₹${taxData.income}. Compare Old vs New regime. Include specific savings tips.`,
      hinglish: `Hinglish mein batao ki ₹${taxData.income} kamaane wale ko Budget 2025 se kya fayda hai. Tax: ₹${taxData.totalTax}. Simple language use karo.`
    };

    try {
      // Replace with your actual Gemini API call
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompts[mode],
          taxData,
          gstData,
          userProfile
        })
      });
      
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      // Fallback explanation
      setExplanation(generateFallbackExplanation(taxData, mode));
    }
    
    setLoading(false);
  };

  const generateFallbackExplanation = (data, mode) => {
    const monthly = Math.round(data.totalTax / 12);
    const savings = data.savings || 0;
    
    if (mode === 'hinglish') {
      return `Aapki salary ₹${formatCurrency(data.income)} pe ${data.betterRegime === 'new' ? 'New' : 'Old'} Regime best hai. Total tax sirf ₹${formatCurrency(data.totalTax)} (₹${formatCurrency(monthly)}/month). ${savings > 0 ? `Yeh choose karke aap ₹${formatCurrency(savings)} bacha rahe ho!` : ''} Budget 2025 ne middle class ko bada relief diya hai! 🎉`;
    }
    
    return `With an income of ${formatCurrency(data.income)}, the ${data.betterRegime === 'new' ? 'New' : 'Old'} Tax Regime saves you more. Your annual tax is ${formatCurrency(data.totalTax)} (${formatCurrency(monthly)}/month). ${savings > 0 ? `By choosing this regime, you save ${formatCurrency(savings)} annually!` : ''} Budget 2025 brought significant relief for middle-class taxpayers.`;
  };

  const formatCurrency = (amt) => `₹${Math.round(amt).toLocaleString('en-IN')}`;

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          AI Explanation
        </h3>
        <div className="flex gap-2">
          {['simple', 'detailed', 'hinglish'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                mode === m 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {explanation ? (
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
          <p className="text-slate-200 leading-relaxed">{explanation}</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4 text-center text-slate-400">
          Click "Explain" to get AI-powered insights about your tax situation
        </div>
      )}

      <button
        onClick={getExplanation}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✨ Explain My Tax Situation
          </span>
        )}
      </button>
    </div>
  );
};

export default AIExplainer;