// client/src/modules/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import your existing components
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

// --- INTERNAL COMPONENT: METRIC CARD ---
const MetricCard = ({ label, value, subtitle, icon, color = 'emerald', trend }) => {
  const colorClasses = {
    emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400',
    orange: 'from-orange-500/10 to-amber-500/5 border-orange-500/20 text-orange-400',
    blue: 'from-blue-500/10 to-cyan-500/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/10 to-pink-500/5 border-purple-500/20 text-purple-400',
    slate: 'from-slate-500/10 to-slate-500/5 border-slate-500/20 text-slate-300'
  };

  return (
    <div className={`group relative bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-${color}-500/10`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {label}
        </div>
        {icon && (
          <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
        )}
      </div>
      <div className={`text-3xl md:text-4xl font-bold ${colorClasses[color].split(' ').pop()} mb-1`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-slate-500 flex items-center gap-2">
          {subtitle}
          {trend && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              trend > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
            }`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// --- INTERNAL COMPONENT: BADGE ---
const Badge = ({ children, variant = 'emerald' }) => {
  const variants = {
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${variants[variant]}`}>
      {children}
    </span>
  );
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
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* --- ENHANCED HERO SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800/50 shadow-2xl">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"></div>

        <div className="relative z-10 px-8 py-12 md:px-12 md:py-16">
          {/* Welcome Text */}
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-2">Welcome back, {userProfile.displayName} 👋</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="emerald">Budget 2025-26</Badge>
              <Badge variant="blue">GST 2.0</Badge>
              <Badge variant="purple">Live Dashboard</Badge>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Understand How Policies
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 animate-gradient">
              Affect Your Wallet
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl text-lg md:text-xl mb-8 leading-relaxed font-light">
            India's first comprehensive policy simulation platform. Calculate taxes, understand GST impact, and see how government policies affect your real income.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('income-tax')}
              className="group relative px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/50 transform hover:-translate-y-0.5 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Calculate Your Tax
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            
            <button 
              onClick={() => setActiveTab('gst')}
              className="group px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                See GST Impact
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* --- KEY METRICS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Annual Income" value={formatCurrency(taxInputs.grossIncome)} icon="💰" color="slate" />
        <MetricCard label="Tax Payable" value={formatCurrency(taxData.totalTax)} subtitle={`${taxData.effectiveRate.toFixed(1)}% Effective Rate`} icon="📊" color="emerald" />
        <MetricCard label="Monthly GST" value={formatCurrency(gstData.totalGST)} subtitle="Estimated from spending" icon="🛒" color="orange" />
        <MetricCard label="Potential Savings" value={formatCurrency(taxSavings)} subtitle={`vs ${betterRegime === 'new' ? 'Old' : 'New'} Regime`} icon="💎" color="blue" />
      </div>

      {/* --- INSIGHTS BANNER --- */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Quick Insight</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              You're currently on the <span className="font-bold text-emerald-400">{betterRegime === 'new' ? 'New' : 'Old'} Tax Regime</span>, which is optimal for your income level. 
              {taxSavings > 0 && ` You're saving ${formatCurrency(taxSavings)} compared to the alternative regime.`}
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Charts & Analysis (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Historical Comparison */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">📈</span> Historical Tax Trends
              </h3>
              <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">5 Years</span>
            </div>
            <HistoricalComparison currentIncome={taxInputs.grossIncome} />
          </div>
            
          {/* AI Analysis Section */}
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🤖</span> AI Financial Analysis
              </h3>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                BETA
              </span>
            </div>
            <AIExplainer taxData={taxData} gstData={gstData} userProfile={userProfile} />
          </div>
        </div>
        
        {/* Right Column: Actions & Reports */}
        <div className="space-y-6">
          {/* Share Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🔗</span>
              </div>
              <h3 className="text-lg font-bold text-white">Share Results</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Share your tax analysis with friends or financial advisors.
            </p>
            <ShareResults taxData={taxData} gstData={gstData} />
          </div>
            
          {/* PDF Report Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 text-3xl">
              📄
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Detailed Report</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Get a comprehensive PDF breakdown of your taxes, GST, and savings for your records.
            </p>
            <div className="w-full">
              <PDFReport taxData={taxData} gstData={gstData} userProfile={userProfile} />
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-sm text-slate-400">Take-home Income</span>
                <span className="text-sm font-bold text-white">{formatCurrency(taxInputs.grossIncome - taxData.totalTax)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-sm text-slate-400">Annual GST</span>
                <span className="text-sm font-bold text-orange-400">{formatCurrency(gstData.totalGST * 12)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Net After All Taxes</span>
                <span className="text-sm font-bold text-emerald-400">
                  {formatCurrency(taxInputs.grossIncome - taxData.totalTax - (gstData.totalGST * 12))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}