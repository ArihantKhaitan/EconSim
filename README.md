# 🏛️ EconSim - Intelligent Policy Impact Simulator
> **FinHack 2025 Submission | Track: FinTech for Social Impact (PS-5)**

## 📜 Problem Statement
**ID 5: FinTech for Social Impact - Understand Tax and Subsidy Impacts in Real Time**

Government policies (Budget revisions, GST changes, Fuel taxes) significantly impact purchasing power. However, citizens—especially students and small business owners—struggle to decode technical jargon to understand *exactly* how these changes affect their personal wallet.

---

## 💡 Our Solution: EconSim
EconSim is a **microsimulation platform** that translates complex economic policies into personalized financial insights. Unlike static calculators, EconSim uses **Generative AI (Google Gemini 2.0)** to act as a real-time financial advisor, explaining impacts in plain English or Hinglish.

### 🌟 Key Features (Winning Edge)

#### 1. 🤖 AI Financial Advisor (Gemini Powered)
* **Plain English & Hinglish:** Explains complex tax terms in simple language (e.g., *"Your savings increased by ₹5,000, which is like 2 months of free Wi-Fi"*).
* **Personalized Tips:** Analyzes your specific data to offer actionable money-saving advice.

#### 2. ⚡ Real-Time Policy Sandbox & Cloud Save
* **Interactive Sliders:** Run "What-If" scenarios (e.g., *"What if GST rises by 5%?"*) and see immediate impact on net savings.
* **Cloud Persistence:** **Firebase Integration** allows users to Login (Google/Email) and **save their scenarios** to compare later.

#### 3. 📊 Advanced Visualization & Reporting
* **Historical Trends:** Interactive charts showing how tax liability has changed over the last 3 fiscal years.
* **PDF Reports:** One-click download of a professional "Financial Health Card" to share with CAs or Loan Officers.
* **Social Sharing:** Instantly share tax savings summaries via WhatsApp/LinkedIn.

#### 4. 💰 Comprehensive Tax Engine
* **Dual-Regime Comparison:** Instantly compares Old vs. New Tax Regimes (FY 2025-26).
* **GST Basket Simulator:** Visualizes how rate changes on specific categories (Tech, Essentials) impact monthly budgets.

---

## 🛠️ Technical Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | High-performance, responsive dashboard |
| **Styling** | Tailwind CSS | Modern, accessible dark-mode UI |
| **Charts** | Recharts | Dynamic historical & comparison graphs |
| **Reporting** | html2pdf.js | Client-side PDF generation |
| **Backend** | Node.js + Express | API for AI orchestration |
| **Database** | Firebase Firestore | User data & scenario storage |
| **Auth** | Firebase Auth | Secure Google & Email Login |
| **AI Engine** | Google Gemini 2.0 | Natural Language Processing |

### 📂 Directory Structure
```bash
EconSim/
├── client/
│   ├── src/components/      # Reusable UI (Navbar, Charts, PDF, Share)
│   ├── src/context/         # AuthContext (User Session Management)
│   ├── src/modules/         # Core Features (Tax, GST, Policy Sim)
│   └── src/firebase.js      # Firebase Configuration
└── server/
    └── index.js             # Gemini AI API Routes

🚀 How to Run Locally
Prerequisites
Node.js (v18+)

Google Gemini API Key

Firebase Project (Auth & Firestore enabled)

Step 1: Clone the Repository
Bash

git clone [https://github.com/ArihantKhaitan/EconSim.git](https://github.com/ArihantKhaitan/EconSim.git)
cd EconSim
Step 2: Setup Backend
Bash

cd server
npm install
# Create a .env file and add your key:
# GEMINI_API_KEY=your_google_ai_key_here
node index.js
Step 3: Setup Frontend
Bash

# Open a new terminal
cd client
npm install
# Ensure firebase.js has your valid config
npm run dev
Note: The app requires the backend server to be running on Port 5000 for AI features to work.

💰 Business Model (Monetization)
Freemium Model: Basic tax calculation is free. AI-driven personalized planning and PDF reports are Premium (₹99/month).

B2B Licensing: White-label the simulation engine for Banks and FinTech apps (e.g., "Check how this loan fits your post-tax budget").

Educational Partnerships: Licensing to colleges for Economics/Commerce labs.

🔮 Future Roadmap
🌍 Vernacular Voice Mode: Voice-to-voice financial advice in Hindi, Tamil, and Kannada for rural literacy.

📈 Live RBI Integration: Real-time Repo Rate fetching to update loan EMI impact dynamically.

🏢 Corporate Tax Module: Extending the simulator for SMEs and Startups.

👥 Contributors
Arihant Khaitan 