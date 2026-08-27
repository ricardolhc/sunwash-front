import type { Appointment } from '../../domain/Appointment';
import type { AppointmentGateway } from '../gateway/AppointmentGateway';
import type { PaymentGateway } from '../gateway/PaymentGateway';

export interface FinalizeServiceInput {
  appointmentId: string;
}

export class FinalizeServiceAndCaptureUseCase {
  private appointmentGateway: AppointmentGateway;
  private paymentGateway: PaymentGateway;

  constructor(appointmentGateway: AppointmentGateway, paymentGateway: PaymentGateway) {
    this.appointmentGateway = appointmentGateway;
    this.paymentGateway = paymentGateway;
  }

  async execute(input: FinalizeServiceInput): Promise<{ appointment: Appointment }> {
    if (!input.appointmentId) {
      throw new Error('ID do agendamento é obrigatório');
    }

    const appointment = await this.appointmentGateway.findById(input.appointmentId);
    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    if (appointment.status === 'COMPLETED') {
      throw new Error('Este serviço já foi finalizado anteriormente');
    }

    const payment = await this.paymentGateway.findByAppointmentId(input.appointmentId);
    if (payment && payment.status === 'AUTHORIZED') {
      await this.paymentGateway.capturePayment(payment.id);
    }

    const updatedAppointment = await this.appointmentGateway.updateStatus(input.appointmentId, 'COMPLETED');

    return { appointment: updatedAppointment };
  }
}
