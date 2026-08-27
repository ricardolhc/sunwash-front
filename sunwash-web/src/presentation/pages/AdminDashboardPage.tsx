import React from 'react';
import { useAdminDashboardController } from '../controller/useAdminDashboardController';
import { AdminDashboardView } from '../view/AdminDashboard/AdminDashboardView';

export const AdminDashboardPage: React.FC = () => {
  const controller = useAdminDashboardController();

  return (
    <AdminDashboardView
      appointments={controller.appointments}
      allAppointmentsCount={controller.allAppointmentsCount}
      isLoading={controller.isLoading}
      statusFilter={controller.statusFilter}
      setStatusFilter={controller.setStatusFilter}
      selectedRoofPhoto={controller.selectedRoofPhoto}
      setSelectedRoofPhoto={controller.setSelectedRoofPhoto}
      droneUploadModalAppointment={controller.droneUploadModalAppointment}
      setDroneUploadModalAppointment={controller.setDroneUploadModalAppointment}
      droneBeforeUrl={controller.droneBeforeUrl}
      setDroneBeforeUrl={controller.setDroneBeforeUrl}
      droneAfterUrl={controller.droneAfterUrl}
      setDroneAfterUrl={controller.setDroneAfterUrl}
      handleOpenDroneUpload={controller.handleOpenDroneUpload}
      handleSaveDronePhotos={controller.handleSaveDronePhotos}
      isUploadingDrone={controller.isUploadingDrone}
      handleUpdateStatus={controller.handleUpdateStatus}
      isUpdatingStatus={controller.isUpdatingStatus}
      handleFinalizeService={controller.handleFinalizeService}
      isFinalizing={controller.isFinalizing}
      successMessage={controller.successMessage}
      errorMessage={controller.errorMessage}
      clearFeedback={controller.clearFeedback}
      refetch={controller.refetch}
    />
  );
};
