// client/src/App.jsx
import React, { useState } from 'react';
import Dashboard from './modules/Dashboard';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';

// Import Modules
import IncomeTaxCalc from './modules/IncomeTax';       
import GSTModule from './modules/GSTCalculator';       
import PolicySimulator from './modules/PolicySimulator';
import InflationModule from './modules/InflationModule';
import LearnModule from './modules/LearnHub';
import SubsidyCalculator from './modules/SubsidyCalculator';
import ImportDutyCalculator from './modules/ImportDutyCalculator';
import SMEScenarios from './modules/SMEScenarios';

// Tax Logic Helpers
const calculateTax = (income) => {
  const newRegimeTax = income > 1200000 ? (income * 0.15) : (income * 0.10);
  const oldRegimeTax = income > 1200000 ? (income * 0.20) : (income * 0.15);
  
  return {
    newRegime: { 
        totalTax: newRegimeTax, 
        effectiveRate: (newRegimeTax/income)*100,
        netIncome: income - newRegimeTax,
        grossIncome: income,
        standardDeduction: 75000,
        taxableIncome: income - 75000
    },
    oldRegime: { 
        totalTax: oldRegimeTax, 
        effectiveRate: (oldRegimeTax/income)*100,
        netIncome: income - oldRegimeTax,
        grossIncome: income,
        totalDeductions: 150000,
        taxableIncome: income - 150000
    },
    betterRegime: newRegimeTax < oldRegimeTax ? 'new' : 'old',
    savings: Math.abs(newRegimeTax - oldRegimeTax)
  };
};

// ✅ UPDATED: Comprehensive Expenses List
const initialExpenses = [
  { id: 1, name: 'House Rent', amount: 18000, category: 'rent', gst: 0 },
  { id: 2, name: 'Groceries (Rice/Atta)', amount: 6000, category: 'essentials', gst: 0 },
  { id: 3, name: 'Packaged Food / Snacks', amount: 2500, category: 'food', gst: 12 },
  { id: 4, name: 'Zomato / Swiggy', amount: 3500, category: 'food', gst: 5 },
  { id: 5, name: 'Electricity Bill', amount: 1500, category: 'utilities', gst: 0 },
  { id: 6, name: 'Mobile & WiFi', amount: 1200, category: 'utilities', gst: 18 },
  { id: 7, name: 'Fuel (Petrol/Diesel)', amount: 4000, category: 'transport', gst: 0 },
  { id: 8, name: 'Uber / Ola', amount: 2000, category: 'transport', gst: 5 },
  { id: 9, name: 'Shopping (Clothes)', amount: 3000, category: 'shopping', gst: 12 },
  { id: 10, name: 'Electronics/Gadgets', amount: 2000, category: 'electronics', gst: 18 },
  { id: 11, name: 'Netflix / Spotify', amount: 800, category: 'entertainment', gst: 18 },
  { id: 12, name: 'Movie Tickets', amount: 1000, category: 'entertainment', gst: 18 },
  { id: 13, name: 'Medicines', amount: 1500, category: 'health', gst: 12 },
  { id: 14, name: 'Gym Membership', amount: 1500, category: 'health', gst: 18 },
  { id: 15, name: 'Personal Care', amount: 1000, category: 'shopping', gst: 18 },
];

function App() {
  const { currentUser, isGuest, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- STATE ---
  const [taxInputs, setTaxInputs] = useState({ grossIncome: 1200000 });
  const [gstExpenses, setGstExpenses] = useState(initialExpenses);
  
  // Derived State
  const taxResult = calculateTax(taxInputs.grossIncome);
  
  const gstResult = (() => {
    const totalGST = gstExpenses.reduce((sum, item) => sum + (item.amount * (item.gst / 100)), 0);
    const totalExpense = gstExpenses.reduce((sum, item) => sum + item.amount, 0);
    return {
        totalGST: Math.round(totalGST),
        totalExpense: totalExpense,
        effectiveGSTRate: totalExpense > 0 ? (totalGST / totalExpense) * 100 : 0
    };
  })();

  // AUTH GUARD
  if (!currentUser && !isGuest) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <AuthModal />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            taxInputs={taxInputs} 
            setActiveTab={setActiveTab}
            newRegimeTax={taxResult.newRegime}
            oldRegimeTax={taxResult.oldRegime}
            betterRegime={taxResult.betterRegime}
            taxSavings={taxResult.savings}
            gstImpact={gstResult}
          />
        );
      case 'income-tax':
        return <IncomeTaxCalc 
            inputs={taxInputs} 
            setInputs={setTaxInputs} 
            result={taxResult}
        />;
      case 'gst':
        return <GSTModule 
            expenses={gstExpenses}
            setExpenses={setGstExpenses}
            result={gstResult}
        />;
      case 'policy-sim':
        return <PolicySimulator taxInputs={taxInputs} gstImpact={gstResult} newRegimeTax={taxResult.newRegime} />;
      case 'inflation':
        return <InflationModule gstImpact={gstResult} />;
      case 'subsidies':
        return <SubsidyCalculator />;
      case 'import-duty':
        return <ImportDutyCalculator />;
      case 'sme-scenarios':
        return <SMEScenarios />;
      case 'learn':
        return <LearnModule />;
      default:
        return <Dashboard />;
    }
  };

  const userInitial = currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U';
  const userPhoto = currentUser?.photoURL;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* NAVBAR */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between py-3">
           
           {/* Logo */}
           <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block leading-none">EconSim</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">FinHack 2025</span>
              </div>
           </div>
           
           {/* Tabs */}
           <nav className="hidden md:flex gap-1 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50 overflow-x-auto">
              {[
                { name: 'Dashboard', id: 'dashboard' },
                { name: 'Income Tax', id: 'income-tax' },
                { name: 'GST', id: 'gst' },
                { name: 'Policy Sim', id: 'policy-sim' },
                { name: 'Inflation', id: 'inflation' },
                { name: 'Subsidies', id: 'subsidies' },
                { name: 'Import Duty', id: 'import-duty' },
                { name: 'SME', id: 'sme-scenarios' },
                { name: 'Learn', id: 'learn' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-slate-700 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
           </nav>

           {/* Profile */}
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 text-right">
                 <div>
                    <div className="text-sm font-bold text-white leading-none mb-1">
                      {isGuest ? 'Guest User' : currentUser?.displayName}
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                    </div>
                 </div>
                 
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-500 flex items-center justify-center overflow-hidden shadow-lg">
                    {userPhoto ? (
                      <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">{userInitial}</span>
                    )}
                 </div>
              </div>

              <div className="h-8 w-[1px] bg-slate-700 mx-2 hidden sm:block"></div>

              <button 
                onClick={logout}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                {isGuest ? 'Exit' : 'Logout'}
              </button>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;