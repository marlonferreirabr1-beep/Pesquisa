import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, MessageCircleHeart } from 'lucide-react';
import type { SurveySuggestions } from '../../types/survey';

interface SuggestionsSectionProps {
  suggestions: SurveySuggestions;
  onChange: (updates: Partial<SurveySuggestions>) => void;
}

export const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({
  suggestions,
  onChange,
}) => {
  return (
    <section className="w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 survey-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-[#D9BA79]/30 shadow-xl shadow-stone-900/5 space-y-6"
      >
        {/* Section Header */}
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-[#B8964C] border border-[#D9BA79]/30">
              <MessageCircleHeart className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8964C]">
              Etapa 7 • Espaço Aberto
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#283D35] mt-2">
            Sugestões, Elogios &amp; Melhorias
          </h2>
          <p className="text-xs sm:text-sm text-[#283D35]/70 mt-1">
            Sua voz detalhada é o que mais nos orienta. Todos os campos abaixo são opcionais.
          </p>
        </div>

        {/* Textareas */}
        <div className="space-y-4">
          {/* 1. O que mais gosta */}
          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                O que você mais gosta em nosso colégio?
              </span>
              <span className="text-[11px] font-normal text-stone-400">Opcional</span>
            </label>
            <textarea
              rows={3}
              value={suggestions.whatYouLikeMost}
              onChange={(e) => onChange({ whatYouLikeMost: e.target.value })}
              placeholder="Ex: Projetos pedagógicos, carinho dos educadores, acolhimento, infraestrutura..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-[#283D35] placeholder:text-stone-400 focus:outline-none focus:border-[#D9BA79] focus:bg-white focus:ring-2 focus:ring-[#D9BA79]/20 transition-all resize-none"
            />
          </div>

          {/* 2. O que podemos melhorar */}
          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8964C]" />
                O que acredita que podemos melhorar?
              </span>
              <span className="text-[11px] font-normal text-stone-400">Opcional</span>
            </label>
            <textarea
              rows={3}
              value={suggestions.whatCanImprove}
              onChange={(e) => onChange({ whatCanImprove: e.target.value })}
              placeholder="Ex: Pontos que poderiam ser mais ágeis, rotina de saída, novas atividades extras..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-[#283D35] placeholder:text-stone-400 focus:outline-none focus:border-[#D9BA79] focus:bg-white focus:ring-2 focus:ring-[#D9BA79]/20 transition-all resize-none"
            />
          </div>

          {/* 3. Sugestão, elogio ou comentário adicional */}
          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageCircleHeart className="w-3.5 h-3.5 text-[#283D35]" />
                Gostaria de deixar alguma sugestão, elogio ou comentário?
              </span>
              <span className="text-[11px] font-normal text-stone-400">Opcional</span>
            </label>
            <textarea
              rows={3}
              value={suggestions.generalComments}
              onChange={(e) => onChange({ generalComments: e.target.value })}
              placeholder="Mensagem livre para a direção pedagógica e administrativa..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-[#283D35] placeholder:text-stone-400 focus:outline-none focus:border-[#D9BA79] focus:bg-white focus:ring-2 focus:ring-[#D9BA79]/20 transition-all resize-none"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
