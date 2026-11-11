import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  helperText?: string;
}

const STAR_LABELS = [
  'Selecione uma nota',
  '1 - Muito insatisfeito',
  '2 - Insatisfeito',
  '3 - Regular',
  '4 - Satisfeito',
  '5 - Excelente',
];

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  label,
  helperText,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered !== null ? hovered : value;

  return (
    <div className="w-full py-2">
      {label && (
        <div className="mb-2">
          <p className="text-base sm:text-lg font-medium text-[#283D35] leading-snug">
            {label}
          </p>
          {helperText && (
            <p className="text-xs text-[#283D35]/60 mt-0.5">{helperText}</p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div 
          className="flex items-center gap-2 sm:gap-3"
          onMouseLeave={() => setHovered(null)}
          role="radiogroup"
          aria-label={label || 'Avaliação em estrelas'}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= displayRating;
            const isSelected = star === value;

            return (
              <motion.button
                key={star}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHovered(star)}
                onClick={() => onChange(star)}
                className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#D9BA79] cursor-pointer ${
                  isFilled 
                    ? 'text-[#D9BA79] drop-shadow-sm' 
                    : 'text-stone-300 hover:text-[#D9BA79]/60'
                }`}
              >
                <Star
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                    isFilled ? 'fill-[#D9BA79]' : 'fill-transparent stroke-[1.7]'
                  }`}
                />
              </motion.button>
            );
          })}
        </div>

        <div className="h-6 flex items-center">
          <motion.span
            key={displayRating}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs sm:text-sm font-medium tracking-wide transition-colors ${
              displayRating > 0 ? 'text-[#B8964C]' : 'text-stone-400 italic'
            }`}
          >
            {STAR_LABELS[displayRating] || 'Selecione uma nota'}
          </motion.span>
        </div>
      </div>
    </div>
  );
};
