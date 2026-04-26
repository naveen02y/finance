import { useStore } from "../../store/useStore";

const navItems = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "transactions", icon: "⇄", label: "Transactions" },
  { id: "reminders", icon: "◷", label: "Reminders" },
  { id: "budget", icon: "◈", label: "Budget & Limits" },
  { id: "insights", icon: "◎", label: "Smart Insights" },
  { id: "notifications", icon: "◉", label: "Notifications" },
];

export default function Sidebar({ open, onClose }) {
  const { currentPage, setCurrentPage, notifications } = useStore();
  const unread = (notifications || []).filter((n) => !n.read).length;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 shadow-2xl
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shadow-none lg:z-auto`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30 text-sm">F</div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-base">Finora</p>
            <p className="text-xs text-gray-400">Finance Dashboard</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <nav className="p-3 space-y-1 pb-6">
          {navItems.map((item) => (
            <div key={item.id}>
              {item.id === "notifications" && (
                <div className="mx-4 my-2 h-px bg-gray-200 dark:bg-gray-700"></div>
              )}

              <button
                onClick={() => {
                  console.log("Clicked:", item.id);
                  setCurrentPage(item.id);
                  if (onClose) onClose();
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                  ${currentPage === item.id
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}`}
              >
                <span className="text-lg w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>

                {item.id === "notifications" && unread > 0 && (
                  <span
                    className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                      currentPage === "notifications"
                        ? "bg-white text-emerald-600"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {unread}
                  </span>
                )}
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 text-center">Finora v2.0 • IIIT Bhopal</p>
        </div>
      </aside>
    </>
  );
}