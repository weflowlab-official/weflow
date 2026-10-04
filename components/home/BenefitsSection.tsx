import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

// 혜택 카드 2개 (번호 리본 · 3D 아이콘 · 설명) — '제휴 마케팅 연결'은 내렸다
const BENEFITS = [
  {
    no: "혜택 01",
    icon: "/images/main/main-benefit-02.webp",
    title: ["확실한", "고객 DB 확보"],
    desc: "문의·예약을 통계로\n관리하는 나만의 관리자 페이지",
  },
  {
    no: "혜택 02",
    icon: "/images/main/main-benefit-03.webp",
    title: ["50% 특가", "특별 프로모션"],
    desc: "전상품 50% 할인\n도메인 제공  • 정기 유지보수",
  },
];

/**
 * WEFLOW만의 혜택 섹션 (#benefits) — 검은 바탕에 혜택 카드 2개 + 하단 신청 CTA.
 * 머리말 모양은 혜택 탭 공용 스타일(.svc-*, app/benefits/page.tsx)을 쓴다.
 */
export default function BenefitsSection() {
  return (
    <section id="benefits" className="svc-section svc-section--dark">
      <div className="svc-inner">
        <Reveal as="header" variant="up" className="svc-head">
          <p className="svc-eyebrow">SPECIAL BENEFITS</p>
          <h2 className="svc-title">
            지금 시작하면, <br className="br-mobile" />
            <span className="svc-hl">2가지 혜택</span>을 한 번에
          </h2>
          <p className="bn-lead">
            50% 프로모션부터 도메인·유지보수, 관리자 페이지까지 — WEFLOW가 한
            번에 챙겨드립니다.
          </p>
        </Reveal>

        {/* 혜택 카드 2개 */}
        <Reveal as="div" stagger className="bn-grid">
          {BENEFITS.map((b) => (
            <div key={b.no} className="bn-card">
              {/* 번호 북마크 리본 */}
              <span className="bn-ribbon" aria-label={b.no}>
                <span>{b.no}</span>
              </span>
              <div className="bn-icon">
                <Image
                  src={b.icon}
                  alt={b.title.join(" ")}
                  fill
                  sizes="110px"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3>
                {b.title[0]}
                <br />
                {b.title[1]}
              </h3>
              <p>{b.desc}</p>
              <Link href="/pricing" className="bn-more">
                자세히 보기 ›
              </Link>
            </div>
          ))}
        </Reveal>

        {/* 안내 + CTA */}
        <Reveal variant="up" className="bn-foot">
          <p>
            * 프로모션은 선착순으로 조기 마감될 수 있습니다.{" "}
            <br className="br-mobile" />
            지금 부담 없이 시작하세요!
          </p>
          <Link href="/diagnosis" className="bn-cta">
            혜택 신청하기
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>

      <style>{`
        .bn-lead {
          margin: clamp(1.1rem, 2.4vw, 1.6rem) auto 0;
          max-width: 40rem;
          font-size: clamp(0.98rem, 1.5vw, 1.15rem);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.66);
          word-break: keep-all;
        }
        /* 2장이라 카드가 너무 넓어지지 않게 전체 폭을 좁혀 가운데에 둔다 */
        .bn-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
          max-width: 860px;
          margin: 0 auto;
        }
        .bn-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: clamp(1.75rem, 3.4vw, 2.5rem);
          border-radius: clamp(18px, 2.2vw, 28px);
          background: #1a1b1f;
        }
        .bn-ribbon {
          position: absolute;
          top: -6px;
          right: 20px;
          width: 104px;
          height: 84px;
          background: url('/images/3d-icon/bookmark.svg') top center / contain no-repeat;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 16px;
        }
        .bn-ribbon span { font-size: 1.15rem; font-weight: 700; color: #212126; }
        .bn-icon { position: relative; width: 110px; height: 110px; margin: 0.5rem 0 1.25rem; }
        .bn-card h3 {
          margin: 0;
          color: #fff;
          font-size: clamp(1.35rem, 2.6vw, 1.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .bn-card p {
          margin: 0.7rem 0 1.5rem;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.66);
          white-space: pre-line;
          word-break: keep-all;
        }
        .bn-more {
          margin-top: auto;
          color: #9fd0ff;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s;
        }
        .bn-more:hover { color: #fff; }

        .bn-foot { text-align: center; margin-top: clamp(1.75rem, 4vw, 2.5rem); }
        .bn-foot p {
          margin: 0 0 1.5rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.66);
          word-break: keep-all;
        }
        /* 흰 알약 버튼 — 마우스를 올리면 테두리만 남는다 */
        .bn-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 1rem 1.9rem;
          border: 1.5px solid #fff;
          border-radius: 9999px;
          background: #fff;
          color: #111;
          font-size: 1.05rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .bn-cta:hover { background: transparent; color: #fff; }
        .bn-cta svg { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .bn-cta:hover svg { transform: translateX(4px); }

        @media (max-width: 640px) {
          .bn-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
