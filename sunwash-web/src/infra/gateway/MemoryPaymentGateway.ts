import type { Payment } from '../../domain/Payment';
import type {
  AuthorizeCreditCardInput,
  GeneratePixPaymentInput,
  PaymentGateway,
} from '../../application/gateway/PaymentGateway';
import { mockPaymentList } from '../../fixture/paymentFixture';

export class MemoryPaymentGateway implements PaymentGateway {
  private payments: Payment[] = [...mockPaymentList];

  async generatePix(input: GeneratePixPaymentInput): Promise<Payment> {
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136sunwash-pix-${input.appointmentId}5204000053039865404${input.amount.toFixed(2)}5802BR5907SunWash6009Campinas62070503***6304`;
    const newPayment: Payment = {
      id: `pay-pix-${Date.now().toString().slice(-6)}`,
      appointmentId: input.appointmentId,
      amount: input.amount,
      method: 'PIX',
      status: 'PENDING',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`,
      qrCodeText: pixCode,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }

  async authorizeCreditCard(input: AuthorizeCreditCardInput): Promise<Payment> {
    const rawNumber = input.cardNumber.replace(/\D/g, '');
    const last4 = rawNumber.slice(-4) || '1234';

    const newPayment: Payment = {
      id: `pay-card-${Date.now().toString().slice(-6)}`,
      appointmentId: input.appointmentId,
      amount: input.amount,
      method: 'CREDIT_CARD',
      status: 'AUTHORIZED',
      cardLast4: last4,
      cardHolderName: input.cardHolder,
      authorizedAt: new Date().toISOString(),
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }

  async findById(id: string): Promise<Payment | null> {
    const found = this.payments.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  async findByAppointmentId(appointmentId: string): Promise<Payment | null> {
    const found = this.payments.find((p) => p.appointmentId === appointmentId);
    return found ? { ...found } : null;
  }

  async capturePayment(paymentId: string): Promise<Payment> {
    const index = this.payments.findIndex((p) => p.id === paymentId);
    if (index === -1) {
      throw new Error(`Pagamento ${paymentId} não encontrado`);
    }
    const updated: Payment = {
      ...this.payments[index],
      status: 'PAID',
      paidAt: new Date().toISOString(),
    };
    this.payments[index] = updated;
    return { ...updated };
  }

  async confirmCardAuthorization(paymentId: string): Promise<Payment> {
    const payment = await this.findById(paymentId);
    if (!payment) throw new Error(`Pagamento ${paymentId} nao encontrado`);
    return { ...payment, status: 'AUTHORIZED', authorizedAt: new Date().toISOString() };
  }
}
