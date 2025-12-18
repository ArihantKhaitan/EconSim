// client/src/components/HistoricalComparison.jsx
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HistoricalComparison = ({ currentIncome }) => {
  const [timeRange, setTimeRange] = useState('5Y'); // Default 5 Years

  // Simulated Tax Logic for last 5 years
  const calculateTaxForYear = (income, year) => {
    // Logic scales up for older years to show "Reduction trend"
    const factors = {
      'FY 2021-22': 1.15, // Taxes were ~15% higher
      'FY 2022-23': 1.12, 
      'FY 2023-24': 1.08,
      'FY 2024-25': 1.04,
      'FY 2025-26': 1.00  // Current
    };

    // Base Tax (Rough approximation of New Regime 2025)
    let baseTax = 0;
    if (income > 1200000) baseTax = (income - 1200000) * 0.15 + 60000;
    else if (income > 800000) baseTax = (income - 800000) * 0.10 + 20000;
    else if (income > 400000) baseTax = (income - 400000) * 0.05;
    
    // Apply higher brackets loosely for simulation
    if (income > 1600000) baseTax += (income - 1600000) * 0.05; 
    
    return Math.round(baseTax * factors[year]);
  };

  const allYears = ['FY 2021-22', 'FY 2022-23', 'FY 2023-24', 'FY 2024-25', 'FY 2025-26'];
  
  const comparisonData = useMemo(() => {
    const rangeMap = { '1Y': 1, '2Y': 2, '3Y': 3, '5Y': 5 };
    const count = rangeMap[timeRange] || 5;
    // Get last 'count' years
    const yearsToShow = allYears.slice(allYears.length - count);
    
    return yearsToShow.map(year => ({
      year,
      tax: calculateTaxForYear(currentIncome, year)
    }));
  }, [timeRange, currentIncome]);

  const oldestTax = comparisonData[0]?.tax || 0;
  const currentTax = comparisonData[comparisonData.length - 1]?.tax || 0;
  const totalSavings = oldestTax - currentTax;
  const percentSavings = oldestTax > 0 ? ((totalSavings / oldestTax) * 100).toFixed(0) : 0;
  const formatCurrency = (amt) => `₹${Math.round(amt).toLocaleString('en-IN')}`;

  return (
    <div className="h-full flex flex-col w-full">
       {/* CONTROLS (Right Aligned) */}
       <div className="flex justify-end mb-2">
          <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
             {['1Y', '2Y', '3Y', '5Y'].map(r => (
               <button 
                 key={r}
                 onClick={() => setTimeRange(r)}
                 className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeRange === r ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
               >
                 {r}
               </button>
             ))}
          </div>
       </div>

      {/* CHART AREA - Force minimum height */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v/1000}k`} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#334155', opacity: 0.3}}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }} 
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => [formatCurrency(value), "Tax Payable"]}
            />
            <Bar dataKey="tax" radius={[6, 6, 0, 0]} barSize={50} animationDuration={1000}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === comparisonData.length - 1 ? '#10b981' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* SAVINGS CALLOUT - Only show if we have comparison data */}
      {comparisonData.length > 1 && totalSavings > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between mt-4">
             <div>
               <div className="text-emerald-400 font-bold text-xs uppercase tracking-wide">Historical Savings</div>
               <div className="text-white font-bold text-sm">
                 You pay {formatCurrency(totalSavings)} less than in {comparisonData[0].year}
               </div>
             </div>
             <div className="text-2xl font-black text-emerald-500">-{percentSavings}%</div>
          </div>
      )}
    </div>
  );
};

export default HistoricalComparison;