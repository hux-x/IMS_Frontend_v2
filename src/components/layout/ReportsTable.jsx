import ReportCard from '@/components/cards/ReportCard';

export default function ReportsTable({ data }) {
  return (
    <div>
      {data.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
