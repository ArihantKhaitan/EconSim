import React from 'react';
import { NEW_TAX_SLABS_2025, formatCurrency } from '../utils/taxLogic';

export default function IncomeTax({ taxInputs, setTaxInputs, newRegimeTax, oldRegimeTax, betterRegime, taxSavings }) {
  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-bold">Income Tax Calculator</h2><p className="text-slate-400">FY 2025-26 (AY 2026-27) • Budget 2025</p></div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold">Your Details</h3>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Annual Gross Income</label>
            <input type="number" value={taxInputs.grossIncome} onChange={(e) => setTaxInputs({...taxInputs, grossIncome: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="range" min="0" max="10000000" step="100000" value={taxInputs.grossIncome}
              onChange={(e) => setTaxInputs({...taxInputs, grossIncome: parseInt(e.target.value)})} className="w-full mt-2 accent-emerald-500" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Employment Type</label>
            <div className="flex gap-2">
              <button onClick={() => setTaxInputs({...taxInputs, isSalaried: true})} className={`flex-1 py-3 rounded-xl font-medium transition-all ${taxInputs.isSalaried ? 'bg-emerald-500 text-white' : 'bg-slate-800'}`}>Salaried</button>
              <button onClick={() => setTaxInputs({...taxInputs, isSalaried: false})} className={`flex-1 py-3 rounded-xl font-medium transition-all ${!taxInputs.isSalaried ? 'bg-emerald-500 text-white' : 'bg-slate-800'}`}>Self-Employed</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50">
            <h4 className="font-medium mb-4 flex items-center gap-2">ℹ️ Deductions (Old Regime)</h4>
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
                  <input type="number" max={d.max} value={taxInputs.deductions[d.key]}
                    onChange={(e) => setTaxInputs({...taxInputs, deductions: {...taxInputs.deductions, [d.key]: Math.min(d.max, parseInt(e.target.value) || 0)}})}
                    className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-sm outline-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* New Regime Result */}
            <div className={`bg-slate-900/80 border rounded-2xl p-6 ${betterRegime === 'new' ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-800'}`}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">New Regime (FY 25-26)</h4>
                {betterRegime === 'new' && <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">RECOMMENDED</span>}
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800 flex justify-between"><span className="text-slate-400">Gross</span><span className="font-mono">{formatCurrency(newRegimeTax.grossIncome)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Std Deduction</span><span className="font-mono text-emerald-400">-{formatCurrency(newRegimeTax.standardDeduction)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Taxable</span><span className="font-mono">{formatCurrency(newRegimeTax.taxableIncome)}</span></div>
                <div className="p-4 rounded-xl bg-emerald-500/20 flex justify-between items-center"><span className="font-semibold">Total Tax</span><span className="font-mono text-2xl font-bold text-emerald-400">{formatCurrency(newRegimeTax.totalTax)}</span></div>
                <div className="p-3 rounded-lg bg-slate-800"><div className="flex justify-between"><span className="text-slate-400">Net Income</span><span className="font-mono font-semibold">{formatCurrency(newRegimeTax.netIncome)}</span></div></div>
              </div>
            </div>

            {/* Old Regime Result */}
            <div className={`bg-slate-900/80 border rounded-2xl p-6 ${betterRegime === 'old' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-800'}`}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">Old Regime</h4>
                {betterRegime === 'old' && <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">RECOMMENDED</span>}
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800 flex justify-between"><span className="text-slate-400">Gross</span><span className="font-mono">{formatCurrency(oldRegimeTax.grossIncome)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Deductions</span><span className="font-mono text-blue-400">-{formatCurrency(oldRegimeTax.totalDeductions)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-700"><span className="text-slate-400">Taxable</span><span className="font-mono">{formatCurrency(oldRegimeTax.taxableIncome)}</span></div>
                <div className="p-4 rounded-xl bg-blue-500/20 flex justify-between items-center"><span className="font-semibold">Total Tax</span><span className="font-mono text-2xl font-bold text-blue-400">{formatCurrency(oldRegimeTax.totalTax)}</span></div>
                <div className="p-3 rounded-lg bg-slate-800"><div className="flex justify-between"><span className="text-slate-400">Net Income</span><span className="font-mono font-semibold">{formatCurrency(oldRegimeTax.netIncome)}</span></div></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${betterRegime === 'new' ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>✨</div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold">{betterRegime === 'new' ? 'New' : 'Old'} Regime saves you more!</h4>
              <p className="text-slate-400">Save <span className={`font-bold ${betterRegime === 'new' ? 'text-emerald-400' : 'text-blue-400'}`}>{formatCurrency(taxSavings)}</span> annually ({formatCurrency(taxSavings / 12)}/month)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}