// /about — 회사소개 페이지.
// 인트로 → 이름의 의미 → 철학 → 브랜드 스토리 → 일하는 방식(ListeningSection) → 회사 정보 → CTA 순.
// 화면에 뿌릴 문구는 아래 상수(MEANING·STORY·INFO)에 모아뒀고,
// 페이지 전용 스타일은 파일 맨 아래 <style> 블록에 있다.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import ListeningSection from "@/components/home/ListeningSection";
import { CTA_BTN, CTA_BTN_FILLED } from "@/lib/ctaButton";

export const metadata: Metadata = {
  title: "회사소개 · WEFLOW",
  // 짧으면 네이버가 이 문장을 버리고 본문에서 아무 데나 긁어 온다 (UI 라벨이 세미콜론으로
  // 이어 붙은 채로 나오기도 한다). 그대로 쓰이는 /difference 가 88자라 그 수준으로 맞춘다.
  description:
    'WEFLOW는 사람과 기술이 함께 흘러가며 더 좋은 방향을 만듭니다. 회사 이름에 담은 뜻과 일하는 방식, 사업자 정보를 함께 안내합니다.',
  // openGraph 를 여기서 정의하는 순간 루트(app/layout.tsx)의 것이 통째로 덮인다.
  // 이미지까지 다시 적어야 카톡·네이버 미리보기에 그림이 나온다.
  openGraph: {
    title: '회사소개 · WEFLOW',
    description: '사람과 기술이 함께 흘러가는 WEFLOW, 이름에 담은 뜻과 일하는 방식을 소개합니다.',
    url: '/about',
    images: [{ url: '/images/og/about.webp', width: 1200, height: 630 }],
  },
};

// 사명 풀이 — WE · FLOW 두 카드
const MEANING: { key: string; desc: string; img: string }[] = [
  { key: "WE", desc: "우리 · 사람 · 관계 · 함께하는 가치", img: "/images/about/about2.webp" },
  { key: "FLOW", desc: "흐름 · 성장 · 연결 · 앞으로 나아가는 움직임", img: "/images/about/about3.webp" },
];

// 브랜드 스토리 본문 — 한 줄씩 순차 등장
const STORY: string[] = [
  "처음엔 돈도, 스펙도, 대단한 기술도 없었습니다.",
  "하지만 사람과 관계, 그리고 좋은 흐름은 결국 큰 결과를 만든다고 믿었습니다.",
  "우리는 혼자 성공하는 회사보다, 함께 흘러가며 성장하는 회사를 만들고 싶었습니다.",
];

// 사업자 정보 표 (라벨 — 값)
const INFO: { label: string; value: string }[] = [
  { label: "상호", value: "WEFLOW (위플로우)" },
  { label: "대표", value: "신서준" },
  { label: "사업자등록번호", value: "884-07-03480" },
  { label: "이메일", value: "contact@weflowlab.kr" },
  { label: "운영시간", value: "연중무휴 24시간 상담 가능" },
];

