// components/reports/ReportFilters.jsx
export default function ReportFilters({ employee, setEmployee }) {
  return (
    <div className="flex gap-4 items-center mb-4">
      <select
        className="border p-2 rounded"
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
      >
        <option value="all">All Employees</option>
        <option value="alice">Alice</option>
        <option value="bob">Bob</option>
        <option value="charlie">Charlie</option>
      </select>
    </div>
  );
}
