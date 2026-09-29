import React, { useEffect, useRef } from 'react';

/**
 * High Performance Hardware-Accelerated Cursor Glow
 * - Disabled automatically on touch screens / mobile devices (0 overhead)
 * - Directly mutates transform via requestAnimationFrame (0 React re-renders, 120fps smooth)
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop devices with fine pointer (mouse)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const glowEl = glowRef.current;
    if (!glowEl) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHovering = false;
    let rafId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(renderLoop);
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      isHovering = !!(
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      );
    };

    const renderLoop = () => {
      // Smooth linear interpolation for buttery cursor glide
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;

      const scale = isHovering ? 1.5 : 1;
      const opacity = isHovering ? '0.8' : '0.4';

      glowEl.style.transform = `translate3d(${currentX - 16}px, ${currentY - 16}px, 0) scale(${scale})`;
      glowEl.style.opacity = opacity;

      // Keep rendering until stabilized
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        rafId = requestAnimationFrame(renderLoop);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // If touch device, render nothing
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen transition-opacity duration-200"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform, opacity',
      }}
    >
      <div className="w-full h-full bg-[#00E5FF] rounded-full blur-[10px]" />
    </div>
  );
}
