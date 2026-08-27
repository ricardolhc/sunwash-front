import type { Appointment } from '../../domain/Appointment';
import type { AppointmentGateway, CreateAppointmentInput } from '../gateway/AppointmentGateway';

export class CreateAppointmentUseCase {
  private appointmentGateway: AppointmentGateway;

  constructor(appointmentGateway: AppointmentGateway) {
    this.appointmentGateway = appointmentGateway;
  }

  async execute(input: CreateAppointmentInput): Promise<Appointment> {
    if (!input.clientName?.trim()) {
      throw new Error('Nome completo é obrigatório');
    }
    if (!input.clientEmail?.trim()) {
      throw new Error('E-mail é obrigatório');
    }
    if (!input.clientPhone?.trim()) {
      throw new Error('Telefone/WhatsApp é obrigatório');
    }
    if (!input.dateTime) {
      throw new Error('Data e horário do agendamento são obrigatórios');
    }

    const appointmentDate = new Date(input.dateTime);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error('Data ou horário inválidos');
    }

    // Regra de Negócio: Não pode agendar no passado
    const now = new Date();
    if (appointmentDate.getTime() < now.getTime()) {
      throw new Error('A data do agendamento deve ser posterior à data atual');
    }

    // Regra de Negócio: Não pode agendar aos domingos (day 0)
    if (appointmentDate.getDay() === 0) {
      throw new Error('Não realizamos atendimentos aos domingos. Por favor, escolha de segunda a sábado.');
    }

    // Regra de Negócio: Horário comercial das 08:00 às 17:00
    const hours = appointmentDate.getHours();
    if (hours < 8 || hours >= 18) {
      throw new Error('Os agendamentos devem ser marcados no horário comercial (entre 08:00 e 17:30).');
    }

    if (!input.panelsCount || input.panelsCount < 1) {
      throw new Error('Informe a quantidade de placas solares (mínimo 1).');
    }

    if (!input.address?.street?.trim() || !input.address?.city?.trim()) {
      throw new Error('Endereço completo é obrigatório.');
    }

    return this.appointmentGateway.create(input);
  }
}
