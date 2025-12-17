import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, calculateNewRegimeTax, calculateOldRegimeTax } from '../utils/taxLogic';

export default function Dashboard({ taxInputs, setActiveTab, newRegimeTax, oldRegimeTax, betterRegime, taxSavings, gstImpact }) {
  
  const taxComparisonData = useMemo(() => {
    return [500000, 700000, 1000000, 1200000, 1500000, 2000000, 2500000].map(income => ({
      income: `₹${income / 100000}L`,
      newRegime: Math.round(calculateNewRegimeTax(income, true).totalTax),
      oldRegime: Math.round(calculateOldRegimeTax(income, taxInputs.deductions, true).totalTax),
    }));
  }, [taxInputs.deductions]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">Budget 2025-26</span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">GST 2.0</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Understand How Policies<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Affect Your Wallet</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mb-8">India's first comprehensive policy simulation platform. Calculate taxes, understand GST impact, and see how government policies affect your real income.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveTab('income-tax')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">Calculate Your Tax</button>
            <button onClick={() => setActiveTab('gst')} className="px-6 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-all">See GST Impact</button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Tax-Free Income', value: '₹12.75L', subtitle: 'Salaried (New Regime)', color: 'emerald' },
          { title: 'Max 80C Deduction', value: '₹1.5L', subtitle: 'Old Regime Only', color: 'blue' },
          { title: 'Standard Deduction', value: '₹75K', subtitle: 'New Regime FY 25-26', color: 'purple' },
          { title: 'GST Slabs', value: '0-40%', subtitle: '5% & 18% Primary', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Tax Summary Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8">
         <h3 className="text-2xl font-bold mb-4">Your Tax Summary</h3>
         <div className="grid md:grid-cols-2 gap-6">
            {/* New Regime */}
            <div className={`p-6 rounded-xl ${betterRegime === 'new' ? 'bg-emerald-500/10 border-2 border-emerald-500' : 'bg-slate-800/50 border border-slate-700'}`}>
               <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">New Tax Regime</h4>
                  {betterRegime === 'new' && <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">✓ Better</span>}
               </div>
               <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Total Tax</span><span className="font-mono text-xl font-bold text-emerald-400">{formatCurrency(newRegimeTax.totalTax)}</span></div>
               </div>
            </div>
            {/* Old Regime */}
            <div className={`p-6 rounded-xl ${betterRegime === 'old' ? 'bg-blue-500/10 border-2 border-blue-500' : 'bg-slate-800/50 border border-slate-700'}`}>
               <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">Old Tax Regime</h4>
                  {betterRegime === 'old' && <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">✓ Better</span>}
               </div>
               <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Total Tax</span><span className="font-mono text-xl font-bold text-blue-400">{formatCurrency(oldRegimeTax.totalTax)}</span></div>
               </div>
            </div>
         </div>
         <div className={`mt-6 p-4 rounded-xl ${betterRegime === 'new' ? 'bg-emerald-500/10' : 'bg-blue-500/10'} flex items-center justify-between`}>
            <span>You save <strong className={betterRegime === 'new' ? 'text-emerald-400' : 'text-blue-400'}>{formatCurrency(taxSavings)}</strong> with the {betterRegime === 'new' ? 'New' : 'Old'} Regime!</span>
         </div>
      </div>

      {/* Tax Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-bold mb-6">Tax Comparison Across Income Levels</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taxComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="income" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="newRegime" name="New Regime" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="oldRegime" name="Old Regime" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}