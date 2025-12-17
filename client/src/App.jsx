import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Dashboard from './modules/Dashboard';
import IncomeTax from './modules/IncomeTax';
import GSTCalculator from './modules/GSTCalculator';
import PolicySimulator from './modules/PolicySimulator';
import LearnHub from './modules/LearnHub';
import Login from './modules/Login';
import Signup from './modules/Signup';

// Logic
import { EXPENSE_ITEMS, calculateNewRegimeTax, calculateOldRegimeTax, calculateGSTImpact } from './utils/taxLogic';

function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [taxInputs, setTaxInputs] = useState({
    grossIncome: 1200000, isSalaried: true,
    deductions: { section80C: 150000, section80D: 25000, section80CCD1B: 50000, hra: 0, homeLoanInterest: 0 }
  });
  const [gstExpenses, setGstExpenses] = useState(EXPENSE_ITEMS.map(item => ({ ...item, amount: item.avgMonthly })));

  const newRegimeTax = useMemo(() => calculateNewRegimeTax(taxInputs.grossIncome, taxInputs.isSalaried), [taxInputs.grossIncome, taxInputs.isSalaried]);
  const oldRegimeTax = useMemo(() => calculateOldRegimeTax(taxInputs.grossIncome, taxInputs.deductions, taxInputs.isSalaried), [taxInputs.grossIncome, taxInputs.deductions, taxInputs.isSalaried]);
  const betterRegime = newRegimeTax.totalTax <= oldRegimeTax.totalTax ? 'new' : 'old';
  const taxSavings = Math.abs(newRegimeTax.totalTax - oldRegimeTax.totalTax);
  const gstImpact = useMemo(() => calculateGSTImpact(gstExpenses), [gstExpenses]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      {/* NAVBAR now handles the profile and logout buttons */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard taxInputs={taxInputs} setActiveTab={setActiveTab} newRegimeTax={newRegimeTax} oldRegimeTax={oldRegimeTax} betterRegime={betterRegime} taxSavings={taxSavings} gstImpact={gstImpact} />}
        {activeTab === 'income-tax' && <IncomeTax taxInputs={taxInputs} setTaxInputs={setTaxInputs} newRegimeTax={newRegimeTax} oldRegimeTax={oldRegimeTax} betterRegime={betterRegime} taxSavings={taxSavings} />}
        {activeTab === 'gst' && <GSTCalculator gstExpenses={gstExpenses} setGstExpenses={setGstExpenses} gstImpact={gstImpact} />}
        {activeTab === 'policy-sim' && <PolicySimulator taxInputs={taxInputs} gstImpact={gstImpact} newRegimeTax={newRegimeTax} />}
        {activeTab === 'learn' && <LearnHub />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}