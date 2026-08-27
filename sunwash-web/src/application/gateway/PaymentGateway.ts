import type { Payment } from '../../domain/Payment';

export interface GeneratePixPaymentInput {
  appointmentId: string;
  amount: number;
}

export interface AuthorizeCreditCardInput {
  appointmentId: string;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
}

export interface PaymentGateway {
  generatePix(input: GeneratePixPaymentInput): Promise<Payment>;
  authorizeCreditCard(input: AuthorizeCreditCardInput): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByAppointmentId(appointmentId: string): Promise<Payment | null>;
  capturePayment(paymentId: string): Promise<Payment>;
  confirmCardAuthorization(paymentId: string): Promise<Payment>;
}
