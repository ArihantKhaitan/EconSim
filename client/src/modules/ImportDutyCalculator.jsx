// client/src/modules/ImportDutyCalculator.jsx
import React, { useState } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const DutyCard = ({ product, isSelected, onClick }) => {
  const dutyAmount = product.basePrice * (product.dutyRate / 100);
  const finalPrice = product.basePrice + dutyAmount;

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 text-left transition-all transform hover:scale-105 ${
        isSelected
          ? 'bg-gradient-to-br from-orange-900/40 to-red-900/30 border-orange-500 ring-2 ring-orange-500/30'
          : 'bg-slate-800 border-slate-700 hover:border-orange-500/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-3xl mb-2">{product.emoji}</div>
          <h3 className="font-bold text-white">{product.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase font-bold">Duty Rate</div>
          <div className={`text-lg font-black ${isSelected ? 'text-orange-400' : 'text-slate-300'}`}>
            {product.dutyRate}%
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Import cost:</span>
          <span className="font-mono text-slate-300">₹{product.basePrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Final price:</span>
          <span className="font-mono text-red-400 font-bold">₹{Math.round(finalPrice).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </button>
  );
};

export default function ImportDutyCalculator() {
  const [selectedProduct, setSelectedProduct] = useState(0);

  const products = [
    {
      name: 'Smartphones',
      emoji: '📱',
      basePrice: 25000, 
      dutyRate: 20,
      origin: 'China/Vietnam',
      description: 'Mobile phones imported face 20% customs duty. This is why iPhones & Samsung flagships are so expensive in India compared to USA.',
      impact: 'A ₹25,000 phone costs ₹30,000 with duty. On Apple, this difference is even bigger (₹1,50,000 → ₹1,80,000+).',
      whoAffects: 'Tech-savvy consumers, students, professionals who want latest phones',
      realWorld: [
        '🍎 iPhone 15: Costs $799 in USA (₹67k) but ₹89,999 in India.',
        '📈 Import duty + GST makes it ₹22,999 MORE expensive in India.',
        '🇮🇳 Indian alternative: OnePlus & Realme price competitively to benefit.'
      ]
    },
    {
      name: 'Laptops & Computers',
      emoji: '💻',
      basePrice: 60000, 
      dutyRate: 20,
      origin: 'China/Taiwan',
      description: 'Electronics have 20% import duty. A ₹60k laptop becomes ₹72k. High-end gaming laptops see even bigger absolute cost increases.',
      impact: 'A ₹1,00,000 laptop costs ₹1,20,000 with duty. Makes gaming & workstations unaffordable for students.',
      whoAffects: 'Students, freelancers, content creators needing high-spec machines',
      realWorld: [
        '💻 MacBook Air: $1,099 in USA (₹92k) but ₹1,14,900 in India.',
        '📈 Duty makes it ₹22k more expensive.',
        '🇮🇳 Effect: Many students buy refurbished/second-hand to avoid cost.'
      ]
    },
    {
      name: 'Crude Oil Import',
      emoji: '🛢️',
      basePrice: 80, 
      dutyRate: 5,
      unit: 'per barrel',
      origin: 'Middle East/USA',
      description: 'India imports 85% of crude oil. Import duty & taxes add ₹2-3 per liter to fuel. This affects transport costs nationwide.',
      impact: 'Petrol: ₹100/liter base → ₹102-103 with duty/tax. On 1000L/month fuel consumption (taxi/truck), costs ₹2,000-3,000 extra.',
      whoAffects: 'Transportation industry, logistics, daily commuters (indirect effect on Uber/Ola fares)',
      realWorld: [
        '⛽ Petrol prices: Change daily based on crude oil import costs.',
        '📈 Duty & taxes add ₹25+ per liter.',
        '🚗 Effect: CNG cars become attractive. EV adoption increases.'
      ]
    },
    {
      name: 'Appliances (Washing Machine)',
      emoji: '🧺',
      basePrice: 35000, 
      dutyRate: 20,
      origin: 'China/Thailand',
      description: '20% duty on home appliances. Imported machines from China are cheaper, but duty adds ₹7,000. This protects local manufacturers.',
      impact: 'A ₹35k washing machine becomes ₹42k. Makes it unaffordable for lower-middle class.',
      whoAffects: 'Households buying appliances, middle-class families',
      realWorld: [
        '🧺 Washing Machines: Samsung pays duty, raises India prices 20%.',
        '📈 Local brand Godrej can price lower → gains market share.',
        '🏭 Effect: Local manufacturing encouraged, jobs created.'
      ]
    },
    {
      name: 'Electronics Components (Chips)',
      emoji: '🔌',
      basePrice: 500, 
      dutyRate: 15,
      unit: 'per chip',
      origin: 'Taiwan/South Korea',
      description: 'Semiconductor chips have 15% duty. These are used in all electronics—phones, cars, appliances. The duty cascades through the entire supply chain.',
      impact: 'A ₹500 chip becomes ₹575. When a phone needs 50 chips, duty adds ₹3,750 to its cost.',
      whoAffects: 'Entire electronics industry, eventually all consumers (passed in final prices)',
      realWorld: [
        '🔌 Chip shortage: Duty increases cost of chips in all electronics.',
        '📈 Cascading effect: Phone cost ↑, laptop cost ↑, car cost ↑',
        '🇮🇳 Government goal: Build domestic semiconductor plants (India Chip Mission)'
      ]
    },
    {
      name: 'Agricultural Products (Wheat)',
      emoji: '🌾',
      basePrice: 20, 
      dutyRate: 40,
      unit: 'per kg',
      origin: 'Australia/Ukraine',
      description: 'India sometimes imports food grains. 40% import duty + quota system makes imported wheat expensive, protecting Indian farmers.',
      impact: 'Imported wheat: ₹20/kg base → ₹28/kg with duty. India prefers domestic supply to keep food prices low.',
      whoAffects: 'Food prices, farmers (protected), consumers (protected)',
      realWorld: [
        '🌾 Wheat import: 40% duty keeps it expensive → domestic supply preferred',
        '📈 Protects Indian farmers from global price swings',
        '🍞 Effect: Bread prices remain stable, farmers get fair price'
      ]
    }
  ];

  const current = products[selectedProduct];
  const dutyAmount = current.basePrice * (current.dutyRate / 100);
  const finalPrice = current.basePrice + dutyAmount;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 p-8 rounded-3xl border border-orange-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
          Import Duty Impact Calculator 📦
        </h1>
        <p className="text-slate-300 relative z-10 max-w-2xl">
          Understand how import duties affect consumer prices. See why products cost more in India than abroad.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, idx) => (
          <DutyCard
            key={idx}
            product={product}
            isSelected={selectedProduct === idx}
            onClick={() => setSelectedProduct(idx)}
          />
        ))}
      </div>

      {/* DETAILED VIEW */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: Description & How It Works */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div>
            <div className="text-6xl mb-4">{current.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{current.name}</h2>
            <p className="text-slate-400">From: {current.origin}</p>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">How Import Duty Works</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              {current.description}
            </p>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-sm text-orange-400 font-semibold">💡 {current.impact}</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-slate-700 pt-6 space-y-3">
            <h3 className="text-lg font-bold text-white">Price Breakdown</h3>
            
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-300">Import Cost (Base)</span>
              </div>
              <div className="text-3xl font-black text-white">
                ₹{current.basePrice.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-2">Cost of product in origin country</p>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-orange-300">Import Duty ({current.dutyRate}%)</span>
              </div>
              <div className="text-2xl font-black text-orange-400">
                + ₹{Math.round(dutyAmount).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-orange-300/70 mt-2">Tax imposed by govt when importing</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-red-900/40 to-orange-900/30 border border-red-500/30 flex items-center justify-between">
              <span className="font-bold text-white text-lg">Final Consumer Price</span>
              <span className="text-3xl font-black text-red-400">
                ₹{Math.round(finalPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Who Benefits? */}
          <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
            <h4 className="text-sm font-bold text-blue-300 mb-2">👥 Who Is Affected?</h4>
            <p className="text-xs text-blue-200 leading-relaxed">
              {current.whoAffects}
            </p>
          </div>
        </div>

        {/* RIGHT: Policy Impact Analysis */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">Policy Impact Analysis</h2>

          {/* Cost Comparison */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Price Comparison</h3>
            
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold">Scenario 1: NO Import Duty</span>
                <span className="text-xs text-slate-400 uppercase font-bold">Hypothetical</span>
              </div>
              <div className="text-2xl font-black text-white mb-2">
                ₹{current.basePrice.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400">
                If govt removed duty, product would cost this much. Cheaper for consumers, but local industry loses market.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold">Scenario 2: WITH Duty ({current.dutyRate}%)</span>
                <span className="text-xs text-orange-400 uppercase font-bold">Current Policy</span>
              </div>
              <div className="text-2xl font-black text-orange-400 mb-2">
                ₹{Math.round(finalPrice).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-orange-300/70">
                Current cost with duty. Protects local industry but consumers pay more.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Price Difference (Duty Cost)</span>
                <span className="text-2xl font-black text-red-400">
                  +₹{Math.round(dutyAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-red-300/70 mt-2">
                How much MORE you pay due to import duty
              </p>
            </div>
          </div>

          {/* Why Does Govt Use Duty? */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">🎯 Why Does India Use Import Duty?</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="text-2xl">🏭</div>
                <div>
                  <p className="font-bold text-white text-sm">Protect Local Industry</p>
                  <p className="text-xs text-slate-400">Makes Indian companies competitive by increasing import costs</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">💰</div>
                <div>
                  <p className="font-bold text-white text-sm">Government Revenue</p>
                  <p className="text-xs text-slate-400">Duty money goes to govt budget</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">💼</div>
                <div>
                  <p className="font-bold text-white text-sm">Create Jobs</p>
                  <p className="text-xs text-slate-400">Protected industry hires more workers</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <p className="font-bold text-white text-sm">Trade Retaliation Risk</p>
                  <p className="text-xs text-slate-400">Other countries may raise duty on Indian exports</p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Example */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm font-bold text-white mb-3">📊 Real-World Effect</h4>
            <div className="space-y-2 text-xs text-slate-300">
              {/* ✅ FIXED: Now maps over the array inside the product object directly */}
              {current.realWorld.map((line, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/(\*\*(.*?)\*\*)/g, '<strong>$2</strong>') }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}