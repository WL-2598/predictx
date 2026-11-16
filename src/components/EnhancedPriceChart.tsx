'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface PricePoint {
  time: string;
  price: number;
}

interface EnhancedPriceChartProps {
  data: PricePoint[];
  color?: string;
  height?: number;
  secondaryData?: PricePoint[];
  secondaryColor?: string;
  labels?: [string, string];
}

export default function EnhancedPriceChart({
  data,
  color = '#10b981',
  height = 280,
  secondaryData,
  secondaryColor = '#ef4444',
  labels,
}: EnhancedPriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: PricePoint; price: number } | null>(null);
  const [timeframe, setTimeframe] = useState<'1H' | '6H' | '24H' | '7D'>('24H');
  const [containerWidth, setContainerWidth] = useState(0);

  // Get filtered data based on timeframe
  const filteredData = useCallback(() => {
    const now = Date.now();
    const cutoffs: Record<string, number> = {
      '1H': now - 3600000,
      '6H': now - 21600000,
      '24H': now - 86400000,
      '7D': now - 604800000,
    };
    const cutoff = cutoffs[timeframe] || cutoffs['24H'];
    return data.filter(d => new Date(d.time).getTime() >= cutoff);
  }, [data, timeframe]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(container);
    setContainerWidth(container.clientWidth);

    return () => observer.disconnect();
  }, []);

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0 || containerWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = containerWidth;
    const h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const padding = { top: 20, right: 12, bottom: 32, left: 44 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const chartData = filteredData();
    if (chartData.length < 2) return;

    const prices = chartData.map(d => d.price);
    if (secondaryData) {
      const secFiltered = secondaryData.filter(d => new Date(d.time).getTime() >= (Date.now() - ({ '1H': 3600000, '6H': 21600000, '24H': 86400000, '7D': 604800000 }[timeframe] || 86400000)));
      prices.push(...secFiltered.map(d => d.price));
    }
    const minPrice = Math.min(...prices) - 3;
    const maxPrice = Math.max(...prices) + 3;
    const priceRange = maxPrice - minPrice || 1;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (chartH / gridCount) * i;
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Price labels
      const priceLabel = (maxPrice - (priceRange / gridCount) * i).toFixed(0);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '10px -apple-system, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${priceLabel}¢`, padding.left - 8, y + 3);
    }

    // Time labels
    ctx.textAlign = 'center';
    const timeLabels = Math.min(6, chartData.length);
    for (let i = 0; i < timeLabels; i++) {
      const idx = Math.floor((chartData.length - 1) * (i / (timeLabels - 1)));
      const x = padding.left + (chartW / (chartData.length - 1)) * idx;
      const date = new Date(chartData[idx].time);
      let label: string;
      if (timeframe === '7D') {
        label = `${date.getMonth() + 1}/${date.getDate()}`;
      } else {
        label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      }
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillText(label, x, h - 8);
    }

    // Helper function to draw a line with area
    function drawLine(points: PricePoint[], lineColor: string, fillAlpha: number) {
      if (points.length < 2) return;

      // Gradient fill
      const gradient = ctx!.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, lineColor + Math.round(fillAlpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, lineColor + '00');

      // Draw area
      ctx!.beginPath();
      ctx!.moveTo(padding.left, padding.top + chartH);
      points.forEach((d, i) => {
        const x = padding.left + (chartW / (points.length - 1)) * i;
        const y = padding.top + chartH - ((d.price - minPrice) / priceRange) * chartH;
        ctx!.lineTo(x, y);
      });
      ctx!.lineTo(padding.left + chartW, padding.top + chartH);
      ctx!.closePath();
      ctx!.fillStyle = gradient;
      ctx!.fill();

      // Draw line
      ctx!.beginPath();
      ctx!.strokeStyle = lineColor;
      ctx!.lineWidth = 2;
      ctx!.lineJoin = 'round';
      ctx!.lineCap = 'round';
      points.forEach((d, i) => {
        const x = padding.left + (chartW / (points.length - 1)) * i;
        const y = padding.top + chartH - ((d.price - minPrice) / priceRange) * chartH;
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      });
      ctx!.stroke();

      // Draw last point with glow
      const lastPoint = points[points.length - 1];
      const lastX = padding.left + chartW;
      const lastY = padding.top + chartH - ((lastPoint.price - minPrice) / priceRange) * chartH;

      ctx!.beginPath();
      ctx!.arc(lastX, lastY, 7, 0, Math.PI * 2);
      ctx!.fillStyle = lineColor + '25';
      ctx!.fill();

      ctx!.beginPath();
      ctx!.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx!.fillStyle = lineColor;
      ctx!.fill();

      ctx!.beginPath();
      ctx!.arc(lastX, lastY, 2, 0, Math.PI * 2);
      ctx!.fillStyle = '#fff';
      ctx!.fill();
    }

    // Draw secondary line first (behind)
    if (secondaryData) {
      const secFiltered = secondaryData.filter(d => new Date(d.time).getTime() >= (Date.now() - ({ '1H': 3600000, '6H': 21600000, '24H': 86400000, '7D': 604800000 }[timeframe] || 86400000)));
      drawLine(secFiltered, secondaryColor, 0.08);
    }

    // Draw primary line
    drawLine(chartData, color, 0.15);

  }, [data, secondaryData, color, secondaryColor, height, containerWidth, filteredData, timeframe]);

  // Mouse move handler for crosshair
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const chartData = filteredData();

    const padding = { left: 44, right: 12 };
    const chartW = rect.width - padding.left - padding.right;

    if (x < padding.left || x > rect.width - padding.right) {
      setTooltip(null);
      return;
    }

    const ratio = (x - padding.left) / chartW;
    const idx = Math.round(ratio * (chartData.length - 1));
    const clampedIdx = Math.max(0, Math.min(chartData.length - 1, idx));
    const point = chartData[clampedIdx];

    if (point) {
      const prices = chartData.map(d => d.price);
      const minPrice = Math.min(...prices) - 3;
      const maxPrice = Math.max(...prices) + 3;
      const priceRange = maxPrice - minPrice || 1;
      const chartH = height - 20 - 32;
      const y = 20 + chartH - ((point.price - minPrice) / priceRange) * chartH;

      setTooltip({ x, y, point, price: point.price });
    }
  }, [data, filteredData, height]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const timeframes: Array<'1H' | '6H' | '24H' | '7D'> = ['1H', '6H', '24H', '7D'];

  const firstPrice = filteredData()[0]?.price || 0;
  const lastPrice = filteredData()[filteredData().length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

  return (
    <div ref={containerRef} className="w-full">
      {/* Timeframe selector + stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {labels && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-gray-400">{labels[0]}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                <span className="text-gray-400">{labels[1]}</span>
              </span>
            </div>
          )}
          {!labels && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tabular-nums">{lastPrice.toFixed(1)}¢</span>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                priceChange >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-1 p-0.5 rounded-lg bg-gray-800/40">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ height: `${height}px` }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Crosshair tooltip */}
        {tooltip && (
          <>
            {/* Vertical line */}
            <div
              className="absolute top-0 bottom-8 w-px bg-gray-500/30 pointer-events-none"
              style={{ left: tooltip.x }}
            />
            {/* Horizontal line */}
            <div
              className="absolute left-11 right-3 h-px bg-gray-500/30 pointer-events-none"
              style={{ top: tooltip.y }}
            />
            {/* Dot */}
            <div
              className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1.5 -translate-y-1.5"
              style={{ left: tooltip.x, top: tooltip.y, backgroundColor: color }}
            />
            {/* Tooltip box */}
            <div
              className="absolute z-10 px-2.5 py-1.5 rounded-lg bg-[#1a1f2e] border border-gray-700/60 shadow-xl pointer-events-none -translate-x-1/2"
              style={{ left: tooltip.x, top: tooltip.y - 44 }}
            >
              <p className="text-xs font-bold text-white tabular-nums">{tooltip.price.toFixed(1)}¢</p>
              <p className="text-[10px] text-gray-500">
                {new Date(tooltip.point.time).toLocaleString('zh-CN', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
