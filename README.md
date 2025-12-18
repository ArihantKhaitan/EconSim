# 🏛️ EconSim - Intelligent Policy & Inflation Simulator
> **FinHack 2025 Submission | Track: FinTech for Social Impact (PS-5)**

![Status](https://img.shields.io/badge/Status-Beta-purple) ![AI](https://img.shields.io/badge/AI-Hybrid%20Arch-emerald) ![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Firebase-blue)

## 📜 Problem Statement
**ID 5: FinTech for Social Impact - Understand Tax and Subsidy Impacts in Real Time**

Government policies (Budget revisions, GST changes, Subsidies, Inflation control) significantly impact purchasing power. However, citizens—especially students and small business owners—struggle to decode technical jargon (CPI, WPI, Core Inflation) to understand *exactly* how these changes affect their personal wallet and standard of living.

---

## 💡 Our Solution: EconSim
EconSim is a **comprehensive microsimulation platform** that translates complex economic data into personalized financial insights.

Unlike static calculators, EconSim features a **Hybrid AI Engine** (Cloud + Local) acting as a real-time financial advisor. It models not just taxes, but also **inflation shocks** and **social protection schemes** (like Ration Cards), making it a truly inclusive tool.

---

### 🌟 Key Features (The Winning Edge)

#### 1. 🤖 Hybrid AI Architecture (Failover System)
* **Dual-Engine Intelligence:** Uses **Google Gemini 2.0 Flash** for high-speed cloud analysis.
* **Offline/Privacy Mode:** Automatically switches to a local **Ollama (Mistral)** model if internet fails or API limits are reached.
* **Zero Downtime:** Ensures the demo works 100% of the time, regardless of venue Wi-Fi.

#### 2. 🎈 Advanced Inflation Tracker (Macro to Micro)
* **Macro Trends:** Visualizes Headline CPI vs. Core Inflation vs. Super-Core Inflation.
* **Personal Impact:** Calculates your *personal* inflation rate based on your specific spending basket.
* **Social Shielding:** Simulate how possessing a **Ration Card** protects vulnerable groups from food supply shocks.

#### 3. ⚡ Real-Time Policy Sandbox
* **Interactive Sliders:** Model impacts of GST hikes, Fuel Tax changes, and **Government Subsidies**.
* **Net Impact Visualizer:** See exactly how a ₹500 subsidy increase balances out a 2% GST hike in real-time.

#### 4. 🎨 Modern Glassmorphism UI
* **Financial Health Card:** One-click PDF reports for loan applications.
* **Historical Trends:** Dynamic charts showing tax liability changes over 3 fiscal years.
* **Smart Dashboard:** Auto-recommends the best Tax Regime (Old vs. New) based on FY 2025-26 logic.

---

## 🛠️ Technical Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | High-performance, animated Glassmorphism UI |
| **Styling** | Tailwind CSS | Responsive, dark-mode design system |
| **Routing** | React Router v6 | Seamless SPA navigation |
| **Charts** | Recharts | Interactive Data Visualization (Pie/Bar/Line) |
| **Backend** | Node.js + Express | REST API handling AI orchestration |
| **AI (Cloud)** | Google Gemini SDK | Primary Generative Model |
| **AI (Local)** | Ollama (Mistral) | Fallback/Offline Generative Model |
| **Database** | Firebase Firestore | Cloud save for user scenarios |
| **Auth** | Firebase Auth | Secure Google & Email Login |

### 📂 Directory Structure
```bash
EconSim/
├── client/
│   ├── src/modules/       # Feature Logic (Inflation, Tax, GST, Policy)
│   ├── src/utils/         # Tax Logic & AI Helpers
│   ├── src/components/    # Reusable UI (AuthModal, Navbar)
│   └── src/context/       # Auth Context
└── server/
    ├── index.js           # Hybrid AI Router (Gemini -> Ollama Failover)
    └── index_ollama.js    # Dedicated Local AI Server

```

---

## 🚀 How to Run Locally

### Prerequisites

* Node.js (v18+)
* [Ollama](https://ollama.com/) (For local AI support)
* Firebase Project Credentials

### Step 1: Clone the Repository

```bash
git clone [https://github.com/ArihantKhaitan/EconSim.git](https://github.com/ArihantKhaitan/EconSim.git)
cd EconSim

```

### Step 2: Setup Backend (Hybrid AI)

```bash
cd server
npm install
# 1. Create a .env file: GEMINI_API_KEY=your_key_here
# 2. Ensure Ollama is running in background: 'ollama run mistral'
node index.js

```

*Output should say: `🚀 HYBRID SERVER RUNNING on Port 5000*`

### Step 3: Setup Frontend

```bash
# Open a new terminal
cd client
npm install
npx vite --port 5173 --host

```

*Access the dashboard at `http://localhost:5173*`

---

## 🌍 Social Impact & Inclusivity

* **Ration Card Logic:** We explicitly model how government subsidies protect the bottom 20% of the economy from food inflation.
* **Hinglish AI:** The advisor can explain complex financial concepts in mixed Hindi-English for broader accessibility.
* **Education Hub:** Dedicated module to teach students about Fiscal Deficit, Repo Rates, and GDP.

---

## 💰 Business Model

1. **Freemium B2C:** Basic calculation is free. Detailed PDF reports and AI Investment planning are Premium (₹99/mo).
2. **B2B/GovTech:** White-label the "Policy Simulator" for government portals to help citizens understand new budgets.
3. **API Licensing:** Allow FinTech apps to use our "Personal Inflation Engine".