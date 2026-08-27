import type { Payment } from '../../domain/Payment';
import type { GeneratePixPaymentInput, PaymentGateway } from '../gateway/PaymentGateway';

export class GeneratePixPaymentUseCase {
  private paymentGateway: PaymentGateway;

  constructor(paymentGateway: PaymentGateway) {
    this.paymentGateway = paymentGateway;
  }

  async execute(input: GeneratePixPaymentInput): Promise<Payment> {
    if (!input.appointmentId) {
      throw new Error('ID do agendamento é obrigatório');
    }
    if (input.amount <= 0) {
      throw new Error('O valor deve ser maior que zero');
    }
    return this.paymentGateway.generatePix(input);
  }
}
