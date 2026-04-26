import { useState } from "react";
import Header from "./components/temp/Header";
import SummaryCards from "./components/dashboard/SummaryCards";
import BalanceTrend from "./components/dashboard/BalanceTrend";
import SpendingBreakdown from "./components/dashboard/SpendingBreakdown";
import TransactionTable from "./components/transactions/TransactionTable";
import AddTransactionModal from "./components/transactions/AddTransactionModal";
import { useStore } from "./store/useStore";

export default function App() {
  const role = useStore((s) => s.role);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 text-gray-900 dark:text-white">
  <Header />
  <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
    <SummaryCards />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BalanceTrend />
      <SpendingBreakdown />
    </div>
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Transactions</h2>
      {role === "admin" && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-emerald-500/20"
        >
          + Add Transaction
        </button>
      )}
    </div>
    <TransactionTable />
  </main>
  {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
</div>
  );
}