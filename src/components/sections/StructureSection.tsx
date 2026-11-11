import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { StarRating } from '../StarRating';
import type { SurveyRatings } from '../../types/survey';

interface StructureSectionProps {
  ratings: SurveyRatings;
  onChange: (updates: Partial<SurveyRatings>) => void;
}

export const StructureSection: React.FC<StructureSectionProps> = ({
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
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8964C]">
              Etapa 5 • Estrutura e Segurança
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#283D35] mt-2">
            Espaço Físico, Conforto &amp; Proteção
          </h2>
          <p className="text-xs sm:text-sm text-[#283D35]/70 mt-1">
            Avalie as instalações, a conservação e os protocolos de segurança do colégio.
          </p>
        </div>

        {/* Questions with Star Ratings */}
        <div className="divide-y divide-stone-100">
          <div className="pb-4">
            <StarRating
              label="1. Como avalia a limpeza e organização?"
              helperText="Salas de aula, sanitários, refeitório, pátios e áreas de convivência."
              value={ratings.cleanlinessOrganization}
              onChange={(val) => onChange({ cleanlinessOrganization: val })}
            />
          </div>

          <div className="py-4">
            <StarRating
              label="2. Como avalia a segurança dos alunos?"
              helperText="Portaria, controle de acesso e catracas, vigilância e protocolos de saída dos estudantes."
              value={ratings.studentSafety}
              onChange={(val) => onChange({ studentSafety: val })}
            />
          </div>

          <div className="pt-4">
            <StarRating
              label="3. Como avalia os ambientes e a estrutura física do colégio?"
              helperText="Salas de aula, climatização, mobiliário, ventilação e conservação dos espaços."
              value={ratings.physicalStructure}
              onChange={(val) => onChange({ physicalStructure: val })}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
