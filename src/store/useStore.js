import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTransactions } from "../data/mockTransactions";

export const useStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: "viewer", // "viewer" | "admin"

      setRole: (role) => set({ role }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: Date.now() },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      getTotals: () => {
        const txs = get().transactions;
        const income = txs
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amount, 0);
        const expenses = txs
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0);
        return { income, expenses, balance: income - expenses };
      },
    }),
    { name: "finance-store" }
  )
);