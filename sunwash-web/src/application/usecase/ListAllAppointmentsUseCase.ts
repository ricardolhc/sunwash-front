import type { Appointment } from '../../domain/Appointment';
import type { AppointmentGateway } from '../gateway/AppointmentGateway';

export class ListAllAppointmentsUseCase {
  private appointmentGateway: AppointmentGateway;

  constructor(appointmentGateway: AppointmentGateway) {
    this.appointmentGateway = appointmentGateway;
  }

  async execute(): Promise<Appointment[]> {
    return this.appointmentGateway.listAll();
  }
}
