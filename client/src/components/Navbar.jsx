import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'income-tax', label: '💰 Income Tax' },
    { id: 'gst', label: '🛒 GST Impact' },
    { id: 'policy-sim', label: '⚡ Policy Simulator' },
    { id: 'learn', label: '📚 Learn' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xl">📈</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">EconSim</h1>
              <p className="text-xs text-slate-400">Policy Impact Simulator</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}