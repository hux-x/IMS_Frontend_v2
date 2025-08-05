import { TrendingUp, TrendingDown, Users } from "lucide-react";

const summaryData = [
  {
    title: "Total Employees",
    value: 4,
    subtitle: "In selected period",
    icon: Users,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Average Attendance",
    value: "80%",
    subtitle: "Overall performance",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
    progress: 80,
  },
  {
    title: "Needs Attention",
    value: 0,
    subtitle: "<60% attendance",
    icon: TrendingDown,
    color: "bg-red-100 text-red-600",
  },
];

export function ReportsSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {summaryData.map((item, i) => (
        <SummaryCard key={i} {...item} />
      ))}
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, color, progress }) {
  return (
    <div className="p-5 bg-white rounded-2xl shadow flex flex-col gap-2">
      <div className={`w-fit p-2 rounded-full ${color}`}>
        <Icon size={22} />
      </div>
      <h3 className="text-gray-600 font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>

      {progress !== undefined && (
        <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
