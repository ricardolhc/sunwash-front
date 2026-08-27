import type { BaseSyntheticEvent } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UseFormReturn } from 'react-hook-form';
import { ROUTES } from '../../../shared/constants/routes';
import type { RegisterFormValues } from '../../controller/useRegisterController';

interface RegisterViewProps {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  passwordVisible: boolean;
  togglePasswordVisible: () => void;
  rootError: string | null;
  fieldErrors: Partial<Record<keyof RegisterFormValues, string>>;
}

export const RegisterView = ({
  form,
  onSubmit,
  isSubmitting,
  passwordVisible,
  togglePasswordVisible,
  rootError,
  fieldErrors,
}: RegisterViewProps) => {
  const { register } = form;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.18),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <section className="w-full rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
          <div className="mb-8 space-y-3 text-center">
            <span className="inline-flex rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
              Nova conta
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Criar conta</h1>
            <p className="text-sm leading-6 text-slate-500">
              Cadastre-se para agendar serviços e acompanhar o progresso pelo painel.
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <label htmlFor="register-name" className="text-sm font-semibold text-slate-700">
                Nome completo
              </label>
              <input
                id="register-name"
                aria-label="Nome completo"
                type="text"
                autoComplete="name"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-100'
                }`}
                {...register('name')}
              />
              {fieldErrors.name && <p className="text-sm text-rose-600">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-semibold text-slate-700">
                E-mail
              </label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="text-sm font-semibold text-slate-700">
                Senha
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  aria-label="Senha"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
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

            <div className="space-y-2">
              <label htmlFor="register-confirm-password" className="text-sm font-semibold text-slate-700">
                Confirmar senha
              </label>
              <input
                id="register-confirm-password"
                aria-label="Confirmar senha"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                  fieldErrors.confirmPassword ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-100'
                }`}
                {...register('confirmPassword')}
              />
              {fieldErrors.confirmPassword && <p className="text-sm text-rose-600">{fieldErrors.confirmPassword}</p>}
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
              {isSubmitting ? 'Criando...' : 'Criar conta'}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>

            <p className="text-center text-sm text-slate-500">
              Já tem conta?{' '}
              <Link to={ROUTES.LOGIN} className="font-semibold text-cyan-700 hover:text-cyan-800">
                Entrar
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};
