import Image from 'next/image'
import { Check, Sparkles, Star } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * 플랜 카드 한 장 — /pricing 의 제작 플랜·관리자 페이지 옵션·리뉴얼과
 * 메인페이지 가격 섹션이 모두 이 하나를 쓴다. 내용을 양쪽에서 똑같이 유지하려면
 * 카드를 복붙하지 않고 여기만 고쳐야 한다.
 *
 * 겉모습(.pricing-card 계열 CSS)은 페이지마다 자기 <style> 에서 정의한다 —
 * 같은 클래스명을 쓰되 테두리 두께·hover 처럼 페이지 성격에 맞는 차이는 남겨둔다.
 *
 * - discount 나 originalPrice 가 비면 할인 배지 줄을 통째로 접는다(금액 미확정 플랜용)
 * - highlight 는 테두리·별 태그·반짝이를 켜고, tone 은 그 강조색만 바꾼다
 *   (MASTER 는 파랑, 리뉴얼은 바이올렛 — 성격이 다른 상품이라 색으로 구분한다)
 * - cta 는 페이지마다 목적지와 서식이 달라 통째로 받는다
 */
export default function PlanCard({
  icon,
  title,
  subtitle,
  discount,
  originalPrice,
  price,
  foot,
  features,
  highlight = false,
  tone = 'accent',
  tagLabel = '가장 인기',
  cta,
}: {
  icon: string
  title: string
  subtitle: string
  discount?: string
  originalPrice?: string
  price: string
  /** 가격 아래 단서 줄 — 문자열 하나 또는 여러 줄 (예: ['VAT 별도', '월 유지보수 무제한']) */
  foot?: string | string[]
  features: string[]
  highlight?: boolean
  tone?: 'accent' | 'violet'
  tagLabel?: string
  cta: ReactNode
}) {
  // 문자열 하나로 넘어와도 배열로 맞춰 둔다 — 빈 배열이면 단서 줄 자체를 접는다
  const footLines = foot ? (Array.isArray(foot) ? foot : [foot]) : []

  return (
    <div
      className={`pricing-card${highlight ? ' is-highlight' : ''}${
        highlight && tone === 'violet' ? ' is-violet' : ''
      }`}
    >
      {/* 강조 카드만 — 별 5개 태그 + 카드 안쪽 반짝이 */}
      {highlight && (
        <>
          <span className="pricing-tag" aria-label={tagLabel}>
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} size={16} fill="#ffd23f" strokeWidth={0} />
            ))}
          </span>
          <span className="hl-sparkle-layer" aria-hidden="true">
            <Sparkles className="hl-sparkle hl-sparkle-1" size={150} strokeWidth={1.25} />
            <Sparkles className="hl-sparkle hl-sparkle-2" size={110} strokeWidth={1.25} />
            <Sparkles className="hl-sparkle hl-sparkle-3" size={130} strokeWidth={1.25} />
          </span>
        </>
      )}

      {/* 상단: 아이콘 + 이름 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <Image
          src={icon}
          alt=""
          width={48}
          height={48}
          style={{ width: 48, height: 48, objectFit: 'contain' }}
        />
        <div>
          <h3 className="headline emphasized" style={{ margin: 0 }}>
            {title}
          </h3>
          <span className="caption-1 c-muted">{subtitle}</span>
        </div>
      </div>

      {/* 가격 — 아래 여백(1.25rem)은 단서 줄 아래, 즉 기능 목록과의 간격이다.
          단서 줄 위 여백(0.35rem)은 아래 foot 블록에 따로 있다. */}
      <div style={{ margin: '1.1rem 0 1.25rem' }}>
        {discount && originalPrice && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.35rem',
            }}
          >
            <span
              className="caption-1 emphasized c-accent"
              style={{
                background: 'var(--accent-light)',
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              {discount} 할인
            </span>
            <span className="footnote c-muted" style={{ textDecoration: 'line-through' }}>
              {originalPrice}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
          <span className="title-2 emphasized">{price}</span>
        </div>
        {/* 가격 아래 단서 줄 (월 유지보수 무제한 · VAT 별도).
            구분점은 데이터 쪽 문자열에 들어 있다 — 여기서 "· " 를 붙이면
            한 줄 안에서 점이 두 번 나와("· A · B") 목록인지 구분인지 흐려진다. */}
        {footLines.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
              // 위 여백은 가격 블록의 아래 여백(0.35rem)과 같게 맞춰 둔다
              margin: '0.35rem 0 0',
            }}
          >
            {footLines.map(line => (
              <p key={line} className="caption-1 c-muted" style={{ margin: 0 }}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* 기능 */}
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flex: 1,
        }}
      >
        {features.map(f => (
          <li key={f} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <Check
              size={16}
              strokeWidth={2.5}
              style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.15rem' }}
            />
            <span className="callout" style={{ wordBreak: 'keep-all' }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      {cta}
    </div>
  )
}
