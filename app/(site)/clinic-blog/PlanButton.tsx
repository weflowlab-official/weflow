'use client'
import { ArrowRight } from 'lucide-react'

/** 상품 카드의 '이 구성으로 상담 신청' — 상담 폼으로 내려가면서 문의 유형을 미리 골라 둔다 (InquiryForm 이 'cb:plan' 을 듣는다) */
export const PLAN_EVENT = 'cb:plan'

export default function PlanButton({ plan, fill }: { plan: string; fill?: boolean }) {
  return (
    <a
      href="#contact-form"
      className={`ch-plan-btn${fill ? ' ch-plan-btn--fill' : ''}`}
      onClick={() => window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan }))}
    >
      이 구성으로 견적 신청 <ArrowRight size={17} />
    </a>
  )
}
