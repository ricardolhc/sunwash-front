jest.mock('../http/api', () => ({
  api: {
    patch: jest.fn(),
  },
  numericId: jest.fn((id: string) => id),
}));

import { api } from '../http/api';
import { HttpAppointmentGateway } from './HttpAppointmentGateway';

describe('HttpAppointmentGateway.updateStatus', () => {
  const patch = api.patch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const)(
    'sends the English %s status to the API',
    async (status) => {
      patch.mockResolvedValue({ data: { id: '42', status } });

      await new HttpAppointmentGateway().updateStatus('42', status);

      expect(patch).toHaveBeenCalledWith('/appointments/42/status', { status });
    },
  );
});
