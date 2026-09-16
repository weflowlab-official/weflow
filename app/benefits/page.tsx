// /benefits — WEFLOW 혜택 페이지.
// 도입부(h1) 아래에 메인에도 쓰이는 혜택 요약 섹션과 상세 설명을 이어 붙인다.
// BenefitsSection 은 메인에서도 쓰여 제목이 h2 라, 이 페이지의 h1 은 PageIntro 가 맡는다.
import type { Metadata } from 'next'
import PageIntro from '@/components/PageIntro'
import BenefitsSection from '@/components/home/BenefitsSection'
import BenefitDetails from '@/components/home/BenefitDetails'

/** 검색 결과와 카톡 미리보기에 함께 나가는 설명 — 한 군데서 고치면 둘 다 따라간다 */
const DESCRIPTION =
  '홈페이지는 만들고 나면 끝이 아닙니다. 통계 관리자 페이지, 1:1 관리 시스템, 상품별 전용 유지보수까지 제작과 함께 제공하는 것들을 정리했습니다.'

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
        title={
          <>
            만들고 끝이 아니라,{" "}
            <br className="br-mobile" />
            <span className="c-accent">계속 함께합니다</span>
          </>
        }
        body={
          <>
            제작 이후에도 운영 관리를 이어갑니다.
            <br />
            WEFLOW가 기본으로 챙기는 것들을 정리했습니다.
          </>
        }
        ctaLabel="혜택 신청하기 →"
      />
      <BenefitsSection />
      <BenefitDetails />
    </>
  )
}
