// src/data/seed.js
// Default categories with colors and emoji icons
export const CATEGORIES = [
  { id: 'housing', label: 'Housing', icon: 'Home', color: '#8ab4f8' },
  { id: 'food', label: 'Food & Dining', icon: 'Coffee', color: '#ffd166' },
  { id: 'transport', label: 'Transport', icon: 'Bus', color: '#b6f5a0' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Film', color: '#c084fc' },
  { id: 'health', label: 'Health', icon: 'HeartPulse', color: '#f9a8d4' },
  { id: 'income', label: 'Income', icon: 'Briefcase', color: '#b6f5a0' },
  { id: 'savings', label: 'Savings', icon: 'Wallet', color: '#748c06ff' },
  { id: 'utility bills', label: 'Utility Bills', icon: 'ReceiptText', color: '#a0c2f5ff' },
];

// Default budget limits per category (expenses only)
export const DEFAULT_BUDGETS = {
  housing: 1200,
  food: 800,
  transport: 200,
  entertainment: 250,
  health: 150,
};

// Seed transactions — stored in localStorage, used only on first load
export const SEED_TRANSACTIONS = [
  { id: '1', type: 'income', amount: 4500, category: 'income', description: 'Salary — Acme Corp', date: '2025-03-01' },
  { id: '2', type: 'expense', amount: 1200, category: 'housing', description: 'March Rent', date: '2025-03-01' },
  { id: '3', type: 'income', amount: 900, category: 'income', description: 'Freelance — Logo design', date: '2025-03-06' },
  { id: '4', type: 'expense', amount: 84, category: 'food', description: 'Whole Foods', date: '2025-03-04' },
  { id: '5', type: 'expense', amount: 67, category: 'entertainment', description: 'Cinema + Dinner', date: '2025-03-05' },
  { id: '6', type: 'expense', amount: 310, category: 'food', description: 'Weekly groceries x4', date: '2025-03-03' },
  { id: '7', type: 'expense', amount: 243, category: 'entertainment', description: 'Streaming subs + games', date: '2025-03-02' },
  { id: '8', type: 'expense', amount: 88, category: 'transport', description: 'Monthly transit pass', date: '2025-03-01' },
];
