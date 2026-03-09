import { useState, useEffect, useRef, useCallback } from 'react';

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'mitrakA_user';
const TIMESTAMP_KEY = 'mitrakA_last_active';
const INACTIVITY_MS = 15 * 60 * 1000; // 15 minutes

// Single authorised credential (client-side only, no backend)
const ALLOWED_EMAIL = 'admin@mitraka.com';
const ALLOWED_PASSWORD = 'MiTrak@8';

// ── PASSWORD RULES ────────────────────────────────────────────────────────────
export const PASSWORD_RULES = [
    { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { id: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { id: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
    { id: 'special', label: 'One special character (!@#$…)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function validatePassword(password) {
    const failed = PASSWORD_RULES.filter(r => !r.test(password));
    return failed.length > 0 ? failed.map(r => r.label).join(', ') : null;
}

// ── HOOK ──────────────────────────────────────────────────────────────────────
export function useAuth() {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const ts = Number(localStorage.getItem(TIMESTAMP_KEY) || 0);
            if (!stored || Date.now() - ts > INACTIVITY_MS) {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(TIMESTAMP_KEY);
                return null;
            }
            return JSON.parse(stored);
        } catch { return null; }
    });

    const timerRef = useRef(null);

    // Bump the last-active timestamp on any user interaction
    const markActive = useCallback(() => {
        localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
    }, []);

    const logout = useCallback((reason = null) => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);
        setUser(null);
    }, []);

    // Inactivity watch
    useEffect(() => {
        if (!user) return;

        const checkInactivity = () => {
            const ts = Number(localStorage.getItem(TIMESTAMP_KEY) || 0);
            const now = Date.now();
            if (now - ts > INACTIVITY_MS) {
                logout('inactivity timeout');
            }
        };

        // Check every 30 seconds for more precision
        const interval = setInterval(checkInactivity, 30_000);

        // Activity events
        const EVENTS = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
        const activityHandler = () => markActive();

        EVENTS.forEach(ev => window.addEventListener(ev, activityHandler, { passive: true }));

        return () => {
            clearInterval(interval);
            EVENTS.forEach(ev => window.removeEventListener(ev, activityHandler));
        };
    }, [user, logout, markActive]);



    // ── login ──────────────────────────────────────────────────────────────────
    const login = useCallback(async ({ email, password }) => {
        // Simulate network round-trip
        await new Promise(r => setTimeout(r, 900));

        if (email.toLowerCase() !== ALLOWED_EMAIL) {
            throw new Error('No account found with that email address.');
        }
        if (password !== ALLOWED_PASSWORD) {
            throw new Error('Incorrect password. Please try again.');
        }

        const userData = { email: ALLOWED_EMAIL, name: 'Hardin', loginAt: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
        setUser(userData);
        return userData;
    }, []);

    return { user, login, logout };
}
