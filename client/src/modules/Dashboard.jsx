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

// --- COMPONENT: FULL-WIDTH ROTATING TICKER ---
const NewsTicker = () => {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 mb-8 bg-slate-900 border-b border-slate-800 overflow-hidden h-10 flex items-center z-0">
      
      {/* Red 'LIVE' Badge */}
      <div className="absolute left-0 top-0 bottom-0 bg-red-600 px-4 z-20 flex items-center text-xs font-bold text-white uppercase tracking-wider shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
        LIVE 🔴
      </div>

      {/* Rotating Content */}
      <div className="flex animate-marquee whitespace-nowrap items-center">
        <div className="flex items-center gap-12 text-sm font-medium text-slate-300 px-4 pl-24">
            <span>📉 <strong className="text-white">Crude Oil</strong> drops to $71/barrel</span>
            <span>📢 <strong className="text-white">RBI</strong> likely to hold Repo Rate at 6.5%</span>
            <span>🍅 <strong className="text-white">Tomato Prices</strong> surge 14% in Delhi</span>
            <span>⚡ <strong className="text-white">Govt</strong> announces ₹500cr EV subsidy</span>
            <span>📈 <strong className="text-white">Sensex</strong> crosses 78,000 mark</span>
            <span>🏗️ <strong className="text-white">Infrastructure Cess</strong> likely to increase</span>
            
            {/* DUPLICATE CONTENT FOR SEAMLESS LOOP */}
            <span>📉 <strong className="text-white">Crude Oil</strong> drops to $71/barrel</span>
            <span>📢 <strong className="text-white">RBI</strong> likely to hold Repo Rate at 6.5%</span>
            <span>🍅 <strong className="text-white">Tomato Prices</strong> surge 14% in Delhi</span>
            <span>⚡ <strong className="text-white">Govt</strong> announces ₹500cr EV subsidy</span>
            <span>📈 <strong className="text-white">Sensex</strong> crosses 78,000 mark</span>
            <span>🏗️ <strong className="text-white">Infrastructure Cess</strong> likely to increase</span>
        </div>
      </div>
    </div>
  );
};

// --- METRIC CARD ---
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
    <div className="animate-fade-in pb-12 -mt-6 mx-[-1.5rem]">
      
      {/* 1. NEWS TICKER (Full Width) */}
      <NewsTicker />

      <div className="px-6 md:px-8 space-y-6">
        
        {/* --- CLEAN PROFESSIONAL HERO SECTION --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* 1. Restored Background Pattern & Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>
          {/* THE CHECK PATTERN */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Left: User Welcome (Cleaner) */}
            <div className="w-full md:w-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{userProfile.displayName}</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Your personal economic intelligence hub.
              </p>
            </div>

            {/* Right: The BIG Buttons (Restored) */}
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('income-tax')}
                className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-emerald-900/30 hover:shadow-emerald-500/40 transform hover:-translate-y-1 overflow-hidden flex-1 md:flex-none justify-center flex"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Calculate Tax
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              
              <button 
                onClick={() => setActiveTab('gst')}
                className="group px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-300 backdrop-blur-md shadow-lg flex-1 md:flex-none justify-center flex"
              >
                <span className="flex items-center gap-2">
                  Check GST
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm shadow-sm">
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
          {/* Left Column: Charts & AI (2/3 Width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Historical Comparison */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">📈</span> Historical Tax Trends
                </h3>
              </div>
              {/* Chart Component */}
              <div className="flex-1 min-h-0">
                 <HistoricalComparison currentIncome={taxInputs.grossIncome} />
              </div>
            </div>
              
            {/* AI Analysis Section */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🤖</span>
                <h3 className="text-xl font-bold text-white">AI Financial Analysis</h3>
              </div>
              <AIExplainer taxData={taxData} gstData={gstData} userProfile={userProfile} />
            </div>
          </div>
          
          {/* Right Column: Tools & Reports (1/3 Width) */}
          <div className="space-y-6">
            
            {/* 1. EXPLORE TOOLS (Moved to Top) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                🚀 Explore Tools
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('policy-sim')} 
                  className="w-full p-4 rounded-xl bg-slate-800 hover:bg-indigo-900/20 border border-slate-700 hover:border-indigo-500/50 transition-all group text-left flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🏛️</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Policy Simulator</h4>
                    <p className="text-xs text-slate-400">Finance Minister Mode</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('inflation')} 
                  className="w-full p-4 rounded-xl bg-slate-800 hover:bg-red-900/20 border border-slate-700 hover:border-red-500/50 transition-all group text-left flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🎈</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Inflation Tracker</h4>
                    <p className="text-xs text-slate-400">Track Price Rise</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('learn')} 
                  className="w-full p-4 rounded-xl bg-slate-800 hover:bg-emerald-900/20 border border-slate-700 hover:border-emerald-500/50 transition-all group text-left flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📚</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Learn Hub</h4>
                    <p className="text-xs text-slate-400">Financial Education</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. DETAILED REPORT */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 text-2xl">
                📄
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Detailed Report</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Download a comprehensive PDF breakdown of your taxes and savings.
              </p>
              <div className="w-full">
                <PDFReport taxData={taxData} gstData={gstData} userProfile={userProfile} />
              </div>
            </div>

            {/* 3. SHARE RESULTS */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">🔗</span>
                </div>
                <h3 className="text-lg font-bold text-white">Share Results</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Share your tax analysis with friends.
              </p>
              <ShareResults taxData={taxData} gstData={gstData} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}