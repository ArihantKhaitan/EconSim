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

  // 1. Prepare Data Objects for your components
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
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-400">
            Financial Dashboard
          </h2>
          <p className="text-slate-400 mt-1">
            Overview for FY 2025-26 • {betterRegime === 'new' ? 'New Regime' : 'Old Regime'} Selected
          </p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-2">
           <button onClick={() => setActiveTab('income-tax')} className="bg-slate-800 hover:bg-slate-700 text-sm px-4 py-2 rounded-lg border border-slate-700 transition-colors">
             Edit Income
           </button>
        </div>
      </div>

      {/* 1. SUMMARY CARDS (Existing Logic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Annual Income</div>
          <div className="text-2xl font-bold text-white mt-1">{formatCurrency(taxInputs.grossIncome)}</div>
        </div>
        
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Tax Payable</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(taxData.totalTax)}</div>
          <div className="text-xs text-slate-500 mt-1">{taxData.effectiveRate.toFixed(1)}% Effective Rate</div>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Monthly GST</div>
          <div className="text-2xl font-bold text-orange-400 mt-1">{formatCurrency(gstData.totalGST)}</div>
          <div className="text-xs text-slate-500 mt-1">Based on spending</div>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Potential Savings</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(taxSavings)}</div>
          <div className="text-xs text-slate-500 mt-1">vs {betterRegime === 'new' ? 'Old' : 'New'} Regime</div>
        </div>
      </div>

      {/* 2. HISTORICAL COMPARISON CHART (New Component) */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
           <HistoricalComparison currentIncome={taxInputs.grossIncome} />
        </div>
        
        {/* 3. SHARE & REPORT SECTION (New Components) */}
        <div className="space-y-6">
           <ShareResults taxData={taxData} gstData={gstData} />
           <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="font-bold text-white mb-1">Need a Report?</h3>
              <p className="text-sm text-slate-400 mb-4">Download a detailed PDF breakdown for your records or loan applications.</p>
              <PDFReport taxData={taxData} gstData={gstData} userProfile={userProfile} />
           </div>
        </div>
      </div>

      {/* 4. AI EXPLAINER SECTION (New Component) */}
      <div className="pt-4 border-t border-slate-800">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-purple-400">⚡</span> AI Financial Analysis
        </h3>
        <AIExplainer taxData={taxData} gstData={gstData} userProfile={userProfile} />
      </div>

    </div>
  );
}