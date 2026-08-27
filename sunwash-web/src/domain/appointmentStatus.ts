import type { AppointmentStatus } from './Appointment';

export const appointmentStatuses = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const satisfies readonly AppointmentStatus[];

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export const appointmentStatusLabel = (status: AppointmentStatus): string =>
  appointmentStatusLabels[status];
