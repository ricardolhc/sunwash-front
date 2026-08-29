import React, { useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  UploadCloud,
  X,
  Sparkles,
  ArrowRight,
  Layers,
  Loader2,
} from 'lucide-react';
import { Navbar } from '../../../shared/components/Navbar';
import { Footer } from '../../../shared/components/Footer';
import { ToastNotification } from '../../../shared/components/ToastNotification';
import { formatCurrency } from '../../../shared/utils/formatters';
import type { ScheduleFormData } from '../../controller/useScheduleController';

interface ScheduleViewProps {
  form: UseFormReturn<ScheduleFormData>;
  estimatedPrice: number;
  roofPhotoPreview: string | null;
  handlePhotoSelected: (file: File) => void;
  handleRemovePhoto: () => void;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  errorMessage: string | null;
  clearError: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  form,
  estimatedPrice,
  roofPhotoPreview,
  handlePhotoSelected,
  handleRemovePhoto,
  onSubmit,
  isPending,
  errorMessage,
  clearError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, formState: { errors } } = form;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoSelected(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1 py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Página */}
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
              Passo 1 de 2 • Solicitação de Agendamento
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Agende a Manutenção Preventiva das suas Placas Solares
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Preencha os dados abaixo para calcularmos o orçamento e reservarmos a equipe técnica com drone.
            </p>
          </div>

          {/* Feedback de Erro de Regra de Negócio (ex: domingo, fora de horário comercial) */}
          {errorMessage && (
            <div className="mb-6">
              <ToastNotification
                type="error"
                message={errorMessage}
                onClose={clearError}
              />
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            {/* CARD 1: DADOS DO CLIENTE */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Seus Dados de Contato</h2>
                  <p className="text-xs text-slate-500">Para envio do laudo e confirmação</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      {...register('clientName')}
                      type="text"
                      placeholder="Ex: João da Silva"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                        errors.clientName ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.clientName && (
                    <p className="text-rose-600 text-xs mt-1">{errors.clientName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      {...register('clientEmail')}
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                        errors.clientEmail ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.clientEmail && (
                    <p className="text-rose-600 text-xs mt-1">{errors.clientEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp / Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      {...register('clientPhone')}
                      type="tel"
                      placeholder="(11) 98765-4321"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                        errors.clientPhone ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.clientPhone && (
                    <p className="text-rose-600 text-xs mt-1">{errors.clientPhone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 2: LOCALIZAÇÃO & INSTALAÇÃO SOLAR */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Endereço da Instalação</h2>
                  <p className="text-xs text-slate-500">Onde o serviço será executado</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CEP *
                  </label>
                  <input
                    {...register('address.zipCode')}
                    type="text"
                    placeholder="13080-000"
                    className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      errors.address?.zipCode ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.address?.zipCode && (
                    <p className="text-rose-600 text-xs mt-1">{errors.address.zipCode.message}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rua / Avenida *
                  </label>
                  <input
                    {...register('address.street')}
                    type="text"
                    placeholder="Ex: Alameda dos Ipês"
                    className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      errors.address?.street ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.address?.street && (
                    <p className="text-rose-600 text-xs mt-1">{errors.address.street.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Número *
                  </label>
                  <input
                    {...register('address.number')}
                    type="text"
                    placeholder="Ex: 450"
                    className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      errors.address?.number ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.address?.number && (
                    <p className="text-rose-600 text-xs mt-1">{errors.address.number.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bairro *
                  </label>
                  <input
                    {...register('address.neighborhood')}
                    type="text"
                    placeholder="Jardim Solar"
                    className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      errors.address?.neighborhood ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cidade *
                  </label>
                  <input
                    {...register('address.city')}
                    type="text"
                    placeholder="Campinas"
                    className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      errors.address?.city ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: ESPECIFICAÇÕES DO SISTEMA & DATA/HORA */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Agendamento & Telhado</h2>
                  <p className="text-xs text-slate-500">Escolha a data e anexe fotos se desejar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Data e Horário Preferencial *
                  </label>
                  <div className="relative">
                    <input
                      {...register('dateTime')}
                      type="datetime-local"
                      className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                        errors.dateTime ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Atendimentos de Segunda a Sábado das 08h às 17h30.
                  </p>
                  {errors.dateTime && (
                    <p className="text-rose-600 text-xs mt-1">{errors.dateTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Quantidade Estimada de Placas Solares *
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      {...register('panelsCount')}
                      type="number"
                      min={1}
                      max={500}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                        errors.panelsCount ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.panelsCount && (
                    <p className="text-rose-600 text-xs mt-1">{errors.panelsCount.message}</p>
                  )}
                </div>
              </div>

              {/* UPLOAD DRAG AND DROP DA FOTO DO TELHADO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Foto do Telhado (Opcional - Ajuda no Planejamento do Drone)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {roofPhotoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video max-h-56 bg-slate-100 group">
                    <img
                      src={roofPhotoPreview}
                      alt="Telhado enviado"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-3 right-3 p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-md transition-colors"
                      title="Remover foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-md text-xs text-white">
                      Foto anexada com sucesso
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50/60 hover:bg-cyan-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-100/80 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      Clique para anexar ou arraste a foto do seu telhado aqui
                    </span>
                    <span className="text-xs text-slate-400">
                      PNG, JPG ou JPEG (máx. 10MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* RESUMO DE VALOR E SUBMIT */}
            <div className="bg-gradient-to-r from-slate-900 to-cyan-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Orçamento Estimado
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  {formatCurrency(estimatedPrice)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Inclui manutenção preventiva, higienização técnica e inspeção aérea de drone.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Ir para Pagamento / Caução
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
