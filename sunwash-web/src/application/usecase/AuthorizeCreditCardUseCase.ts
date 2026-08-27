import type { Payment } from '../../domain/Payment';
import type { AuthorizeCreditCardInput, PaymentGateway } from '../gateway/PaymentGateway';

export class AuthorizeCreditCardUseCase {
  private paymentGateway: PaymentGateway;

  constructor(paymentGateway: PaymentGateway) {
    this.paymentGateway = paymentGateway;
  }

  async execute(input: AuthorizeCreditCardInput): Promise<Payment> {
    if (!input.appointmentId) {
      throw new Error('ID do agendamento é obrigatório');
    }
    if (!input.cardNumber || input.cardNumber.replace(/\s/g, '').length < 13) {
      throw new Error('Número de cartão inválido');
    }
    if (!input.cardHolder?.trim()) {
      throw new Error('Nome impresso no cartão é obrigatório');
    }
    if (!input.expirationDate?.trim()) {
      throw new Error('Data de validade é obrigatória');
    }
    if (!input.cvv || input.cvv.length < 3) {
      throw new Error('CVV inválido');
    }
    return this.paymentGateway.authorizeCreditCard(input);
  }
}
