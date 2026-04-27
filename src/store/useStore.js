import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTransactions } from "../data/mockTransactions";

const today = new Date().toISOString().slice(0, 10);
const thisMonth = today.slice(0, 7);

export const useStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: "viewer",

      reminders: [
        { id: 1, name: "Netflix Subscription", amount: 649, dueDate: "2026-05-11", type: "autopay", status: "upcoming", category: "Entertainment" },
        { id: 2, name: "Home Loan EMI", amount: 22000, dueDate: "2026-05-05", type: "emi", status: "upcoming", category: "Housing" },
        { id: 3, name: "Car EMI", amount: 8500, dueDate: "2026-05-15", type: "emi", status: "upcoming", category: "Transport" },
        { id: 4, name: "Internet Bill", amount: 999, dueDate: "2026-04-30", type: "autopay", status: "overdue", category: "Bills" },
        { id: 5, name: "Spotify Premium", amount: 119, dueDate: "2026-05-08", type: "autopay", status: "upcoming", category: "Entertainment" },
        { id: 6, name: "Personal Loan EMI", amount: 5500, dueDate: "2026-05-20", type: "emi", status: "upcoming", category: "Loan" },
      ],

      budgetLimits: {
        daily: 1500,
        monthly: 45000,
      },

      customRules: [
        { id: 1, category: "Food", limit: 600, period: "daily", enabled: true },
        { id: 2, category: "Shopping", limit: 5000, period: "monthly", enabled: true },
        { id: 3, category: "Entertainment", limit: 2000, period: "monthly", enabled: true },
      ],

      notificationSettings: {
        permissionGranted: false,
        dailyReminderEnabled: true,
        dailyReminderTime: "09:00",
        reminderDaysBeforeDue: 3,
        overspendAlert: true,
        dailyDigestEnabled: true,
      },

      notifications: [
        { id: 1, type: "warning", title: "Internet Bill Overdue", message: "₹999 payment is overdue. Pay now to avoid penalties.", time: new Date(Date.now() - 3600000).toISOString(), read: false },
        { id: 2, type: "info", title: "Home Loan EMI due in 12 days", message: "₹22,000 due on 2026-05-05. Ensure sufficient balance.", time: new Date(Date.now() - 7200000).toISOString(), read: false },
        { id: 3, type: "success", title: "Monthly budget on track", message: "You have spent 42% of your monthly budget so far.", time: new Date(Date.now() - 86400000).toISOString(), read: true },
      ],

      currentPage: "dashboard",

      // ---- Actions ----
      setRole: (role) => set({ role }),
      setCurrentPage: (page) => set({ currentPage: page }),

      addTransaction: (tx) =>
        set((s) => ({ transactions: [{ ...tx, id: Date.now() }, ...s.transactions] })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      addReminder: (r) =>
        set((s) => ({ reminders: [{ ...r, id: Date.now(), status: "upcoming" }, ...s.reminders] })),
      deleteReminder: (id) =>
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),
      markReminderPaid: (id) =>
        set((s) => ({ reminders: s.reminders.map((r) => r.id === id ? { ...r, status: "paid" } : r) })),

      setBudgetLimits: (limits) => set({ budgetLimits: limits }),

      addCustomRule: (rule) =>
        set((s) => ({ customRules: [{ ...rule, id: Date.now() }, ...s.customRules] })),
      deleteCustomRule: (id) =>
        set((s) => ({ customRules: s.customRules.filter((r) => r.id !== id) })),
      toggleCustomRule: (id) =>
        set((s) => ({ customRules: s.customRules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r) })),

      updateNotificationSettings: (settings) =>
        set((s) => ({ notificationSettings: { ...s.notificationSettings, ...settings } })),

      addNotification: (notif) =>
        set((s) => ({ notifications: [{ ...notif, id: Date.now(), time: new Date().toISOString(), read: false }, ...s.notifications].slice(0, 50) })),
      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      clearNotifications: () => set({ notifications: [] }),

      // ---- Computed ----
      getTotals: () => {
        const txs = get().transactions;
        const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const expenses = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        return { income, expenses, balance: income - expenses };
      },

      getDailySpending: () => {
        const today = new Date().toISOString().slice(0, 10);
        return get().transactions
          .filter((t) => t.type === "expense" && t.date === today)
          .reduce((s, t) => s + t.amount, 0);
      },

      getMonthlySpending: () => {
        const month = new Date().toISOString().slice(0, 7);
        return get().transactions
          .filter((t) => t.type === "expense" && t.date.startsWith(month))
          .reduce((s, t) => s + t.amount, 0);
      },

      getCategorySpending: (category, period) => {
        const txs = get().transactions.filter((t) => t.type === "expense" && t.category === category);
        if (period === "daily") {
          const today = new Date().toISOString().slice(0, 10);
          return txs.filter((t) => t.date === today).reduce((s, t) => s + t.amount, 0);
        }
        const month = new Date().toISOString().slice(0, 7);
        return txs.filter((t) => t.date.startsWith(month)).reduce((s, t) => s + t.amount, 0);
      },

      getFinancialHealthScore: () => {
        const { transactions, reminders, budgetLimits } = get();
        const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

        // 1. Savings Rate (40% weight) — target: save at least 20%
        const savingsRate = income > 0 ? Math.max(0, (income - expenses) / income) : 0;
        const savingsScore = Math.min(100, (savingsRate / 0.20) * 100) * 0.4;

        // 2. Budget Adherence (30% weight)
        const monthlySpend = get().getMonthlySpending();
        const budgetScore = budgetLimits.monthly > 0
          ? Math.min(100, Math.max(0, (1 - monthlySpend / budgetLimits.monthly) * 100 + 50)) * 0.3
          : 50 * 0.3;

        // 3. Reminder Compliance (20% weight)
        const paid = reminders.filter((r) => r.status === "paid").length;
        const total = reminders.length;
        const reminderScore = total > 0 ? (paid / total) * 100 * 0.2 : 80 * 0.2;

        // 4. Spending Consistency (10% weight) — low daily variance is good
        const byDate = {};
        transactions.filter((t) => t.type === "expense").forEach((t) => {
          byDate[t.date] = (byDate[t.date] || 0) + t.amount;
        });
        const dailyAmounts = Object.values(byDate);
        const avg = dailyAmounts.length > 0 ? dailyAmounts.reduce((a, b) => a + b, 0) / dailyAmounts.length : 0;
        const variance = dailyAmounts.length > 0
          ? dailyAmounts.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / dailyAmounts.length : 0;
        const consistencyScore = Math.min(100, Math.max(0, 100 - Math.sqrt(variance) / 100)) * 0.1;

        return Math.round(savingsScore + budgetScore + reminderScore + consistencyScore);
      },

      getBurnRate: () => {
        const month = new Date().toISOString().slice(0, 7);
        const monthlyTxs = get().transactions.filter((t) => t.type === "expense" && t.date.startsWith(month));
        const dayOfMonth = new Date().getDate();
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const daysRemaining = daysInMonth - dayOfMonth;
        const currentSpend = monthlyTxs.reduce((s, t) => s + t.amount, 0);
        const avgDailySpend = dayOfMonth > 0 ? currentSpend / dayOfMonth : 0;
        const projectedTotal = currentSpend + avgDailySpend * daysRemaining;
        return { currentSpend, avgDailySpend, projectedTotal, daysRemaining, dayOfMonth };
      },
    }),
    { name: "finance-store-v2" }
  )
);