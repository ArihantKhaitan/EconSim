// client/src/App.jsx
import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './modules/Dashboard';
import IncomeTax from './modules/IncomeTax';
import GSTCalculator from './modules/GSTCalculator';
import PolicySimulator from './modules/PolicySimulator';
import LearnHub from './modules/LearnHub';
import { EXPENSE_ITEMS, calculateNewRegimeTax, calculateOldRegimeTax, calculateGSTImpact } from './utils/taxLogic';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // ==================== GLOBAL STATE ====================
  const [taxInputs, setTaxInputs] = useState({
    grossIncome: 1200000,
    isSalaried: true,
    deductions: { section80C: 150000, section80D: 25000, section80CCD1B: 50000, hra: 0, homeLoanInterest: 0 }
  });

  const [gstExpenses, setGstExpenses] = useState(EXPENSE_ITEMS.map(item => ({ ...item, amount: item.avgMonthly })));

  // ==================== GLOBAL CALCULATIONS ====================
  // We calculate here so we can pass results to Dashboard AND specific tabs
  const newRegimeTax = useMemo(() => calculateNewRegimeTax(taxInputs.grossIncome, taxInputs.isSalaried), [taxInputs.grossIncome, taxInputs.isSalaried]);
  const oldRegimeTax = useMemo(() => calculateOldRegimeTax(taxInputs.grossIncome, taxInputs.deductions, taxInputs.isSalaried), [taxInputs.grossIncome, taxInputs.deductions, taxInputs.isSalaried]);
  
  const betterRegime = newRegimeTax.totalTax <= oldRegimeTax.totalTax ? 'new' : 'old';
  const taxSavings = Math.abs(newRegimeTax.totalTax - oldRegimeTax.totalTax);
  const gstImpact = useMemo(() => calculateGSTImpact(gstExpenses), [gstExpenses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            taxInputs={taxInputs}
            setActiveTab={setActiveTab}
            newRegimeTax={newRegimeTax}
            oldRegimeTax={oldRegimeTax}
            betterRegime={betterRegime}
            taxSavings={taxSavings}
            gstImpact={gstImpact}
          />
        )}
        
        {activeTab === 'income-tax' && (
          <IncomeTax 
            taxInputs={taxInputs} 
            setTaxInputs={setTaxInputs}
            newRegimeTax={newRegimeTax} 
            oldRegimeTax={oldRegimeTax}
            betterRegime={betterRegime}
            taxSavings={taxSavings}
          />
        )}
        
        {activeTab === 'gst' && (
          <GSTCalculator 
            gstExpenses={gstExpenses} 
            setGstExpenses={setGstExpenses}
            gstImpact={gstImpact}
          />
        )}
        
        {activeTab === 'policy-sim' && (
          <PolicySimulator 
            taxInputs={taxInputs}
            gstImpact={gstImpact}
            newRegimeTax={newRegimeTax}
          />
        )}
        
        {activeTab === 'learn' && <LearnHub />}
      </main>
    </div>
  );
}