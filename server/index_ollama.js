// server/index_ollama.js
// Run this file with: node index_ollama.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- HELPER: TALK TO LOCAL OLLAMA ---
async function callOllama(prompt) {
  try {
    // 1. Check if Ollama is actually running
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "mistral", // Make sure you ran 'ollama run mistral' in a separate terminal
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error("Ollama connection failed");
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("❌ Ollama Error:", error.message);
    return "Error: Local AI is offline. Please run 'ollama run mistral' in a terminal.";
  }
}

// --- ROUTE 1: POLICY SIMULATOR SLIDERS ---
app.post('/api/explain-impact', async (req, res) => {
  const { income, gstChange, taxChange, fuelChange } = req.body;
  console.log("⚡ [Ollama] Analyzing Slider Scenario...");

  const prompt = `
    Act as a financial advisor. User Income: ₹${income}.
    Scenario: GST ${gstChange}%, Income Tax ${taxChange}%, Fuel ₹${fuelChange}.
    Explain the impact on their buying power in exactly 2 short sentences.
  `;

  const text = await callOllama(prompt);
  res.json({ explanation: text });
});

// --- ROUTE 2: DASHBOARD AI EXPLAINER ---
app.post('/api/ai/explain', async (req, res) => {
  const { prompt, taxData, userProfile } = req.body;
  console.log("⚡ [Ollama] Explaining Dashboard Data...");

  const fullPrompt = `
    You are a friendly Indian financial advisor.
    User Name: ${userProfile?.displayName || 'Friend'}
    Income: ₹${taxData.income}
    Total Tax: ₹${taxData.totalTax}
    
    User Question: "${prompt}"
    
    Please explain this simply in under 50 words. Be encouraging. Use the Rupee symbol (₹).
  `;

  const text = await callOllama(fullPrompt);
  res.json({ explanation: text });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 LOCAL AI SERVER RUNNING on Port ${PORT}`);
  console.log(`   (Using Ollama / Mistral)\n`);
});