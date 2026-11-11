import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Send, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  UserCheck, 
  Star, 
  Loader2,
  Heart
} from 'lucide-react';
import type { SurveyData } from '../../types/survey';

interface ReviewAndSubmitSectionProps {
  data: SurveyData;
  onSubmit: () => Promise<void>;
  onEditSection?: (index: number) => void;
  isSubmitted: boolean;
  onRestart: () => void;
}

export const ReviewAndSubmitSection: React.FC<ReviewAndSubmitSectionProps> = ({
  data,
  onSubmit,
  isSubmitted,
  onRestart,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate required fields
  const missingFields: string[] = [];
  if (!data.grade) missingFields.push('Turma ou Série do estudante (Etapa 2)');
  if (data.ratings.teachingQuality === 0) missingFields.push('Qualidade do ensino (Etapa 3)');
  if (data.ratings.overallSatisfaction === 0) missingFields.push('Satisfação geral (Etapa 6)');
  if (data.npsScore === null) missingFields.push('Nota de recomendação NPS de 0 a 10 (Etapa 6)');

  const canSubmit = missingFields.length === 0;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit();
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Ocorreu um imprevisto ao enviar a avaliação. Por favor, tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (isSubmitted) {
    return (
      <section className="w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center survey-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border-2 border-[#D9BA79]/60 shadow-2xl shadow-stone-900/10 space-y-7 relative overflow-hidden"
        >
          {/* Decorative burst aura */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D9BA79]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Success Animated Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-600/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
            >
              <Check className="w-10 h-10 stroke-[2.5]" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
              className="absolute -inset-2 border border-dashed border-[#D9BA79]/60 rounded-full"
            />
          </div>

          {/* School official gratitude message */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#B8964C] text-xs font-bold uppercase tracking-wider border border-[#D9BA79]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Avaliação Registrada e Enviada</span>
            </div>

            <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-semibold text-[#283D35] leading-snug">
              Obrigado por contribuir com o futuro do nosso colégio!
            </h2>

            <p className="text-sm sm:text-base text-[#283D35]/85 leading-relaxed font-normal italic max-w-md mx-auto">
              "Sua participação é essencial para continuarmos evoluindo. Juntos, construímos uma educação cada vez melhor."
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Avaliação registrada no sistema da direção</span>
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-4 border-t border-stone-100 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">
              Atenciosamente,
            </span>
            <div className="font-serif-title text-xl font-bold text-[#283D35] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#B8964C] fill-[#B8964C]/20" />
              <span>Equipe Gestora</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-0.5">
              Direção Pedagógica &amp; Administrativa
            </span>
          </div>

          {/* Restart option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onRestart}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-[#283D35] hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            >
              Enviar outra resposta ou preencher para outro filho
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  // REVIEW BEFORE SUBMISSION SCREEN
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
              <CheckCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B8964C]">
              Etapa 8 • Revisão e Envio
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#283D35] mt-2">
            Revise Suas Respostas
          </h2>
          <p className="text-xs sm:text-sm text-[#283D35]/70 mt-1">
            Verifique o resumo abaixo e clique em <strong>Enviar minha avaliação</strong>. Os dados serão gravados e entregues diretamente à direção.
          </p>
        </div>

        {/* Validation Warnings if any required missing */}
        <AnimatePresence>
          {!canSubmit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5"
            >
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Campos essenciais pendentes de preenchimento:</span>
              </div>
              <ul className="list-disc list-inside pl-1 space-y-0.5 text-amber-800">
                {missingFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
              <p className="text-stone-500 pt-1 text-[11px]">
                Role para cima para preencher os itens sinalizados e retornar aqui.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Card */}
        <div className="bg-[#FAF7EF]/80 rounded-2xl p-4 sm:p-5 border border-[#D9BA79]/30 space-y-4 text-xs sm:text-sm">
          {/* Identificação */}
          <div className="border-b border-stone-200/60 pb-3 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Identificação Escolar
            </span>
            <p className="font-semibold text-[#283D35] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#B8964C]" />
              {data.grade || <span className="text-rose-500 font-normal italic">Turma não selecionada</span>}
              <span className="text-stone-500 font-normal">• Turno Vespertino (Tarde)</span>
            </p>
            <p className="text-stone-500 text-xs">
              Responsável: {data.responsibleName ? data.responsibleName : 'Anônimo'}
              {data.studentName && ` | Aluno(a): ${data.studentName}`}
            </p>
          </div>

          {/* Resumo de Notas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Notas Atribuídas
              </span>
              <span className="text-[11px] text-[#B8964C] font-semibold">Escala 1 a 5</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200/70 flex items-center justify-between">
                <span className="text-[#283D35]">Ensino e Professores:</span>
                <span className="font-bold text-[#B8964C] flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#D9BA79] text-[#D9BA79]" />
                  {data.ratings.teachingQuality || '-'}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200/70 flex items-center justify-between">
                <span className="text-[#283D35]">Atendimento &amp; Apoio:</span>
                <span className="font-bold text-[#B8964C] flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#D9BA79] text-[#D9BA79]" />
                  {data.ratings.schoolCommunication || '-'}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200/70 flex items-center justify-between">
                <span className="text-[#283D35]">Estrutura &amp; Segurança:</span>
                <span className="font-bold text-[#B8964C] flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#D9BA79] text-[#D9BA79]" />
                  {data.ratings.studentSafety || '-'}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200/70 flex items-center justify-between">
                <span className="text-[#283D35]">Satisfação Geral:</span>
                <span className="font-bold text-[#B8964C] flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#D9BA79] text-[#D9BA79]" />
                  {data.ratings.overallSatisfaction || '-'}
                </span>
              </div>
            </div>

            {/* NPS Badge */}
            <div className="p-2.5 bg-white rounded-xl border border-stone-200/70 flex items-center justify-between">
              <span className="text-xs text-[#283D35]">Recomendação NPS (0-10):</span>
              <span className="font-bold text-sm text-[#283D35] px-2 py-0.5 rounded-lg bg-stone-100">
                {data.npsScore !== null ? `${data.npsScore} / 10` : <span className="text-rose-500 font-normal">Não informado</span>}
              </span>
            </div>
          </div>

          {/* Comentários abertos */}
          {(data.suggestions.whatYouLikeMost || data.suggestions.whatCanImprove || data.suggestions.generalComments) && (
            <div className="pt-2 border-t border-stone-200/60 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
                Comentários Inclusos
              </span>
              <p className="text-stone-600 line-clamp-3 italic">
                "{data.suggestions.whatYouLikeMost || data.suggestions.whatCanImprove || data.suggestions.generalComments}"
              </p>
            </div>
          )}
        </div>

        {/* Error notification if submit failed */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <motion.button
            whileHover={canSubmit && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}
            type="button"
            disabled={!canSubmit || isSubmitting}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-semibold text-base sm:text-lg flex items-center justify-center gap-3 transition-all cursor-pointer ${
              canSubmit && !isSubmitting
                ? 'bg-[#283D35] hover:bg-[#1E2E28] text-white shadow-xl shadow-[#283D35]/25 border border-[#D9BA79]/30'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#D9BA79]" />
                <span>Gravando sua avaliação com segurança...</span>
              </>
            ) : (
              <>
                <span>Enviar minha avaliação</span>
                <Send className="w-5 h-5 text-[#D9BA79]" />
              </>
            )}
          </motion.button>
          <p className="text-[11px] text-stone-400 text-center mt-2.5">
            Ao clicar em enviar, sua avaliação será registrada com segurança no sistema da direção.
          </p>
        </div>
      </motion.div>
    </section>
  );
};
