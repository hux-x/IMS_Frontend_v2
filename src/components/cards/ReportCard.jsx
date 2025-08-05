import { Download, TrendingUp } from 'lucide-react';

export default function ReportCard({ report }) {
  const rate = ((report.presentDays / report.totalDays) * 100).toFixed(2);

  const handleExport = () => {
    const data = `Name: ${report.name}\nEmail: ${report.email}\nAttendance: ${rate}%`;
    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.name}-report.txt`;
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-bold">{report.name}</h2>
          <p className="text-sm text-gray-500">{report.email}</p>
          <p className="text-xs text-gray-400">Joined: {report.joined}</p>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-yellow-600">{rate}%</h3>
          <div className="text-xs text-yellow-600 flex items-center justify-end">
            <TrendingUp className="w-4 h-4 mr-1" /> Good
          </div>
          <button onClick={handleExport} className="mt-2 text-sm border px-3 py-1 rounded hover:bg-gray-100">
            <Download className="w-4 h-4 inline mr-1" /> Export
          </button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm">
          Present Days: {report.presentDays} / Total Days: {report.totalDays} <br />
          Absent Days: {report.totalDays - report.presentDays}
        </p>
        <div className="mt-1 w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-black rounded"
            style={{ width: `${rate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
