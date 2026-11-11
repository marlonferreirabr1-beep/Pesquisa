import React from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';

interface WelcomeSectionProps {
  onScrollDown?: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onScrollDown }) => {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center survey-section">
      {/* Decorative subtle background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] bg-gradient-to-tr from-[#D9BA79]/15 via-[#FAF7EF] to-emerald-900/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-2xl mx-auto flex flex-col items-center"
      >
        {/* School Logo */}
        <div className="mb-6 sm:mb-8 p-3 rounded-3xl bg-white/80 shadow-md shadow-stone-900/5 border border-[#D9BA79]/30 transition-transform duration-300 hover:scale-105">
          <img
            src="https://i.postimg.cc/4dB1VpFp/file-00000000fde4820e9eedd8fce39418f5.png"
            alt="Logotipo Oficial do Colégio"
            className="w-28 sm:w-36 md:w-44 h-auto object-contain"
          />
        </div>

        {/* Institution tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D9BA79]/40 text-xs font-semibold text-[#283D35] mb-5 tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#B8964C]" />
          <span>PESQUISA INSTITUCIONAL DE SATISFAÇÃO</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-semibold text-[#283D35] tracking-tight leading-tight sm:leading-tight mb-5">
          Sua opinião transforma <br />
          <span className="italic text-[#B8964C]">o nosso colégio!</span>
        </h1>

        {/* Official text */}
        <p className="text-base sm:text-lg text-[#283D35]/85 leading-relaxed font-normal mb-8 max-w-xl">
          "Queridas famílias, acreditamos que a parceria entre escola e família é essencial para oferecer uma educação de excelência. Queremos ouvir você! Sua opinião nos ajuda a evoluir e construir um ambiente escolar cada vez melhor."
        </p>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#283D35]/75 mb-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-stone-200">
            <Clock className="w-4 h-4 text-[#B8964C]" />
            <span>Tempo estimado: <strong>3 a 5 minutos</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 border border-stone-200">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Respostas confidenciais &amp; seguras</span>
          </div>
        </div>

        {/* Natural Scroll prompt (no forced button) */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          onClick={onScrollDown}
          className="flex flex-col items-center gap-1.5 text-xs text-[#283D35]/70 font-medium cursor-pointer p-2 rounded-xl hover:bg-stone-100/50 transition-colors"
        >
          <span className="tracking-wide">Role para baixo para responder quando quiser</span>
          <div className="w-7 h-7 rounded-full bg-white/80 border border-[#D9BA79]/40 flex items-center justify-center shadow-xs">
            <ChevronDown className="w-4 h-4 text-[#B8964C]" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
