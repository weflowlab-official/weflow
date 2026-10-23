"use client";
// 화면에 들어오면 data-in="true" 를 붙이는 감싸개 (weflowlab.kr/clinic-blog 의 InView 와 같은 방식).
// 안쪽 요소는 Tailwind 그룹 변형으로 등장 효과를 건다: group-data-[in=true]/inview:opacity-100 등.
// 순서는 각 요소의 transitionDelay(인라인 style)로 늦춘다. 한 번 붙으면 떼지 않는다 (다시 스크롤할 때 사라졌다 나타나면 산만하다).
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = { className?: string; threshold?: number; children: ReactNode };

export function InView({ className = "", threshold = 0.35, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} data-in={inView ? "true" : "false"} className={`group/inview ${className}`}>
      {children}
    </div>
  );
}
