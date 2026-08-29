import { useState } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import { getPostAuthRoute } from '../routes/authNavigation';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe um e-mail válido').email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const INVALID_CREDENTIALS_MESSAGE = 'Email ou senha inválidos';
const GENERIC_LOGIN_ERROR_MESSAGE = 'Não foi possível entrar agora.';

export type LoginFormValues = z.infer<typeof loginSchema>;

const getFromLocation = (state: unknown): Location | string | null => {
  if (!state || typeof state !== 'object') return null;
  if (!('from' in state)) return null;
  return (state as { from?: Location | string | null }).from ?? null;
};

const isUnauthorizedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object' || !('response' in error)) return false;
  return (error as { response?: { status?: number } }).response?.status === 401;
};

const getLoginErrorMessage = (error: unknown): string => (
  isUnauthorizedError(error) ? INVALID_CREDENTIALS_MESSAGE : GENERIC_LOGIN_ERROR_MESSAGE
);

export const useLoginController = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [rootError, setRootError] = useState<string | null>(null);
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setRootError(null);
    setFieldErrors({});

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof LoginFormValues, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === 'email' || field === 'password') {
          nextErrors[field] = issue.message;
        }
      });
      setFieldErrors(nextErrors);
      return;
    }

    try {
      const result = await auth.login(parsed.data);
      navigate(getPostAuthRoute(result.user, getFromLocation(location.state)), { replace: true });
    } catch (error) {
      setRootError(getLoginErrorMessage(error));
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
