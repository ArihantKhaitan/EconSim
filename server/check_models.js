require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Checking available models...");
    // We actually need the model manager to list models, 
    // but the simplest way to fix your error is to try the specific version code:
    console.log("-------------");
    console.log("Trying specific version: gemini-1.5-flash-001");
    const testModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    const result = await testModel.generateContent("Hello");
    console.log("✅ SUCCESS! The correct model name is: gemini-1.5-flash-001");
    console.log("-------------");
  } catch (error) {
    console.log("❌ Error with that name. Trying 'gemini-pro'...");
    try {
        const testModel2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await testModel2.generateContent("Hello");
        console.log("✅ SUCCESS! The correct model name is: gemini-pro");
    } catch (err2) {
        console.log("❌ Both failed. Please check if 'Generative Language API' is enabled in Google Cloud Console.");
    }
  }
}

listModels();