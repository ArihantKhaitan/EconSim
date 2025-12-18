// client/src/modules/LearnHub.jsx
import React, { useState } from 'react';

export default function LearnHub() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Basics', 'Taxation', 'Macro Economy', 'Personal Finance'];

  const topics = [
    // BASICS
    { id: 'gdp', category: 'Basics', title: 'GDP', emoji: '🌏', prompt: 'Explain Gross Domestic Product (GDP) simply.' },
    { id: 'inflation', category: 'Basics', title: 'Inflation', emoji: '🎈', prompt: 'Explain Inflation and why things get expensive.' },
    { id: 'interest', category: 'Basics', title: 'Compound Interest', emoji: '📈', prompt: 'Explain the power of Compound Interest.' },
    { id: 'fiat', category: 'Basics', title: 'Fiat Money', emoji: '💵', prompt: 'What is Fiat Money vs Gold Standard?' },
    // NEW 25th TOPIC
    { id: 'erupee', category: 'Basics', title: 'Digital Rupee (e₹)', emoji: '📱', prompt: 'What is RBI Digital Rupee and how is it different from UPI?' },
    
    // MACRO ECONOMY
    { id: 'repo', category: 'Macro Economy', title: 'Repo Rate', emoji: '🏦', prompt: 'Explain Repo Rate and how RBI controls it.' },
    { id: 'fiscal', category: 'Macro Economy', title: 'Fiscal Deficit', emoji: '📉', prompt: 'What is Fiscal Deficit and is it bad?' },
    { id: 'forex', category: 'Macro Economy', title: 'Forex Reserves', emoji: '💱', prompt: 'Why are Forex Reserves important for India?' },
    { id: 'trade', category: 'Macro Economy', title: 'Trade Deficit', emoji: '🚢', prompt: 'Explain Trade Deficit (Import vs Export).' },
    { id: 'crr', category: 'Macro Economy', title: 'CRR & SLR', emoji: '🔒', prompt: 'Explain CRR and SLR in banking.' },

    // TAXATION
    { id: 'gst', category: 'Taxation', title: 'GST', emoji: '🧾', prompt: 'Explain how GST works in India simply.' },
    { id: 'tds', category: 'Taxation', title: 'TDS', emoji: '✂️', prompt: 'What is Tax Deducted at Source (TDS)?' },
    { id: '80c', category: 'Taxation', title: 'Section 80C', emoji: '☂️', prompt: 'Explain Section 80C tax deductions.' },
    { id: 'ltcg', category: 'Taxation', title: 'LTCG vs STCG', emoji: '📊', prompt: 'Explain Long Term vs Short Term Capital Gains tax.' },
    { id: 'cess', category: 'Taxation', title: 'Health & Edu Cess', emoji: '🏥', prompt: 'What is Cess on top of Income Tax?' },

    // PERSONAL FINANCE
    { id: 'sip', category: 'Personal Finance', title: 'SIP', emoji: '🔄', prompt: 'Why is SIP (Systematic Investment Plan) good?' },
    { id: 'pf', category: 'Personal Finance', title: 'EPF vs PPF', emoji: '👴', prompt: 'Difference between EPF and PPF accounts.' },
    { id: 'score', category: 'Personal Finance', title: 'CIBIL Score', emoji: '💯', prompt: 'What is CIBIL Score and how to improve it?' },
    { id: 'term', category: 'Personal Finance', title: 'Term Insurance', emoji: '🛡️', prompt: 'Why is Term Insurance important?' },
    { id: 'emergency', category: 'Personal Finance', title: 'Emergency Fund', emoji: '🆘', prompt: 'What is an Emergency Fund?' },
  ];

  const filteredTopics = activeCategory === 'All' 
    ? topics 
    : topics.filter(t => t.category === activeCategory);

  const handleExplain = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setExplanation(''); 
    
    try {
      const response = await fetch('http://localhost:5000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${topic.prompt} Keep it simple for a student. Under 60 words.`,
          taxData: { income: 0, totalTax: 0, betterRegime: 'N/A' },
          gstData: { totalGST: 0 },
          userProfile: { displayName: 'Learner' }
        })
      });

      if (!response.ok) throw new Error("Server Offline");
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation("⚠️ Connection Error: Please ensure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 p-8 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 relative z-10">
           Financial <span className="text-indigo-400">Knowledge Hub</span>
         </h1>
         <p className="text-slate-300 relative z-10 max-w-2xl mx-auto">
           Master the language of money. Click any topic to get an instant AI-powered explanation.
         </p>
         
         <div className="flex flex-wrap justify-center gap-2 mt-6 relative z-10">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                 activeCategory === cat 
                   ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                   : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
               }`}
             >
               {cat}
             </button>
           ))}
         </div>
      </div>

      {/* TOPIC GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredTopics.map(topic => (
          <button
            key={topic.id}
            onClick={() => handleExplain(topic)}
            className={`p-4 rounded-2xl border transition-all text-left group hover:-translate-y-1 ${
              selectedTopic?.id === topic.id 
                ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-900/50' 
                : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50'
            }`}
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{topic.emoji}</div>
            <div className={`font-bold text-sm ${selectedTopic?.id === topic.id ? 'text-white' : 'text-slate-200'}`}>
              {topic.title}
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1 tracking-wider">{topic.category}</div>
          </button>
        ))}
      </div>

      {/* AI OUTPUT AREA */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 transition-transform duration-500 z-50 ${selectedTopic ? 'translate-y-0' : 'translate-y-full'}`}>
        {selectedTopic && (
          <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 p-6 rounded-t-3xl shadow-2xl relative">
            <button onClick={() => setSelectedTopic(null)} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700">✕</button>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-indigo-400 mb-2 flex items-center gap-2">
                {loading ? <span className="animate-spin">🌀</span> : <span>✨</span>} 
                {loading ? 'AI is thinking...' : `Gemini Explains: ${selectedTopic.title}`}
              </h3>
              <p className="text-slate-200 leading-relaxed text-lg">
                {explanation || "Connecting to AI Agent..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}