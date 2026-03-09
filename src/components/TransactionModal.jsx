import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/seed';
import { format } from 'date-fns';
import { Home, Coffee, Bus, Film, HeartPulse, Briefcase, Plus, CheckCircle2, Wallet, ReceiptText } from 'lucide-react';

const iconMap = { Home, Coffee, Bus, Film, HeartPulse, Briefcase, Wallet, ReceiptText };

const EXPENSE_CATS = CATEGORIES.filter(c => c.id !== 'income');

export default function TransactionModal({ onClose, onSave, initial = null }) {
  const [type, setType]     = useState(initial?.type || 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [desc, setDesc]     = useState(initial?.description || '');
  const [cat, setCat]       = useState(initial?.category || 'food');
  const [date, setDate]     = useState(initial?.date || format(new Date(), 'yyyy-MM-dd'));
  const [success, setSuccess] = useState(false);

  // When switching to income, force category to income
  useEffect(() => {
    if (type === 'income') setCat('income');
    else if (cat === 'income') setCat('food');
  }, [type]);

  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const newErrors = {};
    const parsed = parseFloat(amount);

    if (!amount || isNaN(parsed) || parsed <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0.';
    }
    if (!desc.trim()) {
      newErrors.description = 'Please enter a description.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSave({
      type,
      amount: parsed,
      description: desc.trim(),
      category: type === 'income' ? 'income' : cat,
      date,
    });

    setSuccess(true);
    setTimeout(onClose, 2000); // Reduced delay slightly
  };

  const shownCats = type === 'income' ? [] : EXPENSE_CATS;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal anim-slide-in">
        {success ? (
          <div className="modal-success-state">
            <CheckCircle2 size={48} className="success-icon" />
            <div className="modal-title">Transaction Saved</div>
            <p className="modal-sub">MiTrakA has been updated successfully.</p>
          </div>
        ) : (
          <>
            <div className="modal-title">{initial ? 'Edit Transaction' : 'New Transaction'}</div>
            <div className="modal-sub">
              {initial ? 'Update the details below' : `Log an income or expense · ${format(new Date(), 'MMMM yyyy')}`}
            </div>

            {/* Type toggle */}
            <div className="type-toggle">
              <button
                className={`type-btn ${type === 'expense' ? 'active-expense' : ''}`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                className={`type-btn ${type === 'income' ? 'active-income' : ''}`}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <label className="field-label">Amount</label>
            <div className={`amount-wrap ${errors.amount ? 'field-invalid' : ''}`}>
              <span className="amount-prefix">₦</span>
              <input
                className="field"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); if (errors.amount) setErrors(prev => ({ ...prev, amount: '' })); }}
                autoFocus
              />
            </div>
            {errors.amount && <div className="field-error-msg">{errors.amount}</div>}

            {/* Description */}
            <label className="field-label">Description</label>
            <input
              className={`field ${errors.description ? 'field-invalid' : ''}`}
              type="text"
              placeholder="What was this for?"
              value={desc}
              onChange={e => { setDesc(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: '' })); }}
            />
            {errors.description && <div className="field-error-msg">{errors.description}</div>}

            {/* Date */}
            <label className="field-label">Date</label>
            <input
              className="field"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />

            {/* Category chips — only for expenses */}
            {type === 'expense' && (
              <>
                <label className="field-label">Category</label>
                <div className="cat-grid">
                  {shownCats.map(c => {
                    const IconComp = iconMap[c.icon] || Coffee;
                    return (
                      <div
                        key={c.id}
                        className={`cat-chip ${cat === c.id ? 'selected' : ''}`}
                        onClick={() => setCat(c.id)}
                      >
                        <IconComp size={14} /> {c.label}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="modal-actions">
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={!amount || !desc.trim()}
              >
                {initial ? 'Save Changes' : 'Save Transaction'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
