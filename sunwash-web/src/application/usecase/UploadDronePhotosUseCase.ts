import type { Appointment } from '../../domain/Appointment';
import type { AppointmentGateway } from '../gateway/AppointmentGateway';

export interface UploadDronePhotosInput {
  appointmentId: string;
  droneBeforePhotoUrl: string;
  droneAfterPhotoUrl: string;
}

export class UploadDronePhotosUseCase {
  private appointmentGateway: AppointmentGateway;

  constructor(appointmentGateway: AppointmentGateway) {
    this.appointmentGateway = appointmentGateway;
  }

  async execute(input: UploadDronePhotosInput): Promise<Appointment> {
    if (!input.appointmentId?.trim()) {
      throw new Error('ID do agendamento é obrigatório');
    }
    if (!input.droneBeforePhotoUrl?.trim() || !input.droneAfterPhotoUrl?.trim()) {
      throw new Error('As fotos de Antes e Depois do drone são obrigatórias');
    }

    return this.appointmentGateway.uploadDronePhotos(
      input.appointmentId,
      input.droneBeforePhotoUrl,
      input.droneAfterPhotoUrl
    );
  }
}
