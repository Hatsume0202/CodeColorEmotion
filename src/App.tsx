import React, { useState, useCallback, useMemo } from 'react';
import type { AnalysisResult, SupportedLanguage } from './types';
import { tokenize } from './utils/tokenizer';
import { getUsedColors } from './utils/colorMapper';
import { analyzeEmotion } from './utils/emotionAnalyzer';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import CodeDisplay from './components/CodeDisplay';
import PieChartComponent from './components/PieChart';
import ColorCardGrid from './components/ColorCardGrid';
import EmotionReportComponent from './components/EmotionReport';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'colors' | 'report'>('overview');

  const handleAnalyze = useCallback((code: string, language: SupportedLanguage) => {
    setIsAnalyzing(true);
    
    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      try {
        const tokens = tokenize(code);
        const emotionReport = analyzeEmotion(tokens);
        const usedColors = getUsedColors(tokens);

        setAnalysisResult({
          tokens,
          emotionReport,
          usedColors,
          code,
          language,
        });
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 100);
  }, []);

  const tabs = useMemo(() => [
    { key: 'overview' as const, label: '总览', icon: '🏠' },
    { key: 'code' as const, label: '彩色代码', icon: '🌈' },
    { key: 'colors' as const, label: '色彩详情', icon: '🎨' },
    { key: 'report' as const, label: '情感报告', icon: '📋' },
  ], []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel: Code Input */}
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-200px)]">
            <div className="h-full rounded-xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] shadow-xl">
              <CodeInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </div>
          </div>

          {/* Right panel: Results */}
          <div className="min-h-[600px]">
            {!analysisResult && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
                <div className="text-6xl mb-6 opacity-60">🎨</div>
                <h2 className="text-xl font-semibold text-[var(--color-text-secondary)] mb-2">
                  等待分析
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] max-w-md">
                  在左侧输入或粘贴代码片段，点击"分析代码色彩情感"按钮，
                  探索代码中隐藏的色彩语言与情感密码。
                </p>
                <div className="mt-6 flex gap-2">
                  {['🔑', '💬', '🔢', '⚙️', '📦', '⚡'].map((emoji, i) => (
                    <span
                      key={i}
                      className="text-2xl opacity-40 hover:opacity-100 transition-opacity"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[var(--color-border-subtle)] border-t-purple-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">正在解析代码色彩...</p>
              </div>
            )}

            {analysisResult && !isAnalyzing && (
              <div className="space-y-4 animate-fadeInUp">
                {/* Tab Navigation */}
                <div className="flex rounded-xl overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.key
                          ? 'bg-purple-600/20 text-purple-300 shadow-[inset_0_-2px_0] shadow-purple-500'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Quick stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Tokens', value: analysisResult.emotionReport.totalTokens, icon: '🔤' },
                          { label: '色彩种类', value: analysisResult.usedColors.length, icon: '🎨' },
                          { label: '主导情感', value: analysisResult.emotionReport.dominantEmotionZh, icon: '💫' },
                          { label: '代码行数', value: analysisResult.code.split('\n').length, icon: '📝' },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] p-3 text-center"
                          >
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-xs text-[var(--color-text-muted)]">{stat.label}</div>
                            <div className="text-lg font-bold text-[var(--color-text-primary)]">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <PieChartComponent
                        tokenPercentages={analysisResult.emotionReport.tokenPercentages}
                        tokenDistribution={analysisResult.emotionReport.tokenDistribution}
                      />
                      <EmotionReportComponent report={analysisResult.emotionReport} />
                    </div>
                  )}

                  {/* Code Tab */}
                  {activeTab === 'code' && (
                    <CodeDisplay tokens={analysisResult.tokens} code={analysisResult.code} />
                  )}

                  {/* Colors Tab */}
                  {activeTab === 'colors' && (
                    <ColorCardGrid
                      colors={analysisResult.usedColors}
                      totalTokens={analysisResult.emotionReport.totalTokens}
                    />
                  )}

                  {/* Report Tab */}
                  {activeTab === 'report' && (
                    <EmotionReportComponent report={analysisResult.emotionReport} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[var(--color-text-muted)]">
          <p>
            🎨 CodeColorEmotion — 代码色彩情感博物馆 &copy; {new Date().getFullYear()}
          </p>
          <p className="mt-1 opacity-60">
            Built with React + TypeScript + Vite + Tailwind CSS + Recharts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
