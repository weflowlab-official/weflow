// /about — 회사소개 페이지.
// 인트로 → 이름의 의미 → 철학 → 브랜드 스토리 → 일하는 방식(ListeningSection) → 회사 정보 → CTA 순.
// 메인과 같은 형식으로 그린다 — 흰 바탕, 영문 머리표 + 굵은 제목, 테두리 없는 회색 카드, 가는 선 목록.
// 화면에 뿌릴 문구는 아래 상수(MEANING·STORY·INFO)에 모아뒀고,
// 페이지 전용 스타일은 파일 맨 아래 <style> 블록에 있다.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import FlowStatement from "@/components/about/FlowStatement";
import ListeningSection from "@/components/home/ListeningSection";

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
    images: [{ url: '/images/og/about.jpg', width: 1200, height: 630 }],
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
    <main className="ab-page">
      {/* 인트로 */}
      <section className="ab-section ab-hero">
        <div className="ab-inner">
          <header className="ab-head">
            <Reveal variant="up">
              <p className="ab-eyebrow">ABOUT US</p>
            </Reveal>
            <SplitText
              as="h1"
              className="ab-hero-title"
              segments={[
                { text: "사람이 움직이면, " },
                { text: "기술은 따라온다", className: "ab-hl", br: "mobile" },
              ]}
            />
            <Reveal variant="up" delay={0.15}>
              <p className="ab-hero-en">People move. Technology follows.</p>
              <p className="ab-lead">
                WEFLOW는 사람과 기술이 함께 흘러가며 더 좋은 방향을 만드는
                회사입니다.
                <br />
                단순히 개발만 하는 회사가 아니라, 기술은 뒤에서 받쳐주고 사람은
                앞에서 빛나게 하는 흐름을 만듭니다.
              </p>
            </Reveal>
          </header>
          <Reveal as="div" stagger className="ab-imgs">
            {[
              { src: "/images/about/about1.webp", alt: "WEFLOW 사무 공간" },
              { src: "/images/about/about9.webp", alt: "WEFLOW 작업 모습" },
            ].map(({ src, alt }) => (
              // 원본(16:9)보다 좁게 잡아 좌우를 조금씩 덜어낸다 (cover 가 양옆을 잘라낸다)
              <div key={src} className="ab-img" style={{ aspectRatio: "924 / 572" }}>
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

      {/* WE · FLOW 의미 — 사진이 위를 채우는 카드 두 장 */}
      <section className="ab-section">
        <div className="ab-inner">
          <Reveal as="header" variant="up" className="ab-head">
            <p className="ab-eyebrow">OUR NAME</p>
            <h2 className="ab-title">이름에 담은 의미</h2>
          </Reveal>
          <Reveal as="div" stagger className="ab-grid-2">
            {MEANING.map(({ key, desc, img }) => (
              <div key={key} className="ab-card">
                <div className="ab-card__photo">
                  <Image
                    src={img}
                    alt={key}
                    fill
                    sizes="(max-width: 640px) 100vw, 430px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="ab-card__body">
                  <p className="ab-card__key">{key}</p>
                  <p className="ab-card__desc">{desc}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 철학 문장 — 화면에 붙은 채 스크롤에 맞춰 두 줄이 양옆에서 들어오고, 바탕이 검게 가라앉는다 */}
      <FlowStatement />

      {/* 브랜드 스토리 — 메인의 자주 묻는 질문처럼 왼쪽 제목 · 오른쪽 본문 2단 */}
      <section className="ab-section">
        <div className="ab-inner ab-split">
          <Reveal as="header" variant="up" className="ab-side">
            <p className="ab-eyebrow">OUR STORY</p>
            <h2 className="ab-title">우리의 시작</h2>
          </Reveal>
          <div>
            <Reveal as="div" stagger className="ab-story">
              {STORY.map((line) => (
                <p key={line} className="ab-story__line">
                  {line}
                </p>
              ))}
              <p className="ab-story__end">
                그래서 이름은 <span className="ab-hl">WEFLOW</span>
                입니다.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.1} className="ab-imgs">
              {[0, 1].map((i) => (
                // 원본이 16:9 — 자리를 같은 비율로 둬야 잘리지 않는다
                <div key={i} className="ab-img" style={{ aspectRatio: "16 / 9" }}>
                  <Image
                    src={`/images/about/about${i + 4}.webp`}
                    alt="WEFLOW 이야기"
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 고객의 소리 — 일하는 방식의 연장이라 메인에서 이리로 옮겼다 */}
      <ListeningSection />

      {/* 회사 정보 — 상자 없이 가는 선으로만 나눈 표 */}
      <section className="ab-section">
        <div className="ab-inner ab-split">
          <Reveal as="header" variant="up" className="ab-side">
            <p className="ab-eyebrow">COMPANY</p>
            <h2 className="ab-title">회사 정보</h2>
          </Reveal>
          <Reveal as="dl" variant="up" delay={0.1} className="ab-info">
            {INFO.map(({ label, value }) => (
              <div key={label} className="ab-info__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA — 메인 마지막 CTA 와 같은 파란 띠 */}
      <section className="ab-cta">
        <span aria-hidden className="ab-cta__dot ab-cta__dot--lg" />
        <span aria-hidden className="ab-cta__dot ab-cta__dot--sm" />
        <Reveal variant="zoom" className="ab-cta__in">
          <p className="ab-cta__title">
            Flow Together, <br className="br-mobile" />
            Grow Beyond.
          </p>
          <p className="ab-cta__sub">함께 흐르고, 더 크게 성장하다</p>
          <div className="ab-cta__btns">
            <a href="tel:010-2971-7280" className="ab-cta__btn">
              전화 상담하기 <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <Link href="/diagnosis" className="ab-cta__btn ab-cta__btn--solid">
              무료 상담 신청 <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </Reveal>
      </section>

      <style>{`
        /* 메인과 같은 규격 — 흰 바탕 #fff · 글씨 #111 · 본문 회색 #5c6066 · 강조 파랑 #3f8fe0 */
        .ab-page { background: #fff; color: #111; }
        /* 흰 섹션이 연달아 오므로 여백은 아래쪽에만 둔다 (위아래 다 주면 사이가 두 배가 된다) */
        .ab-section { padding: 0 1.5rem clamp(4.5rem, 10vw, 8.5rem); }
        .ab-hero { padding-top: clamp(3.5rem, 7vw, 6rem); }
        .ab-inner { max-width: 1120px; margin: 0 auto; }

        /* 검은 섹션 — 흰 섹션만 이어지면 구분이 안 돼서 '철학 문장'(FlowStatement)과 '일하는 방식'(ListeningSection)은
           검은 바탕이다. 바탕이 바뀌는 자리라 그 다음 섹션은 위 여백을 되살린다 */
        .fs-section + .ab-section,
        .listen-section + .ab-section { padding-top: clamp(4.5rem, 10vw, 8.5rem); }

        /* ── 머리말 — 영문 머리표 + 굵은 제목 ── */
        .ab-head { text-align: center; margin-bottom: clamp(2.5rem, 6vw, 4.5rem); }
        .ab-eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.75rem, 1.1vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.34em;
          color: #8a8a8a;
        }
        .ab-title {
          margin: 0;
          color: #111;
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .ab-hl { color: #3f8fe0; }
        .ab-hero-title {
          margin: 0;
          color: #111;
          font-size: clamp(2.1rem, 5.4vw, 3.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.25;
          word-break: keep-all;
        }
        .ab-hero-en {
          margin: 1rem 0 0;
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #8a8a8a;
        }
        .ab-lead {
          margin: clamp(1.1rem, 2.4vw, 1.6rem) auto 0;
          /* 둘째 문장이 넓은 화면에서 한 줄에 들어가는 폭 */
          max-width: 60rem;
          font-size: clamp(0.98rem, 1.5vw, 1.15rem);
          line-height: 1.7;
          color: #5c6066;
          word-break: keep-all;
        }

        /* ── 사진 — 테두리 없이 둥근 모서리만. 두 장 나란히, 폰에서만 세로로 ── */
        .ab-imgs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
        }
        .ab-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          border-radius: clamp(18px, 2.2vw, 28px);
          background: #e9ebee;
        }

        /* ── WE · FLOW 카드 — 메인의 사진 카드와 같은 모양 ── */
        .ab-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
          max-width: 860px;
          margin: 0 auto;
        }
        .ab-card {
          border-radius: clamp(18px, 2.2vw, 28px);
          overflow: hidden;
          background: #f5f6f8;
        }
        .ab-card__photo {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #e9ebee;
        }
        /* 마우스를 올리면 사진이 조금 다가온다 */
        .ab-card__photo img { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .ab-card:hover .ab-card__photo img { transform: scale(1.05); }
        .ab-card__body { padding: clamp(1.4rem, 2.4vw, 2rem); }
        .ab-card__key {
          margin: 0;
          color: #3f8fe0;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .ab-card__desc {
          margin: 0.75rem 0 0;
          font-size: clamp(0.98rem, 1.4vw, 1.1rem);
          font-weight: 600;
          line-height: 1.6;
          color: #5c6066;
          word-break: keep-all;
        }

        /* ── 좌우 2단 — 왼쪽 제목 · 오른쪽 본문 (제목은 따라 내려오지 않는다) ── */
        .ab-split {
          display: grid;
          grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.5fr);
          gap: clamp(2rem, 6vw, 6rem);
          align-items: start;
        }

        /* 브랜드 스토리 — 한 줄씩 가는 선으로 나눈다 */
        .ab-story { border-top: 1px solid #111; }
        .ab-story__line {
          margin: 0;
          padding: clamp(1.15rem, 2.2vw, 1.6rem) 0.25rem;
          border-bottom: 1px solid #e3e5e8;
          font-size: clamp(1.02rem, 1.55vw, 1.25rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.6;
          word-break: keep-all;
        }
        .ab-story__end {
          margin: clamp(1.75rem, 4vw, 2.75rem) 0 0;
          font-size: clamp(1.75rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.3;
          word-break: keep-all;
        }
        .ab-story + .ab-imgs { margin-top: clamp(2rem, 4vw, 3rem); }

        /* 회사 정보 표 (라벨 — 값) */
        .ab-info { margin: 0; border-top: 1px solid #111; }
        .ab-info__row {
          display: flex;
          gap: 1rem;
          padding: clamp(1.15rem, 2.2vw, 1.6rem) 0.25rem;
          border-bottom: 1px solid #e3e5e8;
          font-size: clamp(0.95rem, 1.3vw, 1.05rem);
          line-height: 1.6;
        }
        .ab-info dt { flex: 0 0 140px; font-weight: 700; color: #111; }
        .ab-info dd { margin: 0; color: #5c6066; }

        /* ── CTA — 화면 폭을 다 채우는 파란 띠, 흰 글씨 ── */
        .ab-cta {
          position: relative;
          overflow: hidden;
          background: var(--accent);
          padding: clamp(4rem, 9vw, 7rem) 1.25rem;
          text-align: center;
        }
        /* 장식 원 */
        .ab-cta__dot { position: absolute; border-radius: 9999px; background: rgba(14, 14, 16, 0.1); }
        .ab-cta__dot--lg { right: -80px; bottom: -120px; width: 320px; height: 320px; }
        .ab-cta__dot--sm { right: 40px; bottom: -60px; width: 180px; height: 180px; }
        .ab-cta__in { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; }
        .ab-cta__title {
          margin: 0;
          color: #fff;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }
        .ab-cta__sub {
          margin: 0.9rem 0 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: clamp(1.1rem, 2.4vw, 1.35rem);
          font-weight: 600;
        }
        .ab-cta__btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: clamp(2rem, 5vw, 3rem);
        }
        .ab-cta__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--on-accent-strong);
          font-size: 1.1rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-radius: 9999px;
          padding: 0.95rem 2.2rem;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s;
        }
        .ab-cta__btn:hover { background: rgba(255, 255, 255, 0.22); border-color: var(--on-accent-strong); }
        .ab-cta__btn:active { transform: scale(0.97); }
        /* 주 버튼 — 흰색 채움 (강조) */
        .ab-cta__btn--solid {
          background: var(--on-accent-strong);
          color: var(--accent-strong);
          border-color: var(--on-accent-strong);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
        }
        .ab-cta__btn--solid:hover { background: rgba(255, 255, 255, 0.88); border-color: rgba(255, 255, 255, 0.88); }

        /* 좁은 화면 — 2단을 풀어 제목을 위로 올린다 */
        @media (max-width: 860px) {
          .ab-section { padding-left: 1.25rem; padding-right: 1.25rem; }
          .ab-split { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .ab-imgs, .ab-grid-2 { grid-template-columns: 1fr; }
          .ab-info dt { flex-basis: 110px; }
        }
        @media (max-width: 480px) {
          .ab-cta__btns { flex-direction: column; align-items: stretch; }
          .ab-cta__btn { justify-content: center; }
        }
      `}</style>
    </main>
  );
}
