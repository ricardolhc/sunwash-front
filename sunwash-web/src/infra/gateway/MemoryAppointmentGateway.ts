import type { Appointment, AppointmentStatus } from '../../domain/Appointment';
import type {
  AppointmentGateway,
  AppointmentListFilters,
  AppointmentListResult,
  CreateAppointmentInput,
} from '../../application/gateway/AppointmentGateway';
import { mockAppointmentList } from '../../fixture/appointmentFixture';
import { calculateServicePrice } from '../../shared/constants/pricing';

const normalize = (value: string | undefined): string => value?.trim().toLocaleLowerCase() ?? '';

const matchesSearch = (value: string | undefined, haystack: string): boolean => {
  const normalizedValue = normalize(value);
  if (!normalizedValue) return true;
  return haystack.toLocaleLowerCase().includes(normalizedValue);
};

export class MemoryAppointmentGateway implements AppointmentGateway {
  private appointments: Appointment[] = [...mockAppointmentList];

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const price = calculateServicePrice(input.panelsCount);
    const newAppointment: Appointment = {
      id: `app-tw-${Date.now().toString().slice(-6)}`,
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

  async listAll(filters: AppointmentListFilters = {}): Promise<AppointmentListResult> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.max(1, filters.limit ?? 10);

    const filtered = this.appointments.filter((appointment) => {
      const clientHaystack = [
        appointment.clientName,
        appointment.clientEmail,
        appointment.clientPhone,
      ].join(' ');
      const addressHaystack = [
        appointment.address.street,
        appointment.address.number,
        appointment.address.neighborhood,
        appointment.address.city,
        appointment.address.state,
        appointment.address.zipCode,
        appointment.address.complement,
      ]
        .filter(Boolean)
        .join(' ');
      const appointmentDate = appointment.dateTime.slice(0, 10);

      if (!matchesSearch(filters.client, clientHaystack)) return false;
      if (!matchesSearch(filters.address, addressHaystack)) return false;
      if (filters.status && appointment.status !== filters.status) return false;
      if (filters.startDate && appointmentDate < filters.startDate) return false;
      if (filters.endDate && appointmentDate > filters.endDate) return false;

      return true;
    });

    const totalItems = filtered.length;
    const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / limit);
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data: [...data],
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: safePage,
      },
    };
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
