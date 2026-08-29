import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Sparkles, Calendar, LayoutDashboard, Shield, FileSpreadsheet, LogOut, Menu, X } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../../presentation/context/useAuth';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { status, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isAuthenticated = status === 'authenticated' && !!user;
  const isAnonymous = !isAuthenticated;
  const showClientPanel = user?.role === 'USER';
  const showAdminPanel = user?.role === 'ADMIN';
  const showScheduleLink = user?.role !== 'ADMIN';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />
              <Sparkles className="w-3.5 h-3.5 text-white -ml-1 -mt-2" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                Tw Energia Solar
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
                Manutenção Solar & Drone
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to={ROUTES.HOME}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(ROUTES.HOME)
                  ? 'text-cyan-700 bg-cyan-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Início
            </Link>
            {showScheduleLink && (
              <Link
                to={ROUTES.SCHEDULE}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isActive(ROUTES.SCHEDULE)
                    ? 'text-cyan-700 bg-cyan-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4 text-cyan-600" />
                Agendar Manutenção
              </Link>
            )}
            {showClientPanel && (
              <Link
                to={ROUTES.PANEL}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  isActive(ROUTES.PANEL)
                    ? 'text-cyan-700 bg-cyan-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                Painel do Cliente
              </Link>
            )}
            {showAdminPanel && (
              <>
                <Link
                  to={ROUTES.ADMIN}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive(ROUTES.ADMIN)
                      ? 'text-cyan-700 bg-cyan-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-500" />
                  Admin
                </Link>
                <Link
                  to={ROUTES.REPORTS}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive(ROUTES.REPORTS)
                      ? 'text-cyan-700 bg-cyan-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
                  Relatórios
                </Link>
              </>
            )}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            {isAnonymous ? (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cadastrar
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg shadow-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to={ROUTES.HOME}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
          >
            Início
          </Link>
          {showScheduleLink && (
            <Link
              to={ROUTES.SCHEDULE}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Agendar Manutenção
            </Link>
          )}
          {showClientPanel && (
            <Link
              to={ROUTES.PANEL}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Painel do Cliente
            </Link>
          )}
          {showAdminPanel && (
            <>
              <Link
                to={ROUTES.ADMIN}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Admin
              </Link>
              <Link
                to={ROUTES.REPORTS}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Relatórios
              </Link>
            </>
          )}
          <div className="pt-2 space-y-2">
            {isAnonymous ? (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm"
                >
                  Entrar
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm"
                >
                  Cadastrar
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  void logout();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
