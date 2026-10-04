import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

/**
 * 페이지 맨 아래 전환 유도 섹션 — 전화상담 · 무료 상담 신청 두 버튼으로 보낸다.
 * 혜택 탭과 가격 탭이 같이 쓴다 (제목·설명만 바꿔 넘긴다. 안 넘기면 혜택 탭 문구가 나온다).
 * 메인 마지막 CTA(파란 띠 + 흰 글씨)의 색을 뒤집은 모양이다 — 흰 바탕에 검은 글씨·하늘색 버튼,
 * 오른쪽 아래 장식 원도 옅은 하늘색으로 그대로 둔다.
 * 아래 푸터도 흰 바탕이라, 맨 아래에 가는 선을 그어 푸터와 나눈다.
 */
export default function ServiceCTA({
  title = "지금 바로 시작하세요",
  sub = (
    <>
      무료 상담으로 제작 방향과 비용을 확인하고,
      <br className="svc-cta__br" /> 찾아오는 고객을 늘려보세요.
    </>
  ),
}: {
  title?: string;
  /** 제목 아래 설명 — 좁은 화면에서만 줄을 바꾸려면 <br className="svc-cta__br" /> 를 넣는다 */
  sub?: ReactNode;
}) {
  return (
    <section className="svc-cta">
      {/* 장식 원 */}
      <span aria-hidden className="svc-cta__dot svc-cta__dot--lg" />
      <span aria-hidden className="svc-cta__dot svc-cta__dot--sm" />

      <Reveal variant="zoom" className="svc-cta__in">
        <p className="svc-cta__eyebrow">GET STARTED</p>
        <h2 className="svc-cta__title">{title}</h2>
        <p className="svc-cta__sub">{sub}</p>

        {/* CTA 버튼 */}
        <div className="svc-cta__btns">
          <a href="tel:010-2971-7280" className="svc-cta__btn">
            전화 상담하기 <ArrowRight size={18} strokeWidth={2.5} />
          </a>
          <Link href="/diagnosis" className="svc-cta__btn svc-cta__btn--solid">
            무료 상담 신청 <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </Reveal>

      <style>{`
        .svc-cta {
          position: relative;
          overflow: hidden;
          background: #fff;
          padding: clamp(4rem, 9vw, 7rem) 1.25rem;
          border-bottom: 1px solid #e3e5e8;
          text-align: center;
        }
        /* 장식 원 — 파란 띠일 때는 어두운 원이었던 것을, 흰 바탕에서는 옅은 하늘색 원으로 */
        .svc-cta__dot { position: absolute; border-radius: 9999px; background: rgba(106, 146, 215, 0.14); }
        .svc-cta__dot--lg { right: -80px; bottom: -120px; width: 320px; height: 320px; }
        .svc-cta__dot--sm { right: 40px; bottom: -60px; width: 180px; height: 180px; }
        .svc-cta__in { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
        .svc-cta__eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .svc-cta__title {
          margin: 0;
          color: #111;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          word-break: keep-all;
        }
        .svc-cta__sub {
          margin: 1rem 0 0;
          color: #5c6066;
          font-size: clamp(1.05rem, 2.2vw, 1.3rem);
          line-height: 1.7;
          word-break: keep-all;
        }
        .svc-cta__btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: clamp(2rem, 5vw, 3rem);
        }
        /* 버튼 — 기본은 하늘색 테두리, --solid 는 하늘색 채움에 흰 글씨.
           페이지의 다른 강조색(#3f8fe0)으로 맞춰 봤는데 너무 진해서, 한 톤 부드러운 하늘색(--accent)을 쓴다 */
        .svc-cta__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--accent);
          font-size: 1.1rem;
          font-weight: 700;
          background: rgba(106, 146, 215, 0.08);
          border: 1.5px solid var(--accent);
          border-radius: 9999px;
          padding: 0.95rem 2.2rem;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
        }
        .svc-cta__btn:hover { background: rgba(106, 146, 215, 0.18); }
        .svc-cta__btn:active { transform: scale(0.97); }
        .svc-cta__btn--solid {
          background: var(--accent);
          color: #fff;
          box-shadow: 0 10px 24px rgba(106, 146, 215, 0.35);
        }
        .svc-cta__btn--solid:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
        @media (max-width: 480px) {
          .svc-cta__btns { flex-direction: column; align-items: stretch; }
          .svc-cta__btn { justify-content: center; }
        }

        /* 좁은 화면에서만 줄바꿈 */
        .svc-cta__br { display: none; }
        @media (max-width: 560px) {
          .svc-cta__br { display: inline; }
        }
      `}</style>
    </section>
  );
}
