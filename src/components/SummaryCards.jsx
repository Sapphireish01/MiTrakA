// src/components/SummaryCards.jsx
import { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Eye, EyeOff } from 'lucide-react';

export default function SummaryCards({ totalIncome, totalExpense, netSavings, savingsRate, onAdd }) {
  const fmt = n => '₦' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="summary-section anim-fade-up">
      <div className="card total-balance-card master-card">
        <div className="tb-header">
          <div className="summary-label">Current Balance</div>
          <div className="tb-header-actions">
            <button className="btn-icon mc-eye-btn" onClick={() => setShowBalance(b => !b)}>
              {showBalance ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
            </button>
            {onAdd && (
              <button className="btn-icon mobile-add-btn" onClick={onAdd}>
                <Plus size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
        <div className="tb-value-container">
          <div className="tb-value">
            <span className="currency">₦</span>
            {showBalance ? Math.abs(netSavings).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '• • •'}
          </div>
        </div>

        <div className="sub-summary-grid">
          <div className="sub-card-inner">
            <div className="sub-card-header">
              <div className="summary-label-sm">Income</div>
            </div>
            <div className="sub-card-bottom">
              <div className="summary-value-sm">{fmt(totalIncome)}</div>
              <ArrowUpRight size={18} className="income-icon" />
            </div>
          </div>
          <div className="sub-card-inner">
            <div className="sub-card-header">
              <div className="summary-label-sm">Spent</div>
            </div>
            <div className="sub-card-bottom">
              <div className="summary-value-sm">{fmt(totalExpense)}</div>
              <ArrowDownRight size={18} className="expense-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
