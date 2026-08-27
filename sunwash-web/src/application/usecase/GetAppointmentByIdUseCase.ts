import type { Appointment } from '../../domain/Appointment';
import type { AppointmentGateway } from '../gateway/AppointmentGateway';

export class GetAppointmentByIdUseCase {
  private appointmentGateway: AppointmentGateway;

  constructor(appointmentGateway: AppointmentGateway) {
    this.appointmentGateway = appointmentGateway;
  }

  async execute(id: string): Promise<Appointment | null> {
    if (!id?.trim()) {
      throw new Error('ID do agendamento é obrigatório');
    }
    return this.appointmentGateway.findById(id);
  }
}
