import type {
  AppointmentGateway,
  AppointmentListFilters,
  AppointmentListResult,
} from '../gateway/AppointmentGateway';

export class ListAllAppointmentsUseCase {
  private appointmentGateway: AppointmentGateway;

  constructor(appointmentGateway: AppointmentGateway) {
    this.appointmentGateway = appointmentGateway;
  }

  async execute(filters?: AppointmentListFilters): Promise<AppointmentListResult> {
    return this.appointmentGateway.listAll(filters);
  }
}
