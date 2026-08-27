import { appointmentStatusLabel } from './appointmentStatus';

describe('appointmentStatusLabel', () => {
  it.each([
    ['PENDING', 'Pendente'],
    ['CONFIRMED', 'Confirmado'],
    ['IN_PROGRESS', 'Em andamento'],
    ['COMPLETED', 'Concluído'],
    ['CANCELLED', 'Cancelado'],
  ] as const)('translates %s to %s for display', (status, label) => {
    expect(appointmentStatusLabel(status)).toBe(label);
  });
});
