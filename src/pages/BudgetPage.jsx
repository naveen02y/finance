import { useState } from "react";
import { useStore } from "../store/useStore";

function ProgressBar({ value, max, color = "emerald" }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  const colorMap = {
    emerald: "bg-emerald-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
  };
  const c = pct >= 100 ? "red" : pct >= 80 ? "yellow" : "emerald";
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
      <div className={`h-3 rounded-full transition-all duration-700 ${colorMap[c]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function BudgetPage() {
  const {
    budgetLimits, setBudgetLimits,
    customRules, addCustomRule, deleteCustomRule, toggleCustomRule,
    getDailySpending, getMonthlySpending, getCategorySpending,
    role,
  } = useStore();

  const dailySpend = getDailySpending();
  const monthlySpend = getMonthlySpending();
  const dailyPct = budgetLimits.daily > 0 ? (dailySpend / budgetLimits.daily) * 100 : 0;
  const monthlyPct = budgetLimits.monthly > 0 ? (monthlySpend / budgetLimits.monthly) * 100 : 0;

  const [editLimits, setEditLimits] = useState(false);
  const [limits, setLimits] = useState(budgetLimits);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [ruleForm, setRuleForm] = useState({ category: "", limit: "", period: "daily" });

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Housing", "Loan", "Other"];
  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  const getStatusLabel = (pct) => {
    if (pct >= 100) return { text: "Exceeded", color: "text-red-500" };
    if (pct >= 80) return { text: "Warning", color: "text-yellow-500" };
    return { text: "On Track", color: "text-emerald-500" };
  };

  const inputCls = "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white outline-none focus:border-emerald-400 transition";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget & Limits</h1>
        <p className="text-gray-400 text-sm mt-1">Set daily and monthly spending limits. Get alerted when you approach them.</p>
      </div>

      {/* Daily + Monthly limit cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { label: "Daily Spending", spent: dailySpend, limit: budgetLimits.daily, pct: dailyPct, reset: "Resets at midnight" },
          { label: "Monthly Spending", spent: monthlySpend, limit: budgetLimits.monthly, pct: monthlyPct, reset: `${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} days left this month` },
        ].map((card) => {
          const status = getStatusLabel(card.pct);
          return (
            <div key={card.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{fmt(card.spent)}</p>
                  <p className="text-sm text-gray-400 mt-0.5">of {fmt(card.limit)} limit</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${card.pct >= 100 ? "bg-red-50 dark:bg-red-500/10 text-red-500" : card.pct >= 80 ? "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                  {status.text}
                </span>
              </div>
              <ProgressBar value={card.spent} max={card.limit} />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-400">{card.reset}</p>
                <p className={`text-sm font-semibold ${card.pct >= 100 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {card.pct >= 100 ? `${fmt(card.spent - card.limit)} over` : `${fmt(card.limit - card.spent)} left`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Limits */}
      {role === "admin" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">Edit Spending Limits</h3>
            <button onClick={() => setEditLimits(!editLimits)} className="text-sm text-emerald-500 hover:text-emerald-600 font-medium">
              {editLimits ? "Cancel" : "Edit"}
            </button>
          </div>
          {editLimits ? (
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Daily Limit (₹)</label>
                <input type="number" value={limits.daily} onChange={(e) => setLimits({ ...limits, daily: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Monthly Limit (₹)</label>
                <input type="number" value={limits.monthly} onChange={(e) => setLimits({ ...limits, monthly: Number(e.target.value) })} className={inputCls} />
              </div>
              <button onClick={() => { setBudgetLimits(limits); setEditLimits(false); }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition">
                Save Limits
              </button>
            </div>
          ) : (
            <div className="flex gap-8">
              <div><p className="text-xs text-gray-400">Daily Limit</p><p className="text-lg font-bold text-gray-900 dark:text-white">{fmt(budgetLimits.daily)}</p></div>
              <div><p className="text-xs text-gray-400">Monthly Limit</p><p className="text-lg font-bold text-gray-900 dark:text-white">{fmt(budgetLimits.monthly)}</p></div>
            </div>
          )}
        </div>
      )}

      {/* Custom Rules */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Smart Spending Rules</h3>
            <p className="text-xs text-gray-400 mt-0.5">Get alerted when category spending exceeds your custom limits</p>
          </div>
          {role === "admin" && (
            <button onClick={() => setShowRuleForm(!showRuleForm)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition">
              + Add Rule
            </button>
          )}
        </div>

        {showRuleForm && role === "admin" && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Category</label>
              <select value={ruleForm.category} onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value })} className={inputCls}>
                <option value="">Select</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Limit (₹)</label>
              <input type="number" value={ruleForm.limit} onChange={(e) => setRuleForm({ ...ruleForm, limit: e.target.value })} className={inputCls} placeholder="e.g. 500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Period</label>
              <select value={ruleForm.period} onChange={(e) => setRuleForm({ ...ruleForm, period: e.target.value })} className={inputCls}>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <button onClick={() => {
              if (!ruleForm.category || !ruleForm.limit) return;
              addCustomRule({ ...ruleForm, limit: Number(ruleForm.limit), enabled: true });
              setRuleForm({ category: "", limit: "", period: "daily" });
              setShowRuleForm(false);
            }} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition">
              Save
            </button>
          </div>
        )}

        <div className="space-y-3">
          {customRules.map((rule) => {
            const spent = getCategorySpending(rule.category, rule.period);
            const pct = Math.min(100, rule.limit > 0 ? (spent / rule.limit) * 100 : 0);
            return (
              <div key={rule.id} className={`border rounded-xl p-4 transition ${rule.enabled ? "border-gray-200 dark:border-gray-700" : "border-gray-100 dark:border-gray-800 opacity-50"}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleCustomRule(rule.id)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${rule.enabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${rule.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <span className="font-medium text-sm text-gray-800 dark:text-white">{rule.category}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{rule.period}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{fmt(spent)} / {fmt(rule.limit)}</span>
                    {role === "admin" && <button onClick={() => deleteCustomRule(rule.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-xs transition">✕</button>}
                  </div>
                </div>
                <ProgressBar value={spent} max={rule.limit} />
                <p className={`text-xs mt-1.5 font-medium ${pct >= 100 ? "text-red-500" : pct >= 80 ? "text-yellow-500" : "text-emerald-500"}`}>
                  {pct >= 100 ? `Over limit by ${fmt(spent - rule.limit)}` : `${fmt(rule.limit - spent)} remaining`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}