'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: '欢迎来到 PredictX! 🎉',
    description: '全球领先的预测市场平台，在这里你可以对体育、政治、加密货币等事件进行预测和交易。',
    icon: '🌐',
    tip: '无需真实资金即可体验，我们提供 $10,000 模拟资金。',
  },
  {
    title: '浏览和发现市场 📊',
    description: '从体育赛事到加密货币、政治选举到科技趋势，数百个市场等你探索。',
    icon: '🔍',
    tip: '使用左侧分类栏和搜索功能快速找到感兴趣的市场。',
  },
  {
    title: '交易和获利 💰',
    description: '买入你看好的结果，卖出你看空的结果。价格反映市场共识，正确预测即可获得收益。',
    icon: '📈',
    tip: '结果价格 = 概率。60¢ 意味着市场认为有 60% 的可能性发生。',
  },
  {
    title: '跟踪和成长 🏆',
    description: '在投资组合中追踪你的持仓，查看排行榜学习顶级交易者的策略，甚至跟单他们的操作。',
    icon: '🎯',
    tip: '关注价格提醒功能，不错过任何重要变动。',
  },
];

export default function Onboarding({ isOpen, onClose }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
      localStorage.setItem('predictx_onboarded', 'true');
      addToast({ type: 'success', title: '准备就绪! 🚀', message: '开始你的预测市场之旅' });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onClose();
    localStorage.setItem('predictx_onboarded', 'true');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />

      <div className="relative w-full max-w-lg bg-[#141720] border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/50 animate-scale-in overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">{step.icon}</div>
          <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{step.description}</p>

          {/* Tip card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/15 mb-6">
            <p className="text-xs text-emerald-300 font-medium">💡 {step.tip}</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-emerald-500' : i < currentStep ? 'bg-emerald-500/40' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 h-11 rounded-xl bg-gray-800 text-sm font-medium text-gray-400 hover:text-white transition-all"
            >
              跳过教程
            </button>
            <button
              onClick={handleNext}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              {isLastStep ? '开始交易 🚀' : '下一步 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
