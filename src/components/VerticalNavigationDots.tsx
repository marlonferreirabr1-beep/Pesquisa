import React from 'react';
import { SECTIONS } from '../types/survey';

interface VerticalNavigationDotsProps {
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const VerticalNavigationDots: React.FC<VerticalNavigationDotsProps> = ({
  currentIndex,
  onSelectIndex,
}) => {
  return (
    <nav
      aria-label="Navegação rápida pelas etapas"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 bg-white/70 backdrop-blur-md p-2.5 rounded-full border border-[#D9BA79]/30 shadow-lg shadow-stone-900/5"
    >
      {SECTIONS.map((section, idx) => {
        const isActive = idx === currentIndex;
        const isCompleted = idx < currentIndex;

        return (
          <div key={section.id} className="relative group flex items-center justify-center">
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <div className="bg-[#283D35] text-white text-xs px-2.5 py-1 rounded-md shadow-md font-medium border border-[#D9BA79]/30">
                {idx + 1}. {section.shortLabel}
              </div>
            </div>

            {/* Dot button */}
            <button
              type="button"
              onClick={() => onSelectIndex(idx)}
              aria-label={`Ir para etapa ${idx + 1}: ${section.title}`}
              className="relative p-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#D9BA79] cursor-pointer"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3 h-6 bg-[#B8964C] shadow-sm shadow-[#B8964C]/50'
                    : isCompleted
                    ? 'w-2.5 h-2.5 bg-[#283D35]/50 hover:bg-[#B8964C]'
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
};
