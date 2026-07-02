import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { EmotionReport as EmotionReportType } from '../types';

interface EmotionReportProps {
  report: EmotionReportType;
}

const DIMENSION_COLORS = [
  '#4169E1', // Royal Blue - logic
  '#50C878', // Emerald - structure
  '#FF2400', // Scarlet - complexity
  '#9966CC', // Amethyst - creativity
  '#FFBF00', // Amber - warmth
  '#FF6B6B', // Coral - energy
];

const EMOTION_EMOJIS: Record<string, string> = {
  joyful: '🎉',
  serious: '🧐',
  calm: '😌',
  complex: '🧩',
  warm: '🤗',
  cool: '🧊',
};

const EmotionReportComponent: React.FC<EmotionReportProps> = ({ report }) => {
  const dimensionData = report.dimensions.map((d, i) => ({
    name: d.nameZh,
    score: d.score,
    fill: DIMENSION_COLORS[i],
    description: d.description,
  }));

  const CustomBarTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; score: number; description: string; fill: string } }> }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-lg p-3 shadow-xl max-w-52">
          <p className="font-medium text-[var(--color-text-primary)] text-sm">{d.name}</p>
          <p className="text-lg font-bold" style={{ color: d.fill }}>
            {d.score}%
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{d.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Dominant emotion */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-tertiary)] p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-bl-full" />
        
        <div className="relative flex items-start gap-4">
          <div className="text-5xl flex-shrink-0">
            {EMOTION_EMOJIS[report.dominantEmotion] || '🎨'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                主导情感
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {report.dominantEmotionZh}
              <span className="text-sm font-normal text-[var(--color-text-muted)] ml-2 capitalize">
                ({report.dominantEmotion})
              </span>
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              {report.description}
            </p>
          </div>
        </div>
      </div>

      {/* Dimension bar chart */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📊</span>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">情感维度分析</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dimensionData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border-subtle)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--color-border-subtle)', opacity: 0.3 }} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={22} animationBegin={0} animationDuration={1000}>
              {dimensionData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Style characteristics */}
      {report.styleCharacteristics.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">代码风格特征</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {report.styleCharacteristics.map((char, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)]"
              >
                <span className="text-sm mt-0.5">✨</span>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{char}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionReportComponent;
