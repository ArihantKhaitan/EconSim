// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Setup Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ CHANGED: Switched to 'gemini-2.5-flash' as per your request
const GOOGLE_MODEL_NAME = "gemini-2.5-flash"; 

// 2. Setup Ollama Helper (The Backup)
async function callOllama(prompt) {
  try {
    // ⚠️ Ensure Ollama is running: 'ollama run mistral'
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "mistral", 
        prompt: prompt,
        stream: false
      })
    });
    if (!response.ok) throw new Error("Ollama connection failed");
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("❌ Ollama also failed:", error.message);
    throw new Error("System Overload: Both AI services are currently unavailable.");
  }
}

// 3. The "Smart Switcher" Function
async function generateSmartContent(prompt) {
  console.log(`🤖 Attempting generation with Google Gemini (${GOOGLE_MODEL_NAME})...`);
  
  try {
    // TRY 1: Google Gemini
    const model = genAI.getGenerativeModel({ model: GOOGLE_MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("✅ Served by Google Gemini");
    return response.text();

  } catch (error) {
    // CATCH: If Google fails (429 Limit, 503 Overload, etc.)
    console.warn(`⚠️ Gemini Failed (${error.message}). Switching to Local Ollama...`);
    
    // TRY 2: Local Ollama
    try {
      const ollamaResponse = await callOllama(prompt);
      console.log("✅ Served by Local Ollama (Backup)");
      return ollamaResponse;
    } catch (finalError) {
      return "AI Service Unavailable: Please try again later.";
    }
  }
}

// --- ROUTE 1: POLICY SIMULATOR SLIDERS ---
app.post('/api/explain-impact', async (req, res) => {
  const { income, gstChange, taxChange, fuelChange, subsidyChange } = req.body;
  
  const prompt = `
    Act as a financial advisor. User Income: ₹${income}.
    Scenario: GST ${gstChange}%, Income Tax ${taxChange}%, Fuel Tax ₹${fuelChange}, Subsidy Benefit ₹${subsidyChange}.
    Explain the impact on buying power in exactly 2 short sentences.
  `;

  let aiEngine = 'gemini';
  let text = '';

  try {
    const model = genAI.getGenerativeModel({ model: GOOGLE_MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    text = response.text();
    aiEngine = 'gemini';
    console.log("✅ Served by Google Gemini");
  } catch (error) {
    console.warn(`⚠️ Gemini Failed. Switching to Ollama...`);
    try {
      text = await callOllama(prompt);
      aiEngine = 'ollama';
      console.log("✅ Served by Local Ollama");
    } catch (finalError) {
      text = "System overloaded. Please try again.";
      aiEngine = 'error';
    }
  }

  res.json({ 
    explanation: text,
    aiEngine: aiEngine  // ← NEW!
  });
});

// --- ROUTE 2: DASHBOARD AI EXPLAINER ---
app.post('/api/ai/explain', async (req, res) => {
  const { prompt, taxData, userProfile } = req.body;

  const fullPrompt = `
    You are a friendly Indian financial advisor.
    User Name: ${userProfile?.displayName || 'Friend'}
    Income: ₹${taxData?.income || '0'}
    Total Tax: ₹${taxData?.totalTax || '0'}
    
    User Question: "${prompt}"
    
    Please explain this simply in under 60 words. Be encouraging. Use the Rupee symbol (₹).
  `;

  let aiEngine = 'gemini'; // Track which engine responds
  let text = '';

  try {
    const model = genAI.getGenerativeModel({ model: GOOGLE_MODEL_NAME });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    text = response.text();
    aiEngine = 'gemini';
    console.log("✅ Served by Google Gemini");
  } catch (error) {
    console.warn(`⚠️ Gemini Failed (${error.message}). Switching to Local Ollama...`);
    try {
      text = await callOllama(fullPrompt);
      aiEngine = 'ollama';
      console.log("✅ Served by Local Ollama (Backup)");
    } catch (finalError) {
      text = "AI Service Unavailable: Please try again later.";
      aiEngine = 'error';
    }
  }

  res.json({ 
    explanation: text,
    aiEngine: aiEngine  // ← THIS IS NEW! Send which engine was used
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 HYBRID SERVER RUNNING on Port ${PORT}`);
  console.log(`   Primary: Google Gemini (${GOOGLE_MODEL_NAME})`);
  console.log(`   Backup:  Local Ollama (Mistral)\n`);
});