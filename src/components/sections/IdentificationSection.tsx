import React from 'react';
import { motion } from 'motion/react';
import { User, GraduationCap, Shield } from 'lucide-react';
import { GRADES_LIST, type SurveyData } from '../../types/survey';

interface IdentificationSectionProps {
  data: SurveyData;
  onChange: (updates: Partial<SurveyData>) => void;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  data,
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8964C]">
            Etapa 2 • Identificação
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#283D35] mt-1">
            Dados de Identificação
          </h2>
          <p className="text-xs sm:text-sm text-[#283D35]/70 mt-1">
            Os campos de nome são opcionais. Apenas a turma/série do aluno é solicitada para sabermos a etapa escolar.
          </p>
        </div>

        {/* Inputs Form */}
        <div className="space-y-4">
          {/* Nome do responsável (opcional) */}
          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#B8964C]" />
                Nome do Responsável
              </span>
              <span className="text-[11px] font-normal text-stone-400">Opcional</span>
            </label>
            <input
              type="text"
              value={data.responsibleName}
              onChange={(e) => onChange({ responsibleName: e.target.value })}
              placeholder="Ex: Mariana Albuquerque (ou deixe em branco para anônimo)"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-[#283D35] placeholder:text-stone-400 focus:outline-none focus:border-[#D9BA79] focus:bg-white focus:ring-2 focus:ring-[#D9BA79]/20 transition-all"
            />
          </div>

          {/* Nome do aluno (opcional) */}
          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#B8964C]" />
                Nome do Aluno
              </span>
              <span className="text-[11px] font-normal text-stone-400">Opcional</span>
            </label>
            <input
              type="text"
              value={data.studentName}
              onChange={(e) => onChange({ studentName: e.target.value })}
              placeholder="Ex: Lucas Albuquerque"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm text-[#283D35] placeholder:text-stone-400 focus:outline-none focus:border-[#D9BA79] focus:bg-white focus:ring-2 focus:ring-[#D9BA79]/20 transition-all"
            />
          </div>

          {/* Turma ou série (obrigatório) */}
          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#283D35]" />
                Turma ou Série do Estudante <span className="text-amber-600">*</span>
              </span>
              <span className="text-[11px] font-semibold text-[#B8964C]">Obrigatório</span>
            </label>
            <select
              value={data.grade}
              onChange={(e) => onChange({ grade: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#283D35] bg-white focus:outline-none focus:border-[#D9BA79] focus:ring-2 focus:ring-[#D9BA79]/20 transition-all cursor-pointer ${
                !data.grade ? 'border-amber-300/70 text-stone-500' : 'border-stone-200'
              }`}
            >
              <option value="">Selecione a turma ou série...</option>
              {GRADES_LIST.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Privacy & LGPD Notice */}
        <div className="p-3.5 rounded-2xl bg-[#FAF7EF] border border-[#D9BA79]/20 flex items-start gap-2.5 text-xs text-[#283D35]/80">
          <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Compromisso de Privacidade &amp; LGPD:</strong> As respostas são tratadas com sigilo pela gestão escolar para aprimoramento institucional contínuo.
          </p>
        </div>
      </motion.div>
    </section>
  );
};
