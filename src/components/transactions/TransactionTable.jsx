import { useState } from "react";
import { useStore } from "../../store/useStore";

export default function TransactionTable() {
  const { transactions, role, deleteTransaction } = useStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");

  let filtered = transactions.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sort === "amount-desc") return b.amount - a.amount;
    if (sort === "amount-asc") return a.amount - b.amount;
    return 0;
  });

  const inputCls = "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex flex-wrap gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." className={`${inputCls} flex-1 min-w-[160px]`} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={inputCls}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
          <option value="date-desc">Date ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="amount-desc">Amount ↓</option>
          <option value="amount-asc">Amount ↑</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 font-medium">No transactions found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-left bg-gray-50 dark:bg-gray-800/50">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                {role === "admin" && <th className="px-5 py-3 font-medium"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                  <td className="px-5 py-4 text-gray-400 text-xs">{t.date}</td>
                  <td className="px-5 py-4 text-gray-800 dark:text-white font-medium">{t.description}</td>
                  <td className="px-5 py-4">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{t.category}</span>
                  </td>
                  <td className={`px-5 py-4 text-right font-semibold ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </td>
                  {role === "admin" && (
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => deleteTransaction(t.id)} className="text-gray-600 dark:text-gray-600 hover:text-red-500 text-xs transition">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}