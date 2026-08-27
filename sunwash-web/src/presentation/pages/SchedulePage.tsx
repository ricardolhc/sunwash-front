import React from 'react';
import { useScheduleController } from '../controller/useScheduleController';
import { ScheduleView } from '../view/Schedule/ScheduleView';

export const SchedulePage: React.FC = () => {
  const controller = useScheduleController();

  return (
    <ScheduleView
      form={controller.form}
      estimatedPrice={controller.estimatedPrice}
      roofPhotoPreview={controller.roofPhotoPreview}
      handlePhotoSelected={controller.handlePhotoSelected}
      handleRemovePhoto={controller.handleRemovePhoto}
      onSubmit={controller.onSubmit}
      isPending={controller.isPending}
      errorMessage={controller.errorMessage}
      clearError={controller.clearError}
    />
  );
};
