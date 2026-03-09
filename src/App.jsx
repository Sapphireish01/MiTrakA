// src/App.jsx
import { useState } from 'react';
import './styles/theme.css';
import './styles/app.css';

import { useTheme }        from './hooks/useTheme';
import { useTransactions } from './hooks/useTransactions';
import { useAuth }         from './hooks/useAuth';

import Sidebar          from './components/Sidebar';
import SummaryCards     from './components/SummaryCards';
import SpendingChart    from './components/SpendingChart';
import BudgetPanel      from './components/BudgetPanel';
import TransactionList  from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import LoginPage        from './components/LoginPage';
import { Plus, Sun, Moon, LogOut } from 'lucide-react';

import { format } from 'date-fns';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [showModal,  setShowModal]  = useState(false);

  // ── AUTH (7-min inactivity timeout managed inside useAuth) ──
  const { user, login, logout } = useAuth();
  const isLoggedIn = !!user;

  const {
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
  } = useTransactions();

  return (
    <div className="app-shell">
      {!isLoggedIn && <LoginPage onLogin={login} />}
      {isLoggedIn && (
        <>
        <Sidebar
          theme={theme}
          toggleTheme={toggleTheme}
          activeView={activeView}
          setActiveView={setActiveView}
          user={user}
          onLogout={logout}
        />

      <main className="main">
        {/* ── HEADER ── */}
        <div className="page-header">
          <div>
            <h1>
              {activeView === 'overview'     && `Welcome, ${user.name || 'User'}`}
              {activeView === 'transactions' && 'Transactions'}
              {activeView === 'budgets'      && 'Budgets'}
            </h1>
            <p>{format(new Date(), 'MMMM yyyy')} · {transactions.length} transactions logged</p>
          </div>
          <div className="header-actions">
            <button className="btn-icon mobile-theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="btn-icon mobile-logout" onClick={logout} title="Sign out">
              <LogOut size={20} />
            </button>
            <button className="btn-primary desktop-add-btn" onClick={() => setShowModal(true)}>
              <Plus size={16} strokeWidth={2.5} /> Add Transaction
            </button>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeView === 'overview' && (
          <>
            <SummaryCards
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netSavings={netSavings}
              savingsRate={savingsRate}
              onAdd={() => setShowModal(true)}
            />

            <div className="mid-grid">
              <SpendingChart transactions={transactions} />
              <BudgetPanel
                budgets={budgets}
                spendingByCategory={spendingByCategory}
                updateBudget={updateBudget}
              />
            </div>

            <div className="section-label">Recent Transactions</div>
            <TransactionList
              transactions={transactions.slice(0, 8)}
              updateTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
            />
          </>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeView === 'transactions' && (
          <TransactionList
            transactions={transactions}
            updateTransaction={updateTransaction}
            deleteTransaction={deleteTransaction}
          />
        )}

        {/* ── BUDGETS ── */}
        {activeView === 'budgets' && (
          <>
            <SummaryCards
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netSavings={netSavings}
              savingsRate={savingsRate}
              onAdd={() => setShowModal(true)}
            />
            <BudgetPanel
              budgets={budgets}
              spendingByCategory={spendingByCategory}
              updateBudget={updateBudget}
            />
          </>
        )}
      </main>

        {/* ── ADD MODAL ── */}
        {showModal && (
          <TransactionModal
            onClose={() => setShowModal(false)}
            onSave={addTransaction}
          />
        )}
        </>
      )}
    </div>
  );
}
