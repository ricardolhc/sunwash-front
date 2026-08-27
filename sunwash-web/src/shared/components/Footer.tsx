import React from 'react';
import { Sun, Sparkles, ShieldCheck, Zap, Camera, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
                <Sun className="w-4 h-4 text-amber-300" />
                <Sparkles className="w-2.5 h-2.5 text-white -ml-0.5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Sun<span className="text-cyan-400">Wash</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Especialistas em higienização técnica e aumento de eficiência para usinas e sistemas solares residenciais e comerciais com vistoria aérea por drone.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Garantia de Geração
              </span>
              <span className="inline-flex items-center gap-1 text-amber-400">
                <Camera className="w-4 h-4" /> Laudo com Drone
              </span>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to={ROUTES.HOME} className="hover:text-cyan-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SCHEDULE} className="hover:text-cyan-400 transition-colors">
                  Agendar Limpeza
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PANEL} className="hover:text-cyan-400 transition-colors">
                  Acompanhar Meu Pedido
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ADMIN} className="hover:text-cyan-400 transition-colors">
                  Painel de Operações (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Benefícios */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Por que limpar?
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Até +30% de eficiência energética</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Água desmineralizada e segura</span>
              </li>
              <li className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fotos em alta resolução de drone</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Atendimento
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>(11) 98765-4321</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>contato@sunwash.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>São Paulo e Interior - SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SunWash - Todos os direitos reservados. Limpeza profissional de placas solares.</p>
        </div>
      </div>
    </footer>
  );
};
