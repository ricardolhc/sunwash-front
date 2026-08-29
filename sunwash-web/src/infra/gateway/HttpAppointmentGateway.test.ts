jest.mock('../http/api', () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn(),
  },
  numericId: jest.fn((id: string) => id),
}));

import { api } from '../http/api';
import { HttpAppointmentGateway } from './HttpAppointmentGateway';

describe('HttpAppointmentGateway', () => {
  const get = api.get as jest.Mock;
  const patch = api.patch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listAll sends filters and pagination params and returns the paginated contract', async () => {
    const response = {
      data: [
        {
          id: '42',
          clientName: 'Ricardo Carvalho',
        },
      ],
      meta: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 2,
      },
    };

    get.mockResolvedValue({ data: response });

    const result = await new HttpAppointmentGateway().listAll({
      client: 'Ricardo',
      address: 'Paulista',
      startDate: '2026-08-28',
      endDate: '2026-08-30',
      status: 'IN_PROGRESS',
      page: 2,
      limit: 10,
    });

    expect(get).toHaveBeenCalledWith('/appointments', {
      params: {
        client: 'Ricardo',
        address: 'Paulista',
        startDate: '2026-08-28',
        endDate: '2026-08-30',
        status: 'IN_PROGRESS',
        page: 2,
        limit: 10,
      },
    });
    expect(result).toEqual(response);
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
