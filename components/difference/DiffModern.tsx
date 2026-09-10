import { Calculator, Zap, Search, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";

// 최신 기술로 직접 만들면 달라지는 것 4가지 — 도입부에서 거절당한 요청들과 짝을 맞춘다
const RESULTS: { Icon: LucideIcon; title: string; desc: string }[] = [
  {
    Icon: Calculator,
    title: "원하는 기능은 무엇이든",
    // "틀이 없으니" 는 바로 위 보조 문단에 이미 있다 — 카드에서 또 쓰면 같은 말이 두 번 된다
    desc: "자동 견적 계산기, 스마트스토어·네이버 플레이스로 이어지는 연결 구조 설계, 예약·결제까지 필요한 기능을 코드로 직접 만듭니다.",
  },
  {
    Icon: Zap,
    title: "모바일에서도 빠른 로딩",
    desc: "필요한 것만 불러오는 구조라 가볍습니다. 로딩 속도는 고객 이탈은 물론, 검색 순위에도 그대로 반영됩니다.",
  },
  {
    Icon: Search,
    title: "검색에 잡히는 구조",
    desc: "페이지마다 제목·설명·구조화 데이터를 직접 설계합니다. 네이버·구글 상단 노출을 ‘관리할 수 있는’ 사이트가 됩니다.",
  },
  {
    Icon: LayoutDashboard,
    title: "나만의 관리자 페이지",
    // "원하는 대로 항목을 바꾼다" 는 06 이 사례로 증명하는 몫이라 여기서 뺐다.
    // 03 은 "무엇이 쌓이는가" 까지만 말한다 — 겹치면 06 이 그냥 반복으로 읽힌다.
    desc: "문의·예약이 한곳에 쌓이고, 어떤 광고를 보고 들어왔는지까지 남습니다. 흩어져 있던 고객 정보가 그대로 자산이 됩니다.",
  },
];

/**
 * 03 · 최신 기술을 이용한 홈페이지란? — 틀 없이 처음부터 만든다는 게 어떤 결과로 이어지는지
 * 기능·속도·검색·관리자 네 가지로 보여준다.
 */
export default function DiffModern() {
  return (
    <section
      style={{
        background: "var(--section-b)",
        padding: "clamp(3rem, 7vw, 5rem) 1.25rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <Reveal variant="up" style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto" }}>
          <span className="footnote emphasized c-accent" style={{ letterSpacing: "0.04em" }}>
            03 · 최신 기술로 만든 홈페이지란?
          </span>
          <h2 className="title-1" style={{ margin: "0.9rem 0 0", wordBreak: "keep-all" }}>
            <span className="c-gold">최신 기술을 쓰면,</span> <br className="br-mobile" />
            어떤 사이트가 나올까요?
          </h2>
          <p
            className="body c-muted"
            style={{ margin: "1rem auto 0", maxWidth: "600px", wordBreak: "keep-all" }}
          >
            WEFLOW는 대기업 서비스에 쓰이는 최신 웹 기술
            <br className="br-mobile" />
            <span style={{ whiteSpace: "nowrap" }}>(React·Next.js)로</span> 처음부터 직접 만듭니다.
            <br />
            틀이 없으니, 안 되는 게 없습니다.
          </p>
        </Reveal>

        <Reveal stagger className="dm-grid" style={{ marginTop: "clamp(2rem, 5vw, 3rem)" }}>
          {RESULTS.map(({ Icon, title, desc }) => (
            <div key={title} className="dm-card">
              <span className="dm-icon">
                <Icon size={22} strokeWidth={2} />
              </span>
              <h3 className="headline" style={{ margin: "0 0 0.45rem", wordBreak: "keep-all" }}>
                {title}
              </h3>
              <p className="callout c-muted" style={{ margin: 0, wordBreak: "keep-all" }}>
                {desc}
              </p>
            </div>
          ))}
        </Reveal>
      </div>

      <style>{`
        /* 카드 4장 높이를 제일 긴 문장 기준으로 전부 맞춘다 — 2열·1열로 쌓여도 같은 높이 */
        .dm-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 1fr;
          gap: 1.1rem;
        }
        .dm-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: 1.6rem;
        }
        .dm-icon {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-xl);
          background: var(--accent-light);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        @media (max-width: 1000px) {
          .dm-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .dm-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
