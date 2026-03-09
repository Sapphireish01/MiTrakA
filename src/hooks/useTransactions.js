import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SEED_TRANSACTIONS, DEFAULT_BUDGETS } from '../data/seed';
import { v4 as uuidv4 } from 'uuid';

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage('flo-transactions', SEED_TRANSACTIONS);
  const [budgets, setBudgets] = useLocalStorage('flo-budgets', DEFAULT_BUDGETS);

  const addTransaction = (tx) => {
    setTransactions(prev => [{ ...tx, id: uuidv4() }, ...prev]);
  };

  const updateTransaction = (id, updated) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updated } : tx));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const updateBudget = (category, amount) => {
    setBudgets(prev => ({ ...prev, [category]: Number(amount) }));
  };

  // Derived values
  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const netSavings = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const savingsRate = useMemo(() =>
    totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0',
    [totalIncome, netSavings]
  );

  // Spending by category
  const spendingByCategory = useMemo(() =>
    transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {}),
    [transactions]
  );

  return {
    transactions,
    budgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    spendingByCategory,
  };
}
