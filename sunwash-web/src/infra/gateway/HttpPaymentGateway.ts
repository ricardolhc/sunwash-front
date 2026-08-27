import type { Payment } from '../../domain/Payment';
import type {
  AuthorizeCreditCardInput,
  GeneratePixPaymentInput,
  PaymentGateway,
} from '../../application/gateway/PaymentGateway';
import { api, isNotFound, numericId } from '../http/api';

interface PixCheckoutResponse {
  paymentId: number;
  appointmentId: number;
  status: string;
  qrCode: string | null;
  qrCodeBase64: string | null;
  amount: number;
}

interface CardCheckoutResponse {
  paymentId: number;
  appointmentId: number;
  status: string;
  amount: number;
  clientSecret: string;
}

export class HttpPaymentGateway implements PaymentGateway {
  async generatePix(input: GeneratePixPaymentInput): Promise<Payment> {
    const response = await api.post<PixCheckoutResponse>('/payments/checkout/pix', {
      appointmentId: numericId(input.appointmentId),
      amount: input.amount,
      description: `Limpeza SunWash - ${input.appointmentId}`,
    });
    const data = response.data;
    return {
      id: `pay-sun-${String(data.paymentId).padStart(3, '0')}`,
      appointmentId: input.appointmentId,
      amount: data.amount,
      method: 'PIX',
      status: data.status.toLowerCase() === 'approved' ? 'PAID' : 'PENDING',
      qrCode: data.qrCodeBase64
        ? `data:image/png;base64,${data.qrCodeBase64}`
        : data.qrCode || undefined,
      qrCodeText: data.qrCode || undefined,
    };
  }

  async authorizeCreditCard(input: AuthorizeCreditCardInput): Promise<Payment> {
    const response = await api.post<CardCheckoutResponse>('/payments/checkout/card', {
      appointmentId: numericId(input.appointmentId),
      amount: input.amount,
      description: `Caucao SunWash - ${input.appointmentId}`,
    });
    return {
      id: `pay-sun-${String(response.data.paymentId).padStart(3, '0')}`,
      appointmentId: input.appointmentId,
      amount: response.data.amount,
      method: 'CREDIT_CARD',
      status: 'PENDING',
      cardLast4: input.cardNumber.replace(/\D/g, '').slice(-4),
      cardHolderName: input.cardHolder,
      clientSecret: response.data.clientSecret,
    };
  }

  async findById(id: string): Promise<Payment | null> {
    try {
      const response = await api.get<Payment>(`/payments/${numericId(id)}`);
      return response.data;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async findByAppointmentId(appointmentId: string): Promise<Payment | null> {
    try {
      const response = await api.get<Payment>(`/payments/appointment/${numericId(appointmentId)}`);
      return response.data;
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async capturePayment(paymentId: string): Promise<Payment> {
    const response = await api.post<{ paymentId: number; appointmentId: number; amount: number }>(
      `/admin/payments/capture/${numericId(paymentId)}`,
      undefined,
      { headers: { 'X-Admin-Token': import.meta.env.VITE_ADMIN_API_TOKEN || '' } },
    );
    return {
      id: paymentId,
      appointmentId: `app-sun-${String(response.data.appointmentId).padStart(3, '0')}`,
      amount: response.data.amount,
      method: 'CREDIT_CARD',
      status: 'PAID',
      paidAt: new Date().toISOString(),
    };
  }

  async confirmCardAuthorization(paymentId: string): Promise<Payment> {
    const response = await api.post<Payment>(`/payments/${numericId(paymentId)}/authorize`);
    return response.data;
  }
}
