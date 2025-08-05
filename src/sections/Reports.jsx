// src/pages/Reports.jsx
import ReportsHeader from "../components/layout/ReportsHeader";
import ReportsFilters from "../components/filters/ReportFilters";
import{ ReportsSummaryCards} from "../components/cards/ReportSummaryCards";
import {ReportsTable} from "../components/layout/ReportsTable";

function Reports() {
  return (
    <div className="p-6 space-y-6">
      <ReportsHeader />
      <ReportsFilters />
      <ReportsSummaryCards />
      <ReportsTable />
    </div>
  );
}

export default Reports;
