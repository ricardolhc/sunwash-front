import type { Appointment, AppointmentStatus } from '../../domain/Appointment';
import type { AppointmentGateway } from '../gateway/AppointmentGateway';

export class UpdateAppointmentStatusUseCase {
  private appointmentGateway: AppointmentGateway;

  constructor(appointmentGateway: AppointmentGateway) {
    this.appointmentGateway = appointmentGateway;
  }

  async execute(id: string, status: AppointmentStatus): Promise<Appointment> {
    if (!id?.trim()) {
      throw new Error('ID do agendamento é obrigatório');
    }
    return this.appointmentGateway.updateStatus(id, status);
  }
}
