const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Testing API Key...");

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const response = JSON.parse(data);
    if (response.error) {
        console.error("❌ API Error:", response.error.message);
        console.log("💡 Tip: If it says 'API has not been used', you need to enable it in Google Cloud Console.");
    } else {
        console.log("✅ Success! Your API Key can access these models:");
        response.models.forEach(m => console.log(` - ${m.name.replace('models/', '')}`));
        console.log("\nUse one of these exact names in your index.js file.");
    }
  });
}).on('error', (err) => {
  console.error("Network Error:", err.message);
});