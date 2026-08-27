import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '../context/useDependencies';
import type { Appointment, AppointmentStatus } from '../../domain/Appointment';

export const useAdminDashboardController = () => {
  const queryClient = useQueryClient();
  const {
    listAllAppointmentsUseCase,
    updateAppointmentStatusUseCase,
    uploadDronePhotosUseCase,
    finalizeServiceAndCaptureUseCase,
  } = useDependencies();

  // Estados de Modais
  const [selectedRoofPhoto, setSelectedRoofPhoto] = useState<string | null>(null);
  const [droneUploadModalAppointment, setDroneUploadModalAppointment] = useState<Appointment | null>(null);
  const [droneBeforeUrl, setDroneBeforeUrl] = useState('');
  const [droneAfterUrl, setDroneAfterUrl] = useState('');

  // Mensagens de Feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtro de status
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Query de Agendamentos
  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: async () => {
      return listAllAppointmentsUseCase.execute();
    },
  });

  // Mutation para Atualizar Status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      return updateAppointmentStatusUseCase.execute(id, status);
    },
    onSuccess: (updated) => {
      setSuccessMessage(`Status do agendamento #${updated.id} atualizado para ${updated.status}.`);
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['client-appointments'] });
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || 'Erro ao atualizar status');
    },
  });

  // Mutation para Upload de Fotos do Drone
  const droneUploadMutation = useMutation({
    mutationFn: async ({
      appointmentId,
      droneBeforePhotoUrl,
      droneAfterPhotoUrl,
    }: {
      appointmentId: string;
      droneBeforePhotoUrl: string;
      droneAfterPhotoUrl: string;
    }) => {
      return uploadDronePhotosUseCase.execute({
        appointmentId,
        droneBeforePhotoUrl,
        droneAfterPhotoUrl,
      });
    },
    onSuccess: () => {
      setSuccessMessage('Fotos de drone adicionadas com sucesso!');
      setDroneUploadModalAppointment(null);
      setDroneBeforeUrl('');
      setDroneAfterUrl('');
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['client-appointments'] });
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || 'Erro ao enviar fotos do drone');
    },
  });

  // Mutation para Finalizar Serviço e Capturar Caução
  const finalizeMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      return finalizeServiceAndCaptureUseCase.execute({ appointmentId });
    },
    onSuccess: (result) => {
      setSuccessMessage(`Serviço #${result.appointment.id} concluído e pagamento liquidado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['client-appointments'] });
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || 'Erro ao finalizar serviço');
    },
  });

  const handleOpenDroneUpload = (appointment: Appointment) => {
    setDroneUploadModalAppointment(appointment);
    setDroneBeforeUrl(
      appointment.droneBeforePhotoUrl ||
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80'
    );
    setDroneAfterUrl(
      appointment.droneAfterPhotoUrl ||
        'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80'
    );
  };

  const handleSaveDronePhotos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!droneUploadModalAppointment) return;
    droneUploadMutation.mutate({
      appointmentId: droneUploadModalAppointment.id,
      droneBeforePhotoUrl: droneBeforeUrl,
      droneAfterPhotoUrl: droneAfterUrl,
    });
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return {
    appointments: filteredAppointments,
    allAppointmentsCount: appointments.length,
    isLoading,
    statusFilter,
    setStatusFilter,
    selectedRoofPhoto,
    setSelectedRoofPhoto,
    droneUploadModalAppointment,
    setDroneUploadModalAppointment,
    droneBeforeUrl,
    setDroneBeforeUrl,
    droneAfterUrl,
    setDroneAfterUrl,
    handleOpenDroneUpload,
    handleSaveDronePhotos,
    isUploadingDrone: droneUploadMutation.isPending,
    handleUpdateStatus: (id: string, status: AppointmentStatus) => statusMutation.mutate({ id, status }),
    isUpdatingStatus: statusMutation.isPending,
    handleFinalizeService: (id: string) => finalizeMutation.mutate(id),
    isFinalizing: finalizeMutation.isPending,
    successMessage,
    errorMessage,
    clearFeedback: () => {
      setSuccessMessage(null);
      setErrorMessage(null);
    },
    refetch,
  };
};
