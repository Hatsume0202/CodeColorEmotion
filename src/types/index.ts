// Token types from code parsing
export type TokenType =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'function'
  | 'variable'
  | 'operator'
  | 'type'
  | 'bracket'
  | 'other';

// A single parsed token
export interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
  colorHex: string;
  colorId: string;
}

// Color entry in the database
export interface ColorEntry {
  id: string;
  hex: string;
  name: string;
  nameZh: string;
  category: 'warm' | 'cool' | 'neutral';
  subCategory: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'neutral';
  historicalBackground: string;
  psychologicalMeaning: string;
  famousApplications: string[];
  emotionTags: string[];
  rgb: [number, number, number];
}

// Token type → color mapping
export interface TokenColorMapping {
  tokenType: TokenType;
  colorId: string;
  colorHex: string;
  colorName: string;
  label: string;
  icon: string;
}

// Emotion dimension
export interface EmotionDimension {
  name: string;
  nameZh: string;
  score: number; // 0-100
  description: string;
}

// Emotion analysis result
export interface EmotionReport {
  dominantEmotion: string;
  dominantEmotionZh: string;
  description: string;
  dimensions: EmotionDimension[];
  styleCharacteristics: string[];
  tokenDistribution: Record<TokenType, number>;
  tokenPercentages: Record<TokenType, number>;
  totalTokens: number;
}

// Supported languages
export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'auto';

// Analysis result
export interface AnalysisResult {
  tokens: Token[];
  emotionReport: EmotionReport;
  usedColors: ColorEntry[];
  code: string;
  language: SupportedLanguage;
}
