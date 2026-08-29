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

  test('exportReport requests the pdf blob using the active filters', async () => {
    const pdfBlob = new Blob(['pdf'], { type: 'application/pdf' });
    get.mockResolvedValue({ data: pdfBlob });

    const gateway = new HttpAppointmentGateway() as unknown as {
      exportReport: (filters?: {
        client?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
      }) => Promise<Blob>;
    };

    const result = await gateway.exportReport({
      client: 'Ricardo',
      startDate: '2026-08-28',
      endDate: '2026-08-29',
      status: 'COMPLETED',
    });

    const params = get.mock.calls[0]?.[1]?.params as URLSearchParams;
    expect(get).toHaveBeenCalledWith('/reports/export', {
      params,
      responseType: 'blob',
    });
    expect(params).toBeInstanceOf(URLSearchParams);
    expect(params.toString()).toBe('client=Ricardo&startDate=2026-08-28&endDate=2026-08-29&status=COMPLETED');
    expect(result).toBe(pdfBlob);
  });

  test('exportReport parses a blob error response and throws the backend message', async () => {
    const gateway = new HttpAppointmentGateway() as unknown as {
      exportReport: () => Promise<Blob>;
    };
    const errorBlob = new Blob(
      [JSON.stringify({ message: 'Falha ao gerar PDF' })],
      { type: 'application/json' },
    );
    get.mockRejectedValue({
      response: {
        status: 500,
        data: errorBlob,
      },
      message: 'Request failed with status code 500',
    });

    await expect(gateway.exportReport()).rejects.toMatchObject({
      message: 'Falha ao gerar PDF',
      status: 500,
    });
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
