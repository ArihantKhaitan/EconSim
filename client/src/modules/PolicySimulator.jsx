import React, { useState } from 'react';
import { formatCurrency } from '../utils/taxLogic';

export default function PolicySimulator({ taxInputs, gstImpact, newRegimeTax }) {
  const [policySimulation, setPolicySimulation] = useState({ gstChange: 0, incomeTaxChange: 0, fuelTaxChange: 0 });
  
  // AI State
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to call the backend
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
          fuelChange: policySimulation.fuelTaxChange
        })
      });
      
      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation("AI service is currently unavailable. Check server console.");
      }
    } catch (error) {
      setAiExplanation("Error connecting to AI Server. Is 'node index.js' running?");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-bold">Policy Impact Simulator</h2><p className="text-slate-400">See how policy changes affect your finances</p></div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold flex items-center gap-2">⚡ Adjust Policy Parameters</h3>
            
            <div>
              <div className="flex justify-between mb-3"><label className="font-medium">GST Rate Change</label><span className={`font-mono text-lg ${policySimulation.gstChange > 0 ? 'text-red-400' : policySimulation.gstChange < 0 ? 'text-emerald-400' : ''}`}>{policySimulation.gstChange > 0 ? '+' : ''}{policySimulation.gstChange}%</span></div>
              <input type="range" min="-10" max="10" value={policySimulation.gstChange} onChange={(e) => setPolicySimulation({...policySimulation, gstChange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
            </div>

            <div>
              <div className="flex justify-between mb-3"><label className="font-medium">Income Tax Rate Change</label><span className={`font-mono text-lg ${policySimulation.incomeTaxChange > 0 ? 'text-red-400' : policySimulation.incomeTaxChange < 0 ? 'text-emerald-400' : ''}`}>{policySimulation.incomeTaxChange > 0 ? '+' : ''}{policySimulation.incomeTaxChange}%</span></div>
              <input type="range" min="-5" max="5" value={policySimulation.incomeTaxChange} onChange={(e) => setPolicySimulation({...policySimulation, incomeTaxChange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
            </div>

            <div>
              <div className="flex justify-between mb-3"><label className="font-medium">Fuel Tax Change (₹/L)</label><span className={`font-mono text-lg ${policySimulation.fuelTaxChange > 0 ? 'text-red-400' : policySimulation.fuelTaxChange < 0 ? 'text-emerald-400' : ''}`}>{policySimulation.fuelTaxChange > 0 ? '+' : ''}₹{policySimulation.fuelTaxChange}</span></div>
              <input type="range" min="-10" max="10" value={policySimulation.fuelTaxChange} onChange={(e) => setPolicySimulation({...policySimulation, fuelTaxChange: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
            </div>

            <button onClick={() => setPolicySimulation({ gstChange: 0, incomeTaxChange: 0, fuelTaxChange: 0 })} className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">Reset to Current</button>
          </div>

          {/* Impact */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">🎯 Your Impact</h3>
            <div className="p-6 rounded-2xl bg-slate-800">
               <h4 className="font-semibold mb-4">Monthly Financial Impact</h4>
               <div className="space-y-4">
                  <div className="flex justify-between"><span>🛒 GST Impact</span><span>{formatCurrency(Math.round(policySimulation.gstChange * gstImpact.totalGST / 100))}</span></div>
                  <div className="flex justify-between"><span>💰 Tax Impact</span><span>{formatCurrency(Math.round(policySimulation.incomeTaxChange * newRegimeTax.totalTax / 100 / 12))}</span></div>
                  <div className="flex justify-between"><span>⛽ Fuel Impact</span><span>{formatCurrency(policySimulation.fuelTaxChange * 100)}</span></div>
                  
                  <div className="border-t border-slate-600 pt-4">
                    {(() => {
                      const total = Math.round(policySimulation.gstChange * gstImpact.totalGST / 100) + Math.round(policySimulation.incomeTaxChange * newRegimeTax.totalTax / 100 / 12) + policySimulation.fuelTaxChange * 100;
                      return <div className="flex justify-between"><span className="font-semibold">Net Monthly</span><span className={`font-mono text-xl font-bold ${total > 0 ? 'text-red-400' : total < 0 ? 'text-emerald-400' : ''}`}>{total >= 0 ? '+' : ''}{formatCurrency(total)}</span></div>;
                    })()}
                  </div>
               </div>
            </div>

            {/* AI BUTTON SECTION */}
            <div className="pt-4 border-t border-slate-800">
                <button 
                  onClick={getAIExplanation}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
                >
                  {loading ? (
                    <span className="animate-pulse">🤖 Analyzing with Gemini AI...</span>
                  ) : (
                    <><span>✨</span> Ask AI to Explain Impact</>
                  )}
                </button>

                {aiExplanation && (
                  <div className="mt-4 p-5 bg-slate-800 rounded-xl border border-purple-500/30 shadow-inner">
                    <h4 className="font-semibold text-purple-400 mb-2 text-sm uppercase tracking-wider">Gemini Analysis</h4>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{aiExplanation}</p>
                  </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}