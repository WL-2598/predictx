'use client';

import { useEffect, useRef } from 'react';

interface PricePoint {
  time: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
  color?: string;
  height?: number;
}

export default function PriceChart({ data, color = '#10b981', height = 200 }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 10, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices) - 2;
    const maxPrice = Math.max(...prices) + 2;
    const priceRange = maxPrice - minPrice;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (chartH / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Price labels
      const priceLabel = (maxPrice - (priceRange / gridCount) * i).toFixed(0);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(`${priceLabel}¢`, padding.left - 8, y + 3);
    }

    // Time labels
    ctx.textAlign = 'center';
    const timeLabels = 5;
    for (let i = 0; i < timeLabels; i++) {
      const idx = Math.floor((data.length - 1) * (i / (timeLabels - 1)));
      const x = padding.left + (chartW / (data.length - 1)) * idx;
      const date = new Date(data[idx].time);
      const label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
      ctx.fillText(label, x, h - 8);
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, color + '30');
    gradient.addColorStop(1, color + '00');

    // Draw area
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartH);
    data.forEach((d, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - ((d.price - minPrice) / priceRange) * chartH;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    data.forEach((d, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - ((d.price - minPrice) / priceRange) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw last point
    const lastPoint = data[data.length - 1];
    const lastX = padding.left + chartW;
    const lastY = padding.top + chartH - ((lastPoint.price - minPrice) / priceRange) * chartH;

    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.fillStyle = color + '30';
    ctx.fill();

  }, [data, color, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
}
