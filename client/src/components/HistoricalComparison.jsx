// client/src/components/HistoricalComparison.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HistoricalComparison = ({ currentIncome }) => {
  // Tax calculation for different years
  const calculateTaxForYear = (income, year) => {
    const regimes = {
      'FY 2023-24': {
        slabs: [
          { min: 0, max: 300000, rate: 0 }, { min: 300000, max: 600000, rate: 0.05 }, { min: 600000, max: 900000, rate: 0.10 }, { min: 900000, max: 1200000, rate: 0.15 }, { min: 1200000, max: 1500000, rate: 0.20 }, { min: 1500000, max: Infinity, rate: 0.30 }
        ],
        stdDed: 50000, rebateLimit: 700000, rebateAmount: 25000
      },
      'FY 2024-25': {
        slabs: [
          { min: 0, max: 300000, rate: 0 }, { min: 300000, max: 700000, rate: 0.05 }, { min: 700000, max: 1000000, rate: 0.10 }, { min: 1000000, max: 1200000, rate: 0.15 }, { min: 1200000, max: 1500000, rate: 0.20 }, { min: 1500000, max: Infinity, rate: 0.30 }
        ],
        stdDed: 75000, rebateLimit: 700000, rebateAmount: 25000
      },
      'FY 2025-26': {
        slabs: [
          { min: 0, max: 400000, rate: 0 }, { min: 400000, max: 800000, rate: 0.05 }, { min: 800000, max: 1200000, rate: 0.10 }, { min: 1200000, max: 1600000, rate: 0.15 }, { min: 1600000, max: 2000000, rate: 0.20 }, { min: 2000000, max: 2400000, rate: 0.25 }, { min: 2400000, max: Infinity, rate: 0.30 }
        ],
        stdDed: 75000, rebateLimit: 1200000, rebateAmount: 60000
      }
    };

    const regime = regimes[year];
    const taxable = Math.max(0, income - regime.stdDed);
    let tax = 0;
    
    for (const slab of regime.slabs) {
      if (taxable > slab.min) {
        tax += (Math.min(taxable, slab.max) - slab.min) * slab.rate;
      }
    }
    
    if (taxable <= regime.rebateLimit) {
      tax = Math.max(0, tax - regime.rebateAmount);
    }
    
    return Math.round(tax * 1.04); // Add 4% cess
  };

  const years = ['FY 2023-24', 'FY 2024-25', 'FY 2025-26'];
  
  const comparisonData = years.map(year => ({
    year,
    tax: calculateTaxForYear(currentIncome, year)
  }));

  const totalSavings = comparisonData[0].tax - comparisonData[2].tax;
  const percentSavings = comparisonData[0].tax > 0 ? ((totalSavings / comparisonData[0].tax) * 100).toFixed(0) : 0;
  const formatCurrency = (amt) => `₹${Math.round(amt).toLocaleString('en-IN')}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">📅 Tax History Analysis</h3>
      <p className="text-slate-400 text-sm mb-6">
        See how budget updates have lowered your tax burden over time.
      </p>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v/1000}k`} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#334155', opacity: 0.4}}
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              formatter={(value) => [formatCurrency(value), "Tax Payable"]}
            />
            <Bar dataKey="tax" radius={[6, 6, 0, 0]} barSize={50}>
              {/* THIS FIXES THE COLORS: */}
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 2 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings Callout */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
         <div>
           <div className="text-emerald-400 font-bold text-sm uppercase tracking-wide">Total Savings</div>
           <div className="text-white font-bold text-lg">You save {formatCurrency(totalSavings)} vs 2023!</div>
         </div>
         <div className="text-3xl font-black text-emerald-500">-{percentSavings}%</div>
      </div>
    </div>
  );
};

export default HistoricalComparison;