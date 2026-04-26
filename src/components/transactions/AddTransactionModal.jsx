import { useState } from "react";
import { useStore } from "../../store/useStore";

export default function AddTransactionModal({ onClose }) {
  const addTransaction = useStore((s) => s.addTransaction);
  const [form, setForm] = useState({ date: "", description: "", category: "", amount: "", type: "expense" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.date || !form.description || !form.amount) return;
    addTransaction({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-semibold text-lg mb-5">Add Transaction</h3>
        <div className="space-y-4">
          {[
            { name: "date", label: "Date", type: "date" },
            { name: "description", label: "Description", type: "text" },
            { name: "category", label: "Category", type: "text" },
            { name: "amount", label: "Amount (₹)", type: "number" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-gray-400 text-sm block mb-1">{f.label}</label>
              <input name={f.name} type={f.type} value={form[f.name]} onChange={handle}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
          ))}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Type</label>
            <select name="type" value={form.type} onChange={handle}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition">Cancel</button>
          <button onClick={submit} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium transition">Add</button>
        </div>
      </div>
    </div>
  );
}