import type { EmotionReport, EmotionDimension, TokenType } from '../types';
import { getTokenDistribution, getTokenPercentages } from './colorMapper';
import type { Token } from '../types';

// Emotion weight maps: each token type contributes to different emotional dimensions
const TOKEN_WEIGHTS: Record<TokenType, Record<string, number>> = {
  keyword: { logic: 0.8, structure: 0.9, complexity: 0.5, creativity: 0.2, warmth: 0.1, energy: 0.3 },
  string: { logic: 0.1, structure: 0.2, complexity: 0.3, creativity: 0.7, warmth: 0.6, energy: 0.4 },
  number: { logic: 0.7, structure: 0.3, complexity: 0.4, creativity: 0.1, warmth: 0.1, energy: 0.2 },
  comment: { logic: 0.3, structure: 0.2, complexity: 0.2, creativity: 0.5, warmth: 0.5, energy: 0.1 },
  function: { logic: 0.7, structure: 0.8, complexity: 0.7, creativity: 0.6, warmth: 0.2, energy: 0.5 },
  variable: { logic: 0.4, structure: 0.4, complexity: 0.4, creativity: 0.4, warmth: 0.3, energy: 0.3 },
  operator: { logic: 0.9, structure: 0.5, complexity: 0.6, creativity: 0.1, warmth: 0.0, energy: 0.4 },
  type: { logic: 0.8, structure: 0.9, complexity: 0.8, creativity: 0.3, warmth: 0.1, energy: 0.2 },
  bracket: { logic: 0.3, structure: 0.9, complexity: 0.5, creativity: 0.2, warmth: 0.1, energy: 0.2 },
  other: { logic: 0.1, structure: 0.1, complexity: 0.1, creativity: 0.1, warmth: 0.1, energy: 0.1 },
};

interface StyleCharacteristic {
  name: string;
  nameZh: string;
  description: string;
}

function determineStyleCharacteristics(
  percentages: Record<TokenType, number>
): StyleCharacteristic[] {
  const chars: StyleCharacteristic[] = [];

  if (percentages.comment > 15) {
    chars.push({
      name: 'Well-documented',
      nameZh: '文档详实',
      description: '代码中注释占比较高，说明开发者注重代码可读性和团队协作。',
    });
  }

  if (percentages.function > 10) {
    chars.push({
      name: 'Modular',
      nameZh: '模块化设计',
      description: '函数调用频繁，代码采用良好的模块化组织方式，复用性高。',
    });
  }

  if (percentages.keyword > 15) {
    chars.push({
      name: 'Logic-heavy',
      nameZh: '逻辑密集',
      description: '控制流关键字较多，代码包含复杂的业务逻辑和条件判断。',
    });
  }

  if (percentages.string > 12) {
    chars.push({
      name: 'Content-rich',
      nameZh: '内容驱动',
      description: '字符串使用频繁，代码可能涉及UI渲染、文本处理或数据序列化。',
    });
  }

  if (percentages.type > 8) {
    chars.push({
      name: 'Type-safe',
      nameZh: '类型安全',
      description: '类型注解丰富，体现了严格的类型系统使用习惯。',
    });
  }

  if (percentages.operator > 10) {
    chars.push({
      name: 'Compute-intensive',
      nameZh: '计算密集',
      description: '运算符使用较多，代码涉及大量数学或逻辑运算。',
    });
  }

  if (percentages.variable > 20) {
    chars.push({
      name: 'Data-driven',
      nameZh: '数据驱动',
      description: '变量标识符占比高，代码处理多样的数据状态和转换。',
    });
  }

  if (percentages.number > 10) {
    chars.push({
      name: 'Numeric',
      nameZh: '数值处理',
      description: '数字字面量较多，可能涉及科学计算、图形处理或数据分析。',
    });
  }

  if (chars.length === 0) {
    chars.push({
      name: 'Balanced',
      nameZh: '均衡风格',
      description: '代码各元素分布均衡，展现出全面的编程风格。',
    });
    chars.push({
      name: 'Clean',
      nameZh: '简洁明了',
      description: '代码结构清晰，没有过度复杂的表达。',
    });
  }

  return chars;
}

