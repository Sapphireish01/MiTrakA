# MiTrakA — Personal Finance, Simplified.

Welcome to **MiTrakA**, a sleek, privacy-focused personal finance companion. Designed for clarity and ease of use, MiTrakA helps you see exactly where your money goes without the complexity of traditional banking apps.

---

## The Vision: Why MiTrakA?

Most finance trackers are either too simple or overly complex. MiTrakA hits the sweet spot:
- **Private by Design**: Your data stays on your device. No servers, no tracking.
- **Instant Insights**: Beautifully rendered charts show your income vs. spending trends at a glance.
- **Smart Budgets**: Stay on track with visual progress bars and instant over-budget alerts.
- **Seamless Flow**: Adding a transaction takes seconds, not minutes.

---

## The Build: Choices & Logic

### Core Stack
- **React 18**: Chosen for its reactive state management, ensuring the UI stays in sync with local data instantly.
- **Recharts**: Integrated for its robust, responsive SVG charting capabilities, allowing users to visualize financial health without performance lag.
- **Native CSS Variables**: Used to implement a flicker-free "Night Mode" and "Glassmorphism" UI that feels premium and modern.

### Data & Privacy Choice
We opted for **Browser Local Storage** instead of a traditional database. 
- **Reason**: Security and Privacy. By keeping data local, we eliminate the need for server-side security audits and give the user 100% ownership of their financial history.
- **Architecture**: A custom `useLocalStorage` hook acts as a lightweight ORM, handling JSON serialization and persistence.

---

## Challenges Faced

1.  **Mobile Component Density**: Fitting a full financial dashboard (charts, lists, and forms) onto a mobile screen required significant iteration on the `Sidebar` and `SummaryCards` components to ensure accessibility without clutter.
2.  **Session Security**: Implementing a reliable 7-minute inactivity logout using only client-side state required careful management of global event listeners (mouse, keyboard, touch) to avoid memory leaks.
3.  **Data Consistency**: Ensuring the `SpendingChart` updated in real-time as users added/deleted transactions across different components was solved using a centralized `useTransactions` hook.

---

## Development Metrics

- **Time Spent**: ~28 Hours (approx. 7 days of active development).
- **Phases**: 
    - 20% Research & Wireframing
    - 50% Core Implementation (Hooks & Logic)
    - 30% UI Polish & Mobile Optimization

---

## The Roadmap (Future Improvements)

While MiTrakA is powerful, there's always room to grow:
- [ ] **Historical Deep-Dives**: Implementation of a month/year picker for longitudinal analysis.
- [ ] **Category Mastery**: Allowing users to create custom categories with unique icons.
- [ ] **Data Portability**: Adding CSV/JSON export functionality so users can back up their local data.
- [ ] **Recurring Logic**: Support for automated monthly subscriptions and bills.

---

## Experience it Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

### Login Credentials
- **Username**: `admin@mitraka.com`
- **Password**: `MiTrak@8`

---

## Deployment
Hosted live on Vercel: [mitraka.vercel.app](https://mitraka.vercel.app/)

*“Control your money, or it will control you.”* — **MiTrakA Team**

