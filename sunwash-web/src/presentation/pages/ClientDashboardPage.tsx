import React from 'react';
import { useClientDashboardController } from '../controller/useClientDashboardController';
import { ClientDashboardView } from '../view/ClientDashboard/ClientDashboardView';

export const ClientDashboardPage: React.FC = () => {
  const controller = useClientDashboardController();

  return (
    <ClientDashboardView
      appointments={controller.appointments}
      activeAppointment={controller.activeAppointment}
      isLoading={controller.isLoading}
      error={controller.error}
      selectedAppointmentId={controller.selectedAppointmentId}
      setSelectedAppointmentId={controller.setSelectedAppointmentId}
      timelineSteps={controller.timelineSteps}
      refetch={controller.refetch}
    />
  );
};
