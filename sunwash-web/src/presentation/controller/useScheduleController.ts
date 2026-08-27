import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDependencies } from '../context/useDependencies';
import { ROUTES } from '../../shared/constants/routes';
import { STORAGE_KEYS } from '../../shared/constants/storage';
import { calculateServicePrice } from '../../shared/constants/pricing';
import type { CreateAppointmentInput } from '../../application/gateway/AppointmentGateway';
import { uploadFile } from '../../infra/storage/uploadFile';

export const scheduleFormSchema = z.object({
  clientName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  clientEmail: z.string().email('E-mail inválido'),
  clientPhone: z.string().min(10, 'Telefone inválido'),
  dateTime: z.string().min(1, 'Selecione a data e o horário'),
  panelsCount: z.coerce.number().min(1, 'Mínimo de 1 painel solar').max(500, 'Máximo de 500 painéis'),
  address: z.object({
    zipCode: z.string().min(8, 'CEP inválido'),
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado (UF) é obrigatório').max(2, 'Use a sigla do estado'),
    complement: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

export const useScheduleController = () => {
  const navigate = useNavigate();
  const { createAppointmentUseCase } = useDependencies();
  const [roofPhotoPreview, setRoofPhotoPreview] = useState<string | null>(null);
  const [roofPhotoUrl, setRoofPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema) as any,
    defaultValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      dateTime: '',
      panelsCount: 16,
      address: {
        zipCode: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: 'SP',
        complement: '',
      },
      notes: '',
    },
    mode: 'onBlur',
  });

  const watchedPanelsCount = form.watch('panelsCount');
  const estimatedPrice = calculateServicePrice(Number(watchedPanelsCount) || 16);

  const mutation = useMutation({
    mutationFn: async (data: ScheduleFormData) => {
      const input: CreateAppointmentInput = {
        ...data,
        roofPhotoUrl: roofPhotoUrl || undefined,
      };
      return createAppointmentUseCase.execute(input);
    },
    onSuccess: (appointment) => {
      localStorage.setItem(STORAGE_KEYS.CURRENT_APPOINTMENT_ID, appointment.id);
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify({ id: appointment.userId }));
      setErrorMessage(null);
      navigate(ROUTES.CHECKOUT);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || 'Ocorreu um erro ao criar o agendamento.');
    },
  });

  const handlePhotoSelected = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setRoofPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setIsUploadingPhoto(true);
    setErrorMessage(null);
    try {
      setRoofPhotoUrl(await uploadFile(file));
    } catch (error) {
      setRoofPhotoPreview(null);
      setRoofPhotoUrl(null);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao enviar a foto.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setRoofPhotoPreview(null);
    setRoofPhotoUrl(null);
  };

  const onSubmit = form.handleSubmit((data) => {
    setErrorMessage(null);
    mutation.mutate(data);
  });

  return {
    form,
    estimatedPrice,
    roofPhotoPreview,
    handlePhotoSelected,
    handleRemovePhoto,
    onSubmit,
    isPending: mutation.isPending || isUploadingPhoto,
    errorMessage,
    clearError: () => setErrorMessage(null),
  };
};
