import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, HeartHandshake, AlertCircle } from 'lucide-react';

interface NpsSelectorProps {
  value: number | null;
  onChange: (score: number) => void;
}

export const NpsSelector: React.FC<NpsSelectorProps> = ({ value, onChange }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const activeValue = hovered !== null ? hovered : value;

  const getCategoryInfo = (score: number | null) => {
    if (score === null) return null;
    if (score >= 9) {
      return {
        label: 'Promotor — Altamente recomendado',
        description: 'Você é um embaixador do colégio e confia em nossa proposta!',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        icon: Sparkles,
      };
    }
    if (score >= 7) {
      return {
        label: 'Neutro — Satisfeito com ressalvas',
        description: 'Valoriza a instituição e vê oportunidades pontuais de melhoria.',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        icon: HeartHandshake,
      };
    }
    return {
      label: 'Detrator — Pontos críticos a aprimorar',
      description: 'Sua crítica sincera é valiosa para nossa equipe tomar ações corretivas imediatas.',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: AlertCircle,
    };
  };

  const category = getCategoryInfo(activeValue);

  return (
    <div className="w-full space-y-4">
      {/* 0 to 10 scale buttons */}
      <div 
        className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2"
        onMouseLeave={() => setHovered(null)}
        role="radiogroup"
        aria-label="Escala de recomendação de 0 a 10"
      >
        {Array.from({ length: 11 }, (_, i) => i).map((num) => {
          const isSelected = value === num;
          const isHovered = hovered === num;

          // Color accents according to NPS zone
          let zoneClasses = 'bg-white hover:border-[#D9BA79] text-[#283D35]';
          if (isSelected) {
            if (num >= 9) {
              zoneClasses = 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20';
            } else if (num >= 7) {
              zoneClasses = 'bg-[#B8964C] text-white border-[#B8964C] shadow-md shadow-[#B8964C]/20';
            } else {
              zoneClasses = 'bg-stone-700 text-white border-stone-700 shadow-md shadow-stone-700/20';
            }
          } else if (isHovered) {
            zoneClasses = 'bg-amber-50/80 border-[#D9BA79] text-[#283D35]';
          }

          return (
            <motion.button
              key={num}
              type="button"
              role="radio"
              aria-checked={isSelected}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHovered(num)}
              onClick={() => onChange(num)}
              className={`h-11 sm:h-12 rounded-xl font-semibold text-base sm:text-lg border transition-all cursor-pointer flex items-center justify-center ${zoneClasses}`}
            >
              {num}
            </motion.button>
          );
        })}
      </div>

      {/* Extreme labels */}
      <div className="flex justify-between text-xs text-[#283D35]/70 font-medium px-1">
        <span>0 = Pouco provável</span>
        <span className="hidden sm:inline text-stone-400">Escala de Satisfação NPS</span>
        <span>10 = Com certeza recomendaria</span>
      </div>

      {/* Selected dynamic feedback */}
      <div className="min-h-14">
        {category ? (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${category.color}`}
          >
            <category.icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{category.label}</p>
              <p className="opacity-90">{category.description}</p>
            </div>
          </motion.div>
        ) : (
          <div className="p-3 rounded-2xl border border-dashed border-stone-200 text-xs sm:text-sm text-stone-400 text-center italic">
            Clique em um dos números de 0 a 10 para registrar sua pontuação.
          </div>
        )}
      </div>
    </div>
  );
};
