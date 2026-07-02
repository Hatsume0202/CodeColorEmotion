import React from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TokenType } from '../types';
import { getTokenColorLabel, getTokenColorIcon, getTokenHex } from '../utils/colorMapper';

interface PieChartProps {
  tokenPercentages: Record<TokenType, number>;
  tokenDistribution: Record<TokenType, number>;
}

const PieChartComponent: React.FC<PieChartProps> = ({ tokenPercentages, tokenDistribution }) => {
  const tokenTypes: TokenType[] = [
    'keyword', 'string', 'number', 'comment', 'function',
    'variable', 'operator', 'type', 'bracket',
  ];

  const data = tokenTypes
    .filter((t) => tokenDistribution[t] > 0)
    .map((t) => ({
      name: getTokenColorLabel(t),
      icon: getTokenColorIcon(t),
      value: tokenDistribution[t],
      percentage: tokenPercentages[t],
      color: getTokenHex(t),
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--color-text-muted)]">
        暂无数据
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; icon: string; percentage: number; color: string } }> }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-lg p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">{d.icon}</span>
            <span className="font-medium text-[var(--color-text-primary)]">{d.name}</span>
          </div>
          <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
            占比: <span className="font-semibold" style={{ color: d.color }}>{d.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Use a simpler legend style with custom rendering via wrapper
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                stroke="var(--color-bg-primary)"
                strokeWidth={2}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
      {/* Custom legend below the chart */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <span className="text-sm">{entry.icon}</span>
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className="text-[var(--color-text-muted)]">{entry.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartComponent;
