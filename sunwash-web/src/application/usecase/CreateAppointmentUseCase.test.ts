import { CreateAppointmentUseCase } from './CreateAppointmentUseCase';
import type { AppointmentGateway, CreateAppointmentInput } from '../gateway/AppointmentGateway';
import type { Appointment } from '../../domain/Appointment';

const validInput: CreateAppointmentInput = {
  userId: 'user-1',
  clientName: 'Ana Silva',
  clientEmail: 'ana@example.com',
  clientPhone: '11999999999',
  address: {
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
  },
  dateTime: '2099-01-05T10:00:00',
  panelsCount: 8,
};

class AppointmentGatewayStub implements AppointmentGateway {
  async create(input: CreateAppointmentInput): Promise<Appointment> {
    return {
      id: 'appointment-1',
      userId: input.userId ?? 'user-client-01',
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      address: input.address,
      dateTime: input.dateTime,
      panelsCount: input.panelsCount,
      status: 'PENDING',
      price: 240,
      createdAt: '2099-01-01T00:00:00.000Z',
    };
  }

  async findById(): Promise<Appointment | null> {
    return null;
  }

  async listByUser(): Promise<Appointment[]> {
    return [];
  }

  async listAll(): Promise<Appointment[]> {
    return [];
  }

  async updateStatus(): Promise<Appointment> {
    throw new Error('Not implemented');
  }

  async uploadDronePhotos(): Promise<Appointment> {
    throw new Error('Not implemented');
  }
}

describe('CreateAppointmentUseCase', () => {
  const useCase = new CreateAppointmentUseCase(new AppointmentGatewayStub());

  it('creates an appointment with complete data on a future business day', async () => {
    await expect(useCase.execute(validInput)).resolves.toMatchObject({
      id: 'appointment-1',
      status: 'PENDING',
      clientEmail: 'ana@example.com',
    });
  });

  it('rejects an appointment with no client name', async () => {
    await expect(useCase.execute({ ...validInput, clientName: '   ' })).rejects.toThrow(
      'Nome completo é obrigatório',
    );
  });

  it('rejects appointments scheduled on Sunday', async () => {
    await expect(useCase.execute({ ...validInput, dateTime: '2099-01-04T10:00:00' })).rejects.toThrow(
      'Não realizamos atendimentos aos domingos. Por favor, escolha de segunda a sábado.',
    );
  });
});
