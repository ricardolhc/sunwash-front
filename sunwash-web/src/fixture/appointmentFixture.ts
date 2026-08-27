import type { Appointment } from "../domain/Appointment";
import appointmentDummy from "../infra/gateway/dummy/appointment.json";

export const mockAppointmentList: Appointment[] =
  appointmentDummy as Appointment[];

export const mockAppointment: Appointment = mockAppointmentList[0];
