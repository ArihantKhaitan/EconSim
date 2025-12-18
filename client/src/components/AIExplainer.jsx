// client/src/components/AIExplainer.jsx
import React, { useState, useEffect } from 'react';

const AIExplainer = ({ taxData, gstData, userProfile }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('simple'); // 'simple', 'detailed', 'hinglish'
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // --- VOICE SYNTHESIS (Text-to-Speech) ---
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = mode === 'hinglish' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // --- VOICE RECOGNITION (Speech-to-Text) ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser does not support Voice Recognition. Try Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = mode === 'hinglish' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Heard:", transcript);
      // Set the transcript in the text box
      setCustomPrompt(transcript);
      // Automatically trigger AI with the spoken prompt
      getExplanation(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const getExplanation = async (promptOverride = null) => {
    setLoading(true);
    setError('');
    stopSpeaking(); // Stop talking if starting new request
    
    // 1. Construct the prompt
    let finalPrompt = promptOverride || customPrompt;
    
    if (!finalPrompt) {
        const prompts = {
            simple: `Explain simply in 50 words how someone earning ₹${taxData.income} is affected by Budget 2025. Their tax: ₹${taxData.totalTax}. Use everyday examples.`,
            detailed: `Provide detailed analysis of tax implications for income ₹${taxData.income}. Compare Old vs New regime. Include specific savings tips.`,
            hinglish: `Hinglish mein batao ki ₹${taxData.income} kamaane wale ko Budget 2025 se kya fayda hai. Tax: ₹${taxData.totalTax}. Simple language use karo.`
        };
        finalPrompt = prompts[mode];
    } else {
        // Wrap voice query with context
        finalPrompt = `User Question: "${finalPrompt}". Context: Income ₹${taxData.income}, Tax ₹${taxData.totalTax}. Answer in ${mode === 'hinglish' ? 'Hinglish' : 'English'}. Keep it under 60 words.`;
    }

    try {
      // 2. Call the Real Backend
      const response = await fetch('http://localhost:5000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          taxData,
          gstData,
          userProfile
        })
      });
      
      if (!response.ok) throw new Error("Server Offline");

      const data = await response.json();
      setExplanation(data.explanation);
      
      // Auto-speak the response
      speakText(data.explanation);

    } catch (err) {
      console.error("AI Fetch Error:", err);
      setError("⚠️ Server disconnected. Showing offline estimate:");
      const fallback = generateFallbackExplanation(taxData, mode);
      setExplanation(fallback);
      speakText(fallback);
    }
    
    setLoading(false);
  };

  const generateFallbackExplanation = (data, mode) => {
    const monthly = Math.round(data.totalTax / 12);
    const savings = data.savings || 0;
    
    if (mode === 'hinglish') {
      return `Aapki salary ₹${data.income.toLocaleString()} pe ${data.betterRegime === 'new' ? 'New' : 'Old'} Regime best hai. Total tax sirf ₹${data.totalTax.toLocaleString()} (₹${monthly}/month). ${savings > 0 ? `Yeh choose karke aap ₹${savings.toLocaleString()} bacha rahe ho!` : ''} Budget 2025 ne middle class ko bada relief diya hai!`;
    }
    
    return `With an income of ₹${data.income.toLocaleString()}, the ${data.betterRegime === 'new' ? 'New' : 'Old'} Tax Regime saves you more. Your annual tax is ₹${data.totalTax.toLocaleString()} (₹${monthly}/month). ${savings > 0 ? `By choosing this regime, you save ₹${savings.toLocaleString()} annually!` : ''}`;
  };

  return (
    <div className="w-full">
      {/* MODE SELECTOR - Moved to top */}
      <div className="flex gap-2 mb-4">
        {['simple', 'detailed', 'hinglish'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${
              mode === m 
                ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/25' 
                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ERROR WARNING */}
      {error && (
        <div className="text-xs text-orange-400 mb-3 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20">
          {error} (Check if 'node index.js' is running)
        </div>
      )}

      {/* OUTPUT BOX */}
      {explanation ? (
        <div className="bg-slate-900/60 rounded-xl p-4 mb-4 border border-purple-500/20 shadow-inner relative group">
          <p className="text-slate-200 leading-relaxed text-sm md:text-base animate-fade-in pr-8">
            {explanation}
          </p>
          {/* Replay Audio Button */}
          <button 
            onClick={() => isSpeaking ? stopSpeaking() : speakText(explanation)}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
          >
            {isSpeaking ? '🔇' : '🔊'}
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/30 rounded-xl p-6 mb-4 border border-dashed border-slate-700 text-center">
          <p className="text-slate-500 text-sm">
            Type your question, <strong>speak</strong>, or click Generate to get personalized advice.
          </p>
        </div>
      )}

      {/* INPUT BOX + VOICE BUTTON */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && getExplanation()}
          placeholder="Ask me anything about your taxes..."
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
        <button
          onClick={startListening}
          disabled={loading || isListening}
          className={`px-4 py-3 rounded-xl flex items-center justify-center transition-all ${
             isListening 
               ? 'bg-red-500/20 text-red-500 border border-red-500 animate-pulse' 
               : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600'
          }`}
          title="Speak your question"
        >
          {isListening ? '🎤' : '🎙️'}
        </button>
      </div>

      {/* GENERATE BUTTON */}
      <button
        onClick={() => getExplanation()}
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span className="text-lg group-hover:scale-110 transition-transform">✨</span>
            <span>Generate Analysis</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIExplainer;