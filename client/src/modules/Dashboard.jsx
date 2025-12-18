// client/src/modules/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import your new components
import ShareResults from '../components/ShareResults';
import PDFReport from '../components/PDFReport';
import HistoricalComparison from '../components/HistoricalComparison';
import AIExplainer from '../components/AIExplainer';

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Dashboard({ taxInputs, setActiveTab, newRegimeTax, oldRegimeTax, betterRegime, taxSavings, gstImpact }) {
  const { currentUser } = useAuth();

  // 1. Prepare Data Objects
  const taxData = {
    income: taxInputs.grossIncome,
    totalTax: betterRegime === 'new' ? newRegimeTax.totalTax : oldRegimeTax.totalTax,
    betterRegime: betterRegime,
    savings: taxSavings,
    effectiveRate: ((betterRegime === 'new' ? newRegimeTax.totalTax : oldRegimeTax.totalTax) / taxInputs.grossIncome) * 100
  };

  const gstData = {
    totalGST: gstImpact.totalGST,
    totalExpense: gstImpact.totalExpense,
    effectiveRate: (gstImpact.totalGST / gstImpact.totalExpense) * 100
  };

  const userProfile = {
    displayName: currentUser?.displayName || 'User',
    email: currentUser?.email
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* --- 1. RESTORED "HERO" SECTION (The Old Design You Liked) --- */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex gap-3 mb-6">
             <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
               Budget 2025-26
             </span>
             <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
               GST 2.0
             </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Understand How Policies <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Affect Your Wallet
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl text-lg mb-8 leading-relaxed">
            India's first comprehensive policy simulation platform. Calculate taxes, understand GST impact, and see how government policies affect your real income.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveTab('income-tax')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 transform hover:-translate-y-1"
            >
              Calculate Your Tax
            </button>
            <button 
              onClick={() => setActiveTab('gst')}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all hover:border-slate-600"
            >
              See GST Impact
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. KEY METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2">Annual Income</div>
          <div className="text-3xl font-bold text-white">{formatCurrency(taxInputs.grossIncome)}</div>
        </div>
        
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2">Tax Payable</div>
          <div className="text-3xl font-bold text-emerald-400">{formatCurrency(taxData.totalTax)}</div>
          <div className="text-xs text-slate-500 mt-2">{taxData.effectiveRate.toFixed(1)}% Effective Rate</div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2">Monthly GST</div>
          <div className="text-3xl font-bold text-orange-400">{formatCurrency(gstData.totalGST)}</div>
          <div className="text-xs text-slate-500 mt-2">Estimated from spending</div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-2">Potential Savings</div>
          <div className="text-3xl font-bold text-blue-400">{formatCurrency(taxSavings)}</div>
          <div className="text-xs text-slate-500 mt-2">vs {betterRegime === 'new' ? 'Old' : 'New'} Regime</div>
        </div>
      </div>

      {/* --- 3. HISTORICAL & REPORTS SECTION --- */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Charts */}
        <div className="md:col-span-2 space-y-6">
           <HistoricalComparison currentIncome={taxInputs.grossIncome} />
           
           {/* AI Section (Moved here for better flow) */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-purple-400 text-2xl">⚡</span> AI Financial Analysis
              </h3>
              <AIExplainer taxData={taxData} gstData={gstData} userProfile={userProfile} />
           </div>
        </div>
        
        {/* Right Column: Actions */}
        <div className="space-y-6">
           <ShareResults taxData={taxData} gstData={gstData} />
           
           <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-3xl shadow-inner">📄</div>
              <h3 className="text-xl font-bold text-white mb-2">Detailed Report</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Get a comprehensive PDF breakdown of your taxes, GST, and savings for your records.
              </p>
              <div className="w-full">
                <PDFReport taxData={taxData} gstData={gstData} userProfile={userProfile} />
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}