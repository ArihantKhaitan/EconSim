// client/src/modules/SubsidyCalculator.jsx
import React, { useState } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const SchemeCard = ({ scheme, userIncome, isSelected, onClick }) => {
  // ✅ FIXED LOGIC: Check if scheme is Percentage-based or Fixed Amount
  let userAnnual, govtAnnual;

  if (scheme.type === 'percent') {
    // For EPF/NPS: Calculate % of Income
    userAnnual = (scheme.userContribution / 100) * userIncome;
    govtAnnual = (scheme.govtContribution / 100) * userIncome;
  } else {
    // For LPG/Loans: Use Fixed Amount * Frequency
    const freq = scheme.frequency || 1;
    userAnnual = scheme.userContribution * freq;
    govtAnnual = scheme.govtContribution * freq;
  }

  const totalBenefit = userAnnual + govtAnnual;

  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 text-left transition-all transform hover:scale-105 h-full flex flex-col justify-between ${
        isSelected
          ? 'bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border-blue-500 ring-2 ring-blue-500/30'
          : 'bg-slate-800 border-slate-700 hover:border-blue-500/50'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-4xl mb-2">{scheme.emoji}</div>
            <h3 className="font-bold text-white text-lg leading-tight">{scheme.name}</h3>
          </div>
          <div className="text-right shrink-0 ml-2">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Value</div>
            <div className={`text-lg font-black ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
              {totalBenefit > 99999 
                ? `₹${(totalBenefit / 100000).toFixed(1)}L` 
                : `₹${(totalBenefit / 1000).toFixed(1)}k`}
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-3">{scheme.category}</p>
      </div>
      
      <div className="space-y-2 text-sm mt-auto">
        <div className="flex justify-between">
          <span className="text-slate-400">You Pay:</span>
          <span className="font-mono text-slate-300">
            {Math.round(userAnnual) === 0 ? '₹0' : `₹${Math.round(userAnnual).toLocaleString('en-IN')}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Govt Adds:</span>
          <span className="font-mono text-emerald-400 font-bold">₹{Math.round(govtAnnual).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </button>
  );
};

export default function SubsidyCalculator({ userIncome = 1200000 }) {
  const [selectedScheme, setSelectedScheme] = useState(0);

  // ✅ UPDATED DATA: Added 'type' and 'frequency' to fix math
  const schemes = [
    {
      name: 'Employees Provident Fund (EPF)',
      emoji: '🏦',
      category: 'Retirement Savings',
      type: 'percent', // 12% of income
      userContribution: 12, 
      govtContribution: 3.67, 
      totalYears: 40,
      description: 'Monthly deduction from salary that accumulates with employer match. You invest 12% of your salary, employer adds ~12%. Interest earned is tax-free.',
      features: [
        '✅ Tax deduction on your contribution (Section 80C)',
        '✅ Employer contributes equally',
        '✅ Interest earned: 8.5% per annum (tax-free)',
        '✅ Withdrawals allowed for housing, education, medical',
        '✅ Final corpus is tax-free in many cases'
      ],
      govtRole: 'Government regulates EPF and ensures funds are safe. No direct subsidy but provides tax benefits.',
      timeline: 'Lifelong benefit - money grows till retirement'
    },

    {
      name: 'National Pension Scheme (NPS)',
      emoji: '📈',
      category: 'Retirement Planning',
      type: 'percent', // 10% of income
      userContribution: 10, 
      govtContribution: 14, // Avg for govt employees
      totalYears: 30,
      description: 'Modern pension plan with market-linked returns. You invest regularly, government may contribute (esp. for govt employees). Get tax deductions + returns.',
      features: [
        '✅ Tax deduction up to ₹1.5L (Section 80C) + ₹50K (80CCD-1B)',
        '✅ Government contribution for salaried employees: 14% of basic',
        '✅ Returns linked to stock market (historically 10-12%)',
        '✅ Flexible withdrawal at retirement',
        '✅ Lower fees (0.01%-0.25% vs mutual funds)'
      ],
      govtRole: 'Government contributes 14% of salary for salaried employees. Also provides tax deductions.',
      timeline: 'Till retirement (age 60+)'
    },

    {
      name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
      emoji: '🏧',
      category: 'Financial Inclusion',
      type: 'fixed', // Fixed amount
      frequency: 1,
      userContribution: 0, 
      govtContribution: 130000, // Insurance value
      totalYears: 99,
      description: 'Free bank account for every Indian. Government provides ₹1L accidental insurance + ₹30k life insurance FREE.',
      features: [
        '✅ FREE bank account with zero balance',
        '✅ FREE ₹1,00,000 accidental insurance (RuPay card)',
        '✅ FREE ₹30,000 life insurance',
        '✅ Overdraft facility up to ₹10,000',
        '✅ Government subsidizes all insurance costs'
      ],
      govtRole: 'Government bears entire cost of insurance (~₹500/account/year) to include all Indians in formal banking.',
      timeline: 'Lifetime validity'
    },

    {
      name: 'LPG Gas Subsidy (DBT)',
      emoji: '🔥',
      category: 'Essential Commodities',
      type: 'fixed', // Fixed amount per cylinder
      frequency: 12, // 12 cylinders/year
      userContribution: 600, // You pay 600
      govtContribution: 300, // Govt pays 300 subsidy
      totalYears: 99,
      description: 'Government subsidizes cooking gas. Market price: ~₹900/cylinder. You pay ~₹600. Government pays difference directly to producer.',
      features: [
        '✅ Cylinder price capped (actual cost higher)',
        '✅ Difference transferred directly to oil company',
        '✅ Benefits all income groups (No income cap)',
        '✅ Average family saves ₹3,600/year',
        '✅ Direct transfer - no middleman'
      ],
      govtRole: 'Government directly pays oil companies the subsidy amount. You only pay the subsidized rate.',
      timeline: 'Ongoing - 12 cylinders allowed per family per year'
    },

    {
      name: 'Education Loan Interest Subsidy',
      emoji: '📚',
      category: 'Education Support',
      type: 'fixed', // Fixed amount
      frequency: 1,
      userContribution: 0, 
      govtContribution: 45000, // Avg annual interest subsidy
      totalYears: 10,
      description: 'If you take an education loan, government pays the INTEREST while you study + 6 months after. You only pay back principal.',
      features: [
        '✅ Government pays 100% interest during studies',
        '✅ Government pays interest for 6 months after course',
        '✅ You only repay principal amount',
        '✅ Loan available up to ₹10L for higher education',
        '✅ Moratorium period: 6 months after course completion'
      ],
      govtRole: 'Government pays all interest accrued during study period. Interest rate: 9.5% (govt-sponsored loans).',
      timeline: '10 years for repayment after study completion'
    },

    {
      name: 'PM Awas Yojana (Home Subsidy)',
      emoji: '🏠',
      category: 'Housing Support',
      type: 'fixed', // Fixed amount
      frequency: 1,
      userContribution: 500000, // Downpayment
      govtContribution: 267000, // Max subsidy
      totalYears: 20,
      description: 'Government gives direct subsidy on home loan interest. If you buy a house with loan, govt covers part of interest cost (CLSS).',
      features: [
        '✅ Direct subsidy on interest for 20 years',
        '✅ Max subsidy: ₹2.67 Lakh',
        '✅ Reduces monthly EMI by 30-40%',
        '✅ Covers interest, not principal',
        '✅ For first-time homebuyers only'
      ],
      govtRole: 'Government directly pays interest to bank. You pay reduced EMI. Govt absorbs ~₹2.67L per home.',
      timeline: '20 years (home loan tenure)'
    },

    {
      name: 'PM Kisan Samman Nidhi',
      emoji: '🌾',
      category: 'Agricultural Support',
      type: 'fixed', // Fixed amount
      frequency: 1,
      userContribution: 0, 
      govtContribution: 6000, // Cash transfer
      totalYears: 99,
      description: 'Government gives ₹6,000 per year directly to farmers (3 installments of ₹2,000). No loan, pure transfer.',
      features: [
        '✅ ₹6,000/year direct to bank account (3×₹2,000)',
        '✅ No repayment required - pure transfer',
        '✅ Landholding limit: 2 hectares',
        '✅ Covers input costs (seeds, fertilizer, labor)',
        '✅ Launched 2019 - covers 11+ crore farmers'
      ],
      govtRole: 'Government transfers ₹6,000/year to eligible farmers to support agricultural input costs.',
      timeline: 'Ongoing - continuous transfer'
    }
  ];

  const scheme = schemes[selectedScheme];
  
  // ✅ FIXED CALCULATION FOR DETAILED VIEW
  let userAnnualInvestment, govtAnnualContribution;

  if (scheme.type === 'percent') {
    userAnnualInvestment = (scheme.userContribution / 100) * userIncome;
    govtAnnualContribution = (scheme.govtContribution / 100) * userIncome;
  } else {
    const freq = scheme.frequency || 1;
    userAnnualInvestment = scheme.userContribution * freq;
    govtAnnualContribution = scheme.govtContribution * freq;
  }

  const totalAnnualBenefit = userAnnualInvestment + govtAnnualContribution;
  const percentOfIncome = (totalAnnualBenefit / userIncome) * 100;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 p-8 rounded-3xl border border-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
          Government Subsidy Schemes 🎁
        </h1>
        <p className="text-slate-300 relative z-10 max-w-2xl">
          Understand which government subsidies apply to YOU based on your annual income of <span className="font-bold text-blue-300">{formatCurrency(userIncome)}</span>. 
          Click any scheme to see detailed breakdown.
        </p>
      </div>

      {/* YOUR INCOME BANNER */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm uppercase font-bold">Your Annual Income</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{formatCurrency(userIncome)}</p>
            <p className="text-xs text-slate-400 mt-2">📌 Change this in "Income Tax" tab to update subsidy calculations</p>
          </div>
          <div className="text-5xl">💰</div>
        </div>
      </div>

      {/* SCHEMES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((s, idx) => (
          <SchemeCard
            key={idx}
            scheme={s}
            userIncome={userIncome}
            isSelected={selectedScheme === idx}
            onClick={() => setSelectedScheme(idx)}
          />
        ))}
      </div>

      {/* DETAILED SCHEME VIEW */}
      <div className="space-y-6">
        {/* SCHEME TITLE & DESCRIPTION */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="text-7xl">{scheme.emoji}</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{scheme.name}</h2>
              <p className="text-blue-300 text-sm font-bold uppercase mb-3">{scheme.category}</p>
              <p className="text-slate-300 text-lg leading-relaxed">{scheme.description}</p>
            </div>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: YOUR NUMBERS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-white">💸 Your Personal Calculation</h3>

            {/* WHAT YOU PAY */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm uppercase font-bold mb-3">You Pay / Invest</p>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-slate-300">Annual:</span>
                  <span className="text-3xl font-black text-white">
                    ₹{Math.round(userAnnualInvestment).toLocaleString('en-IN')}
                  </span>
                </div>
                {scheme.type === 'percent' && (
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-slate-400">% of Your Income:</span>
                    <span className="text-slate-300 font-bold">
                      {scheme.userContribution}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* WHAT GOVT GIVES */}
            <div className="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20">
              <p className="text-emerald-300 text-sm uppercase font-bold mb-3">🎁 Government Adds</p>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-emerald-200">Per Year:</span>
                  <span className="text-3xl font-black text-emerald-400">
                    ₹{Math.round(govtAnnualContribution).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-end text-sm">
                  <span className="text-emerald-300/70">Monthly Avg:</span>
                  <span className="text-emerald-300">
                    ₹{Math.round(govtAnnualContribution / 12).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* TOTAL BENEFIT */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30">
              <p className="text-blue-300 text-sm uppercase font-bold mb-3">✨ Total Annual Value</p>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-blue-200 text-lg font-bold">Combined:</span>
                  <span className="text-4xl font-black text-blue-300">
                    ₹{Math.round(totalAnnualBenefit).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-blue-300/70 text-xs mt-3">
                  {percentOfIncome < 100 
                    ? `That's ${percentOfIncome.toFixed(1)}% of your annual income!`
                    : `Huge value! This exceeds your annual income due to asset value.`}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: SCHEME DETAILS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">📋 Scheme Features</h3>
              <div className="space-y-3">
                {scheme.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700">
                    <span className="text-emerald-400 font-bold">•</span>
                    <p className="text-slate-300 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h4 className="text-lg font-bold text-white mb-3">🏛️ How Government Helps</h4>
              <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                <p className="text-blue-200 text-sm leading-relaxed">{scheme.govtRole}</p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h4 className="text-lg font-bold text-white mb-3">⏱️ Timeline</h4>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-300 text-sm">{scheme.timeline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* COMPARISON: WITHOUT SUBSIDY */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/20 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">📊 Impact Without This Subsidy</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <p className="text-red-300 text-xs uppercase font-bold mb-2">You Would Pay Alone</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-red-400">
                  ₹{Math.round(totalAnnualBenefit).toLocaleString('en-IN')}
                </p>
                <span className="text-xs text-red-300/70 mb-1">/year</span>
              </div>
              <p className="text-xs text-red-300/70 mt-2">To get the same benefit without government help</p>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
              <p className="text-emerald-300 text-xs uppercase font-bold mb-2">Government Covers</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-emerald-400">
                  ₹{Math.round(govtAnnualContribution).toLocaleString('en-IN')}
                </p>
                <span className="text-xs text-emerald-300/70 mb-1">/year</span>
              </div>
              <p className="text-xs text-emerald-300/70 mt-2">This is money staying in your pocket</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
        <p className="text-blue-300 text-sm">
          💡 <strong>Pro Tip:</strong> You can apply for MULTIPLE schemes at the same time! 
          The total government support to you could be much more when you combine several schemes.
        </p>
      </div>
    </div>
  );
}