// client/src/modules/LearnHub.jsx
import React, { useState } from 'react';

export default function LearnHub() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const topics = [
    { id: 'fiscal-deficit', title: 'Fiscal Deficit', emoji: '📉' },
    { id: 'repo-rate', title: 'Repo Rate', emoji: '🏦' },
    { id: 'inflation', title: 'Inflation', emoji: '🎈' },
    { id: 'gdp', title: 'GDP', emoji: '🌏' },
    { id: 'gst', title: 'GST Structures', emoji: '🧾' },
    { id: '80c', title: 'Section 80C', emoji: '💰' },
  ];

  const handleExplain = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setExplanation(''); // Clear previous text
    
    try {
      const response = await fetch('http://localhost:5000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // We send a specific prompt for learning
          prompt: `Explain the financial concept of "${topic.title}" to a college student. Keep it simple, under 60 words, and use an analogy.`,
          // ⚠️ CRITICAL: We must send dummy data so the backend doesn't crash
          taxData: { income: 0, totalTax: 0, betterRegime: 'N/A' },
          gstData: { totalGST: 0 },
          userProfile: { displayName: 'Student' }
        })
      });

      if (!response.ok) throw new Error("Server Offline");
      
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation("⚠️ Connection Error: Please ensure your backend server (node index.js) is running.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 p-8 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 relative z-10">
           Financial <span className="text-indigo-400">Learn Hub</span>
         </h1>
         <p className="text-slate-300 relative z-10">
           Click any topic below to get an instant AI-powered explanation.
         </p>
      </div>

      {/* TOPIC GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => handleExplain(topic)}
            className={`p-6 rounded-2xl border transition-all text-left group hover:-translate-y-1 ${
              selectedTopic?.id === topic.id 
                ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-900/50' 
                : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50'
            }`}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{topic.emoji}</div>
            <div className={`font-bold text-lg ${selectedTopic?.id === topic.id ? 'text-white' : 'text-slate-200'}`}>
              {topic.title}
            </div>
          </button>
        ))}
      </div>

      {/* AI OUTPUT AREA */}
      <div className={`transition-all duration-500 ${selectedTopic ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {selectedTopic && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 p-8 rounded-3xl shadow-2xl relative">
            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl animate-pulse-slow"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    Thinking...
                  </>
                ) : (
                  <>
                    <span>✨</span> Gemini Explains: {selectedTopic.title}
                  </>
                )}
              </h3>
              
              <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800">
                <p className="text-slate-200 leading-relaxed text-lg">
                  {explanation || "Connecting to AI Agent..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}