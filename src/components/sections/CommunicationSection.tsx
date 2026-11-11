import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { StarRating } from '../StarRating';
import type { SurveyRatings } from '../../types/survey';

interface CommunicationSectionProps {
  ratings: SurveyRatings;
  onChange: (updates: Partial<SurveyRatings>) => void;
}

export const CommunicationSection: React.FC<CommunicationSectionProps> = ({
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
              <MessageSquare className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8964C]">
              Etapa 4 • Comunicação e Atendimento
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#283D35] mt-2">
            Relacionamento &amp; Suporte
          </h2>
          <p className="text-xs sm:text-sm text-[#283D35]/70 mt-1">
            Avalie a eficácia dos canais de diálogo e a cordialidade das equipes escolares.
          </p>
        </div>

        {/* Questions with Star Ratings */}
        <div className="divide-y divide-stone-100">
          <div className="pb-4">
            <StarRating
              label="1. Como avalia a comunicação entre o colégio e as famílias?"
              helperText="Agilidade nas mensagens, avisos no app escolar, reuniões e clareza nas informações."
              value={ratings.schoolCommunication}
              onChange={(val) => onChange({ schoolCommunication: val })}
            />
          </div>

          <div className="py-4">
            <StarRating
              label="2. Como avalia o atendimento da secretaria?"
              helperText="Presteza, resolução ágil de documentos, cordialidade e atendimento telefônico/presencial."
              value={ratings.frontDeskService}
              onChange={(val) => onChange({ frontDeskService: val })}
            />
          </div>

          <div className="pt-4">
            <StarRating
              label="3. Como avalia o suporte da coordenação pedagógica?"
              helperText="Acessibilidade para agendamento, escuta ativa e orientação às famílias."
              value={ratings.pedagogicalCoordination}
              onChange={(val) => onChange({ pedagogicalCoordination: val })}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
