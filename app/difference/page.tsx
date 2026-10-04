// /difference — 왜 WEFLOW? 페이지.
// 템플릿 방식 제작 업체와 WEFLOW가 어떻게 다른지를 설명한다.
// 별도 도입부(h1 배너) 없이 바로 "그 기능은 안 됩니다"라는 공감 질문(h1)으로 시작해
// 템플릿이란 → 최신 기술이란 → 실제 화면 → 걱정 비교 → 관리자 페이지 → 상담 CTA 순으로 흐른다.
//
// 페이지가 거절("안 됩니다")로 열려 초대("원하시는 그대로 만듭니다")로 닫히는 구조다.
// 중간의 사이트 점검 배너는 유일한 중간 전환 지점 — 번호 없는 삽입물로 둔다.
//
// 메인과 같은 흰 바탕으로 그린다 — 섹션 파일은 그대로 두고, 감싸는 .diff-light 에서
// 색 변수만 밝은 값으로 덮어쓴다 (맨 아래 <style>). 금색과 파란 글씨는 건드리지 않는다.
// 맨 아래 CTA 만 감싸지 않아 검은 바탕으로 남는다 — 금색 버튼이 흰 바탕에서는 안 보인다.
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
    // 전용 og 그림이 아직 없다. 적지 않으면 루트 것까지 덮여 미리보기가 빈칸이 되므로
    // 루트와 같은 그림을 명시해 둔다 — 전용 그림이 생기면 이 줄만 갈아 끼우면 된다
    images: [{ url: '/images/main/og-logo-2.jpg', width: 1200, height: 630 }],
  },
}

export default function DifferencePage() {
  return (
    <>
      <div className="diff-light">
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
      </div>
      <DiffCTA />

      <style>{`
        /* ── 흰 바탕 — 메인과 같은 규격 (바탕 #fff · 글씨 #111 · 본문 회색 #5c6066 · 카드 #f5f6f8) ──
           안쪽 섹션들은 전부 색 변수로 그려져 있어서, 여기서 변수만 바꾸면 따라온다.
           --accent(파란 글씨)와 금색(.c-gold · 금테)은 손대지 않는다.
           섹션 바탕은 a·b 모두 흰색이다 — 메인처럼 색 대신 여백으로 섹션을 나눈다. */
        .diff-light {
          --bg: #fff;
          --section-a: #fff;
          --section-b: #fff;
          --surface: #f5f6f8;
          --surface-container: #eceef1;
          --surface-container-high: #e2e5e9;
          --text: #111;
          --text-secondary: #44474d;
          --text-muted: #5c6066;
          --border: #e3e5e8;
          --border-subtle: #eef0f2;
          --outline: #9aa0a8;
          --outline-variant: #cfd3d8;
          /* 배지·칩·아이콘 타일의 바탕 — 어두운 남색 면이던 것을 옅은 하늘색 면으로 */
          --accent-light: #e9f0fb;
          /* 파란 버튼 위 글씨 — 메인의 채운 버튼처럼 흰색 */
          --on-accent: #fff;
          /* 글씨색은 body 에서 이미 계산된 값이 내려오므로 여기서 다시 잡아 준다 */
          color: var(--text);
        }
      `}</style>
    </>
  )
}
