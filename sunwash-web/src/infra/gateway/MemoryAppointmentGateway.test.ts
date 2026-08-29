import { MemoryAppointmentGateway } from './MemoryAppointmentGateway';

describe('MemoryAppointmentGateway.listAll', () => {
  test('filters by client, address, date range and status before paginating', async () => {
    const gateway = new MemoryAppointmentGateway();

    const result = await gateway.listAll({
      client: 'Ricardo',
      address: 'Paulista',
      startDate: '2026-08-28',
      endDate: '2026-08-28',
      status: 'IN_PROGRESS',
      page: 1,
      limit: 10,
    });

    expect(result.data.map((appointment) => appointment.id)).toEqual(['app-tw-002']);
    expect(result.meta).toEqual({
      totalItems: 1,
      itemCount: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    });
  });

  test('returns the requested page slice and metadata', async () => {
    const gateway = new MemoryAppointmentGateway();

    const result = await gateway.listAll({
      page: 2,
      limit: 2,
    });

    expect(result.data.map((appointment) => appointment.id)).toEqual(['app-tw-003', 'app-tw-004']);
    expect(result.meta).toEqual({
      totalItems: 4,
      itemCount: 2,
      itemsPerPage: 2,
      totalPages: 2,
      currentPage: 2,
    });
  });
});
