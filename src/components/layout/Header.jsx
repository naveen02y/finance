import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";

export default function Header({ onMenuClick }) {
  const { role, setRole, notifications } = useStore();
  const [dark, setDark] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick}
            className="w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition lg:hidden">
            <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded" />
            <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded" />
            <span className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded" />
          </button>
          <div className="hidden lg:flex items-center gap-2">
            <p className="font-bold text-gray-900 dark:text-white text-lg">Finora</p>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">v2.0</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">Role:</span>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            {["viewer", "admin"].map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`px-4 py-2 text-sm capitalize font-medium transition ${role === r ? "bg-emerald-500 text-white" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"}`}>
                {r}
              </button>
            ))}
          </div>
          <div className="relative">
            <button className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-base hover:border-emerald-400 transition shadow-sm">
              🔔
            </button>
            {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{unread}</span>}
          </div>
          <button onClick={() => setDark(!dark)}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-base hover:border-emerald-400 transition shadow-sm">
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}