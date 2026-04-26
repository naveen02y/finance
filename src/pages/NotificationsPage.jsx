import { useState } from "react";
import { useStore } from "../store/useStore";
import {
  requestNotificationPermission,
  checkReminderNotifications,
  checkBudgetAlerts,
  checkCustomRules,
  scheduleDailyNotification,
} from "../utils/notificationEngine";

const TYPE_STYLES = {
  danger: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400",
  warning: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-900/40 text-yellow-600 dark:text-yellow-400",
  info: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-900/40 text-blue-600 dark:text-blue-400",
  success: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400",
};
const TYPE_ICONS = { danger: "🚨", warning: "⚠️", info: "ℹ️", success: "✅" };

export default function NotificationsPage() {
  const {
    notifications, markNotificationRead, markAllRead, clearNotifications,
    notificationSettings, updateNotificationSettings,
    reminders, budgetLimits, customRules,
    getDailySpending, getMonthlySpending, getCategorySpending,
    addNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState("center");
  const unread = notifications.filter((n) => !n.read).length;

  const inputCls = "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white outline-none focus:border-emerald-400 transition";

  const handleRequestPermission = () => {
    requestNotificationPermission((s) => updateNotificationSettings(s));
  };

  const handleRunChecks = () => {
    checkReminderNotifications(reminders, notificationSettings.reminderDaysBeforeDue, addNotification);
    checkBudgetAlerts(getDailySpending(), getMonthlySpending(), budgetLimits, addNotification);
    checkCustomRules(customRules, getCategorySpending, addNotification);
    alert("All checks completed! Check the Notification Center tab.");
  };

  const handleScheduleDaily = () => {
    scheduleDailyNotification(
      notificationSettings.dailyReminderTime,
      "Good morning! Review your spending plan for today and stick to your daily budget.",
      addNotification
    );
    alert(`Daily reminder scheduled for ${notificationSettings.dailyReminderTime} today!`);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-400 text-sm mt-1">Manage alerts, reminders, and notification settings.</p>
        </div>
        {unread > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{unread} unread</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[{ id: "center", label: "Notification Center" }, { id: "settings", label: "Settings & Schedule" }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "center" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button onClick={markAllRead} className="text-sm text-emerald-500 hover:text-emerald-600 font-medium">Mark all read</button>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <button onClick={clearNotifications} className="text-sm text-red-400 hover:text-red-500 font-medium">Clear all</button>
          </div>

          {notifications.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <p className="text-4xl mb-3">🔔</p>
              <p className="text-gray-500 font-medium">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">Run checks in Settings to generate alerts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} onClick={() => markNotificationRead(n.id)}
                  className={`border rounded-xl p-4 cursor-pointer transition hover:shadow-sm ${TYPE_STYLES[n.type]} ${!n.read ? "ring-1 ring-current ring-opacity-30" : "opacity-70"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{TYPE_ICONS[n.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-sm">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-current flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-sm opacity-80 mt-0.5">{n.message}</p>
                      <p className="text-xs opacity-60 mt-1">{formatTime(n.time)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-5">
          {/* Browser Permission */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Browser Notifications</h3>
            <p className="text-sm text-gray-400 mb-4">Allow Finora to send desktop notifications for EMI reminders and budget alerts.</p>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${notificationSettings.permissionGranted ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                {notificationSettings.permissionGranted ? "✓ Permitted" : "Not Permitted"}
              </div>
              {!notificationSettings.permissionGranted && (
                <button onClick={handleRequestPermission} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                  Enable Notifications
                </button>
              )}
            </div>
          </div>

          {/* Daily Scheduled Reminder */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Daily Reminder</h3>
            <p className="text-sm text-gray-400 mb-4">Get a daily notification at a specific time to review your finances and stick to your budget.</p>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Reminder Time</label>
                <input type="time" value={notificationSettings.dailyReminderTime}
                  onChange={(e) => updateNotificationSettings({ dailyReminderTime: e.target.value })}
                  className={inputCls} />
              </div>
              <button onClick={handleScheduleDaily}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                Schedule Today
              </button>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Alert Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "overspendAlert", label: "Budget Overspend Alert", desc: "Alert when you exceed daily or monthly limits" },
                { key: "dailyDigestEnabled", label: "Daily Budget Digest", desc: "Morning summary of your financial status" },
              ].map((s) => (
                <div key={s.key} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                  <button onClick={() => updateNotificationSettings({ [s.key]: !notificationSettings[s.key] })}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notificationSettings[s.key] ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notificationSettings[s.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-gray-800 dark:text-white block mb-1">Alert X days before EMI/Autopay due</label>
                <select value={notificationSettings.reminderDaysBeforeDue}
                  onChange={(e) => updateNotificationSettings({ reminderDaysBeforeDue: Number(e.target.value) })}
                  className={`${inputCls} w-40`}>
                  {[1, 2, 3, 5, 7].map((d) => <option key={d} value={d}>{d} day{d > 1 ? "s" : ""} before</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Run All Checks */}
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Run All Checks Now</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
              Manually trigger all notification checks — upcoming EMIs, budget alerts, and custom rule violations.
            </p>
            <button onClick={handleRunChecks}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-md shadow-blue-500/20">
              Run All Checks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}