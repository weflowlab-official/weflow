import type { ReactNode } from 'react'
import { ArrowUp, Crown, Star } from 'lucide-react'
import ScrollPhotoList from '@/components/ScrollPhotoList'

type Point = {
  order: string
  title: string
  stat: string
  desc: ReactNode
  source: string
}

// 홈페이지가 필요한 이유 6가지 — 항목마다 통계 숫자 + 설명 + 출처
const POINTS: Point[] = [
  {
    order: '첫째',
    title: '홈페이지로 유입되는 순간, 고객 DB 확보',
    stat: '99.9%',
    desc: (
      <>
        카톡·SNS 폼보다 요청사항까지 남기고 들어와, <br /><strong>니즈가 명확한 고객</strong>이 데이터로 남습니다.
        <br />
        유입되는 순간부터 기록돼, 명확한 고객 DB 유입량이 늘어납니다.
      </>
    ),
    source: '* WEFLOW 관리자 페이지에서 문의·예약·통계 기본 제공',
  },
  {
    order: '둘째',
    title: 'SNS(네이버·인스타 등) 유입만으로는 부족',
    stat: '84%',
    desc: (
      <>
        SNS를 하지 말라는 게 아니에요.<br />내 <strong>홈페이지를 가진 상태</strong>로 SNS를 운영하라는 뜻입니다.
        <br />
        소비자의 <strong>84%</strong>가 소셜미디어보다 홈페이지를 더 신뢰하니,<br />함께 굴릴수록 광고·유입 효과가 커집니다.
      </>
    ),
    source: '출처: BusinessDasher, "Statistics About Website" (2026)',
  },
  {
    order: '셋째',
    title: 'SEO 상단 관리·상위 노출',
    stat: '50%',
    desc: (
      <>
        각 페이지별 <strong>고유 URL</strong>과 메타·구조화 정보를 최적화하면,<br />검색 결과에서 <strong>클릭률(CTR)이 20~80%</strong>까지 높아집니다.
        <br />
        노출 기회가 늘어 상위 노출과 유입 확대에 유리해집니다.
      </>
    ),
    source: '출처: Wellows (2026) 스키마마크업 리치 결과 CTR 분석',
  },
  {
    order: '넷째',
    title: '홈페이지로 이어지는 실제 매출',
    stat: '15~50%',
    desc: (
      <>
        웹사이트를 활용하면 매출이 <strong>15~50%</strong> 늘어납니다.
        <br />
        반대로 홈페이지가 없으면 소개로 찾아온 고객의 <strong>20~35%</strong>가 그대로 새어나갑니다.
      </>
    ),
    source: '출처: BusinessDasher (2026), LeadsAgent · Google 소비자 조사 인용',
  },
  {
    order: '다섯째',
    title: '고객이 먼저 찾는 홈페이지',
    stat: '81%',
    desc: (
      <>
        소비자의 <strong>81%</strong>가 구매 전 온라인으로 정보를 찾아봅니다.
        <br />
        홈페이지가 없으면 이 탐색 단계에서 선택지에조차 오르지 못합니다.
      </>
    ),
    source: '출처: BusinessDasher (2026) 웹사이트 통계',
  },
  {
    order: '여섯째',
    title: '전문성과 체계성의 증명',
    stat: '75%',
    desc: (
      <>
        목적에 맞게 구조화된 홈페이지는 그 자체로 <strong>전문성과 체계성</strong>을 보여줍니다.
        <br />
        실제로 소비자의 <strong>75%</strong>가 웹사이트 디자인으로 비즈니스의 신뢰도를 판단합니다.
      </>
    ),
    source: '출처: BusinessDasher (2026) "Statistics About Website"',
  },
]

// POINTS 순서와 1:1 매핑
const WHY_IMAGES = [
  '/images/main/main-why-01.webp',
  '/images/main/main-why-02.webp',
  '/images/main/main-why-03.webp',
  '/images/main/main-why-04.webp',
  '/images/main/main-why-05.webp',
  '/images/main/main-why-06.webp',
]

/**
 * "02 · 홈페이지가 필요한 이유" 섹션 — 통계 근거 6가지를 혜택 안내와 같은 방식으로 보여준다:
 * 왼쪽 사진이 붙어 따라오고, 오른쪽 항목을 스크롤하는 대로 사진이 바뀐다 (ScrollPhotoList).
 * 앞의 3개는 핵심으로 왕관·뱃지가 붙는다
 */
export default function WhatIsHomepageSection() {
  return (
    <section id="why-homepage" style={{ background: 'var(--section-a)', padding: 'clamp(2.25rem, 5vw, 4rem) 1.25rem' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', width: '100%' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <span className="footnote emphasized c-accent">02 · 홈페이지가 필요한 이유</span>
          {/* 별 5개 (배경 없이) */}
          <div aria-hidden="true" style={{ display: 'flex', gap: '1px', margin: '0.9rem 0 0.5rem' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={19} fill="#f5b301" color="#f5b301" strokeWidth={0} />
            ))}
          </div>
          <h2 className="title-1" style={{ marginTop: 0, textAlign: 'left', wordBreak: 'keep-all' }}>
            홈페이지가 <span className="c-accent tilt-hl tilt-hl-red">왜 필요할까요?</span>
          </h2>
        </div>

        <ScrollPhotoList
          items={POINTS.map((p, i) => ({
            key: p.order,
            img: WHY_IMAGES[i],
            alt: p.title,
            body: (
              <>
                <p className="spl-kicker">
                  {i < 3 && <Crown size={22} strokeWidth={2} color="#f5b301" fill="#f5b301" aria-hidden="true" />}
                  {p.order}
                  {i < 3 && <span className="spl-badge">핵심</span>}
                </p>
                <h3 className="spl-title">{p.title}</h3>
                <p className="spl-stat">
                  {p.stat}
                  {i >= 1 && <ArrowUp strokeWidth={2.6} aria-hidden="true" />}
                </p>
                <p className="spl-desc">{p.desc}</p>
                <p className="spl-source">{p.source}</p>
              </>
            ),
          }))}
        />
      </div>
    </section>
  )
}
