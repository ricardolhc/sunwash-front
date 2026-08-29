import React from 'react';
import { useReportsController } from '../controller/useReportsController';
import { ReportsView } from '../view/Reports/ReportsView';

export const ReportsPage: React.FC = () => {
  const controller = useReportsController();

  return (
    <ReportsView
      appointments={controller.appointments}
      isLoading={controller.isLoading}
      isRefreshing={controller.isRefreshing}
      clientFilter={controller.clientFilter}
      setClientFilter={controller.setClientFilter}
      startDateFilter={controller.startDateFilter}
      setStartDateFilter={controller.setStartDateFilter}
      endDateFilter={controller.endDateFilter}
      setEndDateFilter={controller.setEndDateFilter}
      statusFilter={controller.statusFilter}
      setStatusFilter={controller.setStatusFilter}
      clearFilters={controller.clearFilters}
      totalItems={controller.totalItems}
      totalRevenue={controller.totalRevenue}
      completedCount={controller.completedCount}
      inProgressCount={controller.inProgressCount}
    />
  );
};
