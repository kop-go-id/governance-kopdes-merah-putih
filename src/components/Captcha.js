'use client';
import { useEffect, useRef, useState } from 'react';

function generateCaptcha(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function Captcha({ onGenerate, refreshCount = 0 }) {
  const canvasRef = useRef(null);

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 250;
    canvas.height = 100;

    // Deteksi dark mode browser
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Background canvas
    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff'; // Tailwind: gray-800 or white
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Teks captcha
    ctx.font = 'bold 50px sans-serif';
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.fillText(text, 20, 70);

    // Grid garis halus
    ctx.strokeStyle = isDark ? '#444' : '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let x = 0.5; x < canvas.width; x += 10) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0.5; y < canvas.height; y += 10) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
  };

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    drawCaptcha(newCaptcha);
    onGenerate?.(newCaptcha);
  };

  useEffect(() => {
   refreshCaptcha();
  }, []);

  useEffect(() => {
    if (refreshCount > 0) {
      refreshCaptcha();
    }
  }, [refreshCount]);

  return (
    <div className="flex flex-row w-max items-center border border-primary rounded-md bg-white dark:bg-gray-800 m-auto">
      <canvas ref={canvasRef} className="h-[70px] px-2" />
      <div
        className="px-3 border-l border-primary text-2xl text-black dark:text-white cursor-pointer hover:text-primary"
        onClick={refreshCaptcha}
      >
        &#x21bb;
      </div>
    </div>
  );
}
