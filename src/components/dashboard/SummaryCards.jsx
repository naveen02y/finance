import { useStore } from "../../store/useStore";

export default function SummaryCards() {
  const getTotals = useStore((s) => s.getTotals);
  const { income, expenses, balance } = getTotals();
  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  const cards = [
    {
      label: "Total Balance",
      value: fmt(balance),
      change: "+12.5% this month",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-white dark:bg-gray-900",
      border: "border-gray-200 dark:border-gray-800",
      dot: "bg-emerald-500",
      badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total Income",
      value: fmt(income),
      change: "+8.2% this month",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-white dark:bg-gray-900",
      border: "border-gray-200 dark:border-gray-800",
      dot: "bg-blue-500",
      badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Expenses",
      value: fmt(expenses),
      change: "-3.1% this month",
      color: "text-red-500 dark:text-red-400",
      bg: "bg-white dark:bg-gray-900",
      border: "border-gray-200 dark:border-gray-800",
      dot: "bg-red-500",
      badge: "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-2xl border ${c.bg} ${c.border} p-6 shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{c.label}</p>
            <span className={`w-2.5 h-2.5 rounded-full ${c.dot} mt-1`}></span>
          </div>
          <p className={`text-3xl font-bold ${c.color} mb-3`}>{c.value}</p>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.badge}`}>{c.change}</span>
        </div>
      ))}
    </div>
  );
}