# 🏛️ EconSim - Intelligent Policy Impact Simulator
> **FinHack 2025 Submission | Track: FinTech for Social Impact (PS-5)**



## 📜 Problem Statement
**ID 5: FinTech for Social Impact - Understand Tax and Subsidy Impacts in Real Time**
Government policies (Budget revisions, GST changes, Fuel taxes) significantly impact purchasing power. However, citizens struggle to decode technical jargon to understand *exactly* how these changes affect their personal wallet.

## 💡 Our Solution: EconSim
EconSim is a **microsimulation platform** that translates complex economic policies into personalized financial insights. Unlike static tax calculators, EconSim uses **Generative AI (Google Gemini)** to act as a real-time financial advisor.

### 🌟 Key Features
* **📊 Dual-Regime Tax Engine:** Instantly compares Old vs. New Tax Regimes (FY 2025-26) with "Break-even" analysis.
* **🛒 GST 2.0 Basket Simulator:** Visualizes how GST rate changes on specific categories (Tech, Essentials, Luxury) impact monthly household budgets.
* **⚡ Real-Time Policy Sandbox:** Interactive sliders allow users to run "What-If" scenarios (e.g., *"What if Fuel Tax drops by ₹5?"*) and see immediate net-savings impact.
* **🤖 AI Financial Advisor:** Integrated **Gemini 2.0 Flash** to provide personalized, plain-English explanations and money-saving tips based on the user's simulation data.
* **📉 Inflation & Fuel Tracker:** specific modules to track the cascading effect of fuel price changes on daily buying power.

---

## 🛠️ Technical Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | High-performance, responsive dashboard |
| **Styling** | Tailwind CSS | Modern, accessible dark-mode UI |
| **Visualization** | Recharts | Dynamic bar charts and pie graphs |
| **Backend** | Node.js + Express | REST API for logic and AI orchestration |
| **AI Engine** | Google Gemini 2.0 | Natural Language Processing for financial advice |

### 📂 Directory Structure
```bash
EconSim/
├── client/              # React Frontend
│   ├── src/modules/     # Feature-based architecture (Tax, GST, Policy)
│   └── src/utils/       # Core microsimulation logic
└── server/              # Node.js Backend
    └── index.js         # Gemini AI Integration

```

---

## 🚀 How to Run Locally

1. **Clone the Repository**
```bash
git clone [https://github.com/ArihantKhaitan/EconSim.git](https://github.com/ArihantKhaitan/EconSim.git)
cd EconSim

```


2. **Setup Backend**
```bash
cd server
npm install
# Create a .env file and add: GEMINI_API_KEY=your_key_here
node index.js

```


3. **Setup Frontend**
```bash
cd ../client
npm install
npx vite --port 5173 --host 

```



---

## 🔮 Future Roadmap (Scalability)

* **📄 PDF Report Generation:** Allow users to download a "Financial Health Card" to share with CA/Advisors.
* **🌍 Vernacular Support:** Use Gemini to voice-translate advice into Hindi, Kannada, and Tamil for rural financial literacy.
* **📈 Historical Data:** Integration with RBI APIs to show 10-year inflation trends.

---

## 💰 Business Model (Monetization Strategy)

1. **Freemium Model:** Basic calculators are free; AI-driven personalized investment planning is a paid tier.
2. **B2B Licensing:** White-label the simulation engine for Banks and FinTech apps (e.g., "Check how this loan fits your post-tax budget").
3. **Educational Partnerships:** Licensing to colleges for Economics/Commerce labs.

---

## 👥 Contributors

* **Arihant Khaitan** - Full Stack Developer & Architect
* **Sushmita Solanki** - Testing and PPT