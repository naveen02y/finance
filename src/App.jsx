import { useState, useEffect } from "react";
import { useStore } from "./store/useStore";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import SummaryCards from "./components/dashboard/SummaryCards";
import BalanceTrend from "./components/dashboard/BalanceTrend";
import SpendingBreakdown from "./components/dashboard/SpendingBreakdown";
import TransactionTable from "./components/transactions/TransactionTable";
import AddTransactionModal from "./components/transactions/AddTransactionModal";
import RemindersSection from "./components/reminders/RemindersSection";
import BudgetPage from "./pages/BudgetPage";
import InsightsPage from "./pages/InsightsPage";
import NotificationsPage from "./pages/NotificationsPage";
import { exportToPDF } from "./utils/exportPDF";
import { checkReminderNotifications } from "./utils/notificationEngine";

export default function App() {
  const {
    role, transactions, reminders, getTotals,
    currentPage, notificationSettings, addNotification
  } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // On load: auto-check reminders
  useEffect(() => {
    if (notificationSettings.permissionGranted) {
      checkReminderNotifications(reminders, notificationSettings.reminderDaysBeforeDue, addNotification);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "budget": return <BudgetPage />;
      case "insights": return <InsightsPage />;
      case "notifications": return <NotificationsPage />;
      case "reminders": return <RemindersSection />;
      case "transactions":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Transactions</h2>
              <div className="flex gap-3">
                <button onClick={() => exportToPDF(transactions, reminders, getTotals())}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:border-emerald-400 transition shadow-sm">
                  📄 Export PDF
                </button>
                {role === "admin" && (
                  <button onClick={() => setShowModal(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-emerald-500/20">
                    + Add Transaction
                  </button>
                )}
              </div>
            </div>
            <TransactionTable />
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceTrend />
              <SpendingBreakdown />
            </div>
            <RemindersSection />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Transactions</h2>
                <div className="flex gap-3">
                  <button onClick={() => exportToPDF(transactions, reminders, getTotals())}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:border-emerald-400 transition shadow-sm">
                    📄 Export PDF
                  </button>
                  {role === "admin" && (
                    <button onClick={() => setShowModal(true)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-emerald-500/20">
                      + Add Transaction
                    </button>
                  )}
                </div>
              </div>
              <TransactionTable />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 text-gray-900 dark:text-white flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {renderPage()}
        </main>
      </div>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}