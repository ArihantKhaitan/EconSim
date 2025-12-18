// client/src/modules/InflationModule.jsx
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- 1. EXPANDED DATASET (Simulating 1 Year) ---
const FULL_MACRO_DATA = [
  { month: 'Jan', cpi: 5.1, core: 3.5, superCore: 2.1 },
  { month: 'Feb', cpi: 5.0, core: 3.4, superCore: 2.0 },
  { month: 'Mar', cpi: 4.8, core: 3.2, superCore: 1.9 },
  { month: 'Apr', cpi: 4.7, core: 3.1, superCore: 1.8 },
  { month: 'May', cpi: 4.8, core: 3.0, superCore: 1.8 },
  { month: 'Jun', cpi: 5.0, core: 3.1, superCore: 1.9 },
  { month: 'Jul', cpi: 3.5, core: 2.0, superCore: 1.2 },
  { month: 'Aug', cpi: 3.7, core: 2.2, superCore: 1.1 },
  { month: 'Sep', cpi: 3.2, core: 1.9, superCore: 0.9 },
  { month: 'Oct', cpi: 2.6, core: 1.8, superCore: 0.2 },
  { month: 'Nov', cpi: 4.4, core: 2.4, superCore: 0.7 },
  { month: 'Dec', cpi: 5.2, core: 2.8, superCore: 1.0 }, // Projected
];

const InflationCard = ({ title, value, description, color }) => {
  const styles = {
    red:    { border: 'border-red-500/30',    text: 'text-red-400',    bg: 'hover:shadow-red-900/10' },
    orange: { border: 'border-orange-500/30', text: 'text-orange-400', bg: 'hover:shadow-orange-900/10' },
    blue:   { border: 'border-blue-500/30',   text: 'text-blue-400',   bg: 'hover:shadow-blue-900/10' },
  };
  
  const theme = styles[color] || styles.red;

  return (
    <div className={`bg-slate-900/50 border ${theme.border} p-5 rounded-2xl h-full flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg ${theme.bg}`}>
      <div>
        <h4 className={`${theme.text} text-xs font-bold uppercase tracking-widest mb-2`}>{title}</h4>
        <div className="text-3xl font-black text-white mb-3">{value}%</div>
      </div>
      <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-800/50 pt-3">
        {description}
      </p>
    </div>
  );
};

export default function InflationModule({ gstImpact }) {
  const [hasRationCard, setHasRationCard] = useState(false);
  // --- 2. TIME RANGE STATE ---
  const [timeRange, setTimeRange] = useState('6M'); // 1M, 3M, 6M, 1Y

  // --- 3. FILTER LOGIC ---
  const filteredData = useMemo(() => {
    const total = FULL_MACRO_DATA.length;
    if (timeRange === '1M') return FULL_MACRO_DATA.slice(total - 2);
    if (timeRange === '3M') return FULL_MACRO_DATA.slice(total - 3);
    if (timeRange === '6M') return FULL_MACRO_DATA.slice(total - 6);
    return FULL_MACRO_DATA; // 1Y
  }, [timeRange]);

  // Calculation Logic
  const baseExpenses = gstImpact.totalExpense;
  const foodInflationRate = hasRationCard ? 0.02 : 0.08; 
  const fuelInflationRate = 0.05; 
  const coreInflationRate = 0.024; 

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
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-8 rounded-3xl border border-red-500/30 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse-slow"></div>
         <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
           Inflation Tracker 🎈
         </h1>
         <p className="text-slate-300 relative z-10 max-w-2xl">
           Understand how macro trends like "Core Inflation" and supply shocks affect your wallet.
         </p>
      </div>

      {/* MACRO DATA CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InflationCard 
            title="Headline CPI" value="4.4" color="red" 
            description="Overall price rise. High due to volatile food prices." 
        />
        <InflationCard 
            title="Core Inflation" value="2.4" color="orange" 
            description="Excludes volatile food & fuel. Shows true demand." 
        />
         <InflationCard 
            title="Super-Core" value="0.71" color="blue" 
            description="Excludes petrol, diesel, gold. Very low." 
        />
      </div>

      {/* SPLIT SECTION: CHART + PERSONAL IMPACT */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT: MACRO CHART (2/3 Width) */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-full min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Macro Inflation Trends</h3>
            
            {/* --- 4. TIME RANGE SELECTOR --- */}
            <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
              {['1M', '3M', '6M', '1Y'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    timeRange === range 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="cpi" name="Headline CPI" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                <Line type="monotone" dataKey="core" name="Core Inflation" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} />
                <Line type="monotone" dataKey="superCore" name="Super-Core" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: PERSONAL IMPACT (1/3 Width) */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-700 rounded-2xl p-6 flex flex-col gap-5 h-full">
            <div className="border-b border-slate-700 pb-4">
               <h2 className="text-xl font-bold text-white">📉 Personal Impact</h2>
               <p className="text-xs text-slate-400 mt-1">Based on your expense basket</p>
            </div>

            {/* Ration Card Toggle */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">🛡️ Ration Card?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={hasRationCard} onChange={(e) => setHasRationCard(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                    Protect yourself from the current 8% food inflation spike (rice/veg supply shock).
                </p>
            </div>

            {/* Warning Box */}
            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <h4 className="font-bold text-red-400 text-xs mb-1 uppercase tracking-wider">Market Alert</h4>
                <p className="text-xs text-slate-300">
                   Vegetable prices up due to supply shock. Fuel prices up 5%.
                </p>
            </div>

            {/* Results Box */}
            <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center shadow-inner">
                 <h4 className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">Your Personal Inflation</h4>
                 <div className={`text-4xl font-black mb-2 ${personalInflationRate > 4 ? 'text-red-500' : 'text-orange-400'}`}>
                    {personalInflationRate.toFixed(2)}%
                 </div>
                 <div className="text-slate-300 text-sm mb-4">
                    Extra monthly cost: <br/>
                    <span className="font-bold text-white text-lg">₹{Math.round(extraCost).toLocaleString('en-IN')}</span>
                 </div>
                 
                 {hasRationCard ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-full border border-emerald-500/20 font-bold">
                        🛡️ Protected from Food Shock
                    </span>
                 ) : (
                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] px-2 py-1 rounded-full border border-red-500/20 font-bold">
                        ⚠️ Fully Exposed to Shock
                    </span>
                 )}
            </div>
        </div>

      </div>
    </div>
  );
}