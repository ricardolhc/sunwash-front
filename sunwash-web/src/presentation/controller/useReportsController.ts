import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AppointmentStatus } from '../../domain/Appointment';
import { useDependencies } from '../context/useDependencies';

const REPORTS_PAGE_SIZE = 100;

export const useReportsController = () => {
  const { listAllAppointmentsUseCase } = useDependencies();
  const [clientFilter, setClientFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AppointmentStatus>('ALL');

  const filters = {
    client: clientFilter.trim() || undefined,
    startDate: startDateFilter || undefined,
    endDate: endDateFilter || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page: 1,
    limit: REPORTS_PAGE_SIZE,
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['reports-appointments', filters],
    queryFn: async () => listAllAppointmentsUseCase.execute(filters),
  });

  const appointments = data?.data ?? [];
  const totalItems = data?.meta.totalItems ?? 0;
  const totalRevenue = appointments.reduce((sum, appointment) => sum + appointment.price, 0);
  const completedCount = appointments.filter((appointment) => appointment.status === 'COMPLETED').length;
  const inProgressCount = appointments.filter((appointment) => appointment.status === 'IN_PROGRESS').length;

  return {
    appointments,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    clientFilter,
    setClientFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    statusFilter,
    setStatusFilter,
    clearFilters: () => {
      setClientFilter('');
      setStartDateFilter('');
      setEndDateFilter('');
      setStatusFilter('ALL');
    },
    totalItems,
    totalRevenue,
    completedCount,
    inProgressCount,
    refetch,
  };
};
