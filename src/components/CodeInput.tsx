import React, { useState } from 'react';
import type { SupportedLanguage } from '../types';

interface CodeInputProps {
  onAnalyze: (code: string, language: SupportedLanguage) => void;
  isAnalyzing: boolean;
}

const SAMPLE_CODE = `// 🎨 Welcome to CodeColorEmotion
// Try analyzing this sample or paste your own code!

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

interface EmotionData {
  name: string;
  score: number;  // 0-100
  color: string;  // hex value
}

const joy: EmotionData = {
  name: "Joy",
  score: 85,
  color: "#FFD700",
};

class CodeArtist {
  private palette: string[] = [];
  
  addColor(hex: string): void {
    this.palette.push(hex);
  }
  
  getDominantEmotion(): string {
    const score = Math.random() * 100;
    return score > 50 ? "Creative ✨" : "Logical 🔬";
  }
}

const artist = new CodeArtist();
artist.addColor("#50C878");
artist.addColor("#9966CC");

console.log(\`Hello, \${artist.getDominantEmotion()} World!\`);
`;

const LANGUAGES: { value: SupportedLanguage; label: string; icon: string }[] = [
  { value: 'auto', label: '自动检测', icon: '🔍' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
];

const CodeInput: React.FC<CodeInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState<SupportedLanguage>('auto');
  const [charCount, setCharCount] = useState(SAMPLE_CODE.length);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    setCharCount(newCode.length);
  };

  const handleAnalyze = () => {
    const trimmed = code.trim();
    if (trimmed) {
      onAnalyze(trimmed, language);
    }
  };

  const handleClear = () => {
    setCode('');
    setCharCount(0);
  };

  const handleLoadSample = () => {
    setCode(SAMPLE_CODE);
    setCharCount(SAMPLE_CODE.length);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="appearance-none bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm rounded-lg px-3 py-2 pr-8 border border-[var(--color-border-subtle)] focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)] text-xs">
              ▼
            </div>
          </div>

          {/* Char count */}
          <span className="text-xs text-[var(--color-text-muted)]">
            {charCount.toLocaleString()} 字符
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors"
          >
            📋 示例代码
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] transition-colors"
          >
            🗑️ 清空
          </button>
        </div>
      </div>

      {/* Code textarea */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={handleCodeChange}
          placeholder="在此粘贴或输入代码片段..."
          spellCheck={false}
          className="w-full h-full min-h-[320px] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-mono text-sm leading-relaxed p-4 resize-none focus:outline-none placeholder:text-[var(--color-text-muted)]"
          style={{
            tabSize: 2,
          }}
        />
        
        {/* Line numbers hint */}
        <div className="absolute top-0 left-0 w-10 h-full pointer-events-none opacity-20 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent" />
      </div>

      {/* Analyze button */}
      <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !code.trim()}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 hover:from-purple-500 hover:via-blue-500 hover:to-emerald-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              正在分析...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span className="text-lg">🎨</span>
              分析代码色彩情感
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeInput;
