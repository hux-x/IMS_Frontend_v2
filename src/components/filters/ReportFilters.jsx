export default function ReportFilters({
  employee,
  setEmployee,
  month,
  setMonth,
  year,
  setYear,
}) {
  return (
    <div className="flex gap-4 items-center mb-4">
      <select className="border p-2 rounded" value={employee} onChange={(e) => setEmployee(e.target.value)}>
        <option value="all">All Employees</option>
        <option value="alice">Alice</option>
        <option value="bob">Bob</option>
        <option value="charlie">Charlie</option>
      </select>

      <select className="border p-2 rounded" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>

      <input
        type="number"
        className="border p-2 rounded w-24"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        min="2000"
        max="2100"
      />
    </div>
  );
}
