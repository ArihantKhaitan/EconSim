// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. ORIGINAL ROUTE (For Policy Simulator Sliders)
app.post('/api/explain-impact', async (req, res) => {
  try {
    const { income, gstChange, taxChange, fuelChange } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Or gemini-pro

    const prompt = `
      Act as a financial advisor. User Income: ₹${income}.
      Scenario: GST ${gstChange}%, Income Tax ${taxChange}%, Fuel ₹${fuelChange}.
      Explain impact on buying power in 2 sentences.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ explanation: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Error" });
  }
});

// 2. NEW ROUTE (For AI Explainer Component - Hinglish/Detailed)
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { prompt, taxData, gstData, userProfile } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct a rich context for the AI
    const fullPrompt = `
      You are a friendly Indian financial advisor explaining taxes to a student/citizen.
      
      User Profile:
      - Name: ${userProfile?.displayName || 'Citizen'}
      - Annual Income: ₹${taxData.income}
      - Total Tax: ₹${taxData.totalTax}
      - Best Regime: ${taxData.betterRegime}
      - Monthly GST Paid: ₹${gstData?.totalGST || 0}
      
      User Question/Mode: "${prompt}"
      
      Guidelines:
      - Keep it under 100 words.
      - Use formatting (bolding, bullet points) if helpful.
      - Be encouraging.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    res.json({ explanation: response.text() });
  } catch (error) {
    console.error("AI Explainer Error:", error);
    res.status(500).json({ explanation: "AI service is currently busy. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));