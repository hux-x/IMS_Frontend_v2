import { useReportsData } from '@/hooks/useReportsData';
import ReportFilters from '@/components/filters/ReportFilters';
import SummaryCards from '@/components/cards/ReportSummaryCards';
import ReportsTable from '@/components/layout/ReportsTable';

export default function ReportsPage() {
  const {
    reports,
    summary,
    setEmployee,
    employee,
    setMonth,
    setYear,
    month,
    year
  } = useReportsData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance Reports</h1>
      <ReportFilters
        employee={employee}
        setEmployee={setEmployee}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
      />
      <SummaryCards summary={summary} />
      <ReportsTable data={reports} />
    </div>
  );
}
