// client/src/modules/InflationModule.jsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Hardcoded data inspired by the article image
const macroData = [
  { month: 'Jul', cpi: 3.5, core: 2.0, superCore: 1.2 },
  { month: 'Aug', cpi: 3.7, core: 2.2, superCore: 1.1 },
  { month: 'Sep', cpi: 3.2, core: 1.9, superCore: 0.9 },
  { month: 'Oct', cpi: 2.6, core: 1.8, superCore: 0.2 },
  { month: 'Nov', cpi: 4.4, core: 2.4, superCore: 0.7 }, // Data points from image
];

// Helper component for Metric Cards
const InflationCard = ({ title, value, description, color }) => (
  <div className={`bg-slate-900/50 border border-${color}-500/30 p-4 rounded-2xl`}>
    <h4 className={`text-${color}-400 text-sm font-bold uppercase mb-1`}>{title}</h4>
    <div className="text-2xl font-bold text-white mb-1">{value}%</div>
    <p className="text-slate-400 text-xs">{description}</p>
  </div>
);

export default function InflationModule({ gstImpact }) {
  const [hasRationCard, setHasRationCard] = useState(false);

  // 1. Calculate Personal Spending Basket & Inflation Impact
  const baseExpenses = gstImpact.totalExpense;
  
  // Simulation: Food prices fluctuate more. Ration card protects from this.
  const foodInflationRate = hasRationCard ? 0.02 : 0.08; // 2% vs 8% shock
  const fuelInflationRate = 0.05; // 5% shock
  const coreInflationRate = 0.024; // 2.4% based on data

  // Assuming rough breakdown of expenses for simulation
  const foodShare = baseExpenses * 0.30; 
  const fuelShare = baseExpenses * 0.15;
  const otherShare = baseExpenses * 0.55;

  const inflatedFood = foodShare * (1 + foodInflationRate);
  const inflatedFuel = fuelShare * (1 + fuelInflationRate);
  const inflatedOther = otherShare * (1 + coreInflationRate);

  const totalInflatedExpense = inflatedFood + inflatedFuel + inflatedOther;
  const personalInflationRate = ((totalInflatedExpense - baseExpenses) / baseExpenses) * 100;
  const extraCost = totalInflatedExpense - baseExpenses;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-8 rounded-3xl border border-red-500/30 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse-slow"></div>
         <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
           Inflation Tracker 🎈
         </h1>
         <p className="text-slate-300 relative z-10 max-w-2xl">
           Understand how macro trends like "Core Inflation" and supply shocks (e.g., Rice production) affect your personal purchasing power.
         </p>
      </div>

      {/* MACRO DATA SECTION (Based on Image Data) */}
      <div className="grid md:grid-cols-3 gap-4">
        <InflationCard 
            title="Headline CPI" 
            value="4.4" 
            color="red" 
            description="Overall price rise. High due to volatile food prices." 
        />
        <InflationCard 
            title="Core Inflation" 
            value="2.4" 
            color="orange" 
            description="Excludes volatile food and fuel prices for a clearer trend." 
        />
         <InflationCard 
            title="Super-Core" 
            value="0.71" 
            color="blue" 
            description="Excludes petrol, diesel, gold, and silver. Very low indicating weak demand." 
        />
      </div>

      {/* CHART SECTION */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-80">
        <h3 className="text-lg font-bold text-white mb-4">Macro Inflation Trends (Last 5 Months)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={macroData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
            <Legend />
            <Line type="monotone" dataKey="cpi" name="Headline CPI" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="core" name="Core Inflation" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="superCore" name="Super-Core" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PERSONAL IMPACT SECTION (Social Impact Focus) */}
      <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">📉 Your Personal Buying Power Impact</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
            {/* CONTROLS */}
            <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">🛡️ Social Protection</h4>
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-slate-300">Do you hold a **Ration Card**?</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only peer" checked={hasRationCard} onChange={(e) => setHasRationCard(e.target.checked)} />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </div>
                    </label>
                    <p className="text-xs text-slate-400 mt-2">Ration cards protect you from food supply shocks (e.g., bad rice production).</p>
                </div>

                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <h4 className="font-bold text-red-400 mb-1">Current Scenario Warning</h4>
                    <p className="text-sm text-slate-300">
                        Food prices are volatile right now due to supply issues. Fuel prices are also up 5%.
                    </p>
                </div>
            </div>

            {/* RESULTS CARD */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center">
                 <h4 className="text-slate-400 text-sm uppercase font-bold mb-2">Your Personal Inflation Rate</h4>
                 <div className={`text-4xl font-black mb-1 ${personalInflationRate > 4 ? 'text-red-500' : 'text-orange-400'}`}>
                    {personalInflationRate.toFixed(1)}%
                 </div>
                 <p className="text-slate-300 mb-4">
                    To maintain your current lifestyle, you need to spend an extra <span className="font-bold text-white">₹{Math.round(extraCost).toLocaleString('en-IN')}</span> per month.
                 </p>
                 
                 {hasRationCard && (
                    <div className="bg-emerald-500/20 text-emerald-300 text-sm p-3 rounded-lg flex items-center gap-2">
                        <span>🛡️</span> Your Ration Card is shielding you from ~6% food price spikes.
                    </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}