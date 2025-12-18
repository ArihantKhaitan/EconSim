// client/src/modules/PolicySimulator.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; 

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PolicySimulator({ taxInputs, gstImpact, newRegimeTax }) {
  // --- STATE ---
  const [policySimulation, setPolicySimulation] = useState({ 
    gstChange: 0, 
    incomeTaxChange: 0, 
    fuelTaxChange: 0,
    subsidyChange: 0 
  });
  
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // New: Toggle for Game Mode
  const [isGameMode, setIsGameMode] = useState(false);
  
  const { currentUser } = useAuth();

  // --- CALCULATIONS ---
  // 1. Calculate Public Approval (For Game Mode)
  const calculateApprovalRating = () => {
    let base = 50; 
    base -= (policySimulation.gstChange * 2);      // Hate GST hikes
    base -= (policySimulation.incomeTaxChange * 3); // Hate Tax hikes
    base += (policySimulation.subsidyChange / 500); // Love Subsidies
    base -= (policySimulation.fuelTaxChange * 5);   // Hate Fuel hikes
    return Math.min(100, Math.max(0, Math.round(base)));
  };
  const approvalRating = calculateApprovalRating();

  // Get approval message
  const getApprovalMessage = () => {
    if (approvalRating >= 80) return { emoji: '🎉', text: 'National Hero!', desc: 'People love your policies!' };
    if (approvalRating >= 60) return { emoji: '👍', text: 'Good Job!', desc: 'Most people are happy' };
    if (approvalRating >= 40) return { emoji: '😐', text: 'Meh...', desc: 'People are neutral' };
    if (approvalRating >= 20) return { emoji: '😠', text: 'Angry Public', desc: 'Protests expected!' };
    return { emoji: '🚨', text: 'CRISIS!', desc: 'Riots in the streets!' };
  };

  // 2. Calculate Net Financial Impact (For Professional Mode)
  const calculateNetImpact = () => {
    return Math.round(policySimulation.gstChange * gstImpact.totalGST / 100) + 
           Math.round(policySimulation.incomeTaxChange * newRegimeTax.totalTax / 100 / 12) + 
           (policySimulation.fuelTaxChange * 100) - 
           policySimulation.subsidyChange;
  };
  const netImpact = calculateNetImpact();

  // Load Saved Data
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
          subsidyChange: policySimulation.subsidyChange 
        })
      });
      const data = await response.json();
      setAiExplanation(data.explanation || "AI service unavailable.");
    } catch (error) {
      setAiExplanation("Error connecting to AI Server.");
    }
    setLoading(false);
  };

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

  const approvalMsg = getApprovalMessage();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* --- HEADER SECTION --- */}
      <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 ${
        isGameMode 
          ? 'bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/20 border-indigo-500/30' 
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        
        {/* Game Mode Background Pattern */}
        {isGameMode && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              {isGameMode ? '🎮 Finance Minister Game' : '📊 Policy Impact Simulator'}
            </h2>
            <p className={`${isGameMode ? 'text-indigo-200' : 'text-slate-400'} mt-2 text-sm max-w-2xl`}>
              {isGameMode 
                ? 'You are the Finance Minister of India! Change policies and see if people love you or hate you 😄' 
                : 'Professional Mode: Analyze the net financial impact of policy changes on your monthly budget.'}
            </p>
          </div>

          {/* MODE TOGGLE SWITCH */}
          <div className="flex bg-slate-800 p-1 rounded-xl shadow-lg">
             <button 
               onClick={() => setIsGameMode(false)}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                 !isGameMode 
                   ? 'bg-slate-600 text-white shadow-lg' 
                   : 'text-slate-400 hover:text-white'
               }`}
             >
               🏢 Professional
             </button>
             <button 
               onClick={() => setIsGameMode(true)}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                 isGameMode 
                   ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                   : 'text-slate-400 hover:text-white'
               }`}
             >
               🎮 Game Mode
             </button>
          </div>
        </div>

        {/* GAME MODE EXCLUSIVE: APPROVAL RATING WITH ANIMATION */}
        {isGameMode && (
           <div className="relative z-10 mt-6 pt-6 border-t border-indigo-500/30">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Approval Rating Gauge */}
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20">
                  <div className="text-center">
                      <div className="text-xs text-indigo-300 uppercase font-bold tracking-widest mb-3">
                        Public Approval Rating
                      </div>
                      
                      {/* Big Number with Animation */}
                      <div className={`text-6xl font-black mb-2 transition-all duration-500 ${
                        approvalRating > 60 ? 'text-emerald-400' : 
                        approvalRating < 40 ? 'text-red-400' : 
                        'text-yellow-400'
                      }`}>
                          {approvalRating}%
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-800 rounded-full h-3 mb-3 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            approvalRating > 60 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                            approvalRating < 40 ? 'bg-gradient-to-r from-red-500 to-orange-400' :
                            'bg-gradient-to-r from-yellow-500 to-amber-400'
                          }`}
                          style={{ width: `${approvalRating}%` }}
                        ></div>
                      </div>
                      
                      {/* Status Message */}
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <span className="text-3xl">{approvalMsg.emoji}</span>
                        <div className="text-left">
                          <div className="font-bold text-white">{approvalMsg.text}</div>
                          <div className="text-xs text-slate-400">{approvalMsg.desc}</div>
                        </div>
                      </div>
                  </div>
                </div>

                {/* Quick Tips Card */}
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                  <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">
                    💡 Pro Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">↑</span>
                      <span><strong>Increase taxes:</strong> People get angry 😠</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">↓</span>
                      <span><strong>Lower taxes:</strong> People celebrate 🎉</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">💰</span>
                      <span><strong>Give subsidies:</strong> Instant popularity boost!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">⚠️</span>
                      <span><strong>Balance is key:</strong> Too much of anything = chaos!</span>
                    </li>
                  </ul>
                </div>
              </div>
           </div>
        )}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className={`rounded-2xl p-8 shadow-xl border transition-all ${
        isGameMode 
          ? 'bg-gradient-to-br from-slate-900/90 to-indigo-900/30 border-indigo-500/20' 
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* --- CONTROLS --- */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {isGameMode ? '🎯 Your Policy Decisions' : '⚡ Policy Parameters'}
            </h3>
            
            {/* GST SLIDER */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <label className="font-medium text-white">🛒 GST Rate Change</label>
                  {isGameMode && <p className="text-xs text-slate-400 mt-1">Tax on shopping & services</p>}
                </div>
                <span className={`font-mono text-lg font-bold ${
                  policySimulation.gstChange > 0 ? 'text-red-400' : 
                  policySimulation.gstChange < 0 ? 'text-emerald-400' : 
                  'text-slate-400'
                }`}>
                  {policySimulation.gstChange > 0 ? '+' : ''}{policySimulation.gstChange}%
                </span>
              </div>
              <input 
                type="range" 
                min="-10" 
                max="10" 
                value={policySimulation.gstChange} 
                onChange={(e) => setPolicySimulation({...policySimulation, gstChange: parseInt(e.target.value)})} 
                className="w-full accent-emerald-500 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              {isGameMode && (
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Lower (People Happy 😊)</span>
                  <span>Higher (People Angry 😡)</span>
                </div>
              )}
            </div>

            {/* INCOME TAX SLIDER */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <label className="font-medium text-white">💰 Income Tax Change</label>
                  {isGameMode && <p className="text-xs text-slate-400 mt-1">Tax on salaries & business income</p>}
                </div>
                <span className={`font-mono text-lg font-bold ${
                  policySimulation.incomeTaxChange > 0 ? 'text-red-400' : 
                  policySimulation.incomeTaxChange < 0 ? 'text-emerald-400' : 
                  'text-slate-400'
                }`}>
                  {policySimulation.incomeTaxChange > 0 ? '+' : ''}{policySimulation.incomeTaxChange}%
                </span>
              </div>
              <input 
                type="range" 
                min="-5" 
                max="5" 
                value={policySimulation.incomeTaxChange} 
                onChange={(e) => setPolicySimulation({...policySimulation, incomeTaxChange: parseInt(e.target.value)})} 
                className="w-full accent-emerald-500 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              {isGameMode && (
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Tax Relief 👍</span>
                  <span>Tax Increase 👎</span>
                </div>
              )}
            </div>

            {/* FUEL TAX SLIDER */}
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <label className="font-medium text-white">⛽ Fuel Price Change</label>
                  {isGameMode && <p className="text-xs text-slate-400 mt-1">Petrol & Diesel tax per liter</p>}
                </div>
                <span className={`font-mono text-lg font-bold ${
                  policySimulation.fuelTaxChange > 0 ? 'text-red-400' : 
                  policySimulation.fuelTaxChange < 0 ? 'text-emerald-400' : 
                  'text-slate-400'
                }`}>
                  {policySimulation.fuelTaxChange > 0 ? '+' : ''}₹{policySimulation.fuelTaxChange}/L
                </span>
              </div>
              <input 
                type="range" 
                min="-10" 
                max="10" 
                value={policySimulation.fuelTaxChange} 
                onChange={(e) => setPolicySimulation({...policySimulation, fuelTaxChange: parseInt(e.target.value)})} 
                className="w-full accent-emerald-500 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              {isGameMode && (
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Cheaper Fuel 🚗</span>
                  <span>Expensive Fuel 💸</span>
                </div>
              )}
            </div>

            {/* SUBSIDY SLIDER - HIGHLIGHTED */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 rounded-xl border-2 border-emerald-500/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <label className="font-medium text-emerald-300 flex items-center gap-2">
                    🎁 Government Subsidy
                    {isGameMode && <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full">Free Money!</span>}
                  </label>
                  {isGameMode && <p className="text-xs text-emerald-200/60 mt-1">Give people monthly benefits</p>}
                </div>
                <span className="font-mono text-lg font-bold text-emerald-400">
                  +{formatCurrency(policySimulation.subsidyChange)}/mo
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={policySimulation.subsidyChange} 
                onChange={(e) => setPolicySimulation({...policySimulation, subsidyChange: parseInt(e.target.value)})} 
                className="w-full accent-emerald-500 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
              />
              {isGameMode && (
                <div className="flex justify-between text-xs text-emerald-400/60 mt-2">
                  <span>No Benefits</span>
                  <span>Maximum Benefits ⭐</span>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setPolicySimulation({ gstChange: 0, incomeTaxChange: 0, fuelTaxChange: 0, subsidyChange: 0 })} 
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-bold border border-slate-700"
                >
                  🔄 Reset All
                </button>
                <button 
                  onClick={saveScenario} 
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-bold text-white shadow-lg shadow-indigo-500/30"
                >
                  {saveStatus || '💾 Save Scenario'}
                </button>
            </div>
          </div>

          {/* --- IMPACT VISUALIZATION --- */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {isGameMode ? '📊 What Happens to People?' : '🎯 Projected Impact'}
            </h3>
            
            <div className={`p-6 rounded-2xl border shadow-inner ${
              isGameMode 
                ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border-indigo-500/30' 
                : 'bg-slate-800 border-slate-700'
            }`}>
               
               {/* GAME VIEW: Fun & Visual */}
               {isGameMode && (
                  <div className="space-y-6">
                      {/* Big Impact Display */}
                      <div className="text-center py-4">
                          <h4 className="font-semibold mb-4 text-indigo-300 text-sm uppercase tracking-wide">
                            💸 Monthly Wallet Impact
                          </h4>
                          <div className={`text-5xl md:text-6xl font-black mb-3 transition-all duration-500 ${
                            netImpact > 0 ? 'text-red-500' : 
                            netImpact < 0 ? 'text-emerald-400' : 
                            'text-slate-400'
                          }`}>
                              {netImpact > 0 ? '+' : ''}{formatCurrency(netImpact)}
                          </div>
                          
                          {/* Explanation in Simple Words */}
                          <div className={`inline-block px-6 py-3 rounded-2xl text-sm font-bold border-2 ${
                            netImpact > 0 
                              ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                              : netImpact < 0 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-700/30 text-slate-400 border-slate-600'
                          }`}>
                             {netImpact > 0 && '😢 People LOSE this money every month'}
                             {netImpact < 0 && '🎉 People SAVE this money every month!'}
                             {netImpact === 0 && '😐 No change in people\'s wallets'}
                          </div>
                      </div>
                      
                      {/* Simple Breakdown */}
                      <div className="bg-slate-900/60 rounded-xl p-5 space-y-3">
                          <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Quick Breakdown:</h5>
                          
                          {policySimulation.gstChange !== 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span>Shopping becomes {policySimulation.gstChange > 0 ? 'expensive' : 'cheaper'}</span>
                              <span className={policySimulation.gstChange > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                {formatCurrency(Math.round(policySimulation.gstChange * gstImpact.totalGST / 100))}
                              </span>
                            </div>
                          )}
                          
                          {policySimulation.incomeTaxChange !== 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span>Salary {policySimulation.incomeTaxChange > 0 ? 'reduced' : 'increased'}</span>
                              <span className={policySimulation.incomeTaxChange > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                {formatCurrency(Math.round(policySimulation.incomeTaxChange * newRegimeTax.totalTax / 100 / 12))}
                              </span>
                            </div>
                          )}
                          
                          {policySimulation.fuelTaxChange !== 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span>Fuel {policySimulation.fuelTaxChange > 0 ? 'costlier' : 'cheaper'}</span>
                              <span className={policySimulation.fuelTaxChange > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                {formatCurrency(policySimulation.fuelTaxChange * 100)}
                              </span>
                            </div>
                          )}
                          
                          {policySimulation.subsidyChange > 0 && (
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700">
                              <span className="text-emerald-400">💰 Free benefits given</span>
                              <span className="text-emerald-400 font-bold">-{formatCurrency(policySimulation.subsidyChange)}</span>
                            </div>
                          )}
                      </div>
                  </div>
               )}

               {/* PROFESSIONAL VIEW: Detailed Breakdown */}
               {!isGameMode && (
                  <>
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
                            <span className="flex items-center gap-2 text-emerald-400 font-bold">🎁 Subsidy</span>
                            <span className="text-emerald-400 font-bold">- {formatCurrency(policySimulation.subsidyChange)}</span>
                        </div>
                        
                        <div className="bg-slate-900 p-4 rounded-xl mt-4 border border-slate-700 flex justify-between items-center">
                            <span className="font-bold text-white">Net Monthly Impact</span>
                            <span className={`font-mono text-xl font-bold ${netImpact > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {netImpact > 0 ? '+' : ''}{formatCurrency(netImpact)}
                            </span>
                        </div>
                     </div>
                  </>
               )}
            </div>

            {/* AI Analysis Button */}
            <div className="pt-2">
                <button 
                  onClick={getAIExplanation}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isGameMode
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 shadow-purple-900/30'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-indigo-900/20'
                  }`}
                >
                  {loading ? (
                    <span className="animate-pulse">🤖 {isGameMode ? 'Consulting Advisors...' : 'Analyzing...'}</span>
                  ) : (
                    <span>✨ {isGameMode ? 'Get AI Advice' : 'Ask AI Opinion'}</span>
                  )}
                </button>

                {aiExplanation && (
                  <div className={`mt-4 p-5 rounded-xl border animate-fade-in ${
                    isGameMode
                      ? 'bg-purple-900/20 border-purple-500/30'
                      : 'bg-slate-800 border-indigo-500/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💭</span>
                      <p className="text-slate-300 text-sm leading-relaxed flex-1">{aiExplanation}</p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}