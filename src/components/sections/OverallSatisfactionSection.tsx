import React from 'react';
import { motion } from 'motion/react';
import { Award, ThumbsUp, Sparkles } from 'lucide-react';
import { StarRating } from '../StarRating';
import { NpsSelector } from '../NpsSelector';

interface OverallSatisfactionSectionProps {
  overallRating: number;
  npsScore: number | null;
  onRatingChange: (val: number) => void;
  onNpsChange: (score: number) => void;
}

export const OverallSatisfactionSection: React.FC<OverallSatisfactionSectionProps> = ({
  overallRating,
  npsScore,
  onRatingChange,
  onNpsChange,
}) => {
  return (
    <section className="w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 survey-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-[#D9BA79]/50 shadow-2xl shadow-stone-900/10 space-y-6 relative overflow-hidden"
      >
        {/* Subtle decorative gold badge in background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D9BA79]/15 to-transparent rounded-bl-full pointer-events-none" />

        {/* Section Header */}
        <div className="border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#B8964C] border border-[#D9BA79]/40 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Etapa 6 • Satisfação Geral</span>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#283D35] mt-1">
            Sua Percepção Global da Instituição
          </h2>
          <p className="text-xs sm:text-sm text-[#283D35]/70 mt-1">
            Esta avaliação resume a experiência integral da sua família conosco e orienta nossas metas de qualidade.
          </p>
        </div>

        {/* 1. Overall Star Rating */}
        <div className="bg-[#FAF7EF]/70 p-4 sm:p-5 rounded-2xl border border-[#D9BA79]/30">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#B8964C]" />
            <h3 className="text-sm sm:text-base font-semibold text-[#283D35]">
              Como você avalia a sua satisfação geral com o colégio?
            </h3>
          </div>
          <StarRating
            value={overallRating}
            onChange={onRatingChange}
            helperText="Considere a formação humana, acadêmica e o suporte diário recebido por sua família."
          />
        </div>

        {/* 2. NPS Recommendation scale 0-10 */}
        <div className="bg-[#FAF7EF]/70 p-4 sm:p-5 rounded-2xl border border-[#D9BA79]/30 space-y-3">
          <div className="flex items-start gap-2.5">
            <ThumbsUp className="w-5 h-5 text-[#283D35] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[#283D35]">
                Em uma escala de 0 a 10, qual a probabilidade de você recomendar o colégio para amigos, familiares ou conhecidos?
              </h3>
              <p className="text-xs text-[#283D35]/65 mt-0.5">
                (Índice Net Promoter Score - NPS institucional)
              </p>
            </div>
          </div>

          <NpsSelector value={npsScore} onChange={onNpsChange} />
        </div>
      </motion.div>
    </section>
  );
};
