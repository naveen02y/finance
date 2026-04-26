export function requestNotificationPermission(updateSettings) {
  if (!("Notification" in window)) return;
  Notification.requestPermission().then((permission) => {
    updateSettings({ permissionGranted: permission === "granted" });
  });
}

export function fireNotification(title, body, type = "info") {
  if (Notification.permission !== "granted") return;
  const icons = { warning: "⚠️", info: "ℹ️", success: "✅", danger: "🚨" };
  new Notification(`${icons[type]} ${title}`, { body, icon: "/vite.svg" });
}

export function checkReminderNotifications(reminders, daysBeforeDue, addNotification) {
  const today = new Date();
  reminders.forEach((r) => {
    if (r.status === "paid") return;
    const due = new Date(r.dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      fireNotification(`${r.name} is OVERDUE`, `₹${r.amount.toLocaleString("en-IN")} was due on ${r.dueDate}`, "danger");
      addNotification({ type: "danger", title: `${r.name} Overdue`, message: `₹${r.amount.toLocaleString("en-IN")} was due on ${r.dueDate}. Pay immediately!` });
    } else if (diff <= daysBeforeDue) {
      fireNotification(`${r.name} due in ${diff} day(s)`, `₹${r.amount.toLocaleString("en-IN")} due on ${r.dueDate}`, "warning");
      addNotification({ type: "warning", title: `${r.name} due in ${diff}d`, message: `₹${r.amount.toLocaleString("en-IN")} due on ${r.dueDate}.` });
    }
  });
}

export function checkBudgetAlerts(dailySpend, monthlySpend, limits, addNotification) {
  const dailyPct = limits.daily > 0 ? (dailySpend / limits.daily) * 100 : 0;
  const monthlyPct = limits.monthly > 0 ? (monthlySpend / limits.monthly) * 100 : 0;

  if (dailyPct >= 100) {
    fireNotification("Daily Budget Exceeded!", `You've spent ₹${dailySpend.toLocaleString("en-IN")} today (limit: ₹${limits.daily.toLocaleString("en-IN")})`, "danger");
    addNotification({ type: "danger", title: "Daily Limit Exceeded", message: `Spent ₹${dailySpend.toLocaleString("en-IN")} of ₹${limits.daily.toLocaleString("en-IN")} daily limit.` });
  } else if (dailyPct >= 80) {
    addNotification({ type: "warning", title: "Daily Budget Warning", message: `${dailyPct.toFixed(0)}% of daily budget used. ₹${(limits.daily - dailySpend).toLocaleString("en-IN")} remaining.` });
  }

  if (monthlyPct >= 100) {
    fireNotification("Monthly Budget Exceeded!", `₹${monthlySpend.toLocaleString("en-IN")} spent this month`, "danger");
    addNotification({ type: "danger", title: "Monthly Limit Exceeded", message: `Spent ₹${monthlySpend.toLocaleString("en-IN")} of ₹${limits.monthly.toLocaleString("en-IN")} monthly limit.` });
  } else if (monthlyPct >= 80) {
    addNotification({ type: "warning", title: "Monthly Budget Warning", message: `${monthlyPct.toFixed(0)}% of monthly budget used.` });
  }
}

export function checkCustomRules(rules, getCategorySpending, addNotification) {
  rules.filter((r) => r.enabled).forEach((rule) => {
    const spent = getCategorySpending(rule.category, rule.period);
    const pct = (spent / rule.limit) * 100;
    if (pct >= 100) {
      fireNotification(`${rule.category} ${rule.period} limit hit!`, `₹${spent.toLocaleString("en-IN")} spent (limit ₹${rule.limit.toLocaleString("en-IN")})`, "danger");
      addNotification({ type: "danger", title: `${rule.category} Limit Exceeded`, message: `${rule.period === "daily" ? "Today" : "This month"}: ₹${spent.toLocaleString("en-IN")} / ₹${rule.limit.toLocaleString("en-IN")}` });
    }
  });
}

export function scheduleDailyNotification(time, message, addNotification) {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target - now;
  setTimeout(() => {
    fireNotification("Daily Finance Reminder", message, "info");
    addNotification({ type: "info", title: "Daily Reminder", message });
  }, delay);
}