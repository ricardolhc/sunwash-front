import type { Appointment, AppointmentStatus } from '../../domain/Appointment';
import type { AppointmentGateway, CreateAppointmentInput } from '../../application/gateway/AppointmentGateway';
import { mockAppointmentList } from '../../fixture/appointmentFixture';
import { calculateServicePrice } from '../../shared/constants/pricing';

export class MemoryAppointmentGateway implements AppointmentGateway {
  private appointments: Appointment[] = [...mockAppointmentList];

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const price = calculateServicePrice(input.panelsCount);
    const newAppointment: Appointment = {
      id: `app-sun-${Date.now().toString().slice(-6)}`,
      userId: input.userId || 'user-client-01',
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      address: input.address,
      dateTime: input.dateTime,
      panelsCount: input.panelsCount,
      roofPhotoUrl: input.roofPhotoUrl,
      status: 'PENDING',
      price,
      createdAt: new Date().toISOString(),
      notes: input.notes,
    };
    this.appointments.unshift(newAppointment);
    return newAppointment;
  }

  async findById(id: string): Promise<Appointment | null> {
    const found = this.appointments.find((a) => a.id === id);
    return found ? { ...found } : null;
  }

  async listByUser(userId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.userId === userId);
  }

  async listAll(): Promise<Appointment[]> {
    return [...this.appointments];
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const index = this.appointments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Agendamento com id ${id} não encontrado`);
    }
    const updated = {
      ...this.appointments[index],
      status,
      completedAt: status === 'COMPLETED' ? new Date().toISOString() : this.appointments[index].completedAt,
    };
    this.appointments[index] = updated;
    return { ...updated };
  }

  async uploadDronePhotos(id: string, droneBeforePhotoUrl: string, droneAfterPhotoUrl: string): Promise<Appointment> {
    const index = this.appointments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Agendamento com id ${id} não encontrado`);
    }
    const updated: Appointment = {
      ...this.appointments[index],
      droneBeforePhotoUrl,
      droneAfterPhotoUrl,
    };
    this.appointments[index] = updated;
    return { ...updated };
  }
}
