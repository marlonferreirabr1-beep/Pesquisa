import React from 'react';
import { ArrowUp, CheckCircle2 } from 'lucide-react';
import { SECTIONS } from '../types/survey';

interface BottomControlsProps {
  currentIndex: number;
  onScrollToTop: () => void;
  onScrollToSubmit: () => void;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  currentIndex,
  onScrollToTop,
  onScrollToSubmit,
}) => {
  // Only display discreet floating utility buttons when scrolled past the welcome section
  if (currentIndex === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
      <button
        type="button"
        onClick={onScrollToTop}
        className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#283D35] border border-stone-200/80 shadow-md shadow-stone-900/10 transition-all cursor-pointer hover:scale-105"
        title="Voltar ao início da página"
        aria-label="Voltar ao início"
      >
        <ArrowUp className="w-4 h-4 text-[#B8964C]" />
      </button>

      {currentIndex < SECTIONS.length - 1 && (
        <button
          type="button"
          onClick={onScrollToSubmit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#283D35]/90 hover:bg-[#283D35] text-white text-xs font-semibold shadow-md shadow-[#283D35]/20 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
          title="Ir direto para a etapa de envio"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#D9BA79]" />
          <span className="hidden sm:inline">Finalizar e Enviar</span>
        </button>
      )}
    </div>
  );
};
