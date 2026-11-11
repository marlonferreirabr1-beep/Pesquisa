import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { StarRating } from '../StarRating';
import type { SurveyRatings } from '../../types/survey';

interface TeachingSectionProps {
  ratings: SurveyRatings;
  onChange: (updates: Partial<SurveyRatings>) => void;
}

export const TeachingSection: React.FC<TeachingSectionProps> = ({
  ratings,
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
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8964C]">
              Etapa 3 • Ensino e Aprendizagem
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#283D35] mt-2">
            Práticas Pedagógicas &amp; Docência
          </h2>
          <p className="text-xs sm:text-sm text-[#283D35]/70 mt-1">
            Avalie cada critério de 1 a 5 estrelas conforme a sua percepção diária.
          </p>
        </div>

        {/* Questions with Star Ratings */}
        <div className="divide-y divide-stone-100">
          <div className="pb-4">
            <StarRating
              label="1. Como você avalia a qualidade do ensino?"
              helperText="Rigor acadêmico, conteúdos ministrados e estímulo ao raciocínio crítico."
              value={ratings.teachingQuality}
              onChange={(val) => onChange({ teachingQuality: val })}
            />
          </div>

          <div className="py-4">
            <StarRating
              label="2. Como avalia o acompanhamento do desenvolvimento do seu filho?"
              helperText="Atenção individualizada, feedbacks avaliativos e evolução socioemocional."
              value={ratings.developmentFollowUp}
              onChange={(val) => onChange({ developmentFollowUp: val })}
            />
          </div>

          <div className="pt-4">
            <StarRating
              label="3. Como avalia os professores e as metodologias utilizadas?"
              helperText="Didática, preparo pedagógico, empatia e dinamismo nas aulas."
              value={ratings.teachersMethodology}
              onChange={(val) => onChange({ teachersMethodology: val })}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
