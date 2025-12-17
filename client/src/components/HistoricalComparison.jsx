// File: client/src/components/HistoricalComparison.jsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoricalComparison = ({ currentIncome }) => {
  // Tax calculation for different years
  const calculateTaxForYear = (income, year) => {
    const regimes = {
      'FY 2023-24': {
        slabs: [
          { min: 0, max: 300000, rate: 0 },
          { min: 300000, max: 600000, rate: 0.05 },
          { min: 600000, max: 900000, rate: 0.10 },
          { min: 900000, max: 1200000, rate: 0.15 },
          { min: 1200000, max: 1500000, rate: 0.20 },
          { min: 1500000, max: Infinity, rate: 0.30 },
        ],
        stdDed: 50000,
        rebateLimit: 700000,
        rebateAmount: 25000
      },
      'FY 2024-25': {
        slabs: [
          { min: 0, max: 300000, rate: 0 },
          { min: 300000, max: 700000, rate: 0.05 },
          { min: 700000, max: 1000000, rate: 0.10 },
          { min: 1000000, max: 1200000, rate: 0.15 },
          { min: 1200000, max: 1500000, rate: 0.20 },
          { min: 1500000, max: Infinity, rate: 0.30 },
        ],
        stdDed: 75000,
        rebateLimit: 700000,
        rebateAmount: 25000
      },
      'FY 2025-26': {
        slabs: [
          { min: 0, max: 400000, rate: 0 },
          { min: 400000, max: 800000, rate: 0.05 },
          { min: 800000, max: 1200000, rate: 0.10 },
          { min: 1200000, max: 1600000, rate: 0.15 },
          { min: 1600000, max: 2000000, rate: 0.20 },
          { min: 2000000, max: 2400000, rate: 0.25 },
          { min: 2400000, max: Infinity, rate: 0.30 },
        ],
        stdDed: 75000,
        rebateLimit: 1200000,
        rebateAmount: 60000
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
  const percentSavings = ((totalSavings / comparisonData[0].tax) * 100).toFixed(0);

  const formatCurrency = (amt) => `₹${Math.round(amt).toLocaleString('en-IN')}`;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-2">📅 Tax Over the Years</h3>
      <p className="text-slate-400 text-sm mb-6">
        How Budget changes affected your tax on {formatCurrency(currentIncome)} income
      </p>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Bar dataKey="tax" name="Tax Payable" radius={[8, 8, 0, 0]}>
              {comparisonData.map((entry, index) => (
                <rect 
                  key={`bar-${index}`}
                  fill={index === 2 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {totalSavings > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 font-semibold">
                🎉 You save {formatCurrency(totalSavings)} in FY 2025-26!
              </p>
              <p className="text-slate-400 text-sm">
                That's {percentSavings}% less tax compared to FY 2023-24
              </p>
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              -{percentSavings}%
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        {comparisonData.map((item, index) => (
          <div 
            key={item.year}
            className={`p-3 rounded-xl text-center ${
              index === 2 ? 'bg-emerald-500/20' : 'bg-slate-800'
            }`}
          >
            <p className="text-xs text-slate-400">{item.year}</p>
            <p className={`font-bold ${index === 2 ? 'text-emerald-400' : ''}`}>
              {formatCurrency(item.tax)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalComparison;