import React, { useState } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const SubsidyCard = ({ subsidy, isSelected, onClick }) => {
  const savings = subsidy.marketPrice - subsidy.subsidizedPrice;
  const annualSavings = savings * subsidy.frequency;

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 text-left transition-all transform hover:scale-105 ${
        isSelected
          ? 'bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border-emerald-500 ring-2 ring-emerald-500/30'
          : 'bg-slate-800 border-slate-700 hover:border-emerald-500/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-3xl mb-2">{subsidy.emoji}</div>
          <h3 className="font-bold text-white">{subsidy.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase font-bold">Annual</div>
          <div className={`text-lg font-black ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
            ₹{(annualSavings / 100000).toFixed(1)}L
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Without subsidy:</span>
          <span className="font-mono text-slate-300">₹{subsidy.marketPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">With subsidy:</span>
          <span className="font-mono text-emerald-400 font-bold">₹{subsidy.subsidizedPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </button>
  );
};

export default function SubsidyCalculator() {
  const [selectedSubsidy, setSelectedSubsidy] = useState(0);

  const subsidies = [
    {
      name: 'LPG Cooking Gas',
      emoji: '🔥',
      marketPrice: 1100,
      subsidizedPrice: 500,
      frequency: 12, // times per year
      unit: 'per cylinder',
      description: 'Government subsidizes LPG to make cooking fuel affordable. Without it, each cylinder costs ₹1,100. With subsidy, you pay ₹500.',
      impact: 'Affects: ₹7,200 annual savings for a family'
    },
    {
      name: 'Food (Ration Card)',
      emoji: '🍚',
      marketPrice: 30,
      subsidizedPrice: 2,
      frequency: 12, // monthly rations = 12 transactions/year
      unit: 'per kg (rice/wheat)',
      description: 'PDS (Public Distribution System) provides rice & wheat at ₹2/kg vs market price of ₹30/kg. Protects bottom 20% from hunger.',
      impact: 'Affects: ₹336 annual savings per month for essentials'
    },
    {
      name: 'Electric Vehicle (EV)',
      emoji: '⚡',
      marketPrice: 1000000,
      subsidizedPrice: 800000,
      frequency: 1, // one time purchase
      unit: 'per vehicle',
      description: 'Govt offers ₹2,00,000 subsidy to promote EVs. Encourages shift away from fossil fuels while making EVs accessible.',
      impact: 'Affects: ₹2,00,000 one-time savings (20% of vehicle cost)'
    },
    {
      name: 'Education (Scholarship)',
      emoji: '📚',
      marketPrice: 200000,
      subsidizedPrice: 80000,
      frequency: 1, // per year, assume 4-year degree
      unit: 'per year (college)',
      description: 'Merit-based scholarships cover tuition fees. Without it, students bear full ₹2,00,000/year cost. With it, pay only ₹80,000.',
      impact: 'Affects: ₹4,80,000 savings over 4-year degree'
    },
    {
      name: 'Fertilizer (Farmers)',
      emoji: '🌾',
      marketPrice: 5000,
      subsidizedPrice: 2000,
      frequency: 2, // twice yearly (Kharif & Rabi)
      unit: 'per bag (50kg)',
      description: 'Agricultural subsidy keeps fertilizer cheap for farmers. Ensures food security while keeping farming viable.',
      impact: 'Affects: ₹6,000 annual savings for small farms'
    },
    {
      name: 'Home Loan Interest (80EEA)',
      emoji: '🏠',
      marketPrice: 900000, // interest paid without subsidy on ₹50L loan
      subsidizedPrice: 750000, // interest paid with government help
      frequency: 1, // one loan, spread over years
      unit: 'per loan (₹50L)',
      description: 'Government offers tax deduction on home loan interest up to ₹2,00,000/year. Reduces effective interest you pay.',
      impact: 'Affects: ₹1,50,000 savings over loan tenure'
    }
  ];

  const current = subsidies[selectedSubsidy];
  const savings = current.marketPrice - current.subsidizedPrice;
  const annualSavings = savings * current.frequency;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
          Subsidy Impact Calculator 🎁
        </h1>
        <p className="text-slate-300 relative z-10 max-w-2xl">
          See how government subsidies save your money. Understand which policies protect different groups.
        </p>
      </div>

      {/* SUBSIDY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subsidies.map((subsidy, idx) => (
          <SubsidyCard
            key={idx}
            subsidy={subsidy}
            isSelected={selectedSubsidy === idx}
            onClick={() => setSelectedSubsidy(idx)}
          />
        ))}
      </div>

      {/* DETAILED VIEW */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: Description & Impact */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div>
            <div className="text-6xl mb-4">{current.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{current.name}</h2>
            <p className="text-slate-400">{current.unit}</p>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">How It Works</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              {current.description}
            </p>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-sm text-emerald-400 font-semibold">{current.impact}</p>
            </div>
          </div>

          {/* Scenario Comparison */}
          <div className="border-t border-slate-700 pt-6 space-y-3">
            <h3 className="text-lg font-bold text-white">Per-Unit Comparison</h3>
            
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-red-300">Without Subsidy</span>
                <span className="text-red-400">❌</span>
              </div>
              <div className="text-2xl font-black text-red-400">
                ₹{current.marketPrice.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-2">Market price (what you'd pay without govt help)</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-emerald-300">With Subsidy</span>
                <span className="text-emerald-400">✅</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                ₹{current.subsidizedPrice.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-2">Govt-subsidized price (what you actually pay)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between">
              <span className="font-bold text-white">Per-Unit Savings</span>
              <span className="text-2xl font-black text-yellow-400">
                ₹{savings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Annual Impact Calculator */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">Annual/Lifetime Savings</h2>

          {/* Frequency Info */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Frequency:</span>
              <span className="text-white font-bold text-lg">{current.frequency}x per year</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Per-Unit Saving:</span>
              <span className="text-emerald-400 font-bold text-lg">₹{savings.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
              <span className="text-white font-bold">Annual Total:</span>
              <span className="text-3xl font-black text-emerald-400">
                ₹{annualSavings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* What This Means */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 p-6 rounded-xl border border-emerald-500/30 space-y-3">
            <h3 className="font-bold text-emerald-300 flex items-center gap-2">
              💰 Real Impact
            </h3>
            
            {current.frequency === 1 ? (
              // One-time purchases
              <>
                <p className="text-slate-300 text-sm">
                  One-time savings of <span className="font-bold text-emerald-400">₹{annualSavings.toLocaleString('en-IN')}</span> when you avail this subsidy.
                </p>
                <p className="text-xs text-slate-400 border-t border-emerald-500/20 pt-3">
                  Without govt support, you'd pay full ₹{current.marketPrice.toLocaleString('en-IN')}. With subsidy, you save a significant amount upfront.
                </p>
              </>
            ) : (
              // Recurring purchases
              <>
                <p className="text-slate-300 text-sm">
                  You save <span className="font-bold text-emerald-400">₹{annualSavings.toLocaleString('en-IN')}/year</span> thanks to this subsidy.
                </p>
                <div className="text-xs text-slate-400 space-y-1 border-t border-emerald-500/20 pt-3">
                  <p>📊 <strong>Monthly average:</strong> ₹{Math.round(annualSavings / 12).toLocaleString('en-IN')}</p>
                  <p>📈 <strong>Over 10 years:</strong> ₹{(annualSavings * 10).toLocaleString('en-IN')}</p>
                  <p>💡 If subsidy removed, your costs would jump by ₹{savings.toLocaleString('en-IN')} {current.frequency > 1 ? 'per transaction' : 'upfront'}.</p>
                </div>
              </>
            )}
          </div>

          {/* Who Benefits? */}
          <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
            <h4 className="text-sm font-bold text-blue-300 mb-2">👥 Who Benefits Most?</h4>
            <p className="text-xs text-blue-200 leading-relaxed">
              {selectedSubsidy === 0 && 'Low-income households that cook at home daily. Urban & rural families.'}
              {selectedSubsidy === 1 && 'Below Poverty Line (BPL) families. Protects from hunger & malnutrition.'}
              {selectedSubsidy === 2 && 'Middle & upper-middle class buyers. Accelerates clean energy adoption.'}
              {selectedSubsidy === 3 && 'Students from economically weaker sections. Enables access to higher education.'}
              {selectedSubsidy === 4 && 'Small & marginal farmers. Keeps agriculture economically viable.'}
              {selectedSubsidy === 5 && 'First-time homebuyers. Makes housing dreams affordable.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}