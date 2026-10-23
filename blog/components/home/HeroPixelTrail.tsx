"use client";
// 히어로 배경의 픽셀 흔적: 마우스 주변 칸이 진한 파랑→밝은 파랑 그라데이션 네모로 켜졌다가 서서히 사라진다.
// 히어로 섹션 안에서만 움직임을 듣고, 캔버스는 클릭을 가로채지 않는다(pointer-events-none).
// 마우스가 있는 기기에서만 켠다 (터치 기기·'동작 줄이기' 설정이면 아무것도 그리지 않는다).
// 다 사라지면 그리기를 멈춰, 가만히 있을 때는 CPU 를 쓰지 않는다.
import { useEffect, useRef } from "react";

const CELL = 28; // 픽셀 한 칸 크기(px)
const RADIUS = 1.6; // 마우스 둘레 몇 칸까지 켤지
const DECAY = 0.81; // 프레임마다 남는 밝기 비율 (작을수록 빨리 사라짐). 0.81 이면 약 0.3초 안에 사라진다
const MAX_ALPHA = 0.75; // 가장 진할 때 불투명도

// 그라데이션 양 끝 색: 진한 브랜드 파랑(--brand-primary) → 밝은 파랑 (보라 기 없이 파랑 계열로만)
const FROM = [27, 78, 167];
const TO = [47, 128, 255];

export function HeroPixelTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const box = canvas?.parentElement;
    const section = canvas?.closest("section");
    if (!canvas || !box || !section) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let cells = new Float32Array(0);
    let raf = 0;
    let running = false;

    const resize = () => {
      const r = box.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      cols = Math.ceil(r.width / CELL);
      rows = Math.ceil(r.height / CELL);
      cells = new Float32Array(cols * rows);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cols * CELL, rows * CELL);
      let alive = false;
      for (let i = 0; i < cells.length; i++) {
        const v = cells[i];
        if (v < 0.02) {
          cells[i] = 0;
          continue;
        }
        alive = true;
        const x = i % cols;
        const y = (i - x) / cols;
        // 화면 왼쪽 위 → 오른쪽 아래로 진한 파랑에서 밝은 파랑으로
        const t = Math.min(1, (x / cols) * 0.7 + (y / rows) * 0.3);
        const c = FROM.map((f, k) => Math.round(f + (TO[k] - f) * t));
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${(v * MAX_ALPHA).toFixed(3)})`;
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        cells[i] = v * DECAY;
      }
      if (alive) raf = requestAnimationFrame(draw);
      else running = false;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = box.getBoundingClientRect();
      const cx = Math.floor((e.clientX - r.left) / CELL);
      const cy = Math.floor((e.clientY - r.top) / CELL);
      const R = Math.ceil(RADIUS);
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const d = Math.hypot(dx, dy);
          if (d > RADIUS) continue;
          const near = 1 - d / RADIUS;
          // 가장자리로 갈수록 듬성듬성 켜서 픽셀이 흩어지는 느낌
          if (Math.random() > near + 0.15) continue;
          const i = y * cols + x;
          cells[i] = Math.max(cells[i], near * (0.6 + Math.random() * 0.4));
        }
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    section.addEventListener("pointermove", onMove);
    return () => {
      ro.disconnect();
      section.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[5] size-full" />;
}
