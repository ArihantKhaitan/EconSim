// client/src/modules/IncomeTax.jsx
import React from 'react';
import { NEW_TAX_SLABS_2025, formatCurrency } from '../utils/taxLogic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function IncomeTaxCalc({ inputs, setInputs, result }) {
  const taxInputs = inputs;
  const setTaxInputs = setInputs;
  const newRegimeTax = result.newRegime;
  const oldRegimeTax = result.oldRegime;
  const betterRegime = result.betterRegime;
  const taxSavings = result.savings;

  const chartData = [
    { name: 'New Regime', tax: newRegimeTax.totalTax, net: newRegimeTax.netIncome, color: '#10B981' },
    { name: 'Old Regime', tax: oldRegimeTax.totalTax, net: oldRegimeTax.netIncome, color: '#3B82F6' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h2 className="text-2xl font-bold">Income Tax Calculator</h2>
           <p className="text-slate-400">FY 2025-26 (AY 2026-27) • Budget 2025</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
           <span className="text-xs text-slate-400 block">Projected Savings</span>
           <span className="text-xl font-bold text-emerald-400">{formatCurrency(taxSavings)}</span>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* INPUTS SECTION */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold">Your Details</h3>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Annual Gross Income</label>
            <input type="number" value={taxInputs.grossIncome} onChange={(e) => setTaxInputs({...taxInputs, grossIncome: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-white" />
            <input type="range" min="0" max="10000000" step="100000" value={taxInputs.grossIncome}
              onChange={(e) => setTaxInputs({...taxInputs, grossIncome: parseInt(e.target.value)})} className="w-full mt-2 accent-emerald-500" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Employment Type</label>
            <div className="flex gap-2">
              <button onClick={() => setTaxInputs({...taxInputs, isSalaried: true})} className={`flex-1 py-3 rounded-xl font-medium transition-all ${taxInputs.isSalaried ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Salaried</button>
              <button onClick={() => setTaxInputs({...taxInputs, isSalaried: false})} className={`flex-1 py-3 rounded-xl font-medium transition-all ${!taxInputs.isSalaried ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Self-Employed</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50">
            <h4 className="font-medium mb-4 flex items-center gap-2 text-slate-300">ℹ️ Deductions (Old Regime)</h4>
            <div className="space-y-4">
              {[
                { key: 'section80C', label: '80C (Max ₹1.5L)', max: 150000 },
                { key: 'section80D', label: '80D Health (Max ₹50K)', max: 50000 },
                { key: 'section80CCD1B', label: '80CCD(1B) NPS (Max ₹50K)', max: 50000 },
                { key: 'homeLoanInterest', label: 'Home Loan Interest (Max ₹2L)', max: 200000 },
                { key: 'hra', label: 'HRA Exemption', max: Infinity },
              ].map(d => (
                <div key={d.key}>
                  <label className="block text-xs text-slate-400 mb-1">{d.label}</label>
                  <input type="number" max={d.max} value={taxInputs.deductions?.[d.key] || 0}
                    onChange={(e) => setTaxInputs({...taxInputs, deductions: {...taxInputs.deductions, [d.key]: Math.min(d.max, parseInt(e.target.value) || 0)}})}
                    className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-sm outline-none text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS & CHART SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Tax Liability Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#94a3b8" tickFormatter={(val) => `₹${val/1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                  <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.2}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(val) => formatCurrency(val)}
                  />
                  <Bar dataKey="tax" name="Tax Payable" radius={[0, 4, 4, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">Lower bar is better. The {betterRegime === 'new' ? 'New' : 'Old'} Regime is winning.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* New Regime Result */}
            <div className={`bg-slate-900/80 border rounded-2xl p-6 ${betterRegime === 'new' ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-800'}`}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white">New Regime (FY 25-26)</h4>
                {betterRegime === 'new' && <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">RECOMMENDED</span>}
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800 flex justify-between"><span className="text-slate-400">Gross</span><span className="font-mono text-white">{formatCurrency(newRegimeTax.grossIncome)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Std Deduction</span><span className="font-mono text-emerald-400">-{formatCurrency(newRegimeTax.standardDeduction)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Taxable</span><span className="font-mono text-white">{formatCurrency(newRegimeTax.taxableIncome)}</span></div>
                <div className="p-4 rounded-xl bg-emerald-500/20 flex justify-between items-center"><span className="font-semibold text-emerald-100">Total Tax</span><span className="font-mono text-2xl font-bold text-emerald-400">{formatCurrency(newRegimeTax.totalTax)}</span></div>
              </div>
            </div>

            {/* Old Regime Result */}
            <div className={`bg-slate-900/80 border rounded-2xl p-6 ${betterRegime === 'old' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-800'}`}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white">Old Regime</h4>
                {betterRegime === 'old' && <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">RECOMMENDED</span>}
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800 flex justify-between"><span className="text-slate-400">Gross</span><span className="font-mono text-white">{formatCurrency(oldRegimeTax.grossIncome)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Deductions</span><span className="font-mono text-blue-400">-{formatCurrency(oldRegimeTax.totalDeductions)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Taxable</span><span className="font-mono text-white">{formatCurrency(oldRegimeTax.taxableIncome)}</span></div>
                <div className="p-4 rounded-xl bg-blue-500/20 flex justify-between items-center"><span className="font-semibold text-blue-100">Total Tax</span><span className="font-mono text-2xl font-bold text-blue-400">{formatCurrency(oldRegimeTax.totalTax)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}