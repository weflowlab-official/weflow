"use client";
// 상품 카드의 '이걸로 상담받기' 버튼: 맨 아래 견적 폼(#contact)으로 부드럽게 내려가면서 폼의 문의 유형을 미리 골라 둔다.
// 폼(InquiryForm)은 PLAN_EVENT 를 듣고 있다. weflowlab.kr/clinic-blog 의 PlanButton 과 같은 방식.
import type { ReactNode } from "react";

export const PLAN_EVENT = "blog-plan-select";

type Props = { plan: string; className?: string; children: ReactNode };

export function PlanButton({ plan, className = "", children }: Props) {
  const onClick = () => {
    window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan }));
    const target = document.getElementById("contact");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#contact");
  };
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
