// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/explain-impact', async (req, res) => {
  try {
    const { income, gstChange, taxChange, fuelChange } = req.body;
    
    // Select the model
    // Use the specific version tag
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Create a precise prompt for financial advice
    const prompt = `
      Act as a financial advisor for a user in India.
      
      User Profile:
      - Annual Income: ₹${income}
      
      Policy Scenario Changes:
      - GST Rate Change: ${gstChange > 0 ? '+' : ''}${gstChange}%
      - Income Tax Rate Change: ${taxChange > 0 ? '+' : ''}${taxChange}%
      - Fuel Tax Change: ${fuelChange > 0 ? '+' : ''}₹${fuelChange}/liter

      Task:
      1. Explain in simple terms (under 50 words) how this specifically impacts their buying power.
      2. Provide 2 actionable money-saving tips for this specific scenario.
      
      Format the output as clear text without markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ explanation: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate explanation. Please check API Key." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));