export function analyzeEmotion(tokens: Token[]): EmotionReport {
  const distribution = getTokenDistribution(tokens);
  const meaningfulTokens = tokens.filter((t) => t.type !== 'other');
  const totalTokens = meaningfulTokens.length;
  const percentages = getTokenPercentages(distribution, totalTokens);

  // Calculate weighted emotion scores
  const rawScores: Record<string, number> = {
    logic: 0,
    structure: 0,
    complexity: 0,
    creativity: 0,
    warmth: 0,
    energy: 0,
  };

  for (const token of meaningfulTokens) {
    const weights = TOKEN_WEIGHTS[token.type];
    for (const dim of Object.keys(rawScores)) {
      rawScores[dim] += weights[dim] || 0;
    }
  }

  // Normalize to 0-100
  const maxPossible = totalTokens;
  const normalizedScores: Record<string, number> = {};
  for (const dim of Object.keys(rawScores)) {
    normalizedScores[dim] = maxPossible > 0 
      ? Math.round((rawScores[dim] / maxPossible) * 100) 
      : 0;
  }

  // Determine dominant emotion
  const emotionScores = {
    joyful: normalizedScores.creativity * 0.5 + normalizedScores.energy * 0.3 + normalizedScores.warmth * 0.2,
    serious: normalizedScores.logic * 0.5 + normalizedScores.structure * 0.3 + normalizedScores.complexity * 0.2,
    calm: normalizedScores.structure * 0.4 + (100 - normalizedScores.energy) * 0.3 + normalizedScores.warmth * 0.3,
    complex: normalizedScores.complexity * 0.5 + normalizedScores.logic * 0.3 + normalizedScores.creativity * 0.2,
    warm: normalizedScores.warmth * 0.4 + normalizedScores.creativity * 0.3 + normalizedScores.energy * 0.3,
    cool: normalizedScores.logic * 0.4 + normalizedScores.structure * 0.4 + (100 - normalizedScores.warmth) * 0.2,
  };

  let maxEmotion = 'serious';
  let maxScore = 0;
  for (const [key, val] of Object.entries(emotionScores)) {
    if (val > maxScore) {
      maxScore = val;
      maxEmotion = key;
    }
  }

  const emotionNames: Record<string, string> = {
    joyful: '欢快',
    serious: '严肃',
    calm: '平静',
    complex: '复杂',
    warm: '温暖',
    cool: '冷静',
  };

  const emotionDescriptions: Record<string, string> = {
    joyful: '这段代码充满了创造力与表达力。丰富的字符串和函数调用透露出开发者对代码美学的追求，如同一位画家在调色板上调配出欢快的色彩。代码节奏明快，充满了探索和实验的精神。',
    serious: '这段代码展现出严谨的逻辑思维和结构化的设计理念。关键字和类型注解的高频使用表明开发者追求精确性和可靠性。这是一个工程师的代码——每一行都经过深思熟虑。',
    calm: '这段代码保持着沉稳的节奏，结构清晰而不急躁。适度的注释和均衡的元素分布营造出从容不迫的氛围。开发者以一种平和的心态组织逻辑，使代码如同一篇宁静的散文。',
    complex: '这段代码层次丰富，交织着多种编程范式和复杂的逻辑结构。函数、类型和运算交织在一起，形成了一个精密而复杂的系统。这是一段需要细细品读的代码，每一次阅读都能发现新的层次。',
    warm: '这段代码散发着人性化的温度。丰富的注释和友好的变量命名方式，让人感受到开发者对代码读者的关怀。代码不只是机器的指令，更是人与人之间沟通的桥梁。',
    cool: '这段代码保持着冷静理性的基调。逻辑清晰、结构严谨，没有多余的情感修饰。开发者以理性的态度处理问题，让代码在冷静中展现出精确的美感。',
  };

  const dimensions: EmotionDimension[] = [
    { name: 'Logic', nameZh: '逻辑性', score: normalizedScores.logic, description: '代码的逻辑严密程度和条件判断的复杂度。' },
    { name: 'Structure', nameZh: '结构性', score: normalizedScores.structure, description: '代码组织架构的层次感和模块化程度。' },
    { name: 'Complexity', nameZh: '复杂度', score: normalizedScores.complexity, description: '代码元素的多样性和交织程度。' },
    { name: 'Creativity', nameZh: '创造性', score: normalizedScores.creativity, description: '代码表达方式的灵活性和创新程度。' },
    { name: 'Warmth', nameZh: '亲和力', score: normalizedScores.warmth, description: '代码对读者友好程度和人文关怀的体现。' },
    { name: 'Energy', nameZh: '活跃度', score: normalizedScores.energy, description: '代码的动态性和操作活跃程度。' },
  ];

  const styleCharacteristics = determineStyleCharacteristics(percentages);

  return {
    dominantEmotion: maxEmotion,
    dominantEmotionZh: emotionNames[maxEmotion],
    description: emotionDescriptions[maxEmotion],
    dimensions,
    styleCharacteristics: styleCharacteristics.map((s) => s.nameZh + '：' + s.description),
    tokenDistribution: distribution,
    tokenPercentages: percentages,
    totalTokens,
  };
}
