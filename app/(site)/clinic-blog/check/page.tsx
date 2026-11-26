import type { Metadata } from 'next'
import ClinicHeader from '../ClinicHeader'
import ClinicFooter from '../ClinicFooter'
import { CLINIC_BASE_CSS, SCENE_CSS } from '../base-css'
import CheckClient from './CheckClient'

/**
 * 병의원 홈페이지 무료 진단 — /clinic-blog/check
 *
 * 병의원 랜딩(/clinic-blog)의 히어로 왼쪽 버튼과 메뉴 '무료 체험'에서 새 탭으로 열린다.
 * 여기는 점검만 한다 — 주소 입력 → 결과(첫 카드만 열림) → 연락처 → 상담. 리뉴얼해야 하는 이유는 랜딩의 '왜 WEFLOW?' 섹션이 맡는다.
 * 진단은 메인 사이트 점검(/check)과 같은 API(/api/diagnose)를 mode: 'clinic' 으로 불러 제작 기술·보안과 AI 검색 준비도까지 여섯 가지를 본다.
 * 랜딩과 같은 헤더·푸터를 붙여, 메뉴와 견적 버튼이 랜딩의 각 섹션으로 돌아가게 한다 (base="/clinic-blog").
 */

export const metadata: Metadata = {
  title: '병원 홈페이지 무료 진단 · WEFLOW',
  description:
    '우리 병원 홈페이지, 지금 몇 점일까요? 주소만 넣으면 제작 기술 및 보안부터 AI 검색 준비도(AEO·GEO), 검색 노출(SEO), 속도까지 무료로 바로 진단해 드립니다.',
  keywords: '병원 홈페이지 진단, 사이트 무료 진단, 홈페이지 점검, SEO 진단, AEO, GEO, AI 검색 준비도, 홈페이지 속도 측정, 홈페이지 보안 점검, 웹블로그, 웹사이트 제작, 홈페이지 검수, 웹사이트 검수, 위플로우, WEFLOW', // 웹블로그 ~ 웹사이트 검수 넷은 광고 담당자가 잡은 광고 메인 키워드 (2026-11-26)
  alternates: { canonical: '/clinic-blog/check' },
  openGraph: {
    title: '병원 홈페이지 무료 진단 · WEFLOW',
    description: '주소만 넣으면 제작 기술 및 보안부터 AI 검색 준비도까지 바로 진단해 드립니다.',
    url: '/clinic-blog/check',
    images: [{ url: '/images/main/og-logo-2.jpg', width: 1200, height: 630 }],
  },
}

export default function ClinicCheckPage() {
  return (
    <div className="cb ckc-page">
      <ClinicHeader base="/clinic-blog" />
      <main className="ckc-main">
        <CheckClient />
      </main>
      <ClinicFooter bar={false} />
      <style>{CLINIC_BASE_CSS + SCENE_CSS + `
        /* 내용이 짧아도 푸터는 화면 맨 아래에 붙인다 */
        .ckc-page { display: flex; flex-direction: column; }
        .ckc-main { flex: 1; }
      `}</style>
    </div>
  )
}
