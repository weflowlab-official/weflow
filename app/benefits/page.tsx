// /benefits — WEFLOW 혜택 페이지.
// 서비스 안내 탭(/service)은 내용이 겹쳐 이 탭으로 합쳤다 — 그 주소는 여기로 넘어온다 (next.config.js).
// 메인과 같은 형식으로 그린다 — 흰 바탕, 영문 머리표 + 굵은 제목, 테두리 없는 카드.
// 인트로 → 혜택 상세(흰) → 제작 진행과정(검정) → CTA(파랑) 순으로 쌓는다.
// 제작 진행과정부터 아래는 서비스 안내 탭에 있던 섹션이다.
// (혜택 카드 BenefitsSection · 강점 카드 ServiceFeatures · 타 서비스 전환 ServiceSwitch 섹션은 내렸다 — 파일은 그대로 있다.
//  강점 카드는 혜택 상세와 겹쳐서, 거기에만 있던 항목을 혜택 상세로 옮기고 내렸다)
// 섹션들이 같이 쓰는 모양(.svc-*)은 맨 아래 <style> 블록에 한 번만 싣는다.
import type { Metadata } from 'next'
import PageIntro from '@/components/PageIntro'
import BenefitDetails from '@/components/home/BenefitDetails'
import ServiceSteps from '@/components/service/ServiceSteps'
import ServiceCTA from '@/components/service/ServiceCTA'

/** 검색 결과와 카톡 미리보기에 함께 나가는 설명 — 한 군데서 고치면 둘 다 따라간다 */
const DESCRIPTION =
  '홈페이지는 만들고 나면 끝이 아닙니다. 통계 관리자 페이지, 1:1 관리 시스템, 상품별 전용 유지보수까지 제작과 함께 제공하는 것들과 다섯 단계 제작 과정을 정리했습니다.'

export const metadata: Metadata = {
  title: 'WEFLOW 혜택 · WEFLOW',
  // 짧으면 네이버가 버리고 본문을 긁어 온다 — 그대로 쓰이는 /difference(88자) 수준으로 맞춘다
  description: DESCRIPTION,
  alternates: { canonical: '/benefits' },
  // 네이버가 이 페이지 설명만 본문에서 긁어 왔다 — 혜택 카드 제목이 세미콜론으로
  // 이어 붙은 채로 나온다. og 를 둔 /difference 는 적어 둔 문장이 그대로 쓰이므로
  // 여기도 og:description 을 붙인다. 두 곳이 어긋나면 어느 쪽이 나갈지 알 수 없으니
  // 같은 상수를 쓴다.
  openGraph: {
    title: 'WEFLOW 혜택 · WEFLOW',
    description: DESCRIPTION,
    url: '/benefits',
    // 전용 og 그림이 아직 없다 — 루트와 같은 그림을 명시해 미리보기가 비지 않게 한다
    images: [{ url: '/images/main/og-logo-2.jpg', width: 1200, height: 630 }],
  },
}

export default function BenefitsPage() {
  return (
    <>
      <PageIntro
        eyebrow="BENEFITS"
        title={[{ text: '만들고 끝이 아니라,' }, { text: '계속 함께합니다', hl: true }]}
        body={
          <>
            제작 이후에도 운영 관리를 이어갑니다.
            <br />
            WEFLOW가 기본으로 챙기는 것들을 정리했습니다.
          </>
        }
        ctaLabel="혜택 신청하기 →"
      />
      <BenefitDetails />
      <ServiceSteps />
      <ServiceCTA />

      <style>{`
        /* ── 혜택 탭 공용 — 메인과 같은 규격 (흰 바탕 #fff · 글씨 #111 · 본문 회색 #5c6066 · 강조 파랑 #3f8fe0) ── */
        /* 흰 섹션이 연달아 오므로 여백은 아래쪽에만 둔다 (위아래 다 주면 사이가 두 배가 된다) */
        .svc-section {
          background: #fff;
          color: #111;
          padding: 0 1.5rem clamp(4.5rem, 10vw, 8.5rem);
        }
        .svc-inner { max-width: 1120px; margin: 0 auto; }

        /* 검은 바탕 — 바탕이 바뀌는 자리라 검은 섹션과 그 다음 섹션은 위 여백을 되살리고, 카드·글씨 색을 뒤집는다 */
        .svc-section--dark { background: #0e0e10; color: #fff; }
        .svc-section--dark,
        .svc-section--dark + .svc-section { padding-top: clamp(4.5rem, 10vw, 8.5rem); }
        .svc-section--dark .svc-title { color: #fff; }
        .svc-section--dark .svc-card { background: #1a1b1f; }
        .svc-section--dark .svc-card__photo { background: #24262b; }
        .svc-section--dark .svc-card__body h3 { color: #fff; }
        .svc-section--dark .svc-card__body p { color: rgba(255, 255, 255, 0.66); }

        /* 머리말 — 영문 머리표 + 굵은 제목 */
        .svc-head { text-align: center; margin-bottom: clamp(2.5rem, 6vw, 4.5rem); }
        .svc-eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .svc-title {
          margin: 0;
          color: #111;
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .svc-hl { color: #3f8fe0; }

        /* 사진 카드 — 사진이 위쪽을 가장자리까지 채우고, 아이콘 타일이 사진 아랫변에 반쯤 걸친다 */
        .svc-card {
          --svc-pad: clamp(1.25rem, 2vw, 1.6rem);
          border-radius: clamp(18px, 2.2vw, 28px);
          overflow: hidden;
          background: #f5f6f8;
        }
        .svc-card__photo {
          position: relative;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          background: #e9ebee;
        }
        /* 마우스를 올리면 사진이 조금 다가온다 */
        .svc-card__photo img { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .svc-card:hover .svc-card__photo img { transform: scale(1.05); }
        /* 아이콘 — 흰 타일 위에 파란색으로. 카드에 마우스를 올리면 타일이 하늘색으로 채워지며 살짝 기운다 */
        .svc-card__icon {
          position: relative;
          z-index: 1;
          width: 56px;
          height: 56px;
          margin: -28px 0 0 var(--svc-pad);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: #fff;
          color: #3f8fe0;
          box-shadow: 0 6px 16px rgba(17, 17, 17, 0.12);
          transition:
            background 0.25s,
            color 0.25s,
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .svc-card:hover .svc-card__icon { background: #a9d4ff; color: #12304f; transform: rotate(-6deg) scale(1.06); }
        .svc-card__body { padding: 1rem var(--svc-pad) var(--svc-pad); }
        .svc-card__body h3 {
          margin: 0;
          color: #111;
          font-size: clamp(1.05rem, 1.4vw, 1.2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.4;
          word-break: keep-all;
        }
        .svc-card__body p {
          margin: 0.6rem 0 0;
          font-size: clamp(0.92rem, 1.2vw, 1rem);
          line-height: 1.6;
          color: #5c6066;
          word-break: keep-all;
        }

        @media (max-width: 860px) {
          .svc-section { padding-left: 1.25rem; padding-right: 1.25rem; }
        }
      `}</style>
    </>
  )
}
