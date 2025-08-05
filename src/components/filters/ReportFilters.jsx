const months = ["January", "February", "March", "April", "May"];
const years = [2024, 2025, 2026];

export default function ReportsFilters({
  selectedMonth,
  selectedYear,
  selectedEmployee,
  onMonthChange,
  onYearChange,
  onEmployeeChange,
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(Number(e.target.value))}
        className="p-2 border rounded"
      >
        {months.map((month, idx) => (
          <option key={idx} value={idx}>
            {month}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="p-2 border rounded"
      >
        {years.map((year) => (
          <option key={year}>{year}</option>
        ))}
      </select>

      <select
        value={selectedEmployee}
        onChange={(e) => onEmployeeChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="All">All Employees</option>
        {/* Later dynamically inject employees */}
      </select>

      <button className="ml-auto px-4 py-2 bg-white border rounded hover:bg-gray-100">
        Export PDF
      </button>
    </div>
  );
}
