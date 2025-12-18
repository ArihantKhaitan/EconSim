// client/src/modules/PolicySimulator.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; 

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PolicySimulator({ taxInputs, gstImpact, newRegimeTax }) {
  // Added subsidyChange to state
  const [policySimulation, setPolicySimulation] = useState({ 
    gstChange: 0, 
    incomeTaxChange: 0, 
    fuelTaxChange: 0,
    subsidyChange: 0 
  });
  
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const { currentUser } = useAuth();

  // Load saved data on mount
  useEffect(() => {
    async function loadSavedData() {
        if (currentUser) {
            try {
                const docRef = doc(db, "user_scenarios", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.simulation) setPolicySimulation(data.simulation);
                    if (data.aiAnalysis) setAiExplanation(data.aiAnalysis);
                }
            } catch (e) {
                console.error("Error loading data", e);
            }
        }
    }
    loadSavedData();
  }, [currentUser]);

  // AI Logic
  const getAIExplanation = async () => {
    setLoading(true);
    setAiExplanation('');
    try {
      const response = await fetch('http://localhost:5000/api/explain-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: taxInputs.grossIncome,
          gstChange: policySimulation.gstChange,
          taxChange: policySimulation.incomeTaxChange,
          fuelChange: policySimulation.fuelTaxChange,
          // Sending subsidy data to AI
          subsidyChange: policySimulation.subsidyChange 
        })
      });
      const data = await response.json();
      setAiExplanation(data.explanation || "AI service unavailable.");
    } catch (error) {
      setAiExplanation("Error connecting to AI Server. Make sure backend is running.");
    }
    setLoading(false);
  };

  // Save Logic
  const saveScenario = async () => {
    if (!currentUser) return alert("Please Log In to save!");
    setSaveStatus('Saving...');
    try {
      await setDoc(doc(db, "user_scenarios", currentUser.uid), {
        email: currentUser.email,
        savedAt: serverTimestamp(),
        simulation: policySimulation,
        income: taxInputs.grossIncome,
        aiAnalysis: aiExplanation
      });
      setSaveStatus('✅ Saved!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      console.error("Error saving:", e);
      setSaveStatus('❌ Error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Policy Impact Simulator</h2>
          <p className="text-slate-400">Sandbox Mode: Adjust sliders to see future impacts</p>
        </div>
        <button 
          onClick={saveScenario}
          className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 rounded-lg text-sm font-medium transition-all"
        >
          {saveStatus || (currentUser ? '💾 Save Scenario' : '🔒 Login to Save')}
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold flex items-center gap-2">⚡ Policy Parameters</h3>
            
            {/* GST SLIDER */}
            <div>
              <div className="flex justify-between mb-3"><label className="font-medium">GST Rate Change</label><span className={`font-mono text-lg ${policySimulation.gstChange > 0 ? 'text-red-400' : policySimulation.gstChange < 0 ? 'text-emerald-400' : ''}`}>{policySimulation.gstChange > 0 ? '+' : ''}{policySimulation.gstChange}%</span></div>
              <input type="range" min="-10" max="10" value={policySimulation.gstChange} onChange={(e) => setPolicySimulation({...policySimulation, gstChange: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* INCOME TAX SLIDER */}
            <div>
              <div className="flex justify-between mb-3"><label className="font-medium">Income Tax Rate Change</label><span className={`font-mono text-lg ${policySimulation.incomeTaxChange > 0 ? 'text-red-400' : policySimulation.incomeTaxChange < 0 ? 'text-emerald-400' : ''}`}>{policySimulation.incomeTaxChange > 0 ? '+' : ''}{policySimulation.incomeTaxChange}%</span></div>
              <input type="range" min="-5" max="5" value={policySimulation.incomeTaxChange} onChange={(e) => setPolicySimulation({...policySimulation, incomeTaxChange: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* FUEL TAX SLIDER */}
            <div>
              <div className="flex justify-between mb-3"><label className="font-medium">Fuel Tax Change (₹/L)</label><span className={`font-mono text-lg ${policySimulation.fuelTaxChange > 0 ? 'text-red-400' : policySimulation.fuelTaxChange < 0 ? 'text-emerald-400' : ''}`}>{policySimulation.fuelTaxChange > 0 ? '+' : ''}₹{policySimulation.fuelTaxChange}</span></div>
              <input type="range" min="-10" max="10" value={policySimulation.fuelTaxChange} onChange={(e) => setPolicySimulation({...policySimulation, fuelTaxChange: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* NEW: SUBSIDY SLIDER */}
            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
              <div className="flex justify-between mb-3">
                <label className="font-medium text-emerald-300">Govt. Subsidy Benefit</label>
                <span className="font-mono text-lg text-emerald-400">+ {formatCurrency(policySimulation.subsidyChange)}/mo</span>
              </div>
              <input 
                type="range" min="0" max="5000" step="100"
                value={policySimulation.subsidyChange} 
                onChange={(e) => setPolicySimulation({...policySimulation, subsidyChange: parseInt(e.target.value)})} 
                className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
              />
              <p className="text-xs text-slate-400 mt-2">Increases in LPG, Electricity, or Food Security subsidies put money back in your pocket.</p>
            </div>

            <button onClick={() => setPolicySimulation({ gstChange: 0, incomeTaxChange: 0, fuelTaxChange: 0, subsidyChange: 0 })} className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-bold">Reset to Default</button>
          </div>

          {/* Impact Visualization */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">🎯 Projected Monthly Impact</h3>
            <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
               <h4 className="font-semibold mb-4 text-slate-300 text-sm uppercase tracking-wide">Cost Breakdown</h4>
               <div className="space-y-4">
                  <div className="flex justify-between text-sm items-center">
                    <span className="flex items-center gap-2">🛒 GST Impact</span>
                    <span className={policySimulation.gstChange > 0 ? 'text-red-400' : 'text-slate-400'}>{formatCurrency(Math.round(policySimulation.gstChange * gstImpact.totalGST / 100))}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="flex items-center gap-2">💰 Tax Impact</span>
                    <span className={policySimulation.incomeTaxChange > 0 ? 'text-red-400' : 'text-slate-400'}>{formatCurrency(Math.round(policySimulation.incomeTaxChange * newRegimeTax.totalTax / 100 / 12))}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="flex items-center gap-2">⛽ Fuel Impact</span>
                    <span className={policySimulation.fuelTaxChange > 0 ? 'text-red-400' : 'text-slate-400'}>{formatCurrency(policySimulation.fuelTaxChange * 100)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center pt-2 border-t border-dashed border-slate-700">
                    <span className="flex items-center gap-2 text-emerald-400 font-bold">🎁 Subsidy Benefit</span>
                    <span className="text-emerald-400 font-bold">- {formatCurrency(policySimulation.subsidyChange)}</span>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-xl mt-4 border border-slate-700">
                    {(() => {
                      const total = Math.round(policySimulation.gstChange * gstImpact.totalGST / 100) + 
                                    Math.round(policySimulation.incomeTaxChange * newRegimeTax.totalTax / 100 / 12) + 
                                    (policySimulation.fuelTaxChange * 100) - 
                                    policySimulation.subsidyChange;
                      return (
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-white">Net Monthly Impact</span>
                            <span className={`font-mono text-xl font-bold ${total > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {total > 0 ? '+' : ''}{formatCurrency(total)}
                            </span>
                        </div>
                      );
                    })()}
                  </div>
               </div>
            </div>

            {/* AI Analysis Button */}
            <div className="pt-2">
                <button 
                  onClick={getAIExplanation}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                >
                  {loading ? <span className="animate-pulse">🤖 Thinking...</span> : <span>✨ Analyze this Scenario</span>}
                </button>

                {aiExplanation && (
                  <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-indigo-500/30 animate-fade-in">
                    <h4 className="font-bold text-indigo-400 mb-2 text-xs uppercase tracking-wider">AI Insight</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{aiExplanation}</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}