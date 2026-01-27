// client/src/modules/InflationModule.jsx
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- 1. EXPANDED DATASET (Simulating 1 Year) ---
const FULL_MACRO_DATA = [
  { month: 'Jan', cpi: 5.1, core: 3.5, superCore: 2.1, wpi: 4.2, ppi: 3.8 },
  { month: 'Feb', cpi: 5.0, core: 3.4, superCore: 2.0, wpi: 4.1, ppi: 3.7 },
  { month: 'Mar', cpi: 4.8, core: 3.2, superCore: 1.9, wpi: 3.9, ppi: 3.5 },
  { month: 'Apr', cpi: 4.7, core: 3.1, superCore: 1.8, wpi: 3.8, ppi: 3.4 },
  { month: 'May', cpi: 4.8, core: 3.0, superCore: 1.8, wpi: 4.0, ppi: 3.6 },
  { month: 'Jun', cpi: 5.0, core: 3.1, superCore: 1.9, wpi: 4.3, ppi: 3.9 },
  { month: 'Jul', cpi: 3.5, core: 2.0, superCore: 1.2, wpi: 2.1, ppi: 1.8 },
  { month: 'Aug', cpi: 3.7, core: 2.2, superCore: 1.1, wpi: 2.3, ppi: 2.0 },
  { month: 'Sep', cpi: 3.2, core: 1.9, superCore: 0.9, wpi: 1.8, ppi: 1.5 },
  { month: 'Oct', cpi: 2.6, core: 1.8, superCore: 0.2, wpi: 1.2, ppi: 0.9 },
  { month: 'Nov', cpi: 4.4, core: 2.4, superCore: 0.7, wpi: 3.1, ppi: 2.8 },
  { month: 'Dec', cpi: 5.2, core: 2.8, superCore: 1.0, wpi: 4.5, ppi: 4.1 },
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <InflationCard 
            title="WPI" value="4.5" color="orange" 
            description="Wholesale prices businesses pay. Higher WPI → Higher consumer prices later." 
        />
        <InflationCard 
            title="PPI" value="4.1" color="red" 
            description="Producer prices. Affects factory input costs & manufacturing." 
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
                <Line type="monotone" dataKey="wpi" name="WPI (Wholesale)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
                <Line type="monotone" dataKey="ppi" name="PPI (Producer)" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: RATION CARD COMPARISON (1/3 Width) */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-700 rounded-2xl p-6 flex flex-col gap-5 h-full">
            <div className="border-b border-slate-700 pb-4">
               <h2 className="text-xl font-bold text-white">🛡️ Ration Card Impact</h2>
               <p className="text-xs text-slate-400 mt-1">See the difference it makes</p>
            </div>

            {/* TOGGLE */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">Have Ration Card?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={hasRationCard} onChange={(e) => setHasRationCard(e.target.checked)} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                    Check to see protection from food inflation (supply shocks)
                </p>
            </div>

            {/* SIDE-BY-SIDE COMPARISON */}
            <div className="space-y-3">
                {/* WITHOUT Ration Card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  !hasRationCard 
                    ? 'bg-red-500/20 border-red-500/40 ring-2 ring-red-500/30' 
                    : 'bg-slate-800/40 border-slate-700'
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase">WITHOUT Card</span>
                        {!hasRationCard && <span className="text-[10px] px-2 py-0.5 bg-red-500/30 text-red-300 rounded-full font-bold">Current</span>}
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Food Inflation:</span>
                            <span className="font-bold text-red-400">8.0%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Monthly Cost:</span>
                            <span className="font-bold text-red-400">₹{Math.round(baseExpenses * 0.30 * 0.08).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* WITH Ration Card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  hasRationCard 
                    ? 'bg-emerald-500/20 border-emerald-500/40 ring-2 ring-emerald-500/30' 
                    : 'bg-slate-800/40 border-slate-700'
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase">WITH Card</span>
                        {hasRationCard && <span className="text-[10px] px-2 py-0.5 bg-emerald-500/30 text-emerald-300 rounded-full font-bold">Active</span>}
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Food Inflation:</span>
                            <span className="font-bold text-emerald-400">2.0%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Monthly Cost:</span>
                            <span className="font-bold text-emerald-400">₹{Math.round(baseExpenses * 0.30 * 0.02).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAVINGS HIGHLIGHT */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/30 p-4 rounded-xl border border-emerald-500/30 text-center">
                <h4 className="text-xs uppercase font-bold text-emerald-300 mb-2">Monthly Savings</h4>
                <div className="text-3xl font-black text-emerald-400">
                    ₹{Math.round((baseExpenses * 0.30 * 0.08) - (baseExpenses * 0.30 * 0.02)).toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-emerald-300/70 mt-2">
                    {hasRationCard ? '✅ You are protected!' : '❌ You lose this if you skip ration card'}
                </p>
            </div>

            {/* INFO BOX */}
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <p className="text-[10px] text-blue-300 leading-relaxed">
                    💡 Ration cards lock in food prices, protecting you from inflation spikes. During the current vegetable shortage, this saves ₹600+/month!
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}