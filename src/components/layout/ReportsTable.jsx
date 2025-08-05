import { Download, TrendingDown } from "lucide-react";

export function ReportsTable({ data = [], title }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4">Present</th>
              <th className="py-3 px-4">Absent</th>
              <th className="py-3 px-4">Performance</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4 text-right">Export</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((emp, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <div className="font-semibold">{emp.name}</div>
                    <div className="text-gray-500 text-xs">{emp.email}</div>
                  </td>
                  <td className="py-4 px-4 text-sm">{emp.joined}</td>
                  <td className="py-4 px-4">{emp.present}</td>
                  <td className="py-4 px-4">{emp.absent}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                      {emp.performance}
                    </span>
                  </td>
                  <td className="py-4 px-4 w-56">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getBarColor(emp.percentage)}`}
                          style={{ width: `${emp.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {emp.percentage}%
                      </span>
                    </div>
                    <div className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <TrendingDown size={14} />
                      {emp.trend}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 border rounded hover:bg-gray-100">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper
function getBarColor(percent) {
  if (percent >= 90) return "bg-green-500";
  if (percent >= 75) return "bg-yellow-500";
  return "bg-red-500";
}
