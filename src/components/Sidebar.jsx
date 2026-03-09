// src/components/Sidebar.jsx
import { Sun, Moon, LayoutDashboard, ArrowLeftRight, PieChart, LogOut } from 'lucide-react';

export default function Sidebar({ theme, toggleTheme, activeView, setActiveView, user, onLogout }) {
  const navItems = [
    { id: 'overview',      label: 'Home', icon: LayoutDashboard },
    { id: 'transactions',  label: 'Transactions', icon: ArrowLeftRight },
    { id: 'budgets',       label: 'Budgets', icon: PieChart },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">Mi<span>T</span>rack<span>A</span></div>

      {/* <div className="nav-section-label">Menu</div> */}
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${activeView === item.id ? 'active' : ''}`}
          onClick={() => setActiveView(item.id)}
        >
          <item.icon size={18} strokeWidth={2.5} />
          {item.label}
        </div>
      ))}

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          <span className="theme-toggle-icon">{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</span>
        </button>
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-info">
              <div className="sidebar-user-email">{user.email}</div>
              <div className="sidebar-meta">Personal workspace</div>
            </div>
            <button className="btn-icon sidebar-logout" onClick={onLogout} title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
