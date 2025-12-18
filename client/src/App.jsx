// client/src/App.jsx
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // <--- CRITICAL FIX
import { AuthProvider, useAuth } from './context/AuthContext';

// --- UTILS ---
import { calculateTax, calculateGSTImpact, EXPENSE_ITEMS } from './utils/taxLogic';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

// --- MODULES ---
// ⚠️ UPDATED IMPORTS TO MATCH YOUR FILE STRUCTURE
import Dashboard from './modules/Dashboard';
import IncomeTaxCalc from './modules/IncomeTax';        // You renamed the file to IncomeTax.jsx
import GSTModule from './modules/GSTCalculator';        // You renamed the file to GSTCalculator.jsx
import PolicySimulator from './modules/PolicySimulator';
import LearnHub from './modules/LearnHub';
import InflationModule from './modules/InflationModule';

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(true);

  // --- 1. GLOBAL STATE: INCOME TAX ---
  const [taxInputs, setTaxInputs] = useState({
    grossIncome: 1200000,
    isSalaried: true,
    deductions: {
       section80C: 150000,
       section80D: 25000,
       section80CCD1B: 0,
       homeLoanInterest: 0,
       hra: 0
    }
  });

  // --- 2. GLOBAL STATE: GST EXPENSES ---
  const [gstExpenses, setGstExpenses] = useState(EXPENSE_ITEMS);

  // --- 3. REAL-TIME CALCULATIONS ---
  const taxResult = useMemo(() => calculateTax(taxInputs), [taxInputs]);
  const gstImpact = useMemo(() => calculateGSTImpact(gstExpenses), [gstExpenses]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {!currentUser && showAuthModal && (
        <AuthModal onGuestAccess={() => setShowAuthModal(false)} />
      )}
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <Dashboard 
             taxInputs={taxInputs} 
             newRegimeTax={taxResult.newRegime}
             oldRegimeTax={taxResult.oldRegime}
             betterRegime={taxResult.betterRegime}
             taxSavings={taxResult.savings}
             gstImpact={gstImpact}
             setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'income-tax' && (
          <IncomeTaxCalc 
            inputs={taxInputs} 
            setInputs={setTaxInputs} 
            result={taxResult} 
          />
        )}

        {activeTab === 'gst' && (
          <GSTModule 
            expenses={gstExpenses} 
            setExpenses={setGstExpenses} 
            result={gstImpact} 
          />
        )}

        {activeTab === 'policy-sim' && (
          <PolicySimulator 
            taxInputs={taxInputs} 
            gstImpact={gstImpact} 
            newRegimeTax={taxResult.newRegime} 
          />
        )}

        {activeTab === 'inflation' && (
          <InflationModule gstImpact={gstImpact} />
        )}

        {activeTab === 'learn' && (
           <LearnHub />
        )}

      </main>
    </div>
  );
}

export default function App() {
  return (
    // ⬇️ THIS ROUTER WRAPPER WAS MISSING
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}