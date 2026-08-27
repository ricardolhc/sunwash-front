import type { BaseSyntheticEvent } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import { ROUTES } from '../../../shared/constants/routes';
import type { LoginFormValues } from '../../controller/useLoginController';

interface LoginViewProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  passwordVisible: boolean;
  togglePasswordVisible: () => void;
  rootError: string | null;
  fieldErrors: Partial<Record<keyof LoginFormValues, string>>;
}

export const LoginView = ({
  form,
  onSubmit,
  isSubmitting,
  passwordVisible,
  togglePasswordVisible,
  rootError,
  fieldErrors,
}: LoginViewProps) => {
  const { register } = form;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.18),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <section className="w-full rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
          <div className="mb-8 space-y-3 text-center">
            <span className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Acesso à conta
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Entrar</h1>
            <p className="text-sm leading-6 text-slate-500">
              Acesse seu painel, acompanhe os agendamentos e continue de onde parou.
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-semibold text-slate-700">
                E-mail
              </label>
              <input
                id="login-email"
                aria-label="E-mail"
                type="email"
                autoComplete="email"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-100'
                }`}
                {...register('email')}
              />
              {fieldErrors.email && <p className="text-sm text-rose-600">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-semibold text-slate-700">
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  aria-label="Senha"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm outline-none transition focus:ring-2 ${
                    fieldErrors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-100'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisible}
                  className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-slate-500 transition hover:text-slate-900"
                  aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-sm text-rose-600">{fieldErrors.password}</p>}
            </div>

            {rootError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {rootError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Entrando...' : 'Entrar'}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>

            <p className="text-center text-sm text-slate-500">
              Ainda não tem conta?{' '}
              <Link to={ROUTES.REGISTER} className="font-semibold text-cyan-700 hover:text-cyan-800">
                Criar conta
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};
