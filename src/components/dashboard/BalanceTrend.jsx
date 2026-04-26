import { useStore } from "../../store/useStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BalanceTrend() {
  const transactions = useStore((s) => s.transactions);
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let running = 0;
  const data = sorted.map((t) => {
    running += t.type === "income" ? t.amount : -t.amount;
    return { date: t.date.slice(5), balance: running };
  });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 dark:text-white font-semibold">Balance Trend</h3>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Last 30 days</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            labelStyle={{ color: "#6b7280" }}
            formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Balance"]}
          />
          <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}