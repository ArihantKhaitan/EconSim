import React from 'react';

export default function LearnHub() {
  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-bold">Learn About Taxes</h2><p className="text-slate-400">Simple explanations of complex concepts</p></div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { q: 'What is GST?', a: 'Unified indirect tax replacing VAT, excise & service tax', icon: '🛒' },
          { q: 'Old vs New Regime?', a: 'Old has deductions but higher rates. New has lower rates, no deductions.', icon: '⚖️' },
          { q: 'What is 80C?', a: '₹1.5L deduction for PPF, ELSS, etc. Old regime only.', icon: '💰' },
          { q: 'What is Cess?', a: '4% Health & Education Cess on tax for welfare', icon: '🏥' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h4 className="font-semibold mb-2">{item.q}</h4>
            <p className="text-sm text-slate-400">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}