export default function AboutPage() {
  return (
    <main style={{ background: "var(--section-a)" }}>
      {/* 인트로 */}
      <section
        style={{
          padding: "clamp(3.5rem, 7vw, 6rem) 1.25rem",
          background: "var(--section-a)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="about-hero">
          <Reveal variant="up">
            <span
              className="caption-2 emphasized c-accent"
              style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              ABOUT
            </span>
          </Reveal>
          <SplitText
            as="h1"
            className="title-1 about-hero-title"
            style={{ margin: "1rem 0 0", wordBreak: "keep-all" }}
            segments={[
              { text: "사람이 움직이면, " },
              { text: "기술은 따라온다", className: "c-accent", br: "mobile" },
            ]}
          />
          <Reveal variant="up" delay={0.15}>
            <p
              className="title-3 c-muted"
              style={{ margin: "1rem 0 0", letterSpacing: "0.01em" }}
            >
              People move. Technology follows.
            </p>
            <p
              className="about-hero-body c-secondary"
              style={{
                margin: "1.75rem 0 0",
                maxWidth: "720px",
                wordBreak: "keep-all",
                lineHeight: 1.8,
              }}
            >
              WEFLOW는 사람과 기술이 함께 흘러가며 더 좋은 방향을 만드는
              회사입니다. 단순히 개발만 하는 회사가 아니라, 기술은 뒤에서
              받쳐주고 사람은 앞에서 빛나게 하는 흐름을 만듭니다.
            </p>
          </Reveal>
          <Reveal as="div" stagger className="about-hero-imgs">
            {[
              { src: "/images/about/about1.webp", alt: "WEFLOW 사무 공간" },
              { src: "/images/about/about9.webp", alt: "WEFLOW 작업 모습" },
            ].map(({ src, alt }) => (
              // 원본(16:9)보다 좁게 잡아 좌우를 조금씩 덜어낸다 (cover 가 양옆을 잘라낸다)
              <div key={src} className="about-img" style={{ aspectRatio: "924 / 572" }}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WE · FLOW 의미 */}
      <section
        style={{
          padding: "clamp(3rem, 6vw, 4.5rem) 1.25rem",
          background: "var(--section-b)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          <Reveal variant="up">
            {/* 아래 카드(820px)와 폭을 맞춰 가운데 정렬.
                아래 철학 문장(title-1)보다 한 단계 작게 두되 title-2 보다는 키운다 */}
            <h2
              className="title-2 emphasized"
              style={{
                margin: "0 auto clamp(2.25rem, 5vw, 3.25rem)",
                maxWidth: "820px",
                fontSize: "clamp(1.6rem, 3.6vw, 2rem)",
                lineHeight: 1.3,
                textAlign: "center",
                wordBreak: "keep-all",
              }}
            >
              이름에 담은 의미
            </h2>
          </Reveal>
          <Reveal as="div" stagger className="about-grid-2">
            {MEANING.map(({ key, desc, img }) => (
              <div key={key} className="about-meaning-card">
                <p
                  className="large-title c-accent"
                  style={{ margin: "0 0 0.5rem", lineHeight: 1 }}
                >
                  {key}
                </p>
                <p
                  className="headline"
                  style={{ margin: 0, wordBreak: "keep-all" }}
                >
                  {desc}
                </p>
                <div className="about-card-img">
                  <Image
                    src={img}
                    alt={key}
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 철학 문장 */}
      <section
        style={{
          padding: "clamp(3.5rem, 8vw, 6rem) 1.25rem",
          background: "var(--section-a)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <SplitText
            as="h2"
            className="title-1"
            style={{ margin: 0, wordBreak: "keep-all", lineHeight: 1.5 }}
            step={0.024}
            segments={[
              { text: "기술은 " },
              { text: "뒤에서 받쳐주고", className: "c-accent emphasized" },
              { text: ", " },
              { text: "사람은 ", br: "mobile" },
              { text: "앞에서 빛나게", className: "c-accent emphasized" },
              { text: " 하는 흐름" },
            ]}
          />
        </div>
      </section>

      {/* 브랜드 스토리 */}
      <section
        style={{
          padding: "clamp(3rem, 7vw, 5rem) 1.25rem",
          background: "var(--section-b)",
        }}
      >
        <div className="about-story">
          <Reveal variant="up">
            <span className="footnote emphasized c-accent">우리의 시작</span>
          </Reveal>
          <Reveal
            as="div"
            stagger
            style={{
              marginTop: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            {STORY.map((line) => (
              <p
                key={line}
                className="c-secondary"
                style={{
                  margin: 0,
                  wordBreak: "keep-all",
                  fontSize: "clamp(1.2rem, 2.6vw, 1.5rem)",
                  lineHeight: 1.85,
                }}
              >
                {line}
              </p>
            ))}
            <p
              className="emphasized"
              style={{
                margin: "1.5rem 0 0",
                wordBreak: "keep-all",
                fontSize: "clamp(1.9rem, 5vw, 3rem)",
                lineHeight: 1.3,
              }}
            >
              그래서 이름은{" "}
              <span className="c-accent" style={{ fontWeight: 800 }}>
                WEFLOW
              </span>
              입니다.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                marginTop: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              {[0, 1].map((i) => (
                // 원본이 16:9 — 자리를 같은 비율로 둬야 잘리지 않는다
                <div key={i} className="about-img" style={{ aspectRatio: "16 / 9" }}>
                  <Image
                    src={`/images/about/about${i + 4}.webp`}
                    alt="WEFLOW 이야기"
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 고객의 소리 — 일하는 방식의 연장이라 메인에서 이리로 옮겼다 */}
      <ListeningSection />

      {/* 회사 정보 */}
      <section
        style={{
          padding: "clamp(2.5rem, 5vw, 4rem) 1.25rem",
          background: "var(--section-a)",
        }}
      >
        <div style={{ maxWidth: "820px", margin: "0 auto", width: "100%" }}>
          <Reveal variant="up">
            <h2 className="title-2 emphasized" style={{ margin: "0 0 1.5rem" }}>
              회사 정보
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-2xl)",
                overflow: "hidden",
              }}
            >
              {INFO.map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem 1.4rem",
                    borderTop: i === 0 ? "none" : "1px solid var(--border)",
                  }}
                >
                  <span
                    className="subhead emphasized c-primary"
                    style={{ flex: "0 0 140px" }}
                  >
                    {label}
                  </span>
                  <span className="callout">{value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "clamp(3.5rem, 7vw, 5.5rem) 1.25rem",
          background: "var(--accent-dim)",
          textAlign: "center",
        }}
      >
        <Reveal variant="zoom">
          <p
            className="emphasized"
            style={{
              margin: 0,
              color: "var(--text)",
              wordBreak: "keep-all",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: 1.25,
            }}
          >
            Flow Together, <br className="br-mobile" />
            Grow Beyond.
          </p>
          <p
            style={{
              margin: "0.9rem 0 2rem",
              color: "var(--accent)",
              fontSize: "clamp(1.15rem, 2.6vw, 1.4rem)",
            }}
          >
            함께 흐르고, 더 크게 성장하다
          </p>
          <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:010-2971-7280" className="btn-gold" style={CTA_BTN}>
              <span className="btn-gold__label">전화 상담하기</span> <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <Link href="/diagnosis" className="btn-gold btn-gold--fill" style={CTA_BTN}>
              <span className="btn-gold__label">무료 상담 신청</span> <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </Reveal>
      </section>

      <style>{`
        .about-hero {
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }
        .about-hero-title {
          font-size: clamp(2.4rem, 6vw, 4rem);
          line-height: 1.2;
        }
        .about-hero-body {
          font-size: clamp(1.15rem, 2.6vw, 1.4rem);
        }
        .about-story {
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }
        .about-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          border-radius: var(--radius-2xl);
          background: var(--surface-container);
          border: 1px solid var(--border);
        }
        /* 인트로 사진 2장 — 나란히, 폰에서만 세로로 */
        .about-hero-imgs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: clamp(2rem, 4vw, 3rem);
        }
        @media (max-width: 640px) {
          .about-hero-imgs { grid-template-columns: 1fr; }
        }
        /* WE · FLOW 카드 — 메인 회사소개 섹션과 같은 크기로 맞춘다 */
        .about-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.9rem;
          max-width: 820px;
          margin: 0 auto;
        }
        .about-meaning-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: clamp(1.5rem, 3vw, 2rem);
          transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s;
        }
        .about-meaning-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 12px 28px rgba(106, 146, 215,0.25);
        }
        .about-card-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 16 / 9;
          margin-top: 0.9rem;
          border-radius: var(--radius-xl);
          background: var(--surface-container);
          border: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .about-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
