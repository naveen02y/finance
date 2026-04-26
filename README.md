# Personal Finance Dashboard

> A modern, responsive personal finance dashboard built with React 18, Tailwind CSS, and Recharts. Track your income, expenses, and spending patterns with a clean and intuitive UI.

🔗 **Live Demo:** [finance-dashboard-mv7yoktyf-nsiripothu-8447s-projects.vercel.app](https://finance-dashboard-mv7yoktyf-nsiripothu-8447s-projects.vercel.app/)

---

##  Screenshots

| Light Mode | Dark Mode |
|---|---|
| ![Light Mode](./screenshots/light.png) | ![Dark Mode](./screenshots/dark.png) |

---

## ✨ Features

### Core Requirements ✅
- **Summary Cards** — Total Balance, Income, and Expenses with color-coded indicators and monthly change badges
- **Balance Trend Chart** — Line chart showing running balance over time (last 30 days)
- **Spending Breakdown Chart** — Donut chart showing expenses grouped by category
- **Transactions Table** — Full list with Date, Description, Category, Amount, and Type columns
- **Filters & Search** — Filter by type (All / Income / Expense), search by description, sort by date or amount
- **Role-Based Access** — Viewer (read-only) and Admin (can add/delete transactions) roles

### Bonus Features ⭐
- 🌙 **Dark / Light Mode Toggle** — Persistent theme switch in the header
-  **LocalStorage Persistence** — Transactions and role survive page refreshes
- ➕ **Add Transaction Modal** — Admin-only modal to add new transactions
- **Delete Transactions** — Admin-only delete with instant UI update
- **Empty State** — Friendly message when no transactions match the filter
- **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React 18 + Vite | Fast dev server, modern React features |
| Styling | Tailwind CSS v4 | Rapid responsive UI, dark mode support |
| Charts | Recharts | Declarative, composable chart components |
| State | Zustand + persist middleware | Lightweight global state + localStorage sync |
| Icons | Lucide React | Clean, consistent icon set |
| Deployment | Vercel | Zero-config CI/CD from GitHub |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Header.jsx          # Nav, role switcher, dark mode toggle
│   ├── dashboard/
│   │   ├── SummaryCards.jsx    # Balance / Income / Expense cards
│   │   ├── BalanceTrend.jsx    # Line chart (Recharts)
│   │   └── SpendingBreakdown.jsx # Donut chart (Recharts)
│   └── transactions/
│       ├── TransactionTable.jsx # Table with search, filter, sort
│       └── AddTransactionModal.jsx # Admin-only modal form
├── store/
│   └── useStore.js             # Zustand store with persist middleware
├── data/
│   └── mockTransactions.js     # 20 realistic sample transactions
├── App.jsx                     # Root layout, role-gated UI
├── main.jsx                    # React DOM entry point
└── index.css                   # Tailwind directives + dark variant
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/finance-dashboard.git

# 2. Navigate into the project
cd finance-dashboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## How Each Core Requirement Is Met

### 1. Dashboard Summary Cards
`src/components/dashboard/SummaryCards.jsx`
Reads from Zustand store using a `getTotals()` selector that computes income, expenses, and balance from the transactions array. Each card has a color-coded value and a percentage change badge.

### 2. Charts
`src/components/dashboard/BalanceTrend.jsx` and `SpendingBreakdown.jsx`
- **Balance Trend** — Sorts transactions by date and builds a running total array fed into a Recharts `LineChart`
- **Spending Breakdown** — Reduces expense transactions by category and feeds the result into a Recharts `PieChart` with `innerRadius` for a donut style

### 3. Transactions Table with Filters
`src/components/transactions/TransactionTable.jsx`
Filters and sorts are computed in the component using local `useState`. Filtering is done in a single `.filter()` chain — no redundant re-renders. Empty state is shown when the filtered array length is 0.

### 4. Role-Based Access Control
`src/store/useStore.js` + `src/App.jsx` + `Header.jsx`
Role is stored globally in Zustand. The `Add Transaction` button and `Delete` column are conditionally rendered based on `role === "admin"`. The role toggle in the header is always visible so evaluators can switch between modes easily.

### 5. State Management
`src/store/useStore.js`
All shared state (transactions, role) lives in a single Zustand store. The `persist` middleware syncs it to `localStorage` automatically. Components access only the slice they need using selectors — avoiding prop drilling and unnecessary re-renders.

### 6. Responsive Design
Every component uses Tailwind's responsive prefixes (`sm:`, `lg:`). The summary cards stack vertically on mobile and go 3-column on `sm:`. The charts go full-width on mobile and 2-column on `lg:`. The transaction table is horizontally scrollable on small screens.

---

##  Key Technical Decisions

**Why Zustand over Redux?**
Redux adds boilerplate (actions, reducers, dispatch) that isn't justified for a single-page dashboard. Zustand provides the same global state benefits in ~10 lines of code, with built-in persistence middleware.

**Why Tailwind v4?**
Tailwind v4 uses `@import "tailwindcss"` instead of PostCSS directives and has a faster engine. The `@custom-variant dark` directive replaces `darkMode: "class"` config for more explicit control.

**Why Recharts over Chart.js?**
Recharts is built natively for React — each chart element is a React component, making it easier to compose, customize, and keep in sync with component state without imperative canvas manipulation.

---

##  Future Improvements

- [ ] Monthly budget goals with progress bars per category
- [ ] Date range picker for custom time filters
- [ ] Export to CSV / PDF
- [ ] Multiple account support (savings, checking, credit)
- [ ] Recurring transaction detection
- [ ] Animated number counters on summary cards
- [ ] Authentication with user profiles

---

##  Author

**Nsiripothu**
- GitHub: [@nsiripothu-8447](https://github.com/nsiripothu-8447)
- Live Project: [Finora on Vercel](https://finance-dashboard-mv7yoktyf-nsiripothu-8447s-projects.vercel.app/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
