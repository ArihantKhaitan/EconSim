// client/src/components/ShareResults.jsx
import React, { useState } from 'react';

const ShareResults = ({ taxData, gstData }) => {
  const [copied, setCopied] = useState(false);

  const formatCurrency = (amt) => `₹${Math.round(amt).toLocaleString('en-IN')}`;

  const shareText = `🧮 My Tax Analysis via EconSim:\n💰 Income: ${formatCurrency(taxData.income)}\n📊 Best Regime: ${taxData.betterRegime?.toUpperCase()}\n💵 Annual Tax: ${formatCurrency(taxData.totalTax)}\n🎯 Tax Saved: ${formatCurrency(taxData.savings)}\n\nCalculate yours at EconSim! #Budget2025 #FinHack2025`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-xl">📤</span> Share Your Results
      </h3>
      
      {/* UPDATED GRID LAYOUT */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold transition-all shadow-lg shadow-green-900/20">
          <span>📱</span> WhatsApp
        </button>
        
        <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold transition-all shadow-lg shadow-blue-900/20">
          <span>🐦</span> Twitter
        </button>
        
        <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, '_blank')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0077b5] hover:bg-[#00669c] text-white font-bold transition-all shadow-lg shadow-blue-900/20">
          <span>💼</span> LinkedIn
        </button>
        
        <button onClick={copyToClipboard} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}>
          <span>{copied ? '✅' : '📋'}</span> {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
    </div>
  );
};

export default ShareResults;