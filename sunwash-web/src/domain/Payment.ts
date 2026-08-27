export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'EXPIRED';

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  qrCode?: string;
  qrCodeText?: string;
  expiresAt?: string;
  cardLast4?: string;
  cardHolderName?: string;
  authorizedAt?: string;
  paidAt?: string;
  clientSecret?: string;
}
