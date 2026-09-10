import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { CTA_BTN, CTA_BTN_FILLED } from "@/lib/ctaButton";

/** 차별점 페이지 맨 아래 — "그 밖의 차이점이 궁금하다면" 지금 바로 상담으로 보낸다 (ServiceCTA와 같은 서식) */
export default function DiffCTA() {
  return (
    <section
      style={{
        padding: "clamp(2.5rem, 5vw, 3.5rem) 1.5rem",
        // 바로 위 07 일하는 방식이 section-b 라 여기는 section-a 로 번갈아 둔다
        background: "var(--section-a)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Reveal
        variant="zoom"
        style={{ maxWidth: "640px", margin: "0 auto", width: "100%", textAlign: "center" }}
      >
        <p
          className="caption-1 emphasized c-accent"
          style={{ letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.85rem" }}
        >
          GET STARTED
        </p>

        <h2
          className="emphasized"
          style={{
            marginBottom: "1rem",
            wordBreak: "keep-all",
            fontSize: "clamp(2.2rem, 5.5vw, 3.5rem)",
            lineHeight: 1.25,
          }}
        >
          그 밖의 차이점이 <br className="br-mobile" />궁금하시다면?
        </h2>

        <p
          className="c-muted"
          style={{
            marginBottom: "2rem",
            wordBreak: "keep-all",
            fontSize: "clamp(1.1rem, 2.6vw, 1.35rem)",
            lineHeight: 1.7,
          }}
        >
          우리 업종에서는 어떤 기능까지 가능한지,
          <br className="br-mobile" /> 상담에서 바로 정리해 드립니다.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="tel:010-2971-7280" className="btn-gold" style={CTA_BTN}>
            <span className="btn-gold__label">전화 상담하기</span> <ArrowRight size={18} strokeWidth={2.5} />
          </a>
          <Link href="/diagnosis" className="btn-gold btn-gold--fill" style={CTA_BTN}>
            <span className="btn-gold__label">지금 바로 상담받기</span> <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
