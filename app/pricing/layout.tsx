// /pricing 전용 메타데이터 (page.tsx가 'use client'라 여기서 정의한다)
import type { Metadata } from 'next'
import { makePlans } from '@/data/pricing'

/**
 * 검색 결과에 붙는 설명.
 *
 * 짧으면 네이버가 이 문장을 버리고 본문에서 아무 데나 긁어 온다 — 화면의 항목 이름들이
 * 세미콜론으로 이어 붙은 채 나오기도 한다. 그대로 쓰이는 /difference 가 88자라 그 수준으로 맞춘다.
 *
 * 최저가는 data/pricing.ts 에서 뽑는다. 금액을 고칠 때 여기만 옛날 값으로 남지 않도록.
 */
// 금액 문자열에는 "~"가 붙어 있다("690,000원~") — 아래 문장은 "…부터"로 이어지므로 떼고 쓴다
const LOWEST_PRICE = makePlans[0].price.replace('~', '')

export const metadata: Metadata = {
  title: '제작 플랜 · 가격 안내 · WEFLOW',
  description:
    `원페이지형 LANDING ${LOWEST_PRICE}부터 풀패키지 SIGNATURE까지, 제작 플랜별 구성과 가격을 한눈에 비교하세요. 모든 플랜에 서버·보안 관리, 정기 점검, 수정, 장애 대응 등을 맡는 월 운영관리가 포함됩니다.`,
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: '제작 플랜 · 가격 안내 · WEFLOW',
    description:
      '원페이지형 LANDING부터 풀패키지 SIGNATURE까지, WEFLOW의 제작 플랜별 구성과 가격을 확인하세요.',
    url: '/pricing',
    // openGraph 를 정의하면 루트의 것을 통째로 덮어쓴다 — 이미지도 여기서 다시 지정해야 한다
    images: [{ url: '/images/og/pricing.jpg', width: 1200, height: 630 }],
  },
}

/** "390,000원" → 390000. 표시용 문자열 하나만 고치면 아래 구조화 데이터도 같이 따라오게 한다 */
const won = (s: string) => Number(s.replace(/[^0-9]/g, ''))

// 금액이 미확정인 플랜("가격 협의" 등)은 숫자가 안 나오므로 걸러낸다 —
// 전부 미확정이면 구조화 데이터에 금액을 아예 싣지 않는다
const prices = makePlans.map(p => won(p.price)).filter(n => Number.isFinite(n) && n > 0)

/**
 * 제작 플랜을 검색엔진·AI 답변엔진이 읽을 수 있는 형태로 내보낸다.
 * "홈페이지 제작 얼마인가요" 같은 질문에 금액과 구성이 그대로 인용되도록,
 * 화면에 보이는 값(data/pricing.ts)에서 직접 만들어 쓴다 — 따로 적어두면 어긋난다.
 */
const PRICING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '홈페이지 제작',
  serviceType: '홈페이지 제작',
  description:
    'WEFLOW의 홈페이지 제작 플랜. LANDING(원페이지형)·BRAND(브랜드형)·SIGNATURE(풀패키지) 세 가지로 나뉘며, 모든 플랜에 월 운영관리(서버·보안 관리, 정기 점검, 수정, 장애 대응 등)가 들어 있다. 모든 금액은 VAT 별도.',
  provider: {
    '@type': 'ProfessionalService',
    name: 'WEFLOW',
    alternateName: '위플로우',
    url: 'https://weflowlab.kr',
  },
  areaServed: { '@type': 'Country', name: '대한민국' },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'KRW',
    ...(prices.length > 0 ? { lowPrice: Math.min(...prices), highPrice: Math.max(...prices) } : {}),
    offerCount: makePlans.length,
    offers: makePlans.map(p => ({
      '@type': 'Offer',
      name: `${p.sub} (${p.tagline})`,
      category: '홈페이지 제작',
      // 아래 priceSpecification 에 실금액이 들어가므로, 설명 글도 화면 카드에 찍힌 것과 같은 말을 한다 —
      // 카드의 구성 목록과 가격 아래 단서 줄(VAT 별도)을 그대로 옮긴다
      description: [p.features.join(' · '), p.note.join(' · ')].join(' / '),
      url: 'https://weflowlab.kr/pricing',
      availability: 'https://schema.org/InStock',
      ...(Number.isFinite(won(p.price)) && won(p.price) > 0
        ? {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: won(p.price),
              priceCurrency: 'KRW',
              valueAddedTaxIncluded: false,
            },
          }
        : {}),
    })),
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_JSON_LD) }}
      />
      {children}
    </>
  )
}