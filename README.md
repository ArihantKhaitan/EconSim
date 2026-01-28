# 🏛️ EconSim - Intelligent Policy & Inflation Simulator
> **FinHack 2025 Submission | Team 67 | Track: FinTech for Social Impact (PS-5)**

![Status](https://img.shields.io/badge/Status-Beta-purple?style=flat-square) 
![AI](https://img.shields.io/badge/AI-Hybrid%20Arch-emerald?style=flat-square) 
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Firebase-blue?style=flat-square)
![Accessibility](https://img.shields.io/badge/Accessibility-Voice%20Enabled-orange?style=flat-square)

## 📜 Problem Statement
**ID 5: FinTech for Social Impact - Understand Tax and Subsidy Impacts in Real Time**

Government policies (Budget revisions, GST changes, Subsidies, Import Duties) significantly impact purchasing power. However, citizens—especially students, rural users, and small business owners—struggle to decode technical jargon (CPI, WPI, Repo Rate) to understand *exactly* how these changes affect their personal wallet and standard of living.

---

## 💡 Our Solution: EconSim
EconSim is a **comprehensive microsimulation platform** that translates complex economic data into personalized financial insights.

Unlike static calculators, EconSim features a **Hybrid AI Engine** (Cloud + Local) acting as a real-time financial advisor. It models not just taxes, but also **inflation shocks**, **social protection schemes**, **import duties**, and **business trade-offs**, making it a truly inclusive tool for everyone from farmers to startup owners.

---

### 🌟 Key Features (The Winning Edge)

#### 1. 🎙️ Voice-Enabled AI Advisor (Hinglish Support)
* **Talk to Your Data:** Ask questions like *"Mera tax kaise bachega?"* (How can I save tax?) via microphone.
* **Inclusive Design:** Bridges the literacy gap by offering audio responses in simple English or Hinglish.
* **Hybrid Intelligence:** Uses **Google Gemini 2.0 Flash** for cloud speed, automatically falling back to local **Ollama (Mistral)** for privacy and offline reliability.

#### 2. 📰 Live Economic Pulse (News Ticker)
* **Real-Time Updates:** A scrolling marquee fetches live headlines from multiple sources (Business, Tech, National) to display macro-economic indicators like Crude Oil Prices and Repo Rate changes.
* **Context-Aware:** Helps users correlate news (e.g., "Tomato prices up 14%") with their personal inflation graph.

#### 3. 🏪 SME Business Simulator (New!)
* **Roleplay Mode:** Puts users in the shoes of MSME owners (Textile Factory, Cafe, Logistics).
* **Scenario Learning:** Forces users to make tough trade-offs during policy shocks (e.g., "Fuel Tax Hike: Raise prices or absorb cost?").
* **Impact Analysis:** Visualizes the immediate effect on **Profit Margins** vs. **Customer Retention**.

#### 4. 💰 Government Subsidy Finder (New!)
* **Eligibility Engine:** Automatically maps your annual income to eligible government schemes (PM Ujjwala, FAME II, PM Awas Yojana).
* **Real Savings:** Calculates the **"Effective Annual Benefit"** (e.g., ₹7,200/year saved on LPG), treating subsidies as an addition to disposable income.

#### 5. 📦 Import Duty Analyzer (New!)
* **Landing Cost Calculator:** Breaks down exactly why imported goods (iPhones, Gold, EVs) cost more in India.
* **"Make in India" Context:** Educates users on how customs duties protect local industries and create jobs.

#### 6. 🎈 Advanced Inflation Tracker (Macro to Micro)
* **WPI & PPI Integration:** Tracks Wholesale and Producer Price Indices alongside Consumer Price Index (CPI).
* **Ration Card Logic:** A unique toggle that shows how government food security schemes shield vulnerable groups from market-rate food inflation.

---

## 🛠️ Technical Architecture

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js + Vite | High-performance, animated Glassmorphism UI |
| **Styling** | Tailwind CSS | Responsive, dark-mode design system |
| **Routing** | React Router v6 | Seamless SPA navigation |
| **Visualization** | Recharts | Interactive Charts (Pie, Line, Bar) for financial data |
| **Backend** | Node.js + Express | REST API handling AI orchestration |
| **AI (Cloud)** | Google Gemini SDK | Primary Generative Model (Gemini 1.5/2.0) |
| **AI (Local)** | Ollama (Mistral) | Privacy-first Offline Fallback Model |
| **Database** | Firebase Firestore | Cloud save for user scenarios & auth |

---

## 🚀 How to Run Locally

Follow these steps to set up the **Hybrid AI** environment on your machine.

### Prerequisites
* **Node.js** (v18 or higher)
* **[Ollama](https://ollama.com/)** (Required for Local AI Fallback)
* **Git**

### Step 1: Clone the Repository
```bash
git clone [https://github.com/ArihantKhaitan/EconSim.git](https://github.com/ArihantKhaitan/EconSim.git)
cd EconSim

```

### Step 2: Setup Local AI (Ollama) 🧠

*Crucial Step: This enables the AI to work without internet or API keys if needed.*

1. Download and install **Ollama** from [ollama.com](https://ollama.com).
2. Open a terminal and pull the Mistral model:
```bash
ollama pull mistral

```


3. Keep the model running in the background:
```bash
ollama run mistral

```


*(You can minimize this terminal window, but keep it open)*.

### Step 3: Setup Backend

1. Open a new terminal in the `EconSim` folder.
2. Navigate to server:
```bash
cd server
npm install

```


3. Create a `.env` file in the `server` folder:
```env
GEMINI_API_KEY=your_google_gemini_key_here
PORT=5000

```


4. Start the server:
```bash
node index.js

```


*Output: `🚀 HYBRID SERVER RUNNING on Port 5000*`

### Step 4: Setup Frontend

1. Open a third terminal.
2. Navigate to client:
```bash
cd client
npm install

```


3. Run the development server:
```bash
npm run dev

```


4. Open your browser at `http://localhost:5173`.

---

## 🌍 Social Impact & Inclusivity

* **Accessibility First:** Voice interactions allow the elderly and visually impaired to navigate complex tax laws easily.
* **Vernacular Support:** The AI understands and replies in "Hinglish," making financial literacy accessible to non-native English speakers.
* **Protection Logic:** Explicitly models safety nets (Ration Cards, Subsidies) to demonstrate how policy protects the bottom 20% of the economy.

---

## 💰 Business Model

| Tier | Target Audience | Pricing | Features |
| --- | --- | --- | --- |
| **Freemium** | Students, General Public | **₹0** | Basic Calc, 3 AI Queries/Day |
| **Premium** | Investors, Taxpayers | **₹99/mo** | PDF Reports, Unlimited AI, History |
| **GovTech** | Government Portals | **Licensing** | White-label Budget Explainer Tool |
| **API** | FinTech Apps | **Per Call** | "Personal Inflation Engine" API |

---

**Built with ❤️ for FinHack 2025**

```

```