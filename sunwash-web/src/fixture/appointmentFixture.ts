import type { Appointment } from '../domain/Appointment';
import appointmentDummy from '../infra/dummy/appointment.json';

export const mockAppointmentList: Appointment[] = appointmentDummy as Appointment[];

export const mockAppointment: Appointment = mockAppointmentList[0];
