# 🏛️ EconSim - Policy Impact Simulator
> **FinHack 2025 Submission | Track: FinTech for Social Impact**

EconSim is an interactive policy simulation tool designed to demystify complex government policies. It helps students, salaried professionals, and small business owners visualize how tax revisions, GST changes, and subsidies impact their real-world purchasing power.

---

## 🎯 Problem Statement
**ID 5: FinTech for Social Impact - Understand Tax and Subsidy Impacts in Real Time**
Most citizens find it difficult to understand the real-world implications of policy changes because the information is often technical and fragmented. We need a tool to model and visualize the economic impact of these changes.

---

## 🚀 Key Features

### 1. 💰 Intelligent Income Tax Calculator
- **Dual Regime Comparison:** Instantly compares Old vs. New Tax Regimes (Budget 2025-26).
- **Smart Recommendations:** Automatically suggests the most tax-efficient regime based on your income and deductions.
- **Visual Breakdowns:** Interactive bar charts showing tax liability across different income brackets.

### 2. 🛒 GST 2.0 Impact Analyzer
- **Basket Simulation:** Users can input their monthly spending across categories (Essentials, Electronics, Luxury).
- **Inflation Tracker:** Visualizes how GST rate changes affect monthly household budgets.
- **Category Visualization:** Pie charts displaying tax contribution by spending category.

### 3. ⚡ Real-Time Policy Simulator
- **"What-If" Scenarios:** Adjust sliders to simulate policy changes (e.g., "What if GST rises by 2%?" or "What if Fuel Tax drops by ₹5?").
- **Immediate Feedback:** Instantly recalculates net monthly and annual savings based on simulation inputs.

### 4. 🤖 AI Policy Explainer (Powered by Gemini)
- Translates complex financial data into plain English.
- Provides personalized tips on how to mitigate negative policy impacts.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React.js + Vite (High-performance UI)
- **Styling:** Tailwind CSS (Responsive Design)
- **Visualization:** Recharts (Data visualization)
- **Logic:** Custom Microsimulation Engine (`taxLogic.js`)
- **AI Integration:** Google Gemini API (Natural Language Explanations)

---

## ⚙️ How to Run Locally

1. **Clone the repository**
   ```bash
   git clone [https://github.com/ArihantKhaitan/EconSim.git](https://github.com/ArihantKhaitan/EconSim.git)

2. **Install Frontend Dependencies**
    ```bash
    cd client
    npm install

3. **Run the Application**
    ```bash
    npx vite --port 5173 --open