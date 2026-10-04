import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

// 실제 제작 사이트 화면 — 두 줄로 나눠 서로 반대 방향으로 흐른다
const ROW_A = [
  { src: "/images/cases/cases-ksmobility/cases-ksmobility-01.webp", alt: "특장맨 홈페이지 화면" },
  { src: "/images/cases/cases-atelier/cases-atelier-01.webp", alt: "커튼장인 홈페이지 화면" },
  { src: "/images/cases/cases-kpsc/cases-kpsc-01.webp", alt: "KPSC 홈페이지 화면" },
  { src: "/images/cases/cases-cambiocamp/cases-cambiocamp-01.webp", alt: "캠핑장 홈페이지 화면" },
];
const ROW_B = [
  { src: "/images/cases/cases-saedure/cases-saedure-01.webp", alt: "새두레 홈페이지 화면" },
  { src: "/images/cases/cases-parknara/cases-parknara-01.webp", alt: "컨설턴트 홈페이지 화면" },
  { src: "/images/cases/cases-leesiyeon/cases-leesiyeon-01.webp", alt: "설계사 홈페이지 화면" },
];

/** 한 줄 마퀴 — 같은 목록을 세 번 이어 붙여 넓은 화면에서도 끊김 없이 돈다. 마우스를 올리면 멈춘다. */
function MarqueeRow({ items, reverse = false }: { items: typeof ROW_A; reverse?: boolean }) {
  return (
    <div className="dg-marquee">
      <div className={`dg-track${reverse ? " reverse" : ""}`}>
        {[...items, ...items, ...items].map(({ src, alt }, i) => (
          <div key={`${src}-${i}`} className="dg-shot" aria-hidden={i >= items.length}>
            <Image
              src={src}
              alt={i < items.length ? alt : ""}
              fill
              sizes="(max-width: 768px) 80vw, 420px"
              style={{ objectFit: "cover", objectPosition: "top" }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 04 · 이렇게 나옵니다 — 앞에서 말로 설명한 결과물을 실제 제작 화면으로 보여준다.
 * 두 줄이 좌우 반대 방향으로 천천히 흐르고, 제작 사례 페이지로 이어 준다.
 */
export default function DiffGallery() {
  return (
    <section
      className="theme-light"
      style={{
        background: "var(--section-a)",
        padding: "clamp(3rem, 7vw, 5rem) 0",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", padding: "0 1.25rem" }}>
        <Reveal variant="up" style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
          <span className="footnote emphasized c-accent" style={{ letterSpacing: "0.04em" }}>
            04 · 이렇게 나옵니다
          </span>
          <h2 className="title-1" style={{ margin: "0.9rem 0 0", wordBreak: "keep-all" }}>
            <span className="title-lead">템플릿이 아닌,</span> <br className="br-mobile" />
            <span className="c-gold">처음부터 만든 홈페이지</span>
          </h2>
          <p
            className="body c-muted"
            style={{ margin: "1rem auto 0", maxWidth: "560px", wordBreak: "keep-all" }}
          >
            아래는 WEFLOW가 실제로 제작한 사이트 화면입니다.
          </p>
        </Reveal>
      </div>

      {/* 화면 폭 전체를 쓰는 좌우 흐름 — 위 줄은 왼쪽으로, 아래 줄은 오른쪽으로 */}
      <Reveal variant="fade" style={{ marginTop: "clamp(2rem, 5vw, 3rem)" }}>
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </Reveal>

      <Reveal variant="fade" style={{ textAlign: "center", marginTop: "1.75rem", padding: "0 1.25rem" }}>
        <Link
          href="/cases"
          className="headline emphasized c-accent"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
        >
          제작 사례 더 보기 <ArrowRight size={19} strokeWidth={2.5} />
        </Link>
      </Reveal>

      <style>{`
        .dg-marquee {
          overflow: hidden;
          width: 100%;
          /* 양 끝을 배경색으로 살짝 녹여 잘린 느낌을 없앤다 */
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .dg-marquee + .dg-marquee { margin-top: 1rem; }
        .dg-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: dg-scroll 38s linear infinite;
        }
        .dg-track.reverse { animation-direction: reverse; }
        .dg-marquee:hover .dg-track { animation-play-state: paused; }
        .dg-shot {
          position: relative;
          flex-shrink: 0;
          width: clamp(260px, 34vw, 420px);
          aspect-ratio: 1920 / 920;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--surface-container);
          border: 1px solid var(--border);
          transition: transform 0.25s ease;
        }
        .dg-shot:hover { transform: translateY(-4px); }
        /* 목록을 세 번 붙였으니 1/3 만큼 밀면 처음과 이어진다 (gap 만큼 보정) */
        @keyframes dg-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc((-100% - 1rem) / 3)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dg-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
