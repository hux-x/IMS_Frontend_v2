// hooks/useReportsData.js
import { useMemo, useState } from 'react';
import { dummyReports } from '../sections/data/dummyReports';

export const useReportsData = () => {
  const [employee, setEmployee] = useState('all');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const filtered = useMemo(() => {
    return dummyReports.filter((r) => {
      if (employee === 'all') return true;
      return r.name.toLowerCase().includes(employee.toLowerCase());
    });
  }, [employee]);

  const summary = useMemo(() => {
    const total = filtered.reduce((acc, r) => acc + r.totalDays, 0);
    const present = filtered.reduce((acc, r) => acc + r.presentDays, 0);
    return {
      total,
      present,
      absent: total - present,
      avgRate: ((present / total) * 100).toFixed(2),
    };
  }, [filtered]);

  return {
    reports: filtered,
    summary,
    setEmployee,
    setMonth,
    setYear,
    month,
    year,
    employee,
  };
};
