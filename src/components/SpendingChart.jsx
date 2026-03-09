// src/components/SpendingChart.jsx
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CATEGORIES } from '../data/seed';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const MONTHS = 6;

function buildChartData(transactions, monthCount) {
  const now = new Date();
  return Array.from({ length: monthCount }, (_, i) => {
    const ref   = subMonths(now, monthCount - 1 - i);
    const start = startOfMonth(ref);
    const end   = endOfMonth(ref);
    const inRange = t => isWithinInterval(parseISO(t.date), { start, end });

    const income  = transactions.filter(t => t.type === 'income'  && inRange(t)).reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense' && inRange(t)).reduce((s, t) => s + t.amount, 0);

    return { month: format(ref, 'MMM'), income, expense };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 12,
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ color: 'var(--muted)', marginBottom: 6, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.dataKey === 'income' ? 'var(--green)' : 'var(--red)', marginBottom: 2 }}>
          {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: ₦{p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default function SpendingChart({ transactions }) {
  const [range, setRange] = useState(6);
  const data = useMemo(() => buildChartData(transactions, range), [transactions, range]);

  return (
    <div className="card chart-card anim-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="card-header">
        <div className="card-title">Income vs Spending</div>
        <div className="pill-tabs">
          {[3, 6, 12].map(m => (
            <div key={m} className={`pill-tab ${range === m ? 'active' : ''}`} onClick={() => setRange(m)}>
              {m}M
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--red)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'DM Mono', letterSpacing: '0.06em' }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="income" stroke="var(--green)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
          <Area type="monotone" dataKey="expense" stroke="var(--red)" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--green)' }} />
          Income
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--red)' }} />
          Spending
        </div>
      </div>
    </div>
  );
}
