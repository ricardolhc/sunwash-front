import type { Appointment, AppointmentStatus } from '../../domain/Appointment';
import type { AppointmentGateway, CreateAppointmentInput } from '../../application/gateway/AppointmentGateway';
import { api, isNotFound, numericId } from '../http/api';

export class HttpAppointmentGateway implements AppointmentGateway {
  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const response = await api.post<Appointment>('/appointments', {
      userId: input.userId ? numericId(input.userId) : undefined,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      address: input.address,
      scheduledDate: new Date(input.dateTime).toISOString(),
      panelsCount: input.panelsCount,
      roofPhotoUrl: input.roofPhotoUrl,
      notes: input.notes,
    });
    return response.data;
  }

  async findById(id: string): Promise<Appointment | null> {
    try {
      const response = await api.get<Appointment>(`/appointments/${numericId(id)}`);
      return response.data;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async listByUser(userId: string): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>('/appointments/me', {
      params: { userId: numericId(userId) },
    });
    return response.data;
  }

  async listAll(): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>('/appointments');
    return response.data;
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const response = await api.patch<Appointment>(`/appointments/${numericId(id)}/status`, { status });
    return response.data;
  }

  async uploadDronePhotos(id: string, droneBeforePhotoUrl: string, droneAfterPhotoUrl: string): Promise<Appointment> {
    const response = await api.post<Appointment>(`/appointments/${numericId(id)}/drone-photos`, {
      droneBeforePhotoUrl,
      droneAfterPhotoUrl,
    });
    return response.data;
  }
}
