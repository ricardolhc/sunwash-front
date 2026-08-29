import type { Address, Appointment, AppointmentStatus } from '../../domain/Appointment';

export interface CreateAppointmentInput {
  userId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: Address;
  dateTime: string;
  panelsCount: number;
  roofPhotoUrl?: string;
  notes?: string;
}

export interface AppointmentListFilters {
  client?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
}

export type ReportExportFilters = Omit<AppointmentListFilters, 'page' | 'limit'>;

export interface AppointmentListMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface AppointmentListResult {
  data: Appointment[];
  meta: AppointmentListMeta;
}

export interface AppointmentGateway {
  create(input: CreateAppointmentInput): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  listByUser(userId: string): Promise<Appointment[]>;
  listAll(filters?: AppointmentListFilters): Promise<AppointmentListResult>;
  exportReport(filters?: ReportExportFilters): Promise<Blob>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
  uploadDronePhotos(id: string, droneBeforePhotoUrl: string, droneAfterPhotoUrl: string): Promise<Appointment>;
}
