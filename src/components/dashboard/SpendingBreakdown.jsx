import { useStore } from "../../store/useStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function SpendingBreakdown() {
  const transactions = useStore((s) => s.transactions);
  const expenses = transactions.filter((t) => t.type === "expense");
  const grouped = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 dark:text-white font-semibold">Spending Breakdown</h3>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">By category</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            formatter={(v) => [`₹${v.toLocaleString("en-IN")}`]}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#6b7280" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}