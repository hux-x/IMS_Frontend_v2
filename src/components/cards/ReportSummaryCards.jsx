// components/reports/SummaryCards.jsx
export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm">Total Days</p>
        <h2 className="text-xl font-bold">{summary.total}</h2>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm">Present Days</p>
        <h2 className="text-xl font-bold">{summary.present}</h2>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm">Absent Days</p>
        <h2 className="text-xl font-bold">{summary.absent}</h2>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm">Avg Attendance Rate</p>
        <h2 className="text-xl font-bold">{summary.avgRate}%</h2>
      </div>
    </div>
  );
}
