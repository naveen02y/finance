import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";

export default function Header() {
  const { role, setRole } = useStore();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">F</div>
          <div>
            <span className="text-gray-900 dark:text-white font-bold text-lg">Finance DashBoard</span>
            <p className="text-xs text-gray-400 leading-none">Personal Finance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">Role:</span>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            {["viewer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-4 py-2 text-sm capitalize font-medium transition ${
                  role === r
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-base hover:border-emerald-400 transition shadow-sm"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}