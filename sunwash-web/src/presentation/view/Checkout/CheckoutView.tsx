import React from 'react';
import {
  QrCode,
  CreditCard,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Calendar,
  MapPin,
  Layers,
  Sparkles,
  Loader2,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Navbar } from '../../../shared/components/Navbar';
import { Footer } from '../../../shared/components/Footer';
import { ToastNotification } from '../../../shared/components/ToastNotification';
import {
  formatCurrency,
  formatDateTime,
} from '../../../shared/utils/formatters';
import type { Appointment } from '../../../domain/Appointment';
import type { Payment, PaymentMethod } from '../../../domain/Payment';
import type { CreditCardFormData } from '../../controller/useCheckoutController';

interface CheckoutViewProps {
  appointment?: Appointment | null;
  isLoadingAppointment: boolean;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  pixPayment?: Payment | null;
  isLoadingPix: boolean;
  copiedPix: boolean;
  handleCopyPix: () => void;
  handleConfirmPixPayment: () => void;
  cardData: CreditCardFormData;
  cardElementContainerRef: React.RefObject<HTMLDivElement | null>;
  setCardData: React.Dispatch<React.SetStateAction<CreditCardFormData>>;
  handleCardSubmit: (e: React.FormEvent) => void;
  isProcessingCard: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  clearError: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
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
  isProcessingCard,
  errorMessage,
  successMessage,
  clearError,
}) => {
  if (isLoadingAppointment) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Carregando detalhes do agendamento...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const amount = appointment?.price || 360.0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1 py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
              Passo 2 de 2 • Finalização & Garantia
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Confirmação e Pagamento
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              Escolha entre PIX instantâneo ou Caução no Cartão de Crédito.
            </p>
          </div>

          {/* Feedback Toasts */}
          {errorMessage && (
            <div className="mb-6 max-w-2xl mx-auto">
              <ToastNotification type="error" message={errorMessage} onClose={clearError} />
            </div>
          )}
          {successMessage && (
            <div className="mb-6 max-w-2xl mx-auto">
              <ToastNotification type="success" message={successMessage} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* COLUNA ESQUERDA: MÉTODOS DE PAGAMENTO (7 colunas) */}
            <div className="lg:col-span-7 space-y-6">
              {/* TABS SELECTOR */}
              <div className="bg-slate-200/70 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    paymentMethod === 'PIX'
                      ? 'bg-white text-cyan-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-cyan-600" />
                  PIX
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-white text-cyan-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-cyan-600" />
                  Cartão de Crédito (Caução)
                </button>
              </div>

              {/* ABA PIX */}
              {paymentMethod === 'PIX' && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Pagamento via PIX</h2>
                      <p className="text-xs text-slate-500">Aprovação imediata e sem taxas</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Disponível 24/7
                    </span>
                  </div>

                  {isLoadingPix ? (
                    <div className="py-12 text-center space-y-2">
                      <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
                      <p className="text-xs text-slate-500">Gerando QR Code PIX dinâmico...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* QR Code Container */}
                      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        {pixPayment?.qrCode ? (
                          <img
                            src={pixPayment.qrCode}
                            alt="QR Code PIX"
                            className="w-48 h-48 rounded-xl shadow-xs border border-white"
                          />
                        ) : (
                          <div className="w-48 h-48 bg-slate-200 rounded-xl flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-slate-400" />
                          </div>
                        )}
                        <span className="text-xs text-slate-500 mt-3">
                          Abra o app do seu banco e escaneie o código acima
                        </span>
                      </div>

                      {/* Copia e Cola */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Código PIX Copia e Cola
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={pixPayment?.qrCodeText || '00020126580014BR.GOV.BCB.PIX0136sunwash-demo-pix-code...'}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 focus:outline-none select-all"
                          />
                          <button
                            type="button"
                            onClick={handleCopyPix}
                            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors ${
                              copiedPix
                                ? 'bg-emerald-600 text-white'
                                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            }`}
                          >
                            {copiedPix ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copiar
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Botão de Confirmação */}
                      <button
                        type="button"
                        onClick={handleConfirmPixPayment}
                        className="w-full py-4 rounded-xl text-base font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        Ja paguei: verificar pagamento
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ABA CARTÃO DE CRÉDITO (CAUÇÃO) */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Garantia por Cartão de Crédito</h2>
                      <p className="text-xs text-slate-500">Autorização segura tipo Caução</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Ambiente Criptografado
                    </div>
                  </div>

                  {/* AVISO IMPORTANTE SOBRE A CAUÇÃO */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Garantia de Satisfação:</strong> Seu cartão apenas servirá como garantia (pré-autorização). A cobrança só será efetivada <strong>após o término do serviço</strong> e você aprovar as fotos do Drone no painel.
                    </div>
                  </div>

                  <form onSubmit={handleCardSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Número do Cartão *
                      </label>
                      <div
                        ref={cardElementContainerRef}
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nome Impresso no Cartão *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="NOME COMO NO CARTÃO"
                        value={cardData.cardHolder}
                        onChange={(e) =>
                          setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })
                        }
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingCard}
                      className="w-full py-4 rounded-xl text-base font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessingCard ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Autorizando Caução...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          Autorizar Caução de {formatCurrency(amount)}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* COLUNA DIREITA: RESUMO DO PEDIDO (5 colunas) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-slate-900">Resumo do Serviço</h2>
                </div>

                {appointment ? (
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block">Data e Horário:</span>
                        <span className="font-bold text-slate-800">{formatDateTime(appointment.dateTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block">Local:</span>
                        <span className="text-slate-700">
                          {appointment.address.street}, {appointment.address.number}
                          {appointment.address.neighborhood ? ` - ${appointment.address.neighborhood}` : ''}
                        </span>
                        <span className="text-xs text-slate-400 block">
                          {appointment.address.city}/{appointment.address.state} • CEP {appointment.address.zipCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Layers className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block">Estrutura:</span>
                        <span className="font-medium text-slate-700">
                          {appointment.panelsCount} Placas Solares
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Taxa de deslocamento e vistoria</span>
                        <span>R$ 120,00</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Higienização ({appointment.panelsCount} painéis)</span>
                        <span>{formatCurrency((appointment.panelsCount || 16) * 15)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                        <span>Laudo Aéreo por Drone</span>
                        <span>Grátis (Incluso)</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-extrabold text-cyan-700">
                        {formatCurrency(appointment.price)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Nenhum agendamento ativo encontrado.</p>
                )}
              </div>

              {/* Selo de Segurança */}
              <div className="bg-cyan-50/70 p-5 rounded-2xl border border-cyan-100 text-cyan-900 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-xs leading-relaxed">
                  <span className="font-bold block text-cyan-950">Garantia SunWash 100% Segura</span>
                  Você só paga ou tem o valor debitado após a conclusão técnica do serviço.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
