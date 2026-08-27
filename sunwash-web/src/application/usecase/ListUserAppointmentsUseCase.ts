import type { Appointment } from '../../domain/Appointment';
import type { AppointmentGateway } from '../gateway/AppointmentGateway';

export class ListUserAppointmentsUseCase {
  private appointmentGateway: AppointmentGateway;

  constructor(appointmentGateway: AppointmentGateway) {
    this.appointmentGateway = appointmentGateway;
  }

  async execute(userId: string): Promise<Appointment[]> {
    if (!userId?.trim()) {
      return [];
    }
    return this.appointmentGateway.listByUser(userId);
  }
}
