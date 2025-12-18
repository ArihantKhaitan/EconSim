// client/src/modules/GSTModule.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { GST_CATEGORIES, formatCurrency } from '../utils/taxLogic';

export default function GSTModule({ expenses, setExpenses, result }) {
  // Alias to match your provided code
  const gstExpenses = expenses;
  const setGstExpenses = setExpenses;
  const gstImpact = result;

  const gstBreakdownData = Object.entries(GST_CATEGORIES).map(([key, cat]) => {
    // Check if item's category matches current loop category key
    const total = gstExpenses.filter(e => e.category === key).reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.label, value: total, color: cat.color };
  }).filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-bold">GST Impact Calculator</h2>
        <p className="text-slate-400">See GST on monthly expenses (GST 2.0 - Sept 2025)</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"><span className="text-3xl">🛒</span><p className="text-sm text-slate-400 mt-2">Total Spending</p><p className="text-2xl font-bold text-white">{formatCurrency(gstImpact.totalExpense)}</p></div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"><span className="text-3xl">🧾</span><p className="text-sm text-slate-400 mt-2">GST Paid Monthly</p><p className="text-2xl font-bold text-orange-400">{formatCurrency(gstImpact.totalGST)}</p></div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"><span className="text-3xl">📊</span><p className="text-sm text-slate-400 mt-2">Effective GST</p><p className="text-2xl font-bold text-white">{gstImpact.effectiveGSTRate.toFixed(1)}%</p></div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"><span className="text-3xl">📅</span><p className="text-sm text-slate-400 mt-2">Annual GST</p><p className="text-2xl font-bold text-purple-400">{formatCurrency(gstImpact.totalGST * 12)}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Expenses Editor */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Edit Monthly Expenses</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {gstExpenses.map((expense, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{expense.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${expense.gst === 0 ? 'bg-emerald-500/20 text-emerald-400' : expense.gst === 5 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>{expense.gst}% GST</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="range" min="0" max={expense.avgMonthly * 3} step="100" value={expense.amount}
                    onChange={(e) => { const n = [...gstExpenses]; n[i].amount = parseInt(e.target.value); setGstExpenses(n); }} className="flex-1 accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                  <input type="number" value={expense.amount}
                    onChange={(e) => { const n = [...gstExpenses]; n[i].amount = parseInt(e.target.value) || 0; setGstExpenses(n); }}
                    className="w-24 px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-right font-mono text-sm outline-none text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GST Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">GST by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gstBreakdownData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3} dataKey="value">
                  {gstBreakdownData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
             {gstBreakdownData.map((d, i) => (
               <div key={i} className="flex items-center gap-2 text-xs">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                 <span className="text-slate-300">{d.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}