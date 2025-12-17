// File: client/src/components/ShareResults.jsx

import React, { useState } from 'react';

const ShareResults = ({ taxData, gstData }) => {
  const [copied, setCopied] = useState(false);

  const formatCurrency = (amt) => `₹${Math.round(amt).toLocaleString('en-IN')}`;

  const shareText = `🧮 My Tax Analysis via EconSim:

💰 Income: ${formatCurrency(taxData.income)}
📊 Best Regime: ${taxData.betterRegime?.toUpperCase()}
💵 Annual Tax: ${formatCurrency(taxData.totalTax)}
🎯 Tax Saved: ${formatCurrency(taxData.savings)}
📈 Effective Rate: ${taxData.effectiveRate?.toFixed(2)}%

🛒 Monthly GST Paid: ${formatCurrency(gstData.totalGST)}

Calculate yours: ${window.location.origin}

#Budget2025 #TaxSavings #EconSim #FinHack2025`;

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const twitterText = `My tax with Budget 2025: ${formatCurrency(taxData.totalTax)} on ${formatCurrency(taxData.income)} income (${taxData.effectiveRate?.toFixed(1)}% effective rate). ${taxData.betterRegime?.toUpperCase()} regime saves me ${formatCurrency(taxData.savings)}! 

Calculate yours with EconSim 👇
#Budget2025 #TaxCalculator`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const linkedInText = `Analyzed my tax situation with EconSim for FY 2025-26. The ${taxData.betterRegime?.toUpperCase()} Tax Regime is optimal for my income level, resulting in ${formatCurrency(taxData.savings)} in annual savings. Budget 2025 has made income up to ₹12.75L effectively tax-free for salaried individuals. Highly recommend this tool for anyone trying to understand policy impacts!`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(linkedInText)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">📤</span>
        Share Your Results
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={shareOnWhatsApp}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
        >
          <span className="text-lg">📱</span>
          WhatsApp
        </button>
        
        <button
          onClick={shareOnTwitter}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
        >
          <span className="text-lg">🐦</span>
          Twitter
        </button>
        
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          <span className="text-lg">💼</span>
          LinkedIn
        </button>
        
        <button
          onClick={copyToClipboard}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
            copied 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          <span className="text-lg">{copied ? '✅' : '📋'}</span>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default ShareResults;