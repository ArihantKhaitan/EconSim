// client/src/modules/LearnHub.jsx
import React, { useState } from 'react';

const TOPICS = [
  { id: 1, term: 'GST (Goods & Services Tax)', short: 'One tax for the whole nation.', icon: '🛒' },
  { id: 2, term: 'Old vs New Regime', short: 'Deductions vs Lower Rates.', icon: '⚖️' },
  { id: 3, term: 'Fiscal Deficit', short: 'When govt spends more than it earns.', icon: '📉' },
  { id: 4, term: 'Repo Rate', short: 'Interest rate at which RBI lends money.', icon: '🏦' },
  { id: 5, term: 'Inflation', short: 'Rate at which prices increase over time.', icon: '🎈' },
  { id: 6, term: 'Standard Deduction', short: 'Flat deduction from salary income.', icon: '✂️' },
];

export default function LearnHub() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const explainTopic = async (topic) => {
    setLoading(true);
    setAiExplanation('');
    setSelectedTopic(topic);
    
    try {
      const response = await fetch('http://localhost:5000/api/explain-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: topic.term })
      });
      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (error) {
      setAiExplanation("AI tutor is currently unavailable. Try again later!");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Financial Learn Hub</h2>
        <p className="text-slate-400">Master economic concepts with AI assistance</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <div key={topic.id} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all cursor-pointer group" onClick={() => explainTopic(topic)}>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{topic.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{topic.term}</h3>
            <p className="text-slate-400 text-sm">{topic.short}</p>
            <div className="mt-4 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Explain <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Explanation Modal */}
      {(selectedTopic || loading) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={() => setSelectedTopic(null)}>
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-2xl w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTopic(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{selectedTopic?.icon || '🤖'}</span>
              <div>
                <h3 className="text-2xl font-bold">{selectedTopic?.term || 'Analyzing...'}</h3>
                <p className="text-emerald-400 text-sm">AI Tutor Mode</p>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 min-h-[150px]">
              {loading ? (
                <div className="flex items-center justify-center h-full gap-2 text-slate-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150" />
                  <span>Generative AI is thinking...</span>
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{aiExplanation}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}