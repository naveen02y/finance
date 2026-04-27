import { useState } from "react";
import { useStore } from "../../store/useStore";

const STATUS_STYLES = {
  upcoming: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  paid:     "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  overdue:  "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400",
};

const TYPE_STYLES = {
  autopay: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  emi:     "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function RemindersSection() {
  const { reminders, role, addReminder, deleteReminder, markReminderPaid } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", dueDate: "", type: "emi" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.name || !form.amount || !form.dueDate) return;
    addReminder({ ...form, amount: Number(form.amount) });
    setForm({ name: "", amount: "", dueDate: "", type: "emi" });
    setShowForm(false);
  };

  const getDaysLeft = (dueDate) => {
    const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return "Due today";
    return `${diff}d left`;
  };

  const sorted = [...reminders].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const totalUpcoming = reminders
    .filter((r) => r.status !== "paid")
    .reduce((s, r) => s + r.amount, 0);

  const inputCls = "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition w-full";

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Reminders</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Upcoming due: <span className="text-red-500 font-semibold">₹{totalUpcoming.toLocaleString("en-IN")}</span>
          </p>
        </div>
        {role === "admin" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md shadow-emerald-500/20"
          >
            + Add Reminder
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && role === "admin" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-gray-800 dark:text-white font-semibold mb-4 text-sm">New Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input name="name" value={form.name} onChange={handle} placeholder="e.g. Home Loan EMI" className={inputCls} />
            <input name="amount" type="number" value={form.amount} onChange={handle} placeholder="Amount (₹)" className={inputCls} />
            <input name="dueDate" type="date" value={form.dueDate} onChange={handle} className={inputCls} />
            <select name="type" value={form.type} onChange={handle} className={inputCls}>
              <option value="emi">EMI</option>
              <option value="autopay">Autopay</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={submit} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition">Save Reminder</button>
          </div>
        </div>
      )}

      {/* Reminders grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((r) => {
          const daysLabel = getDaysLeft(r.dueDate);
          const isOverdue = r.status === "overdue" || daysLabel.includes("overdue");
          return (
            <div key={r.id} className={`bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${isOverdue && r.status !== "paid" ? "border-red-200 dark:border-red-900/40" : "border-gray-200 dark:border-gray-800"}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_STYLES[r.type]}`}>
                    {r.type === "emi" ? "📅 EMI" : "🔄 Autopay"}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>
                    {r.status}
                  </span>
                </div>
                {role === "admin" && (
                  <button onClick={() => deleteReminder(r.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-xs ml-2 transition">✕</button>
                )}
              </div>

              <p className="text-gray-800 dark:text-white font-semibold text-base mb-1">{r.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                ₹{r.amount.toLocaleString("en-IN")}
              </p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Due date</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{r.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${r.status === "paid" ? "text-emerald-500" : isOverdue ? "text-red-500" : "text-blue-500"}`}>
                    {r.status === "paid" ? "✓ Paid" : daysLabel}
                  </p>
                </div>
              </div>

              {role === "admin" && r.status !== "paid" && (
                <button
                  onClick={() => markReminderPaid(r.id)}
                  className="mt-4 w-full py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}