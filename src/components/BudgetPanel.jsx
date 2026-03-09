// src/components/BudgetPanel.jsx
import { useState } from 'react';
import { CATEGORIES, DEFAULT_BUDGETS } from '../data/seed';

const EXPENSE_CATS = CATEGORIES.filter(c => c.id !== 'income');

export default function BudgetPanel({ budgets, spendingByCategory, updateBudget }) {
  const [editing, setEditing] = useState(null); // category id being edited
  const [editVal, setEditVal] = useState('');

  const startEdit = (catId, current) => {
    setEditing(catId);
    setEditVal(String(current));
  };

  const commitEdit = () => {
    if (editing && editVal) {
      updateBudget(editing, parseFloat(editVal) || 0);
    }
    setEditing(null);
  };

  return (
    <div className="card anim-fade-up" style={{ animationDelay: '0.25s' }}>
      <div className="card-header">
        <div className="card-title">Budget Tracker</div>
      </div>

      <div className="budget-list">
        {EXPENSE_CATS.map(cat => {
          const spent  = spendingByCategory[cat.id] || 0;
          const limit  = budgets[cat.id] || DEFAULT_BUDGETS[cat.id] || 0;
          const pct    = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isOver = spent > limit && limit > 0;
          const fillColor = isOver ? 'var(--red)' : pct > 80 ? 'var(--amber)' : cat.color;

          return (
            <div className="budget-item" key={cat.id}>
              <div className="budget-row">
                <div className="budget-name">
                  <div className="cat-dot" style={{ background: cat.color }} />
                  {cat.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {editing === cat.id ? (
                    <input
                      autoFocus
                      style={{
                        width: 72,
                        background: 'var(--surface2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 6,
                        color: 'var(--text)',
                        fontSize: 11,
                        padding: '2px 6px',
                        fontFamily: 'DM Mono, monospace',
                        outline: 'none',
                      }}
                      type="number"
                      value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={e => e.key === 'Enter' && commitEdit()}
                    />
                  ) : (
                    <>
                      <span className="budget-nums">
                        ₦{spent.toLocaleString()} / ₦{limit.toLocaleString()}
                      </span>
                      <button className="budget-edit-btn" onClick={() => startEdit(cat.id, limit)}>
                        edit
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="budget-track">
                <div
                  className="budget-fill"
                  style={{ width: `${pct}%`, background: fillColor }}
                />
              </div>

              {isOver && (
                <div className="budget-over-label">
                  ↑ ₦{(spent - limit).toLocaleString()} over budget
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
