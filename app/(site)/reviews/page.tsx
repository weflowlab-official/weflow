// /reviews — 고객 인터뷰 페이지. 내용은 전부 ReviewsExplorer 가 그린다.
import type { Metadata } from 'next'
import ReviewsExplorer from '@/components/reviews/ReviewsExplorer'
import { reviews } from '@/data/reviews'

export const metadata: Metadata = {
  title: '제작 사례 인터뷰 & 후기 · WEFLOW',
  description: 'WEFLOW와 함께한 분들이 직접 남겨주신 후기와 인터뷰입니다.',
  alternates: { canonical: '/reviews' },
}

/**
 * 실제로 화면에 보이는 후기를 그대로 구조화해 내보낸다.
 * 별점·건수는 data/reviews.ts 에서 계산한다 — 손으로 적어두면 후기가 늘 때 어긋나고,
 * 화면에 없는 후기를 표시로만 넣으면 검색엔진이 스팸으로 본다.
 */
const ratingValue =
  Math.round((reviews.reduce((sum, r) => sum + r.star, 0) / reviews.length) * 10) / 10

const REVIEWS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'WEFLOW',
  alternateName: '위플로우',
  url: 'https://weflowlab.kr',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  },
  review: reviews.map(r => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.name },
    itemReviewed: { '@type': 'WebSite', name: r.site, url: r.siteUrl },
    reviewRating: { '@type': 'Rating', ratingValue: r.star, bestRating: 5, worstRating: 1 },
    reviewBody: r.paragraphs.join(' '),
  })),
}

export default function ReviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(REVIEWS_JSON_LD) }}
      />
      <ReviewsExplorer />
    </>
  )
}