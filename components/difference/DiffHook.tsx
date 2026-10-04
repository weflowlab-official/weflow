import Reveal from "@/components/Reveal";
import DiffChat from "@/components/difference/DiffChat";

/**
 * 01 · 도입 — "그 기능은 안 됩니다"라는 말을 들어본 적 있는지 묻고,
 * 자동 재생되는 채팅(DiffChat)으로 그 상황을 보여준 뒤,
 * 그 이유가 실력이 아니라 '템플릿'이라는 틀 때문임을 한 줄로 짚는다.
 * 페이지 맨 위 섹션이라 제목이 h1 이다 (별도 도입 배너를 두지 않는다).
 * 유입 직후 이탈을 막는 구간이라 짧고 공감 위주로 간다.
 */
export default function DiffHook() {
  return (
    <section
      className="diff-light"
      style={{
        background: "var(--section-b)",
        padding: "clamp(3.5rem, 8vw, 5.5rem) 1.25rem clamp(3rem, 7vw, 5rem)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <Reveal variant="up" style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
          <span className="footnote emphasized c-accent" style={{ letterSpacing: "0.04em" }}>
            01 · 템플릿(예전 기술) 제작 업체와, 무엇이 다를까요?
          </span>
          <h1 className="title-1 emphasized" style={{ margin: "0.9rem 0 0", wordBreak: "keep-all" }}>
            내 홈페이지인데,
            <br />
            왜 <span className="c-gold">내 마음대로</span> 안 될까요?
          </h1>
          <p
            className="body c-muted"
            style={{ margin: "1rem auto 0", maxWidth: "560px", wordBreak: "keep-all" }}
          >
            홈페이지 제작을 알아보다 보면 <br className="br-mobile" />
            한 번쯤 겪게 되는 대화입니다.
          </p>
        </Reveal>

        {/* 고객 ↔ 템플릿 업체 채팅 — 요청마다 "안 됩니다"가 쌓인다 */}
        <Reveal variant="zoom" style={{ marginTop: "clamp(2rem, 5vw, 3rem)" }}>
          <DiffChat />
        </Reveal>

        {/* 결론 한 줄 — 모바일은 스크롤 등장 효과 없이 처음부터 떠 있다 (아래 style) */}
        <Reveal
          variant="fade"
          delay={0.2}
          className="dh-conclusion"
          style={{ textAlign: "center", marginTop: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          <p className="callout c-muted" style={{ margin: "0 0 0.6rem", wordBreak: "keep-all" }}>
            못 만들어서가 아닙니다. 이유는 하나입니다.
          </p>
          <p
            className="title-1 emphasized"
            style={{ margin: 0, wordBreak: "keep-all", lineHeight: 1.3 }}
          >
            <span className="c-gold">템플릿(예전 기술)</span>이라서 <br className="br-mobile" />
            안 되는 겁니다.
          </p>
          <p
            className="body c-muted"
            style={{ margin: "1rem auto 0", maxWidth: "600px", wordBreak: "keep-all" }}
          >
            이미 만들어진 틀 안에서는 <br className="br-mobile" />
            틀에 없는 기능을 넣을 수 없습니다.
            <br />
            그게 무슨 뜻인지, 아래에서 짧게 설명드릴게요.
          </p>
        </Reveal>
      </div>

      <style>{`
        /* 모바일 — 결론 문단은 채팅이 끝나기 전에 스크롤해도 바로 보이게 등장 효과를 끈다 */
        @media (max-width: 768px) {
          .dh-conclusion {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
