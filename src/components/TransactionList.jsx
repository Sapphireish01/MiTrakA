// src/components/TransactionList.jsx
import { useState } from 'react';
import { CATEGORIES } from '../data/seed';
import { format, parseISO } from 'date-fns';
import TransactionModal from './TransactionModal';
import { Edit2, Trash2, Inbox, Home, Coffee, Bus, Film, HeartPulse, Briefcase } from 'lucide-react';

const iconMap = { Home, Coffee, Bus, Film, HeartPulse, Briefcase };

const catMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

export default function TransactionList({ transactions, updateTransaction, deleteTransaction }) {
  const [editing, setEditing] = useState(null);
  const [filter, setFilter]   = useState('all');

  const filtered = transactions.filter(t => {
    if (filter === 'income')  return t.type === 'income';
    if (filter === 'expense') return t.type === 'expense';
    return true;
  });

  const fmt = n => '₦' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Transactions</div>
          <div className="pill-tabs">
            {['all', 'income', 'expense'].map(f => (
              <div
                key={f}
                className={`pill-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon"><Inbox size={48} strokeWidth={1} /></div>
            <p>No transactions yet.<br />Add one using the button above.</p>
          </div>
        ) : (
          <div className="tx-list">
            {filtered.map((tx, i) => {
              const cat = catMap[tx.category] || catMap['food'];
              const IconComponent = iconMap[cat.icon] || Coffee;
              return (
                <div
                  className="tx-item"
                  key={tx.id}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div
                    className="tx-icon"
                    style={{ background: cat.color + '20', color: cat.color }}
                  >
                    <IconComponent size={20} />
                  </div>

                  <div className="tx-info">
                    <div className="tx-name">{tx.description}</div>
                    <div className="tx-cat">{cat.label}</div>
                  </div>

                  <div className="tx-date">
                    {format(parseISO(tx.date), 'MMM d')}
                  </div>

                  <div className={`tx-amount ${tx.type === 'income' ? 'pos' : 'neg'}`}>
                    {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                  </div>

                  <div className="tx-actions">
                    <button className="btn-icon" onClick={() => setEditing(tx)} title="Edit"><Edit2 size={16} /></button>
                    <button className="btn-icon" onClick={() => deleteTransaction(tx.id)} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editing && (
        <TransactionModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={updated => updateTransaction(editing.id, updated)}
        />
      )}
    </>
  );
}
