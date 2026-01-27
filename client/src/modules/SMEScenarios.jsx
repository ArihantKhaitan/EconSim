import React, { useState } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const ScenarioCard = ({ scenario, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 text-left transition-all transform hover:scale-105 h-full ${
        isSelected
          ? 'bg-gradient-to-br from-violet-900/40 to-indigo-900/30 border-violet-500 ring-2 ring-violet-500/30'
          : 'bg-slate-800 border-slate-700 hover:border-violet-500/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-5xl mb-3">{scenario.emoji}</div>
          <h3 className="font-bold text-white text-lg">{scenario.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{scenario.owner}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase font-bold mb-1">Business Type</div>
          <div className={`text-sm font-black ${isSelected ? 'text-violet-400' : 'text-slate-300'}`}>
            {scenario.type}
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-300 line-clamp-3">{scenario.description}</p>
    </button>
  );
};

export default function SMEScenarios() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  const scenarios = [
    {
      title: 'Restaurant Owner Crisis',
      owner: 'Priya, Delhi',
      emoji: '🍽️',
      type: 'Food & Beverage',
      description: 'GST on food services increased. Should you raise menu prices or absorb the cost?',
      
      currentState: {
        monthlyRevenue: 100000,
        monthlyExpenses: 60000,
        currentProfit: 40000,
        monthlyCustomers: 500
      },

      event: {
        title: '📢 GST Rate Change',
        description: 'Government increases GST on restaurant meals from 5% to 12%',
        impact: 'Your tax liability increases by ₹7,000/month'
      },

      decisions: [
        {
          option: 'A: Raise Menu Prices by 8%',
          details: {
            newRevenue: 108000,
            newTax: 12960, // 12% of revenue
            oldTax: 5000, // 5% of revenue
            taxIncrease: 7960,
            revenueGain: 8000,
            netProfit: 40040,
            impact: 'Good: +₹40/month profit. Bad: Lose ~20-30 customers to competitor',
            customerLoss: '~100 customers/month (20%)',
            decision: 'RISKY - Price-sensitive market (food industry)'
          }
        },
        {
          option: 'B: Keep Prices Same, Absorb Cost',
          details: {
            revenue: 100000,
            newTax: 12000, // 12% of revenue
            oldTax: 5000,
            taxIncrease: 7000,
            newProfit: 33000, // 40000 - 7000
            profitLoss: 7000,
            impact: 'Good: Keep customers, stay competitive. Bad: Margin squeezed by 17.5%',
            customerLoss: '0 customers',
            decision: 'SAFER - But unsustainable long-term'
          }
        },
        {
          option: 'C: Raise by 3%, Reduce Portion Size (Hidden)',
          details: {
            newRevenue: 103000,
            newTax: 12360,
            oldTax: 5000,
            taxIncrease: 7360,
            newProfit: 35640, // 40000 - 7360 + 3000 (revenue) - 500 (cost savings)
            impact: 'Good: Keep prices low, reduce food cost. Bad: Customer discovers & loses trust',
            customerLoss: 'Not immediate, but 10-15% leave after 2-3 months',
            decision: 'UNETHICAL - Damages brand long-term'
          }
        }
      ]
    },

    {
      title: 'E-commerce Seller Squeeze',
      owner: 'Arjun, Bangalore',
      emoji: '📦',
      type: 'E-commerce',
      description: 'Import duty on electronics increases. Your product costs go up 20%. What do you do?',
      
      currentState: {
        monthlySales: 50,
        costPerUnit: 500,
        sellingPrice: 1200,
        profitPerUnit: 700,
        monthlyProfit: 35000
      },

      event: {
        title: '📢 Import Duty Increase',
        description: 'Government raises import duty on electronics from 15% to 25%',
        impact: 'Your cost per unit goes from ₹500 to ₹600 (+₹100 per unit)'
      },

      decisions: [
        {
          option: 'A: Raise Price to ₹1,300 (+8.3%)',
          details: {
            newPrice: 1300,
            newCost: 600,
            newProfitPerUnit: 700,
            monthlySales: 40, // Lose 20% customers
            newMonthlyProfit: 28000,
            profitLoss: 7000,
            impact: 'Good: Maintain profit per unit. Bad: Lose customers to competitors',
            salesLoss: '~10 sales/month (-20%)',
            decision: 'MODERATE - Competitive market, tight margins'
          }
        },
        {
          option: 'B: Keep Price at ₹1,200, Absorb Cost',
          details: {
            price: 1200,
            newCost: 600,
            newProfitPerUnit: 600, // Loss of ₹100 per unit
            monthlySales: 50,
            newMonthlyProfit: 30000, // 600 × 50
            profitLoss: 5000,
            impact: 'Good: Keep all customers. Bad: Profit margin drops 14%',
            salesLoss: '0 customers',
            decision: 'SUSTAINABLE - Volume maintains profitability'
          }
        },
        {
          option: 'C: Switch to Local Manufacturer (Negotiate)',
          details: {
            newCost: 550, // Local sourcing slightly cheaper
            newPrice: 1200,
            newProfitPerUnit: 650,
            monthlySales: 50,
            newMonthlyProfit: 32500,
            profitLoss: 2500,
            impact: 'Good: Reduce cost, keep price, minimal profit loss. Bad: Local quality may be inconsistent',
            delay: 'Takes 1-2 months to negotiate & setup',
            decision: 'STRATEGIC - Long-term advantage if quality matches'
          }
        }
      ]
    },

    {
      title: 'Manufacturing Unit Subsidy Shock',
      owner: 'Rajesh, Gujarat',
      emoji: '🏭',
      type: 'Manufacturing',
      description: 'Subsidy on raw materials is removed. Your input costs jump 25%. How do you stay competitive?',
      
      currentState: {
        monthlyProduction: 1000,
        rawMaterialCost: 200,
        otherCosts: 100,
        totalCostPerUnit: 300,
        sellingPrice: 600,
        profitPerUnit: 300,
        monthlyProfit: 300000
      },

      event: {
        title: '📢 Subsidy Removal',
        description: 'Government removes agricultural subsidy (fertilizers, steel). Raw material costs spike 25%',
        impact: 'Your raw material cost goes from ₹200 to ₹250 (+₹50 per unit)'
      },

      decisions: [
        {
          option: 'A: Raise Selling Price to ₹650',
          details: {
            newPrice: 650,
            newCost: 350,
            newProfitPerUnit: 300,
            monthlySales: 800, // Lose 20% volume to price sensitivity
            newMonthlyProfit: 240000,
            profitLoss: 60000,
            impact: 'Good: Maintain unit profit. Bad: Lose industrial contracts due to price increase',
            volumeLoss: '~200 units/month (-20%)',
            decision: 'RISKY - B2B buyers have alternatives'
          }
        },
        {
          option: 'B: Keep Price at ₹600, Absorb Cost',
          details: {
            price: 600,
            newCost: 350,
            newProfitPerUnit: 250, // Loss of ₹50 per unit
            monthlySales: 1000,
            newMonthlyProfit: 250000,
            profitLoss: 50000,
            impact: 'Good: Keep market share & contracts. Bad: Profit margin drops 16.7%',
            volumeLoss: '0 units',
            decision: 'SUSTAINABLE - Maintains customer relationships'
          }
        },
        {
          option: 'C: Automate Production (Capital Investment)',
          details: {
            capInvestment: 500000,
            costReduction: 30, // ₹30/unit savings through automation
            newCost: 320, // 350 - 30
            newPrice: 600,
            newProfitPerUnit: 280,
            monthlySales: 1000,
            monthlyProfit: 280000,
            paybackMonths: 500000 / (30 * 1000), // ~16.7 months
            impact: 'Good: Reduce cost per unit, improve efficiency. Bad: High upfront cost, need financing',
            timeFrame: 'Takes 3-4 months to setup',
            decision: 'STRATEGIC - Long-term competitiveness but risky'
          }
        }
      ]
    },

    {
      title: 'Small Shop Inflation Pressure',
      owner: 'Fatima, Mumbai',
      emoji: '🏪',
      type: 'Retail',
      description: 'Food inflation spikes 14% (vegetable shortage). Your customers demand lower prices. What do you do?',
      
      currentState: {
        dailyRevenue: 5000,
        monthlyRevenue: 150000,
        costOfGoods: 75000,
        grossProfit: 75000,
        monthlyProfit: 40000
      },

      event: {
        title: '📢 Food Inflation Crisis',
        description: 'Tomato/onion prices surge 40-50% due to supply shock. Vegetables that cost ₹20 now cost ₹30-35',
        impact: 'Your COGS increases by 10-15% (₹7,500-11,250 per month)'
      },

      decisions: [
        {
          option: 'A: Raise Prices on All Items by 10%',
          details: {
            newRevenue: 165000,
            oldRevenue: 150000,
            newCOGS: 82500, // 75000 × 1.10
            newProfit: 82500, // 165000 - 82500
            netProfit: 42500,
            profitGain: 2500,
            impact: 'Good: Offset inflation cost. Bad: Customers shop elsewhere (poorer neighborhoods, compete on price)',
            customerLoss: '~15-20% daily visitors leave',
            decision: 'RISKY - Retail is price-sensitive, esp. lower income'
          }
        },
        {
          option: 'B: Absorb Cost, Keep Prices Same',
          details: {
            revenue: 150000,
            newCOGS: 82500, // 75000 + 7500
            newProfit: 67500,
            profitLoss: 7500,
            impact: 'Good: Keep customer loyalty, volume stable. Bad: Margin compressed by 10%',
            customerLoss: '0 customers',
            decision: 'SUSTAINABLE - Community trust matters'
          }
        },
        {
          option: 'C: Use Ration Card Link or Get Govt Benefit',
          details: {
            info: 'Partner with govt subsidy schemes. Sell subsidized essentials at lower prices through ration card system',
            newRevenue: 155000, // Slightly higher from subsidy products
            subsidyBenefit: 5000, // Govt incentive for participating
            newProfit: 45000,
            impact: 'Good: Govt support, customer loyalty, stable margins. Bad: Paperwork, compliance requirements',
            process: 'Takes 2 weeks to register with NFSA',
            decision: 'SMART - Win-win for shop & community'
          }
        }
      ]
    },

    {
      title: 'Logistics Startup Fuel Crisis',
      owner: 'Vikram, Delhi',
      emoji: '🚚',
      type: 'Logistics',
      description: 'Crude oil prices spike. Fuel cost jumps ₹3/liter. Your delivery costs increase. How do you handle?',
      
      currentState: {
        monthlyDeliveries: 2000,
        fuelCostPerDelivery: 5,
        monthlyFuelCost: 10000,
        chargePerDelivery: 50,
        monthlyRevenue: 100000,
        monthlyProfit: 30000
      },

      event: {
        title: '📢 Fuel Price Spike',
        description: 'Crude oil prices rise. Petrol goes from ₹100 to ₹103/liter. Import duty impact.',
        impact: 'Fuel cost per delivery increases from ₹5 to ₹8 (+₹3 per delivery)'
      },

      decisions: [
        {
          option: 'A: Increase Delivery Charge to ₹56',
          details: {
            newCharge: 56,
            chargeIncrease: 6,
            monthlyRevenue: 112000, // 2000 × 56
            newFuelCost: 16000, // 2000 × 8
            newProfit: 96000, // 112000 - 16000
            profitGain: 66000,
            deliveryLoss: 1000, // Lose 50% customers to competitors
            newMonthlyRevenue: 56000,
            actualProfit: 8000,
            profitLoss: 22000,
            decision: 'RISKY - Logistics is competitive, customers shop by price'
          }
        },
        {
          option: 'B: Absorb Cost, Keep Charge at ₹50',
          details: {
            charge: 50,
            monthlyRevenue: 100000,
            newFuelCost: 16000,
            newProfit: 25000, // Lost ₹5,000 per month
            profitLoss: 5000,
            impact: 'Good: Retain all customers. Bad: Margin compressed, sustainability risk',
            decision: 'SHORT-TERM - Not sustainable if prices stay high'
          }
        },
        {
          option: 'C: Offer Subscription/Loyalty Plans',
          details: {
            monthlySubscription: 1500, // Flat fee for unlimited deliveries
            subscribers: 800, // Get 800 subscribers
            subscriberDeliveries: 1600,
            otherDeliveries: 400,
            subscriptionRevenue: 1200000, // 800 × 1500
            adhocRevenue: 20000, // 400 × 50
            totalRevenue: 1220000,
            fuelCost: 16000 + 3200, // 2000×8 + 400×8
            newProfit: 40000,
            profitGain: 10000,
            impact: 'Good: Predictable revenue, lock-in customers. Bad: Needs heavy marketing',
            decision: 'STRATEGIC - Creates customer loyalty moat'
          }
        }
      ]
    }
  ];

  const scenario = scenarios[selectedScenario];
  const decisionA = scenario.decisions[0];
  const decisionB = scenario.decisions[1];
  const decisionC = scenario.decisions[2];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-900/50 to-indigo-900/50 p-8 rounded-3xl border border-violet-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
          SME Policy Impact Scenarios 🎯
        </h1>
        <p className="text-slate-300 relative z-10 max-w-2xl">
          Real business owner dilemmas. See how policy changes force difficult trade-off decisions. Learn the consequences.
        </p>
      </div>

      {/* SCENARIO SELECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {scenarios.map((s, idx) => (
          <ScenarioCard
            key={idx}
            scenario={s}
            isSelected={selectedScenario === idx}
            onClick={() => {
              setSelectedScenario(idx);
              setShowDecision(false);
              setUserChoice(null);
            }}
          />
        ))}
      </div>

      {/* DETAILED SCENARIO VIEW */}
      <div className="space-y-6">
        {/* TITLE & OWNER */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="text-7xl">{scenario.emoji}</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{scenario.title}</h2>
              <p className="text-slate-400 text-lg mb-3">{scenario.owner}</p>
              <p className="text-slate-300">{scenario.description}</p>
            </div>
          </div>
        </div>

        {/* CURRENT STATE */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">📊 Current Business State</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(scenario.currentState).map(([key, value]) => (
              <div key={key} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </p>
                <p className="text-2xl font-black text-white">
                  {typeof value === 'number' && value > 100 
                    ? `₹${(value / 1000).toFixed(0)}k` 
                    : typeof value === 'number' ? value : value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* THE EVENT */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/30 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">{scenario.event.title}</h3>
          <p className="text-slate-300 text-lg mb-4">{scenario.event.description}</p>
          <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <p className="text-red-300 font-semibold text-lg">⚠️ {scenario.event.impact}</p>
          </div>
        </div>

        {/* DECISION SECTION */}
        {!showDecision ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">🤔 What Would You Do?</h3>
            <p className="text-slate-300 mb-6">Click the button below to see 3 real decisions this owner is considering...</p>
            <button
              onClick={() => setShowDecision(true)}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Show Decision Options
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Decision Options</h3>
            
            {/* Option A */}
            <div
              onClick={() => setUserChoice('A')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                userChoice === 'A'
                  ? 'bg-emerald-900/30 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-800 border-slate-700 hover:border-emerald-500'
              }`}
            >
              <h4 className="text-lg font-bold text-white mb-3">{decisionA.option}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {Object.entries(decisionA.details).slice(0, 4).map(([key, value]) => {
                  if (typeof value === 'object' || typeof value === 'string') return null;
                  return (
                    <div key={key} className="bg-slate-900/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 capitalize font-bold mb-1">{key}</p>
                      <p className="font-bold text-white">₹{typeof value === 'number' && value > 100 ? (value / 1000).toFixed(1) + 'k' : value}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-slate-300">{decisionA.details.impact}</p>
            </div>

            {/* Option B */}
            <div
              onClick={() => setUserChoice('B')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                userChoice === 'B'
                  ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-slate-800 border-slate-700 hover:border-blue-500'
              }`}
            >
              <h4 className="text-lg font-bold text-white mb-3">{decisionB.option}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {Object.entries(decisionB.details).slice(0, 4).map(([key, value]) => {
                  if (typeof value === 'object' || typeof value === 'string') return null;
                  return (
                    <div key={key} className="bg-slate-900/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 capitalize font-bold mb-1">{key}</p>
                      <p className="font-bold text-white">₹{typeof value === 'number' && value > 100 ? (value / 1000).toFixed(1) + 'k' : value}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-slate-300">{decisionB.details.impact}</p>
            </div>

            {/* Option C */}
            <div
              onClick={() => setUserChoice('C')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                userChoice === 'C'
                  ? 'bg-purple-900/30 border-purple-500 ring-2 ring-purple-500/30'
                  : 'bg-slate-800 border-slate-700 hover:border-purple-500'
              }`}
            >
              <h4 className="text-lg font-bold text-white mb-3">{decisionC.option}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {Object.entries(decisionC.details).slice(0, 4).map(([key, value]) => {
                  if (typeof value === 'object' || typeof value === 'string') return null;
                  return (
                    <div key={key} className="bg-slate-900/50 p-3 rounded-lg">
                      <p className="text-xs text-slate-400 capitalize font-bold mb-1">{key}</p>
                      <p className="font-bold text-white">₹{typeof value === 'number' && value > 100 ? (value / 1000).toFixed(1) + 'k' : value}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-slate-300">{decisionC.details.impact}</p>
            </div>
          </div>
        )}

        {/* LESSON LEARNED */}
        {userChoice && (
          <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/30 border border-indigo-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">💡 Lesson: Policy Trade-Offs</h3>
            <p className="text-slate-300 leading-relaxed">
              This scenario shows how government policies (taxes, duties, subsidies) force small business owners to make difficult choices. 
              There's no perfect solution—only trade-offs:
            </p>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>✅ <strong>Option A</strong> protects profit per unit but risks losing customers</li>
              <li>✅ <strong>Option B</strong> keeps customers but squeezes margins</li>
              <li>✅ <strong>Option C</strong> (if available) tries to solve the root problem strategically</li>
            </ul>
            <p className="mt-4 text-slate-400 text-sm italic">
              Understanding these trade-offs helps you make informed decisions as a policy maker or business owner.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}