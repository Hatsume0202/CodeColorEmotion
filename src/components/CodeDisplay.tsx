import React from 'react';
import type { Token } from '../types';

interface CodeDisplayProps {
  tokens: Token[];
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ tokens, code }) => {
  // Build colored spans
  const elements: React.ReactNode[] = [];
  let lastEnd = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Add any un-tokenized whitespace
    if (token.start > lastEnd) {
      elements.push(
        <span key={`gap-${lastEnd}`} className="text-[var(--color-text-muted)]">
          {code.slice(lastEnd, token.start)}
        </span>
      );
    }
    
    // Add the token
    const opacity = token.type === 'comment' ? 'opacity-50' : '';
    const fontWeight = token.type === 'keyword' ? 'font-semibold' : '';
    const fontStyle = token.type === 'comment' ? 'italic' : '';
    
    elements.push(
      <span
        key={`token-${i}-${token.start}`}
        style={{ color: token.colorHex }}
        className={`${opacity} ${fontWeight} ${fontStyle} hover:brightness-125 transition-all duration-150`}
        title={`${token.type}: "${token.value.slice(0, 30)}${token.value.length > 30 ? '...' : ''}"`}
      >
        {token.value}
      </span>
    );
    
    lastEnd = token.end;
  }

  // Remaining text
  if (lastEnd < code.length) {
    elements.push(
      <span key={`gap-end`} className="text-[var(--color-text-muted)]">
        {code.slice(lastEnd)}
      </span>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs text-[var(--color-text-muted)] ml-2">Colorized Code</span>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">
          {tokens.length} tokens · {code.split('\n').length} lines
        </span>
      </div>
      
      {/* Code content */}
      <div className="overflow-auto max-h-[500px]">
        <pre className="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
          <code>{elements}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;
