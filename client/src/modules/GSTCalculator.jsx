// client/src/modules/GSTCalculator.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Helper for currency format
const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

// ✅ 1. DEFINED LOCALLY: Full list of categories with specific colors to match App.jsx
const LOCAL_GST_CATEGORIES = {
  rent: { label: 'Rent', color: '#64748B' },          // Slate
  essentials: { label: 'Essentials', color: '#10B981' }, // Emerald
  food: { label: 'Food & Dining', color: '#F59E0B' },    // Amber
  utilities: { label: 'Utilities', color: '#06B6D4' },   // Cyan
  transport: { label: 'Transport', color: '#3B82F6' },   // Blue
  shopping: { label: 'Shopping', color: '#EC4899' },     // Pink
  electronics: { label: 'Electronics', color: '#8B5CF6' }, // Violet
  entertainment: { label: 'Entertainment', color: '#F43F5E' }, // Rose
  health: { label: 'Health', color: '#EF4444' }          // Red
};

export default function GSTModule({ expenses, setExpenses, result }) {
  const gstExpenses = expenses || [];
  const setGstExpenses = setExpenses || (() => {});
  const gstImpact = result || { totalExpense: 0, totalGST: 0, effectiveGSTRate: 0 };

  // ✅ 2. DYNAMIC DATA: Calculates totals for ALL categories defined above
  const gstBreakdownData = Object.entries(LOCAL_GST_CATEGORIES).map(([key, cat]) => {
    const total = gstExpenses
        .filter(e => e.category === key)
        .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.label, value: total, color: cat.color };
  }).filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-bold text-white">GST Impact Calculator</h2>
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
          <h3 className="text-lg font-semibold mb-6 text-white">Edit Monthly Expenses</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {gstExpenses.map((expense, i) => {
              // ✅ 3. COLOR MATCHING: Get the color for this specific category
              const catColor = LOCAL_GST_CATEGORIES[expense.category]?.color || '#64748B';

              return (
                <div key={i} className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{expense.name}</span>
                    
                    {/* ✅ 4. COLORED BADGE: Uses inline style to match Pie Chart color exactly */}
                    <span 
                        className="text-xs px-2 py-1 rounded-full border font-bold"
                        style={{ 
                            backgroundColor: `${catColor}20`, // 20 = 12% opacity hex
                            color: catColor,
                            borderColor: `${catColor}40`
                        }}
                    >
                        {expense.gst}% GST
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                        type="range" min="0" max={Math.max(50000, expense.amount * 2)} step="100" 
                        value={expense.amount}
                        onChange={(e) => { const n = [...gstExpenses]; n[i].amount = parseInt(e.target.value); setGstExpenses(n); }} 
                        // Slider accent color matches category
                        style={{ accentColor: catColor }}
                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                    />
                    <input 
                        type="number" 
                        value={expense.amount}
                        onChange={(e) => { const n = [...gstExpenses]; n[i].amount = parseInt(e.target.value) || 0; setGstExpenses(n); }}
                        className="w-24 px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-right font-mono text-sm outline-none text-white focus:border-emerald-500" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GST Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6 text-white">GST by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gstBreakdownData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3} dataKey="value">
                  {gstBreakdownData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)} 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
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