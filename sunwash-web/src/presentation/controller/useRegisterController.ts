import { useState } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import { getPostAuthRoute } from '../routes/authNavigation';

const registerSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo'),
  email: z.string().trim().min(1, 'Informe um e-mail válido').email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

const getFromLocation = (state: unknown): Location | string | null => {
  if (!state || typeof state !== 'object') return null;
  if (!('from' in state)) return null;
  return (state as { from?: Location | string | null }).from ?? null;
};

export const useRegisterController = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});
  const [rootError, setRootError] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async ({ confirmPassword: _confirmPassword, ...values }) => {
    setRootError(null);
    setFieldErrors({});

    const parsed = registerSchema.safeParse({
      ...values,
      confirmPassword: _confirmPassword,
    });

    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof RegisterFormValues, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (
          field === 'name'
          || field === 'email'
          || field === 'password'
          || field === 'confirmPassword'
        ) {
          nextErrors[field] = issue.message;
        }
      });
      setFieldErrors(nextErrors);
      return;
    }

    if (!_confirmPassword || values.password !== _confirmPassword) {
      setFieldErrors({ confirmPassword: 'As senhas não coincidem' });
      return;
    }

    try {
      const result = await auth.register(values);
      navigate(getPostAuthRoute(result.user, getFromLocation(location.state)), { replace: true });
    } catch (error) {
      setRootError(error instanceof Error ? error.message : 'Não foi possível criar a conta agora.');
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    passwordVisible,
    togglePasswordVisible: () => setPasswordVisible((value) => !value),
    rootError,
    fieldErrors,
  };
};
