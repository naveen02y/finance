import { useStore } from "../store/useStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

function ScoreRing({ score }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Attention";
  const r = 54, c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" className="dark:stroke-gray-700" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={c * 0.25} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color}>{score}</text>
        <text x="70" y="85" textAnchor="middle" fontSize="11" fill="#9ca3af">{label}</text>
      </svg>
    </div>
  );
}

export default function InsightsPage() {
  const { transactions, getFinancialHealthScore, getBurnRate, budgetLimits } = useStore();
  const score = getFinancialHealthScore();
  const burn = getBurnRate();
  const fmt = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  // Category breakdown
  const expenses = transactions.filter((t) => t.type === "expense");
  const catMap = {};
  expenses.forEach((t) => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

  // Daily trend for last 14 days
  const dayMap = {};
  expenses.forEach((t) => { dayMap[t.date] = (dayMap[t.date] || 0) + t.amount; });
  const dailyTrend = Object.entries(dayMap).sort((a, b) => a[0].localeCompare(b[0])).slice(-14)
    .map(([date, amount]) => ({ date: date.slice(5), amount }));

  const savingsRate = (() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return income > 0 ? Math.round(((income - exp) / income) * 100) : 0;
  })();

  const projectedOverBudget = burn.projectedTotal > budgetLimits.monthly;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Insights</h1>
        <p className="text-gray-400 text-sm mt-1">AI-powered analysis of your financial health and spending patterns.</p>
      </div>

      {/* Health Score + Burn Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <p className="font-semibold text-gray-800 dark:text-white mb-2">Financial Health Score</p>
          <ScoreRing score={score} />
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            {[
              { label: "Savings Rate", value: `${savingsRate}%`, good: savingsRate >= 20 },
              { label: "Budget Used", value: `${Math.round(burn.currentSpend / budgetLimits.monthly * 100)}%`, good: burn.currentSpend < budgetLimits.monthly },
            ].map((m) => (
              <div key={m.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                <p className={`text-lg font-bold ${m.good ? "text-emerald-500" : "text-red-500"}`}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="font-semibold text-gray-800 dark:text-white mb-4">Burn Rate Forecast</p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Spent so far</span>
              <span className="font-semibold text-gray-800 dark:text-white">{fmt(burn.currentSpend)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Avg. per day</span>
              <span className="font-semibold text-gray-800 dark:text-white">{fmt(burn.avgDailySpend)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Days remaining</span>
              <span className="font-semibold text-gray-800 dark:text-white">{burn.daysRemaining}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Projected total</span>
              <span className={`font-bold ${projectedOverBudget ? "text-red-500" : "text-emerald-500"}`}>{fmt(burn.projectedTotal)}</span>
            </div>
            <div className={`rounded-xl p-3 text-sm ${projectedOverBudget ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
              {projectedOverBudget
                ? `⚠️ You will exceed your monthly limit by ${fmt(burn.projectedTotal - budgetLimits.monthly)}.`
                : `✓ You are projected to stay ${fmt(budgetLimits.monthly - burn.projectedTotal)} under budget.`}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="font-semibold text-gray-800 dark:text-white mb-4">Top Spending Categories</p>
          <div className="space-y-3">
            {catData.slice(0, 5).map((c, i) => {
              const total = expenses.reduce((s, t) => s + t.amount, 0);
              const pct = total > 0 ? (c.value / total * 100).toFixed(1) : 0;
              return (
                <div key={c.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{c.name}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Daily Spending (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyTrend}>
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
                formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Spent"]} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {dailyTrend.map((entry, i) => (
                  <Cell key={i} fill={entry.amount > budgetLimits.daily ? "#ef4444" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2 text-center">Red bars = exceeded daily limit</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Category Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} layout="vertical">
              <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
                formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Amount"]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}