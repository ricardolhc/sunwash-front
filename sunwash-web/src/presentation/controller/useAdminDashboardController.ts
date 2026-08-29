import { useEffect, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '../context/useDependencies';
import type { Appointment, AppointmentStatus } from '../../domain/Appointment';
import { appointmentStatusLabel } from '../../domain/appointmentStatus';
import type { AppointmentListMeta } from '../../application/gateway/AppointmentGateway';
import { useDebounce } from '../../shared/hooks/useDebounce';

const DEFAULT_ITEMS_PER_PAGE = 10;
const CLIENT_FILTER_DEBOUNCE_MS = 400;

const buildEmptyMeta = (currentPage: number, itemsPerPage: number): AppointmentListMeta => ({
  totalItems: 0,
  itemCount: 0,
  itemsPerPage,
  totalPages: 1,
  currentPage,
});

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

  // Filtros e paginação
  const [clientFilter, setClientFilterState] = useState('');
  const [appliedClientFilter, setAppliedClientFilter] = useState('');
  const [addressFilter, setAddressFilterState] = useState('');
  const [startDateFilter, setStartDateFilterState] = useState('');
  const [endDateFilter, setEndDateFilterState] = useState('');
  const [statusFilter, setStatusFilterState] = useState<'ALL' | AppointmentStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(DEFAULT_ITEMS_PER_PAGE);
  const debouncedClientFilter = useDebounce(clientFilter, CLIENT_FILTER_DEBOUNCE_MS);

  useEffect(() => {
    const nextClientFilter = clientFilter.trim() ? debouncedClientFilter : clientFilter;

    if (nextClientFilter === appliedClientFilter) {
      return;
    }

    setAppliedClientFilter(nextClientFilter);
    setCurrentPage(1);
  }, [appliedClientFilter, clientFilter, debouncedClientFilter]);

  const filters = {
    client: appliedClientFilter.trim() || undefined,
    address: addressFilter.trim() || undefined,
    startDate: startDateFilter || undefined,
    endDate: endDateFilter || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page: currentPage,
    limit: itemsPerPage,
  };

  // Query de Agendamentos
  const { data: appointmentList, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-appointments', filters],
    queryFn: async () => {
      return listAllAppointmentsUseCase.execute(filters);
    },
    placeholderData: keepPreviousData,
  });

  // Mutation para Atualizar Status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      return updateAppointmentStatusUseCase.execute(id, status);
    },
    onSuccess: (updated) => {
      setSuccessMessage(`Status do agendamento #${updated.id} atualizado para ${appointmentStatusLabel(updated.status)}.`);
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

  const appointments = appointmentList?.data ?? [];
  const pagination = appointmentList?.meta ?? buildEmptyMeta(currentPage, itemsPerPage);

  const setClientFilter = (value: string) => {
    setClientFilterState(value);
  };

  const setAddressFilter = (value: string) => {
    setAddressFilterState(value);
    setCurrentPage(1);
  };

  const setStartDateFilter = (value: string) => {
    setStartDateFilterState(value);
    setCurrentPage(1);
  };

  const setEndDateFilter = (value: string) => {
    setEndDateFilterState(value);
    setCurrentPage(1);
  };

  const setStatusFilter = (value: 'ALL' | AppointmentStatus) => {
    setStatusFilterState(value);
    setCurrentPage(1);
  };

  const setItemsPerPage = (value: number) => {
    setItemsPerPageState(Math.max(1, value));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setClientFilterState('');
    setAppliedClientFilter('');
    setAddressFilterState('');
    setStartDateFilterState('');
    setEndDateFilterState('');
    setStatusFilterState('ALL');
    setCurrentPage(1);
  };

  return {
    appointments,
    allAppointmentsCount: pagination.totalItems,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    clientFilter,
    setClientFilter,
    addressFilter,
    setAddressFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
    pagination: {
      ...pagination,
      hasPreviousPage: pagination.currentPage > 1,
      hasNextPage: pagination.currentPage < pagination.totalPages,
    },
    goToPage: (page: number) => {
      setCurrentPage(Math.max(1, page));
    },
    itemsPerPage,
    setItemsPerPage,
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
