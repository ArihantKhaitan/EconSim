# 🏛️ EconSim - Intelligent Policy & Inflation Simulator
> **FinHack 2025 Submission | Track: FinTech for Social Impact (PS-5)**

![Status](https://img.shields.io/badge/Status-Beta-purple?style=flat-square) 
![AI](https://img.shields.io/badge/AI-Hybrid%20Arch-emerald?style=flat-square) 
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Firebase-blue?style=flat-square)
![Accessibility](https://img.shields.io/badge/Accessibility-Voice%20Enabled-orange?style=flat-square)

## 📜 Problem Statement
**ID 5: FinTech for Social Impact - Understand Tax and Subsidy Impacts in Real Time**

Government policies (Budget revisions, GST changes, Subsidies, Inflation control) significantly impact purchasing power. However, citizens—especially students, rural users, and small business owners—struggle to decode technical jargon (CPI, WPI, Repo Rate) to understand *exactly* how these changes affect their personal wallet and standard of living.

---

## 💡 Our Solution: EconSim
EconSim is a **comprehensive microsimulation platform** that translates complex economic data into personalized financial insights.

Unlike static calculators, EconSim features a **Hybrid AI Engine** (Cloud + Local) acting as a real-time financial advisor. It models not just taxes, but also **inflation shocks**, **social protection schemes**, and **behavioral policy impacts**, making it a truly inclusive tool.

---

### 🌟 Key Features (The Winning Edge)

#### 1. 🎙️ Voice-Enabled AI Advisor (Hinglish Support)
* **Talk to Your Data:** Users can ask questions like *"Mera tax kaise bachega?"* (How can I save tax?) via microphone.
* **Inclusive Design:** Bridges the literacy gap by offering audio responses in simple English or Hinglish.
* **Hybrid Intelligence:** Uses **Google Gemini 2.0 Flash** for cloud speed, falling back to local **Ollama (Mistral)** for privacy and offline reliability.

#### 2. 📰 Live Economic Pulse
* **Real-Time Ticker:** A scrolling marquee displays live macro-economic indicators (Crude Oil Prices, Repo Rate, Inflation Spikes) directly on the dashboard.
* **Context-Aware:** Helps users understand *why* policies are changing (e.g., "Tomato prices up 14% -> Govt increases subsidy").

#### 3. 🎮 Gamified Policy Simulator ("Finance Minister Mode")
* **Dual Modes:** * **Professional:** Detailed breakdown of tax liabilities and net monthly impact.
    * **Finance Minister (Game):** Users tweak GST and Fuel Tax sliders to see how it affects their "Public Approval Rating."
* **Behavioral Modeling:** Teaches users the trade-offs between fiscal discipline and populist subsidies.

#### 4. 🎈 Advanced Inflation Tracker (Macro to Micro)
* **Personalized CPI:** Calculates your *personal* inflation rate based on your specific spending basket, distinct from the national average.
* **Social Shielding:** Models how **Ration Cards** protect vulnerable groups from food supply shocks (e.g., Rice/Wheat inflation).

#### 5. 📚 Learn Hub & Reports
* **Financial Education:** Dedicated modules explaining Repo Rates, Fiscal Deficit, and GDP in layman's terms.
* **One-Click Reports:** Generates professional **PDF Impact Reports** for loan applications or financial planning.

---

## 🛠️ Technical Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | High-performance, animated Glassmorphism UI |
| **Styling** | Tailwind CSS | Responsive, dark-mode design system with custom animations |
| **Routing** | React Router v6 | Seamless SPA navigation |
| **Charts** | Recharts | Interactive Data Visualization (Bar/Line/Area) |
| **Backend** | Node.js + Express | REST API handling AI orchestration |
| **AI (Cloud)** | Google Gemini SDK | Primary Generative Model (Gemini 2.0 Flash) |
| **AI (Local)** | Ollama (Mistral) | Fallback/Offline Generative Model |
| **Database** | Firebase Firestore | Cloud save for user scenarios |
| **Auth** | Firebase Auth | Secure Google & Email Login |

### 📂 Directory Structure
```bash
EconSim/
├── client/
│   ├── src/modules/       # Feature Logic (Inflation, Tax, Policy, Learn)
│   ├── src/components/    # UI Components (NewsTicker, AIExplainer, MetricCard)
│   ├── src/utils/         # Tax Logic & AI Helpers
│   └── src/context/       # Auth Context
└── server/
    ├── index.js           # Hybrid AI Router (Gemini -> Ollama Failover)
    └── index_ollama.js    # Dedicated Local AI Server

```

---

## 🚀 How to Run Locally

### Prerequisites

* Node.js (v18+)
* [Ollama](https://ollama.com/) (Optional: For local AI fallback)
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
# 2. (Optional) Run Ollama: 'ollama run mistral'
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

* **Accessibility First:** Voice interactions and high-contrast UI make the tool usable for the elderly and visually impaired.
* **Vernacular Support:** The "Hinglish" AI mode ensures language is not a barrier to financial literacy.
* **Protection Logic:** Explicitly models government safety nets (Subsidies, Ration Cards) to show how policy protects the bottom 20% of the economy.

---

## 💰 Business Model

1. **Freemium B2C:** Basic calculator is free. AI Investment planning and PDF reports are Premium (₹99/mo).
2. **B2B/GovTech:** White-label the "Policy Simulator" for government portals to help citizens understand new budgets.
3. **API Licensing:** Allow FinTech apps to use our "Personal Inflation Engine" via API.