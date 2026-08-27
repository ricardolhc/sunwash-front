import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  Calendar,
  ArrowRight,
  Star,
} from 'lucide-react';
import { ROUTES } from '../../../shared/constants/routes';
import { Navbar } from '../../../shared/components/Navbar';
import { Footer } from '../../../shared/components/Footer';
import { ImageComparison } from '../../../shared/components/ImageComparison';

export const LandingPageView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Coluna Texto */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-semibold shadow-xs">
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Aumente até +30% a produção de energia solar</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                  Maximize a geração de energia do seu{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-800">
                    sistema solar
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Poeira e poluição bloqueiam a luz solar e reduzem sua economia. Nós cuidamos da higienização técnica com água pura e entregamos um laudo com <strong>fotos em alta resolução feitas por Drone</strong>.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    to={ROUTES.SCHEDULE}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Calendar className="w-5 h-5" />
                    Agendar Limpeza Agora
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#como-funciona"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
                  >
                    Como Funciona
                  </a>
                </div>

                {/* Benefícios Rápidos */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="font-extrabold text-2xl text-slate-900">+30%</span>
                    <span className="text-xs text-slate-500">Mais Eficiência</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="font-extrabold text-2xl text-cyan-600">100%</span>
                    <span className="text-xs text-slate-500">Água Pura & Segura</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="font-extrabold text-2xl text-amber-500">4K Drone</span>
                    <span className="text-xs text-slate-500">Inspeção Aérea</span>
                  </div>
                </div>
              </div>

              {/* Coluna Imagem Interativa Antes / Depois */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 to-amber-500/20 rounded-3xl blur-xl" />
                  <div className="relative bg-white p-3 rounded-3xl border border-slate-200/90 shadow-xl">
                    <ImageComparison
                      beforeImage="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80"
                      afterImage="https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1000&q=80"
                      beforeLabel="Antes (Sujo)"
                      afterLabel="Depois (SunWash)"
                    />
                    <div className="p-3 text-center">
                      <p className="text-xs font-medium text-slate-500">
                        Arraste a barra para comparar o Antes e Depois da higienização com Drone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SESSÃO: COMO FUNCIONA (3 PASSOS) */}
        <section id="como-funciona" className="py-16 lg:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                Processo Simples & Transparente
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                Como Funciona a SunWash
              </h2>
              <p className="text-base sm:text-lg text-slate-500 mt-3">
                Cuidamos de tudo para você ter tranquilidade e o máximo retorno do seu investimento solar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Passo 1 */}
              <div className="relative bg-slate-50/70 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-cyan-600/20 mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Agende Online</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Informe a quantidade de placas, selecione a melhor data e envie uma foto do seu telhado em menos de 2 minutos.
                </p>
              </div>

              {/* Passo 2 */}
              <div className="relative bg-slate-50/70 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20 mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Limpeza Especializada</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Nossos técnicos certificados utilizam escovas rotativas anti-risco e água desmineralizada pura sem produtos corrosivos.
                </p>
              </div>

              {/* Passo 3 */}
              <div className="relative bg-slate-50/70 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/20 mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Veja o Antes e Depois</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Receba no seu painel as fotos aéreas de drone comprovando a limpeza impecável e a recuperação da geração de energia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SESSÃO: PROVA SOCIAL & DEPOIMENTOS */}
        <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                Quem usa aprova
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Mais de 1.200 Sistemas Solares Limpos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">
                    "Minha geração aumentou 28% no primeiro mês após a limpeza. As fotos do drone que mandaram no painel foram impressionantes!"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-sm">
                    RC
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Ricardo Carvalho</h4>
                    <p className="text-xs text-slate-400">Residência - Campinas/SP</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">
                    "Excelente atendimento. Fizeram a autorização da caução no cartão e só cobraram depois que o serviço terminou e conferi as fotos."
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                    FS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Fernanda Souza</h4>
                    <p className="text-xs text-slate-400">Comércio - Valinhos/SP</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">
                    "Serviço profissional e com segurança total. Usam água pura e equipamentos apropriados. Recomendo para todos com placas solares."
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                    MS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Marcos Silveira</h4>
                    <p className="text-xs text-slate-400">Granja Viana - Cotia/SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BANNER CTA */}
        <section className="py-16 bg-gradient-to-r from-cyan-700 to-cyan-900 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Pronto para recuperar a eficiência máxima da sua energia solar?
            </h2>
            <p className="text-cyan-100 text-base sm:text-lg max-w-2xl mx-auto">
              Faça sua simulação em segundos e agende a data mais conveniente para a sua visita técnica.
            </p>
            <div className="pt-2">
              <Link
                to={ROUTES.SCHEDULE}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                Agendar Minha Limpeza
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
