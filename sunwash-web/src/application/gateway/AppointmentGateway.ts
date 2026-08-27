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

export interface AppointmentGateway {
  create(input: CreateAppointmentInput): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  listByUser(userId: string): Promise<Appointment[]>;
  listAll(): Promise<Appointment[]>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
  uploadDronePhotos(id: string, droneBeforePhotoUrl: string, droneAfterPhotoUrl: string): Promise<Appointment>;
}
