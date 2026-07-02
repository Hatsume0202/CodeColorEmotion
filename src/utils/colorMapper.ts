import type { Token, ColorEntry, TokenType } from '../types';
import { getColorById, getMappingByTokenType } from '../data/colorDatabase';

export function getUsedColors(tokens: Token[]): ColorEntry[] {
  const usedColorIds = new Set<string>();
  for (const token of tokens) {
    if (token.type !== 'other') {
      usedColorIds.add(token.colorId);
    }
  }
  
  return Array.from(usedColorIds)
    .map((id) => getColorById(id))
    .filter((c): c is ColorEntry => c !== undefined);
}

export function getTokenDistribution(tokens: Token[]): Record<TokenType, number> {
  const dist: Record<TokenType, number> = {
    keyword: 0,
    string: 0,
    number: 0,
    comment: 0,
    function: 0,
    variable: 0,
    operator: 0,
    type: 0,
    bracket: 0,
    other: 0,
  };

  for (const token of tokens) {
    dist[token.type]++;
  }

  return dist;
}

export function getTokenPercentages(distribution: Record<TokenType, number>, total: number): Record<TokenType, number> {
  const pct: Record<TokenType, number> = {} as Record<TokenType, number>;
  for (const key of Object.keys(distribution) as TokenType[]) {
    pct[key] = total > 0 ? Math.round((distribution[key] / total) * 1000) / 10 : 0;
  }
  return pct;
}

export function getTokenColorLabel(type: TokenType): string {
  const mapping = getMappingByTokenType(type);
  return mapping.label;
}

export function getTokenColorIcon(type: TokenType): string {
  const mapping = getMappingByTokenType(type);
  return mapping.icon;
}

export function getTokenHex(type: TokenType): string {
  const mapping = getMappingByTokenType(type);
  return mapping.colorHex;
}
