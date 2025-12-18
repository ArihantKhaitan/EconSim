// client/src/utils/taxLogic.js

// ==================== CONSTANTS ====================
export const NEW_TAX_SLABS_2025 = [
  { min: 0, max: 400000, rate: 0, label: '₹0 - ₹4L' },
  { min: 400000, max: 800000, rate: 0.05, label: '₹4L - ₹8L' },
  { min: 800000, max: 1200000, rate: 0.10, label: '₹8L - ₹12L' },
  { min: 1200000, max: 1600000, rate: 0.15, label: '₹12L - ₹16L' },
  { min: 1600000, max: 2000000, rate: 0.20, label: '₹16L - ₹20L' },
  { min: 2000000, max: 2400000, rate: 0.25, label: '₹20L - ₹24L' },
  { min: 2400000, max: Infinity, rate: 0.30, label: 'Above ₹24L' },
];

export const OLD_TAX_SLABS = [
  { min: 0, max: 250000, rate: 0, label: '₹0 - ₹2.5L' },
  { min: 250000, max: 500000, rate: 0.05, label: '₹2.5L - ₹5L' },
  { min: 500000, max: 1000000, rate: 0.20, label: '₹5L - ₹10L' },
  { min: 1000000, max: Infinity, rate: 0.30, label: 'Above ₹10L' },
];

// EXPANDED GST CATEGORIES
export const GST_CATEGORIES = {
  exempt: { rate: 0, label: 'Exempt (0%)', items: ['Fresh Veggies', 'Milk', 'Bread', 'Books', 'Salt'], color: '#10B981' }, // Emerald
  essential: { rate: 5, label: 'Essential (5%)', items: ['Tea/Coffee', 'Medicine', 'Economy Flights', 'Spices'], color: '#3B82F6' }, // Blue
  standard_low: { rate: 12, label: 'Standard (12%)', items: ['Processed Food', 'Computers', 'Business Class Air'], color: '#8B5CF6' }, // Violet
  standard_high: { rate: 18, label: 'Standard (18%)', items: ['Electronics', 'Restaurant', 'Hair Oil', 'Soap'], color: '#F59E0B' }, // Amber
  luxury: { rate: 28, label: 'Luxury (28%)', items: ['ACs', 'Refrigerators', 'Automobiles', 'Cement'], color: '#EC4899' }, // Pink
  sin: { rate: 40, label: 'Sin Goods (40%*)', items: ['Tobacco', 'Aerated Drinks', 'Pan Masala'], color: '#EF4444' } // Red
};

// EXPANDED EXPENSE LIST (Includes explicit Luxury & Standard options)
export const EXPENSE_ITEMS = [
  { name: 'Groceries (Fresh)', category: 'exempt', amount: 5000, avgMonthly: 5000, gst: 0 },
  { name: 'Rent/Maintenance', category: 'exempt', amount: 15000, avgMonthly: 15000, gst: 0 },
  { name: 'Medicines', category: 'essential', amount: 1500, avgMonthly: 1500, gst: 5 },
  { name: 'Mobile & Data', category: 'standard_high', amount: 1000, avgMonthly: 1000, gst: 18 },
  { name: 'Dining & Zomato', category: 'standard_high', amount: 3000, avgMonthly: 3000, gst: 18 },
  { name: 'Electronics/Gadgets', category: 'standard_high', amount: 2000, avgMonthly: 2000, gst: 18 },
  { name: 'Clothes (Branded)', category: 'standard_low', amount: 2500, avgMonthly: 2500, gst: 12 },
  { name: 'Petrol/Diesel', category: 'exempt', amount: 4000, avgMonthly: 4000, gst: 0 },
  { name: 'Movies/OTT', category: 'standard_high', amount: 500, avgMonthly: 500, gst: 18 },
  { name: 'Luxury Vacation/Hotel', category: 'luxury', amount: 5000, avgMonthly: 5000, gst: 28 },
  { name: 'Air Conditioner/Fridge', category: 'luxury', amount: 2000, avgMonthly: 2000, gst: 28 },
  { name: 'Car EMI/Maintenance', category: 'luxury', amount: 0, avgMonthly: 0, gst: 28 },
];

// ==================== FUNCTIONS ====================
export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const calculateNewRegimeTax = (income, isSalaried = true) => {
  const standardDeduction = isSalaried ? 75000 : 0;
  let taxableIncome = Math.max(0, income - standardDeduction);
  let tax = 0;
  
  for (const slab of NEW_TAX_SLABS_2025) {
    if (taxableIncome > slab.min) {
      const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      tax += taxableInSlab * slab.rate;
    }
  }
  
  let rebate = 0;
  if (taxableIncome <= 1200000) {
    rebate = Math.min(tax, 60000);
    tax = Math.max(0, tax - rebate);
  }
  
  // Marginal relief
  if (taxableIncome > 1200000 && taxableIncome <= 1275000) {
    const excessIncome = taxableIncome - 1200000;
    if (tax > excessIncome) tax = excessIncome;
  }
  
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  
  return { grossIncome: income, standardDeduction, taxableIncome, rebate, cess, totalTax, effectiveRate: income > 0 ? (totalTax / income) * 100 : 0, netIncome: income - totalTax };
};

export const calculateOldRegimeTax = (income, deductions = {}, isSalaried = true) => {
  const standardDeduction = isSalaried ? 50000 : 0;
  const total80C = Math.min(deductions.section80C || 0, 150000);
  const total80D = Math.min(deductions.section80D || 0, 50000);
  const total80CCD1B = Math.min(deductions.section80CCD1B || 0, 50000);
  const hra = deductions.hra || 0;
  const homeLoanInterest = Math.min(deductions.homeLoanInterest || 0, 200000);
  
  const totalDeductions = standardDeduction + total80C + total80D + total80CCD1B + hra + homeLoanInterest;
  let taxableIncome = Math.max(0, income - totalDeductions);
  let tax = 0;
  
  for (const slab of OLD_TAX_SLABS) {
    if (taxableIncome > slab.min) {
      const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      tax += taxableInSlab * slab.rate;
    }
  }
  
  let rebate = 0;
  if (taxableIncome <= 500000) {
    rebate = Math.min(tax, 12500);
    tax = Math.max(0, tax - rebate);
  }
  
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  
  return { grossIncome: income, totalDeductions, taxableIncome, rebate, cess, totalTax, effectiveRate: income > 0 ? (totalTax / income) * 100 : 0, netIncome: income - totalTax };
};

export const calculateGSTImpact = (expenses) => {
  let totalGST = 0, totalExpense = 0;
  expenses.forEach(e => {
    const gstAmount = e.amount - (e.amount / (1 + e.gst / 100));
    totalGST += gstAmount;
    totalExpense += e.amount;
  });
  return { totalExpense, totalGST, effectiveGSTRate: totalExpense > 0 ? (totalGST / totalExpense) * 100 : 0 };
};

export const calculateTax = (inputs) => {
  const newRegime = calculateNewRegimeTax(inputs.grossIncome, inputs.isSalaried);
  const oldRegime = calculateOldRegimeTax(inputs.grossIncome, inputs.deductions, inputs.isSalaried);
  
  let betterRegime = 'new';
  let savings = oldRegime.totalTax - newRegime.totalTax;

  if (newRegime.totalTax > oldRegime.totalTax) {
    betterRegime = 'old';
    savings = newRegime.totalTax - oldRegime.totalTax;
  }

  return { newRegime, oldRegime, betterRegime, savings };
};