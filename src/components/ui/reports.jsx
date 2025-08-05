// src/pages/Reports.jsx
import ReportsHeader from "../layout/ReportsHeader";
import ReportsFilters from "../filters/ReportFilters";
import ReportsSummaryCards from "../cards/ReportSummaryCards";
import ReportsTable from "../layout/ReportsTable";

function reports() {
  return (
    <div className="p-6 space-y-6">
      <ReportsHeader />
      <ReportsFilters />
      <ReportsSummaryCards />
      <ReportsTable />
    </div>
  );
}

export default reports;
