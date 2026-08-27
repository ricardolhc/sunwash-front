import type { Payment } from '../domain/Payment';
import paymentDummy from '../infra/dummy/payment.json';

export const mockPaymentList: Payment[] = paymentDummy as Payment[];

export const mockPayment: Payment = mockPaymentList[0];
