import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToPDF(transactions, reminders, totals) {
  const doc = new jsPDF();
  const { income, expenses, balance } = totals;

  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 220, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Finora — Finance Report", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}`, 145, 18);

  // Summary boxes
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  const boxes = [
    { label: "Total Balance", value: `Rs. ${balance.toLocaleString("en-IN")}`, x: 14 },
    { label: "Total Income", value: `Rs. ${income.toLocaleString("en-IN")}`, x: 80 },
    { label: "Total Expenses", value: `Rs. ${expenses.toLocaleString("en-IN")}`, x: 146 },
  ];

  boxes.forEach((b) => {
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(b.x, 34, 58, 22, 3, 3, "FD");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.text(b.label, b.x + 5, 42);
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.text(b.value, b.x + 5, 52);
  });

  // Transactions table
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Transaction History", 14, 70);

  autoTable(doc, {
    startY: 74,
    head: [["Date", "Description", "Category", "Type", "Amount"]],
    body: transactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      `${t.type === "income" ? "+" : "-"} Rs. ${t.amount.toLocaleString("en-IN")}`,
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 4: { halign: "right" } },
  });

  // Reminders table
  const afterTx = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("EMI & Autopay Reminders", 14, afterTx);

  autoTable(doc, {
    startY: afterTx + 4,
    head: [["Name", "Type", "Due Date", "Amount", "Status"]],
    body: reminders.map((r) => [
      r.name,
      r.type.toUpperCase(),
      r.dueDate,
      `Rs. ${r.amount.toLocaleString("en-IN")}`,
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell(data) {
      if (data.column.index === 4 && data.section === "body") {
        const val = data.cell.raw?.toString().toLowerCase();
        if (val === "paid") data.cell.styles.textColor = [16, 185, 129];
        else if (val === "overdue") data.cell.styles.textColor = [239, 68, 68];
        else data.cell.styles.textColor = [59, 130, 246];
      }
    },
  });

  // Footer
  const pageH = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("Finora — Personal Finance Dashboard", 14, pageH - 8);
  doc.text(`Page 1`, 190, pageH - 8, { align: "right" });

  doc.save(`finora-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}