// src/components/LoginPage.jsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PASSWORD_RULES } from '../hooks/useAuth';

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [touched, setTouched]   = useState({ email: false, password: false });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked]     = useState(false);

  // Per-field validation
  const emailErr = touched.email && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ? 'Enter a valid email address.'
    : '';

  const pwdRulesState = PASSWORD_RULES.map(r => ({ ...r, passed: r.test(password) }));
  const pwdError = touched.password && pwdRulesState.some(r => !r.passed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || locked) return;

    setTouched({ email: true, password: true });
    if (emailErr || pwdRulesState.some(r => !r.passed)) return;

    setError('');
    setLoading(true);

    try {
      await onLogin({ email: email.trim(), password });
      // If we reach here, App will likely re-render and unmount us.
    } catch (err) {
      setLoading(false);
      setPassword(''); // Clear password on failure for security and UX
      
      const next = attempts + 1;
      setAttempts(next);

      if (next >= 5) {
        setLocked(true);
        setError('Too many failed attempts. Access is locked for this session.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="login-shell">
      {/* Brand panel */}
      <div className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-logo">Mi<span>T</span>rack<span>A</span></div>
          <p className="login-tagline">Your personal finance,<br />beautifully organised.</p>
          <div className="login-feature-list">
            <div className="login-feature">✦ Real-time balance tracking</div>
            <div className="login-feature">✦ Smart budget management</div>
            <div className="login-feature">✦ Visual spending insights</div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="login-form-panel">
        <form className="login-card anim-slide-in" onSubmit={handleSubmit} noValidate>
          <div className="login-card-header">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-sub">Sign in to MiTrakA</p>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <label className="field-label">Email address</label>
          <div className="login-input-wrap">
            <Mail size={16} className="login-input-icon" />
            <input
              className={`field login-field ${emailErr ? 'field-invalid' : ''}`}
              type="email"
              placeholder="admin@mitraka.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              autoComplete="email"
              autoFocus
              disabled={locked}
            />
          </div>
          {emailErr && <div className="field-error-msg">{emailErr}</div>}

          {/* Password */}
          <label className="field-label">Password</label>
          <div className="login-input-wrap">
            <Lock size={16} className="login-input-icon" />
            <input
              className={`field login-field ${pwdError ? 'field-invalid' : ''}`}
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              autoComplete="current-password"
              disabled={locked}
            />
            <button
              type="button"
              className="btn-icon login-eye"
              onClick={() => setShowPwd(v => !v)}
              tabIndex={-1}
              disabled={locked}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password strength rules */}
          {(password.length > 0 && pwdError) && (
            <div className="pwd-rules">
              {pwdRulesState.map(r => (
                <div key={r.id} className={`pwd-rule ${r.passed ? 'passed' : 'failed'}`}>
                  <CheckCircle2 size={12} />
                  {r.label}
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className={`btn-primary login-submit ${loading ? 'loading' : ''} ${locked ? 'locked' : ''}`}
            disabled={loading || locked}
          >
            {loading
              ? <span className="login-spinner" />
              : locked
                ? 'Account Locked'
                : <><LogIn size={16} strokeWidth={2.5} /> Sign In</>
            }
          </button>

          {attempts > 0 && !locked && (
            <p className="login-attempts-warn">
              {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lock-out.
            </p>
          )}

          <p className="login-hint">
            Use your authorised credentials to access MiTrakA.
          </p>      
        </form>
      </div>
    </div>
  );
}
