import React from 'react';
import { SECTIONS } from '../types/survey';
import { Lock, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentSectionIndex: number;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentSectionIndex,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const currentSection = SECTIONS[currentSectionIndex] || SECTIONS[0];
  const progressPercent = ((currentSectionIndex) / (SECTIONS.length - 1)) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF7EF]/90 backdrop-blur-md border-b border-[#D9BA79]/20 transition-all">
      {/* Top thin progress bar */}
      <div className="w-full h-1 bg-stone-200/60 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D9BA79] via-[#B8964C] to-[#283D35] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand / Logo snippet */}
        <div className="flex items-center gap-3">
          <img
            src="https://i.postimg.cc/4dB1VpFp/file-00000000fde4820e9eedd8fce39418f5.png"
            alt="Logo do Colégio"
            className="h-8 sm:h-9 w-auto object-contain"
          />
          <div className="hidden md:block">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#283D35]">
              Colégio de Excelência
            </p>
            <p className="text-[11px] text-[#283D35]/65 -mt-0.5">
              Pesquisa Anual de Satisfação
            </p>
          </div>
        </div>

        {/* Current Step indicator badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#D9BA79]/30 text-xs font-medium text-[#283D35]">
            <Sparkles className="w-3.5 h-3.5 text-[#B8964C]" />
            <span className="text-stone-400">Etapa {currentSectionIndex + 1} de {SECTIONS.length}:</span>
            <span className="font-semibold text-[#283D35]">{currentSection.shortLabel}</span>
          </div>

          {/* Admin link button */}
          <button
            onClick={onOpenAdmin}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 hover:bg-white text-[#283D35] border border-stone-200 hover:border-[#D9BA79] transition-all shadow-xs cursor-pointer group"
            title="Acesso exclusivo da direção e coordenação"
          >
            <Lock className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-emerald-600' : 'text-stone-400 group-hover:text-[#B8964C]'}`} />
            <span className="hidden sm:inline">
              {isAdminLoggedIn ? 'Painel da Direção' : 'Área Administrativa'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
