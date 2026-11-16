'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

interface CreateMarketForm {
  title: string;
  category: string;
  description: string;
  outcomes: { name: string; initialPrice: number }[];
  endDate: string;
  resolutionSource: string;
}

const categoryOptions = [
  { id: 'sports', label: '体育', icon: '🏀' },
  { id: 'politics', label: '政治', icon: '🏛️' },
  { id: 'crypto', label: '加密货币', icon: '₿' },
  { id: 'entertainment', label: '娱乐', icon: '🎬' },
  { id: 'science', label: '科技', icon: '🔬' },
  { id: 'weather', label: '天气', icon: '🌡️' },
  { id: 'economics', label: '经济', icon: '📈' },
  { id: 'custom', label: '自定义', icon: '✨' },
];

export default function CreateMarket() {
  const [form, setForm] = useState<CreateMarketForm>({
    title: '',
    category: 'sports',
    description: '',
    outcomes: [
      { name: 'Yes', initialPrice: 50 },
      { name: 'No', initialPrice: 50 },
    ],
    endDate: '',
    resolutionSource: '',
  });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const addOutcome = () => {
    if (form.outcomes.length >= 6) return;
    setForm({
      ...form,
      outcomes: [...form.outcomes, { name: '', initialPrice: Math.round(100 / (form.outcomes.length + 1)) }],
    });
  };

  const removeOutcome = (index: number) => {
    if (form.outcomes.length <= 2) return;
    setForm({
      ...form,
      outcomes: form.outcomes.filter((_, i) => i !== index),
    });
  };

  const updateOutcome = (index: number, field: 'name' | 'initialPrice', value: string | number) => {
    setForm({
      ...form,
      outcomes: form.outcomes.map((o, i) => i === index ? { ...o, [field]: value } : o),
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    addToast({
      type: 'success',
      title: '市场创建申请已提交! 🎉',
      message: '我们的团队将在24小时内审核您的市场',
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">市场创建成功!</h2>
        <p className="text-gray-400 mb-6">您的市场正在审核中，预计24小时内上线</p>
        <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 text-left max-w-md mx-auto">
          <h3 className="text-sm font-semibold text-white mb-3">市场预览</h3>
          <p className="text-sm text-gray-300 mb-2">{form.title}</p>
          <div className="flex gap-2 mb-3">
            {form.outcomes.map((o, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-xs text-white font-medium">
                {o.name} {o.initialPrice}¢
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-500">分类: {categoryOptions.find(c => c.id === form.category)?.label} · 结束: {form.endDate || '待定'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">📝 创建市场</h1>
        <p className="text-gray-400 text-sm">创建您自己的预测市场，让社区来参与交易</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= s ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500'
            }`}>
              {step > s ? '✓' : s}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-white' : 'text-gray-500'}`}>
              {s === 1 ? '基本信息' : s === 2 ? '结果设置' : '确认提交'}
            </span>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-gray-800'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic info */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">市场标题 *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="例: 2026年美国总统大选谁会赢?"
                className="w-full h-11 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium mb-2 block">分类 *</label>
              <div className="grid grid-cols-4 gap-2">
                {categoryOptions.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setForm({ ...form, category: cat.id })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      form.category === cat.id
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-gray-800/40 border-gray-700/40 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-[10px] font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="详细描述这个市场的规则和判定标准..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">结束日期 *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!form.title || !form.endDate}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一步: 设置结果
          </button>
        </div>
      )}

      {/* Step 2: Outcomes */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">结果选项</h3>
              <button
                onClick={addOutcome}
                disabled={form.outcomes.length >= 6}
                className="text-xs text-emerald-400 font-medium hover:text-emerald-300 disabled:text-gray-600"
              >
                + 添加选项
              </button>
            </div>

            {form.outcomes.map((outcome, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
                <div className="flex-1">
                  <input
                    type="text"
                    value={outcome.name}
                    onChange={(e) => updateOutcome(i, 'name', e.target.value)}
                    placeholder={`选项 ${i + 1}`}
                    className="w-full h-9 px-3 rounded-lg bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="w-24">
                  <div className="relative">
                    <input
                      type="number"
                      value={outcome.initialPrice}
                      onChange={(e) => updateOutcome(i, 'initialPrice', parseInt(e.target.value) || 0)}
                      className="w-full h-9 px-3 pr-6 rounded-lg bg-gray-800/60 border border-gray-700/50 text-sm text-white text-center focus:outline-none focus:border-emerald-500/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">¢</span>
                  </div>
                </div>
                {form.outcomes.length > 2 && (
                  <button
                    onClick={() => removeOutcome(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">结算数据来源</label>
              <input
                type="text"
                value={form.resolutionSource}
                onChange={(e) => setForm({ ...form, resolutionSource: e.target.value })}
                placeholder="例: 官方API, 权威新闻机构..."
                className="w-full h-11 px-4 rounded-xl bg-gray-800/60 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="h-12 px-6 rounded-xl bg-gray-800 text-sm font-semibold text-gray-400 hover:text-white transition-all"
            >
              上一步
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={form.outcomes.some(o => !o.name)}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步: 确认
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#141720] border border-gray-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">确认市场信息</h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-800/40">
                <span className="text-xs text-gray-500">标题</span>
                <span className="text-xs text-white font-medium">{form.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/40">
                <span className="text-xs text-gray-500">分类</span>
                <span className="text-xs text-white font-medium">{categoryOptions.find(c => c.id === form.category)?.icon} {categoryOptions.find(c => c.id === form.category)?.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/40">
                <span className="text-xs text-gray-500">结束日期</span>
                <span className="text-xs text-white font-medium">{form.endDate}</span>
              </div>
              <div className="py-2 border-b border-gray-800/40">
                <span className="text-xs text-gray-500 block mb-2">结果选项</span>
                <div className="flex flex-wrap gap-2">
                  {form.outcomes.map((o, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-xs text-white font-medium">
                      {o.name} ({o.initialPrice}¢)
                    </span>
                  ))}
                </div>
              </div>
              {form.description && (
                <div className="py-2">
                  <span className="text-xs text-gray-500 block mb-1">描述</span>
                  <p className="text-xs text-gray-300">{form.description}</p>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <p className="text-[11px] text-amber-400">
                ⚠️ 提交后，市场将进入审核流程。审核通过后将在平台上线。
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="h-12 px-6 rounded-xl bg-gray-800 text-sm font-semibold text-gray-400 hover:text-white transition-all"
            >
              上一步
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-sm font-bold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              🚀 提交市场
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
