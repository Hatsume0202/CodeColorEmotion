import React, { useState } from 'react';
import type { ColorEntry } from '../types';

interface ColorCardProps {
  color: ColorEntry;
  index: number;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-fadeInUp rounded-xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] hover:border-white/10 transition-all duration-300 cursor-pointer group"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Color preview */}
      <div
        className="h-24 relative overflow-hidden transition-all duration-300 group-hover:h-28"
        style={{ backgroundColor: color.hex }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <span className="text-white/90 font-bold text-sm drop-shadow-lg">{color.nameZh}</span>
          <span className="text-white/70 font-mono text-xs drop-shadow-lg">{color.hex}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-primary)]">{color.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]">
            {color.category === 'warm' ? '🔥 暖色' : color.category === 'cool' ? '❄️ 冷色' : '⚪ 中性'}
          </span>
        </div>

        {/* Emotion tags */}
        <div className="flex flex-wrap gap-1">
          {color.emotionTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: `${color.hex}20`,
                color: color.hex,
                border: `1px solid ${color.hex}30`,
              }}
            >
              {tag}
            </span>
          ))}
          {color.emotionTags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-[var(--color-text-muted)]">
              +{color.emotionTags.length - 3}
            </span>
          )}
        </div>

        {/* Expandable details */}
        {expanded && (
          <div className="space-y-2 pt-2 border-t border-[var(--color-border-subtle)] animate-fadeInUp">
            <div>
              <h4 className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                📜 历史文化
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {color.historicalBackground}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                🧠 心理学含义
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {color.psychologicalMeaning}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                🏛️ 著名应用
              </h4>
              <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                {color.famousApplications.map((app, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[var(--color-text-muted)] mt-0.5">•</span>
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Expand hint */}
        <div className="text-center">
          <span className="text-[10px] text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
            {expanded ? '▲ 收起' : '▼ 展开详情'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
