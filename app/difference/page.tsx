// /difference — 왜 WEFLOW? 페이지.
// 템플릿 방식 제작 업체와 WEFLOW가 어떻게 다른지를 설명한다.
// 별도 도입부(h1 배너) 없이 바로 "그 기능은 안 됩니다"라는 공감 질문(h1)으로 시작해
// 템플릿이란 → 최신 기술이란 → 실제 화면 → 걱정 비교 → 관리자 페이지 → 상담 CTA 순으로 흐른다.
//
// 페이지가 거절("안 됩니다")로 열려 초대("원하시는 그대로 만듭니다")로 닫히는 구조다.
// 중간의 사이트 점검 배너는 유일한 중간 전환 지점 — 번호 없는 삽입물로 둔다.
import type { Metadata } from 'next'
import DiffHook from '@/components/difference/DiffHook'
import DiffTemplate from '@/components/difference/DiffTemplate'
import DiffCheckBand from '@/components/difference/DiffCheckBand'
import DiffModern from '@/components/difference/DiffModern'
import DiffGallery from '@/components/difference/DiffGallery'
import DiffWorries from '@/components/difference/DiffWorries'
import DiffAdmin from '@/components/difference/DiffAdmin'
import DiffPromise from '@/components/difference/DiffPromise'
import DiffCTA from '@/components/difference/DiffCTA'

export const metadata: Metadata = {
  title: '왜 WEFLOW? · WEFLOW',
  description:
    '자동 계산기·스마트스토어 연동을 요청했다가 “안 됩니다”라는 답을 들으셨나요? 템플릿 제작 업체와 최신 기술로 직접 만드는 WEFLOW의 차이를 정리했습니다.',
  alternates: { canonical: '/difference' },
  openGraph: {
    title: '왜 WEFLOW? · WEFLOW',
    description:
      '템플릿 제작 업체와 최신 기술로 직접 만드는 WEFLOW, 무엇이 다른지 짧게 정리했습니다.',
    url: '/difference',
  },
}

export default function DifferencePage() {
  return (
    <>
      <DiffHook />
      <DiffTemplate />
      {/* 02 를 막 읽어 "그럼 내 사이트는?" 이 가장 세게 떠오르는 자리 */}
      <DiffCheckBand />
      <DiffModern />
      <DiffGallery />
      <DiffWorries />
      {/* 01 의 "그 기능은 안 됩니다" 를 회수하는 자리 */}
      <DiffAdmin />
      {/* 05 가 기술 걱정을 풀었다면 여기는 사람 걱정 — 연락처를 여쭙기 직전에 둔다 */}
      <DiffPromise />
      <DiffCTA />
    </>
  )
}
