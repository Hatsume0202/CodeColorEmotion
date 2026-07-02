import React from 'react';
import type { ColorEntry } from '../types';
import ColorCard from './ColorCard';

interface ColorCardGridProps {
  colors: ColorEntry[];
  totalTokens: number;
}

const ColorCardGrid: React.FC<ColorCardGridProps> = ({ colors, totalTokens }) => {
  if (colors.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎨</span>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          色彩详情
        </h3>
        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          共 {colors.length} 种色彩 · {totalTokens} 个 tokens
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {colors.map((color, index) => (
          <ColorCard key={color.id} color={color} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ColorCardGrid;
