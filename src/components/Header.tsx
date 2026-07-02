import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-emerald-900/20 animate-gradient" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Logo / Icon */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 animate-glow">
              🎨
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              CodeColorEmotion
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl font-light">
            <span className="text-purple-400">代码色彩情感博物馆</span>
            <span className="mx-3 opacity-40">—</span>
            <span>探索代码背后的色彩语言与情感密码</span>
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center gap-2 pt-1">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-400/50" />
            <div className="w-2 h-2 rounded-full bg-purple-400/50" />
            <div className="w-2 h-2 rounded-full bg-blue-400/50" />
            <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-emerald-400/50" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
