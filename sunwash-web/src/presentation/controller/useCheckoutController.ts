import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '../context/useDependencies';
import { ROUTES } from '../../shared/constants/routes';
import { STORAGE_KEYS } from '../../shared/constants/storage';
import type { PaymentMethod } from '../../domain/Payment';
import { loadStripe } from '../../infra/payment/stripe';
import type { StripeCardElement, StripeClient } from '../../infra/payment/stripe';

export interface CreditCardFormData {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
}

export const useCheckoutController = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getAppointmentByIdUseCase, generatePixPaymentUseCase, authorizeCreditCardUseCase, paymentGateway } = useDependencies();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [copiedPix, setCopiedPix] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const cardElementContainerRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<StripeClient | null>(null);
  const cardElementRef = useRef<StripeCardElement | null>(null);

  // Cartão Form State
  const [cardData, setCardData] = useState<CreditCardFormData>({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: '',
  });

  const appointmentId = localStorage.getItem(STORAGE_KEYS.CURRENT_APPOINTMENT_ID) || 'app-sun-001';

  useEffect(() => {
    if (paymentMethod !== 'CREDIT_CARD' || !cardElementContainerRef.current) return;
    let disposed = false;
    loadStripe()
      .then((stripe) => {
        if (disposed || !cardElementContainerRef.current) return;
        stripeRef.current = stripe;
        const element = stripe.elements().create('card', {
          style: { base: { fontSize: '16px', color: '#0f172a' } },
        });
        cardElementRef.current = element;
        element.mount(cardElementContainerRef.current);
      })
      .catch((error: Error) => setErrorMessage(error.message));
    return () => {
      disposed = true;
      cardElementRef.current?.unmount();
      cardElementRef.current = null;
    };
  }, [paymentMethod]);

  // Buscar Agendamento
  const { data: appointment, isLoading: isLoadingAppointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      return getAppointmentByIdUseCase.execute(appointmentId);
    },
  });

  // Query para Gerar PIX automaticamente quando appointment estiver pronto
  const { data: pixPayment, isLoading: isLoadingPix } = useQuery({
    queryKey: ['pix-payment', appointment?.id, appointment?.price],
    queryFn: async () => {
      if (!appointment) return null;
      return generatePixPaymentUseCase.execute({
        appointmentId: appointment.id,
        amount: appointment.price,
      });
    },
    enabled: !!appointment && paymentMethod === 'PIX',
  });

  // Autorizar Cartão Mutation
  const cardMutation = useMutation({
    mutationFn: async (data: CreditCardFormData) => {
      if (!appointment) throw new Error('Agendamento não encontrado');
      const checkout = await authorizeCreditCardUseCase.execute({
        appointmentId: appointment.id,
        amount: appointment.price,
        cardNumber: data.cardNumber,
        cardHolder: data.cardHolder,
        expirationDate: data.expirationDate,
        cvv: data.cvv,
      });
      if (!checkout.clientSecret || !stripeRef.current || !cardElementRef.current) {
        throw new Error('O formulario seguro da Stripe ainda nao esta pronto.');
      }
      const confirmation = await stripeRef.current.confirmCardPayment(checkout.clientSecret, {
        payment_method: {
          card: cardElementRef.current,
          billing_details: { name: data.cardHolder },
        },
      });
      if (confirmation.error) {
        throw new Error(confirmation.error.message || 'A Stripe recusou a autorizacao.');
      }
      if (confirmation.paymentIntent?.status !== 'requires_capture') {
        throw new Error('A caucao nao foi autorizada para captura posterior.');
      }
      return paymentGateway.confirmCardAuthorization(checkout.id);
    },
    onSuccess: () => {
      setSuccessMessage('Caução autorizada com sucesso! Seu agendamento foi confirmado.');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setTimeout(() => {
        navigate(ROUTES.PANEL);
      }, 1500);
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || 'Erro ao processar cartão.');
    },
  });

  const handleCopyPix = () => {
    const code = pixPayment?.qrCodeText || '';
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const pixConfirmMutation = useMutation({
    mutationFn: async () => {
      if (!appointment) throw new Error('Agendamento nao encontrado');
      return paymentGateway.findByAppointmentId(appointment.id);
    },
    onSuccess: (payment) => {
      if (payment?.status !== 'PAID') {
        setErrorMessage('O PIX ainda esta pendente. Aguarde alguns segundos e tente novamente.');
        return;
      }
      setSuccessMessage('Pagamento PIX confirmado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setTimeout(() => navigate(ROUTES.PANEL), 1000);
    },
    onError: (error: Error) => setErrorMessage(error.message),
  });

  const handleConfirmPixPayment = () => pixConfirmMutation.mutate();

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    cardMutation.mutate(cardData);
  };

  return {
    appointment,
    isLoadingAppointment,
    paymentMethod,
    setPaymentMethod,
    pixPayment,
    isLoadingPix,
    copiedPix,
    handleCopyPix,
    handleConfirmPixPayment,
    cardData,
    cardElementContainerRef,
    setCardData,
    handleCardSubmit,
    isProcessingCard: cardMutation.isPending,
    errorMessage,
    successMessage,
    clearError: () => setErrorMessage(null),
  };
};
