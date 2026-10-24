import type { Metadata } from 'next'
import { MessagesSquare, FolderTree, PenTool, Rocket, Check, ClipboardList, BookOpen, Phone } from 'lucide-react'
import InquiryForm from './InquiryForm'
import InView from './InView'
import BlogWhy from './BlogWhy'
import ClinicHeader from './ClinicHeader'
import ClinicFooter from './ClinicFooter'
import { CLINIC_BASE_CSS } from './base-css'
import HeroWorries from './HeroWorries'
import ClinicFaq from './ClinicFaq'
import HomeVsBlog from './HomeVsBlog'
import FloatingCta from './FloatingCta'
import WithHomepage from './WithHomepage'
import SecurityNews from './SecurityNews'
import HowItWorks from './HowItWorks'
import SearchMock from './SearchMock'

/**
 * 병의원 전용 웹블로그 홍보 페이지 — /clinic-blog
 *
 * 광고·제안서에서 링크로만 들어오는 단독 페이지다. 메인 사이트와 섞이지 않게
 * 헤더·푸터·플로팅 버튼을 빼고(components/ClientLayout.tsx), 메뉴·사이트맵에도 넣지 않는다.
 * 그래서 이 페이지 안에서도 메인 사이트로 가는 링크를 두지 않는다 — 나가는 길은 문의 폼과 카카오톡뿐이다.
 *
 * 기능을 나열하지 않고 대화 장면으로 풀어 간다 —
 * 지금 놓치고 있는 것 셋 — 환자의 AI 검색(WHY NOW 01) → 노출이 빠진 날(02, 원장님 고민 장면은 숨김) → 옛 기술(PHP) 보안(03, SecurityNews) → 웹블로그란·왜 웹블로그(BlogWhy) → 글만 쓰면 자리 잡는 구조(HowItWorks) → 홈페이지 vs 웹블로그(HomeVsBlog) → 홈페이지와 함께하면 + 상품(WithHomepage)
 * → 진행 과정 → 자주 묻는 질문 → 상담. 헤더 메뉴(ClinicHeader)가 각 덩어리의 id(webblog·with-homepage·process·faq·contact)로 이동한다.
 * 장면마다 말풍선이 스크롤에 맞춰 차례로 올라온다 (InView 가 'is-in' 을 붙이고, 순서는 아래 CSS 의 --i 로 늦춘다).
 * 색은 맨 아래 <style> 의 .cb 묶음 안에서만 정의해 다른 페이지에 새지 않게 했다.
 */

export const metadata: Metadata = {
  title: '병의원 웹블로그 · 홈페이지 제작 · WEFLOW',
  description:
    '진료과목별로 정리되고 예약으로 이어지는 병원 전용 웹블로그와 홈페이지를 만들어 드립니다. 웹블로그만, 홈페이지만, 또는 함께 — 네이버·구글·AI 검색 노출까지 설계합니다.',
  alternates: { canonical: '/clinic-blog' },
  openGraph: {
    title: '병의원 웹블로그 · 홈페이지 제작 · WEFLOW',
    description: '블로그 글은 쌓이는데 예약은 그대로라면. 예약으로 이어지는 병원 전용 웹블로그 · 홈페이지 제작.',
    url: '/clinic-blog',
    // openGraph 를 정의하면 루트의 것을 통째로 덮어쓴다 — 이미지도 여기서 다시 지정해야 한다
    images: [{ url: '/images/main/og-logo-2.jpg', width: 1200, height: 630 }],
  },
}

/** 말하는 사람 — 왼쪽(상대)·오른쪽(나) 위치와 동그라미 안 글자 */
const SPEAKERS = {
  patient: { name: '환자', short: '환자', side: 'right' },
  ai: { name: 'AI 검색', short: 'AI', side: 'left' },
  director: { name: '원장님', short: '원장', side: 'right' },
  manager: { name: '실장님', short: '실장', side: 'left' },
} as const
type Speaker = keyof typeof SPEAKERS
/** source 가 있으면 말풍선 대신 '출처 카드' 로 그린다 (AI 답변이 인용한 글) */
type Line = { who: Speaker; text: string; cta?: string; source?: string; time?: string }

/** 장면 1 — 환자 시점이라 휴대폰 화면 안에서 대화가 진행된다 */
const PATIENT_LINES: Line[] = [
  { who: 'patient', text: '임플란트 수술하고 붓기는 며칠이나 가?' },
  { who: 'ai', text: '보통 2~3일째 가장 붓고, 일주일 안에 가라앉습니다. 아래 글을 참고해 보세요.' },
  { who: 'ai', text: '임플란트 수술 후 관리법 총정리', source: '다른 병원 블로그' },
  { who: 'patient', text: '오 설명 잘 돼 있네. 여기 한번 가 볼까?' },
]

/** 장면 2 — 원장님과 실장님의 대화. 상자 없이 큰 말풍선을 대본처럼 주고받는다 (지금은 장면을 숨겨 두어 쓰이지 않는다 — 아래 주석 참고) */
const OFFICE_LINES: Line[] = [
  { who: 'director', text: '블로그 시작한 지 1년 됐는데, 블로그 보고 왔다는 환자 있었어요?', time: '오전 9:02' },
  { who: 'manager', text: '글은 매달 꼬박꼬박 올라가고 있어요…', time: '오전 9:05' },
  { who: 'director', text: '어제 검색해 봤는데 우리 글은 안 나오던데요.', time: '오전 9:05' },
  { who: 'manager', text: '왜 그런지 한번 알아볼게요 😥', time: '오전 9:11' },
]

/** 장면 3 — 방문자 그래프가 뚝 떨어진 뒤 이어지는 대화 */
const DROP_LINES: Line[] = [
  { who: 'manager', text: '원장님, 블로그 노출이 갑자기 다 빠졌어요.' },
  { who: 'director', text: '3년 동안 쓴 글인데요?' },
  { who: 'manager', text: '플랫폼 쪽 문제라 저희가 할 수 있는 게 없대요.' },
]

const STEPS = [
  { Icon: MessagesSquare, title: '상담', desc: '진료과목과 주력 진료, 지금 운영 중인 블로그·홈페이지를 봅니다.' },
  { Icon: FolderTree, title: '구조 설계', desc: '검색 키워드를 기준으로\n카테고리와 글 구성을 잡습니다.' },
  { Icon: PenTool, title: '디자인·제작', desc: '병원 분위기에 맞춰\n웹블로그와 글쓰기 화면을 만듭니다.' },
  { Icon: Rocket, title: '오픈', desc: '도메인 연결과 검색엔진 등록까지 마치고, 웹블로그를 오픈합니다.' },
]

/** 대화창 하나 — 말풍선이 --i 순서대로 늦게 올라온다. className 으로 장면마다 모양을 바꾼다 */
function Chat({ lines, className = '' }: { lines: Line[]; className?: string }) {
  return (
    <InView className={`cb-chat ${className}`}>
      {lines.map((l, i) => {
        const s = SPEAKERS[l.who]
        return (
          <div
            key={i}
            className={`cb-line cb-${s.side} cb-who-${l.who}`}
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className="cb-avatar" aria-hidden="true">{s.short}</span>
            <div className="cb-bubble-wrap">
              <span className="cb-name">{s.name}</span>
              {l.source ? (
                <p className="cb-bubble cb-src">
                  <small>출처 · {l.source}</small>
                  {l.text}
                </p>
              ) : (
                <p className="cb-bubble">{l.text}</p>
              )}
              {l.cta && <span className="cb-bubble-cta">{l.cta}</span>}
              {l.time && <time className="cb-time">{l.time}</time>}
            </div>
          </div>
        )
      })}
    </InView>
  )
}

export default function ClinicBlogPage() {
  return (
    <div className="cb">
      {/* 상단 띠 — 브랜드만 보이고 어디로도 이동하지 않는다 */}
      <ClinicHeader />

      {/* ── 히어로 ── */}
      <section className="cb-hero">
        {/* 제목 둘레에서 고민 메시지가 계속 오간다 (좁은 화면에서는 말풍선 없이 궤도·모눈만) */}
        <HeroWorries />
        <div className="cb-wrap cb-hero-inner">
          <p className="cb-tag">병의원 웹블로그 · 홈페이지 제작</p>
          {/* 글 하나로 SEO·AEO·GEO 까지 — 웹블로그 메인(/blog)의 병의원 섹션과 같은 메시지 */}
          <h1 className="cb-h1">
            글 하나 올렸을 뿐인데,<br />
            <span className="cb-mark">SEO·AEO·GEO</span>까지<br />
            한 번에 챙겨진다면?
          </h1>
          {/* 바로 문의하려는 분은 상담으로, 더 알아보려는 분은 웹블로그 설명으로 */}
          <div className="cb-hero-btns">
            <a href="#contact-form" className="cb-hero-btn cb-hero-btn--fill"><ClipboardList size={18} /> 무료 견적 신청</a>
            <a href="#webblog" className="cb-hero-btn"><BookOpen size={18} /> 웹블로그란?</a>
          </div>
        </div>
        {/* 아래로 내려가라는 선 — 제목 묶음의 높이에 끼지 않게 바닥에 따로 띄운다 */}
        <span className="cb-scroll" aria-hidden="true">
          <em>SCROLL</em>
          <i />
        </span>
      </section>

      {/* 흐름: 약속(히어로) → 지금 놓치고 있는 것 셋(WHY NOW 01 AI · 02 플랫폼 · 03 보안) → 그래서, 웹블로그 → 어떻게 자리 잡나 → 홈페이지와 함께 → 진행 → FAQ → 상담 */}

      {/* ── 장면 1 — 가운데 휴대폰 화면 안에서 환자가 검색한다 ── */}
      <section id="story" className="cb-scene cb-scene-alt cb-phone-scene">
        <div className="cb-wrap">
          <p className="cb-chapter">WHY NOW 01</p>
          <h2 className="cb-h2">요즘 환자는{'\n'}<span className="cb-hl">검색창과 AI에게</span> 먼저 묻습니다</h2>
          <p className="cb-body">
            진료를 결심한 환자는 <br className="cb-mo" />바로 전화하지 않습니다.<br />
            증상과 치료법을 검색하고 AI에게도 물어본 뒤, <br className="cb-mo" />거기서 만난 글을 쓴 병원을 기억합니다.
          </p>
          {/* 넓은 화면: 왼쪽 PC 검색 결과 + 오른쪽 휴대폰 AI 검색 / 좁은 화면: 휴대폰만 */}
          <div className="cb-ai-visual">
          <SearchMock />
          <div className="cb-phone">
            <div className="cb-phone-screen">
              <div className="cb-phone-status"><i /></div>
              <p className="cb-phone-head">
                {/* AI 서비스들이 흔히 쓰는 네 꼭짓점 반짝이 — 특정 회사 로고가 아닌 일반 모양으로 그렸다 */}
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <defs>
                    <linearGradient id="cbSpark" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4f8cff" />
                      <stop offset="100%" stopColor="#9b6bff" />
                    </linearGradient>
                  </defs>
                  <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" fill="url(#cbSpark)" />
                </svg>
                AI 검색
              </p>
              <Chat lines={PATIENT_LINES} />
              <p className="cb-phone-input">무엇이든 물어보세요</p>
            </div>
          </div>
          </div>
          <p className="cb-phone-note">환자가 기억하는 건, <br className="cb-mo" />이 글을 쓴 <b>다른 병원</b>입니다.</p>
        </div>
      </section>

      {/* ── 장면 2 (원장님·실장님 대화) — 바로 다음 '빌린 공간' 장면과 이야기가 겹쳐 숨겨 둔다 (2026-10-23). 되살리려면 주석만 풀면 된다 ──
      <section className="cb-scene cb-talk-scene">
        <div className="cb-wrap">
          <p className="cb-chapter">STORY 02</p>
          <h2 className="cb-h2">글은 매달 올라가는데,{'\n'}왜 우리 병원은 안 보일까요</h2>
          <p className="cb-body">
            블로그 글은 매달 꾸준히 쌓여 갑니다.<br />
            그런데 환자가 검색하는 자리에 <br className="cb-mo" />우리 병원 글은 없습니다.
          </p>
          <Chat lines={OFFICE_LINES} className="cb-talk" />
        </div>
      </section>
      */}

      {/* ── 장면 3 — 방문자 그래프가 떨어지고, 알림이 뜨고, 대화가 이어진다 ── */}
      {/* 앞의 AI 장면(회색)과 붙어 한 덩어리로 보이지 않게 흰 바탕. 다음은 보안(어두운 바탕) */}
      <section className="cb-scene">
        <div className="cb-wrap cb-scene-grid">
          <div className="cb-scene-text">
            <p className="cb-chapter">WHY NOW 02</p>
            <h2 className="cb-h2">그렇다고 <span className="cb-hl">블로그에만</span> 쌓으면,{'\n'}그 글은 병원의 것이 아닙니다</h2>
            <p className="cb-body">
              플랫폼 정책이 바뀌거나 계정에 문제가 생기면,<br />
              몇 년 동안 쌓은 글이 한순간에 힘을 잃습니다.<br />
              <span className="cb-hl">병원이 손쓸 수 있는 게 없습니다.</span>
            </p>
          </div>
          <InView className="cb-drop-col">
            <div className="cb-drop">
              <div className="cb-drop-head">
                <span>블로그 방문자</span>
                <small>최근 12개월</small>
              </div>
              <svg className="cb-drop-chart" viewBox="0 0 400 170" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="cbDropFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f63d6" stopOpacity=".16" />
                    <stop offset="100%" stopColor="#1f63d6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="cb-drop-area" d="M0,140 L40,128 L80,120 L120,104 L160,96 L200,82 L240,70 L280,56 L310,46 L325,150 L360,154 L400,156 L400,170 L0,170 Z" fill="url(#cbDropFill)" />
                <path className="cb-drop-line" d="M0,140 L40,128 L80,120 L120,104 L160,96 L200,82 L240,70 L280,56 L310,46 L325,150 L360,154 L400,156" fill="none" stroke="#1f63d6" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="cb-drop-mark">노출 제한</span>
              <p className="cb-drop-toast">⚠ 블로그 검색 노출이 제한되었습니다</p>
            </div>
            <Chat lines={DROP_LINES} className="cb-after-drop" />
          </InView>
        </div>
      </section>

      {/* ── WHY NOW 03: 그럼 홈페이지는? 옛 기술(PHP) 보안 — 기사 4장 + 옛 방식 vs Next.js (어두운 바탕) ── */}
      <SecurityNews />

      {/* ── 그래서, 웹블로그 — 화면을 붙잡아 두고 답 네 개를 차례로 (메인의 '왜 WEFLOW?' 와 같은 방식) ── */}
      <BlogWhy />

      {/* ── 어떻게 자리 잡나: 글만 쓰면 네이버·구글에 자리 잡고 AI 까지 읽어 가는 구조 — 히어로의 약속을 여기서 보여 준다 ── */}
      <HowItWorks />

      {/* ── 홈페이지 vs 웹블로그 — 둘이 무엇이 다른지 창 두 개로, 바로 아래 '홈페이지와 함께하면'으로 잇는다 ── */}
      <HomeVsBlog />

      {/* ── 홈페이지와 함께하면 + 상품 두 가지 ── */}
      <WithHomepage />

      {/* ── 진행 과정 ── */}
      <section id="process" className="cb-sec cb-step-sec">
        <div className="cb-wrap">
          <p className="cb-chapter">PROCESS</p>
          <h2 className="cb-h2">진행은 이렇게 합니다</h2>
          <ol className="cb-steps">
            {STEPS.map(({ Icon, ...s }, i) => (
              <li key={s.title}>
                {/* 큰 번호는 오른쪽 위에 배경처럼 흐리게 깔고, 앞에는 아이콘 */}
                <b className="cb-step-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</b>
                <span className="cb-step-icon"><Icon size={22} /></span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 자주 묻는 질문 — 메인과 같은 모양 (왼쪽 제목, 오른쪽 목록, 하나씩 열림) ── */}
      <ClinicFaq />

      {/* ── 상담 신청 ── */}
      <section id="contact" className="cb-sec cb-contact">
        <div className="cb-wrap cb-contact-grid">
          <div className="cb-contact-side">
            <p className="cb-chapter">CONTACT</p>
            <h2 className="cb-h2">우리 병원에 맞는 구성부터{'\n'}받아 보세요</h2>
            <p className="cb-body">
              비용은 카테고리 수, 디자인 범위, 홈페이지 연동 방식에 따라 달라집니다.
              상담을 통해 우리 병원에 맞는 구성과 견적을 함께 안내해 드립니다.
            </p>
            {/* 상담에서 받아 가는 것 — 신청하면 무엇을 얻는지 미리 보여 준다 */}
            <ul className="cb-gets">
              {['진료과목에 맞춘 카테고리 구성안', '기존 홈페이지와 연결하는 방식', '예상 일정과 견적'].map(t => (
                <li key={t}><span><Check size={14} /></span>{t}</li>
              ))}
            </ul>
            <a href="tel:010-2971-7280" className="cb-call">
              <Phone size={18} fill="currentColor" /> 전화 상담하기
            </a>
          </div>
          <InquiryForm />
        </div>
      </section>

      <ClinicFooter />

      {/* 오른쪽 아래 떠 있는 상담 버튼 — 첫 화면과 상담 폼에서는 숨는다 */}
      <FloatingCta />

      <style>{CLINIC_BASE_CSS + `
        .cb-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--cb-accent); color: #fff; font-weight: 700; padding: 14px 24px; border-radius: 10px; border: 0; cursor: pointer; text-decoration: none; transition: transform .12s, background .15s; white-space: nowrap; }
        .cb-btn:hover { background: #1852b5; }
        .cb-btn:active { transform: scale(.97); }
        .cb-btn:disabled { opacity: .6; cursor: default; }

        /* 히어로 — 가운데 정렬, 아래로 내려가라는 선 하나 */
        /* 제목 묶음을 화면 세로 정가운데보다 6px 위에 둔다 (아래 여백 12px). 예전엔 16px 위(아래 여백 32px)였는데,
           제목이 세 줄이 되며 위로 붙어 보여 10px 내렸다. 아래 SCROLL 표시도 같은 만큼 내려 둘 사이 간격을 지킨다 */
        .cb-hero { position: relative; overflow: hidden; min-height: 100svh; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 0 0 12px; }
        .cb-hero-inner { position: relative; z-index: 1; width: 100%; }

        /* 제목 강조 — 형광펜이 왼쪽에서 오른쪽으로 칠해진다 */
        .cb-mark { position: relative; z-index: 0; white-space: nowrap; }
        .cb-mark::after { content: ''; position: absolute; z-index: -1; left: -.08em; right: -.08em; bottom: .06em; height: .36em; border-radius: .1em; background: #cfe0fb; transform: scaleX(0); transform-origin: left; animation: cbMark .9s cubic-bezier(.65,0,.35,1) .5s forwards; }
        @keyframes cbMark { to { transform: scaleX(1); } }
        /* 본문 강조 — 섹션의 결론 문장에만 하나씩. 글자 아래쪽 절반에 연한 파랑을 깐다 */
        .cb-hl { color: var(--cb-text); font-weight: 700; background: linear-gradient(transparent 58%, #cfe0fb 58%); padding: 0 .1em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        /* 좁은 화면 — 제목을 위에 두고, 그 아래 채팅 목록 */
        /* 좁은 화면에서는 말풍선이 없으므로 넓은 화면과 같이 제목 묶음을 세로 가운데에 둔다 */
        .cb-tag { font-weight: 700; font-size: clamp(1.05rem, 1.6vw, 1.3rem); letter-spacing: -0.01em; color: var(--cb-accent); margin: 0 0 22px; }
        /* 세 줄 제목 — 한 줄이 넓은 화면 양옆 말풍선(HeroWorries)에 닿지 않게, 휴대폰에서는 줄이 다시 꺾이지 않게 크기를 잡았다 */
        .cb-h1 { font-size: clamp(1.8rem, 5.6vw, 4rem); line-height: 1.22; font-weight: 800; letter-spacing: -0.04em; margin: 0 0 24px; }
        /* 휴대폰 — 화면 폭에 맞춰 더 크게. 가장 긴 줄('글 하나 올렸을 뿐인데,')이 360px 폰에서도 한 줄에 들어가는 만큼 */
        @media (max-width: 767px) { .cb-h1 { font-size: clamp(1.8rem, 9vw, 2.3rem); } }
        /* 두 버튼을 같은 폭으로 — 같은 크기 두 칸 격자라, 글자가 긴 왼쪽 버튼 폭에 오른쪽이 맞춰진다 */
        .cb-hero-btns { display: inline-grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
        .cb-hero-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 15px 28px; border-radius: 999px; border: 1.5px solid #d5d9df; background: rgba(255,255,255,.85); color: var(--cb-text); font-weight: 700; font-size: 1.05rem; text-decoration: none; transition: border-color .15s, background .15s; }
        .cb-hero-btn:hover { border-color: var(--cb-text); background: #fff; }
        .cb-hero-btn--fill { background: var(--cb-text); border-color: var(--cb-text); color: #fff; }
        .cb-hero-btn--fill:hover { background: var(--cb-accent); border-color: var(--cb-accent); }
        .cb-hero-btn--fill svg { position: relative; top: -.75px; } /* 클립보드 아이콘이 글자보다 아래로 처져 보여 살짝 올린다 */
        /* 휴대폰(기본 규칙보다 뒤에 둬야 덮어쓴다) — 위아래로 쌓지 않고 나란히. 화면 폭을 꽉 채우는 두 칸으로 두고 글자·여백을 줄여 한 줄에 들어가게 한다 */
        @media (max-width: 480px) {
          .cb-hero-btns { display: grid; width: 100%; max-width: 340px; margin: 8px auto 0; gap: 8px; }
          .cb-hero-btn { padding: 12px 8px; font-size: .9rem; white-space: nowrap; }
        }
        /* 스크롤 유도 — 'SCROLL' 글자 아래로 선이 흘러내린다 */
        /* 제목이 세 줄이 되며 묶음 아래 끝이 약 40px 내려와, 붙어 보이지 않게 그만큼 더 아래에 둔다 */
        .cb-scroll { position: absolute; left: 50%; bottom: 40px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .cb-scroll em { font-style: normal; font-size: .72rem; font-weight: 700; letter-spacing: .32em; margin-right: -.32em; color: var(--cb-muted); }
        .cb-scroll i { display: block; width: 1px; height: 56px; background: linear-gradient(var(--cb-accent), transparent); animation: cb-drop 1.8s ease-in-out infinite; transform-origin: top; }
        @keyframes cb-drop { 0% { transform: scaleY(0); } 50% { transform: scaleY(1); } 100% { transform: scaleY(1); opacity: 0; } }

        /* 섹션 작은 제목 — 영어 대문자, 글자 사이를 벌린다 (히어로의 SCROLL 과 같은 결) */
        .cb-chapter { font-weight: 700; font-size: .85rem; letter-spacing: .22em; color: var(--cb-accent); margin: 0 0 16px; }
        .cb-h2 { font-size: clamp(1.7rem, 3.8vw, 2.5rem); line-height: 1.32; font-weight: 800; letter-spacing: -0.035em; margin: 0; white-space: pre-line; }
        .cb-body { color: var(--cb-sub); font-size: 1.05rem; line-height: 1.8; margin: 20px 0 0; }

        /* 장면 — 왼쪽 글, 오른쪽 대화창 */
        .cb-scene { padding: 96px 0; }
        .cb-scene-alt { background: var(--cb-soft); }
        /* STORY 01~03 의 설명 글 크기를 하나로 맞춘다 */
        .cb-scene .cb-body { font-size: 1.15rem; }
        @media (min-width: 960px) { .cb-scene { padding: 140px 0; } }
        .cb-scene-grid { display: grid; gap: 40px; align-items: center; }
        @media (min-width: 960px) { .cb-scene-grid { grid-template-columns: 1fr 1fr; gap: 80px; } }
        /* 글과 그림이 위아래로 쌓이는 화면 — STORY 01·02 처럼 글을 가운데로 */
        @media (max-width: 959px) { .cb-scene-text { text-align: center; } }

        .cb-chat { display: flex; flex-direction: column; gap: 14px; background: #fff; border: 1px solid var(--cb-line); border-radius: 24px; padding: 28px 20px; box-shadow: 0 20px 50px rgba(17,20,24,.06); }
        @media (min-width: 768px) { .cb-chat { padding: 36px 32px; } }
        .cb-line { display: flex; gap: 10px; align-items: flex-end; opacity: 0; transform: translateY(14px); transition: opacity .45s ease, transform .45s ease; transition-delay: calc(var(--i) * .55s); }
        .cb-chat.is-in .cb-line { opacity: 1; transform: none; }
        .cb-right { flex-direction: row-reverse; }
        .cb-avatar { flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: 800; background: #e8edf5; color: #44506a; }
        .cb-who-ai .cb-avatar { background: #111418; color: #fff; }
        .cb-who-director .cb-avatar, .cb-who-patient .cb-avatar { background: #e6eefc; color: var(--cb-accent); }
        .cb-bubble-wrap { display: flex; flex-direction: column; max-width: 78%; }
        .cb-right .cb-bubble-wrap { align-items: flex-end; }
        .cb-name { font-size: .75rem; color: var(--cb-muted); margin: 0 4px 4px; }
        .cb-bubble { margin: 0; padding: 12px 16px; border-radius: 18px; line-height: 1.55; font-size: .97rem; background: var(--cb-bubble-you); border-bottom-left-radius: 6px; }
        .cb-right .cb-bubble { background: var(--cb-bubble-me); color: #fff; border-bottom-left-radius: 18px; border-bottom-right-radius: 6px; }
        .cb-bubble-cta { margin-top: 8px; display: inline-block; background: #fff; color: var(--cb-accent); border: 1.5px solid var(--cb-accent); font-weight: 700; font-size: .88rem; padding: 8px 16px; border-radius: 999px; }

        /* 장면 2 — 상자 없이 가운데에서 큰 말풍선 */
        .cb-talk-scene { text-align: center; }
        .cb-talk-scene .cb-body { max-width: 600px; margin-left: auto; margin-right: auto; }
        .cb-talk { max-width: 720px; margin: 64px auto 0; background: none; border: 0; box-shadow: none; padding: 0; gap: 22px; text-align: left; }
        .cb-talk .cb-avatar { width: 44px; height: 44px; font-size: .8rem; }
        .cb-talk .cb-bubble { font-size: clamp(1.02rem, 1.8vw, 1.2rem); padding: 16px 22px; border-radius: 24px; }
        .cb-talk .cb-left .cb-bubble { border-bottom-left-radius: 8px; }
        .cb-talk .cb-right .cb-bubble { border-bottom-right-radius: 8px; }
        .cb-talk .cb-name { font-size: .85rem; font-weight: 700; }
        .cb-time { font-size: .75rem; color: var(--cb-muted); margin: 6px 6px 0; }
        /* 휴대폰 — 아바타·말풍선 여백을 줄여 말풍선 폭을 넓게 쓴다 */
        /* 휴대폰 — 아바타를 빼고(이름만 남김) 말풍선을 메신저처럼 작고 좁게. 좌우로 엇갈려 대화처럼 보이게 한다 */
        @media (max-width: 640px) {
          .cb-talk { margin-top: 40px; gap: 14px; }
          .cb-talk .cb-avatar { display: none; }
          .cb-talk .cb-bubble-wrap { max-width: 78%; }
          .cb-talk .cb-bubble { font-size: .95rem; padding: 11px 15px; border-radius: 18px; }
          .cb-talk .cb-left .cb-bubble { border-bottom-left-radius: 6px; }
          .cb-talk .cb-right .cb-bubble { border-bottom-right-radius: 6px; }
          .cb-talk .cb-name { font-size: .78rem; }
          .cb-time { font-size: .7rem; margin-top: 4px; }
        }

        /* 장면 3 — 방문자 그래프가 그려지다 뚝 떨어진다 */
        .cb-drop-col { display: grid; gap: 20px; }
        .cb-drop { position: relative; background: #fff; border: 1px solid var(--cb-line); border-radius: 24px; padding: 24px 24px 20px; box-shadow: 0 20px 50px rgba(17,20,24,.06); overflow: hidden; }
        .cb-drop-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
        .cb-drop-head span { font-weight: 800; }
        .cb-drop-head small { color: var(--cb-muted); font-size: .8rem; }
        .cb-drop-chart { display: block; width: 100%; height: 170px; overflow: visible; }
        .cb-drop-line { stroke-dasharray: 900; stroke-dashoffset: 900; }
        .cb-drop-area { opacity: 0; }
        .cb-drop-col.is-in .cb-drop-line { transition: stroke-dashoffset 2s cubic-bezier(.45,.05,.3,1); stroke-dashoffset: 0; }
        .cb-drop-col.is-in .cb-drop-area { transition: opacity .8s ease 1.2s; opacity: 1; }
        .cb-drop-mark { position: absolute; left: 78%; top: 76px; padding: 4px 10px; border-radius: 999px; background: #fdecec; color: #d64545; font-size: .78rem; font-weight: 800; opacity: 0; transform: translateY(6px); transition: opacity .4s ease, transform .4s ease; }
        .cb-drop-col.is-in .cb-drop-mark { opacity: 1; transform: none; transition-delay: 1.6s; }
        .cb-drop-toast { position: absolute; left: 16px; right: 16px; top: 14px; margin: 0; padding: 12px 16px; border-radius: 14px; background: #111418; color: #fff; font-size: .9rem; font-weight: 700; opacity: 0; transform: translateY(-120%); transition: opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1); }
        .cb-drop-col.is-in .cb-drop-toast { opacity: 1; transform: none; transition-delay: 2.1s; }
        /* 그래프가 다 떨어진 뒤에 대화가 시작된다 */
        /* 그래프와 대화는 한 묶음(.cb-drop-col)이 화면에 들어오는 순간 같이 시작해, 2.6초에 같이 끝난다.
           그래프: 선 0~2s, 노출 제한 표시 1.6~2.0s, 알림 2.1~2.6s
           대화: 세 줄이 0s · 1.075s · 2.15s 에 올라와 각각 .45s 걸린다 → 마지막이 2.6s 에 끝 */
        .cb-drop-col .cb-after-drop .cb-line { opacity: 0; transform: translateY(14px); transition-delay: calc(var(--i) * 1.075s); }
        .cb-drop-col.is-in .cb-after-drop .cb-line { opacity: 1; transform: none; }

        /* 출처 카드 — AI 답변이 인용한 글 */
        .cb-bubble.cb-src { background: #fff; border: 1.5px solid var(--cb-line); font-weight: 700; }
        .cb-src small { display: block; font-size: .75rem; font-weight: 700; color: #e05252; margin-bottom: 2px; }

        /* 장면 1 — 가운데 정렬, 휴대폰 화면 */
        .cb-phone-scene { text-align: center; }
        .cb-phone-scene .cb-body { max-width: 600px; margin-left: auto; margin-right: auto; }
        /* 넓은 화면: 둘째 줄("증상과 치료법을 검색하고 … 기억합니다.")이 한 줄에 들어가게 폭을 넓힌다 */
        @media (min-width: 768px) { .cb-phone-scene .cb-body { max-width: 860px; } }
        /* PC 검색 화면(SearchMock) + 휴대폰 — 넓은 화면에서 나란히, 위아래 가운데 맞춤 */
        .cb-ai-visual { margin-top: 56px; }
        @media (min-width: 960px) { .cb-ai-visual { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 48px; align-items: center; } }
        .cb-phone { width: min(340px, 100%); margin: 0 auto; padding: 11px; border-radius: 48px; background: #111418; box-shadow: 0 30px 80px rgba(17,20,24,.18); text-align: left; }
        .cb-phone-screen { background: #fff; border-radius: 38px; overflow: hidden; display: flex; flex-direction: column; min-height: 600px; }
        .cb-phone-status { height: 40px; display: flex; justify-content: center; align-items: center; }
        .cb-phone-status i { width: 90px; height: 24px; border-radius: 999px; background: #111418; }
        .cb-phone-head { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0; padding: 4px 0 12px; text-align: center; font-weight: 800; font-size: .95rem; border-bottom: 1px solid var(--cb-line); }
        .cb-phone .cb-chat { flex: 1; border: 0; border-radius: 0; box-shadow: none; padding: 20px 14px; gap: 10px; }
        .cb-phone .cb-avatar, .cb-phone .cb-name { display: none; }
        .cb-phone .cb-bubble-wrap { max-width: 86%; }
        .cb-phone .cb-bubble { font-size: .92rem; }
        .cb-phone-input { margin: 0 14px 18px; padding: 12px 18px; border-radius: 999px; background: var(--cb-soft); color: var(--cb-muted); font-size: .9rem; }
        .cb-phone-note { margin: 56px 0 0; /* 설명 두 줄 ↔ 그림 간격(.cb-ai-visual 의 56px)과 같게 */ font-size: 1.22rem; color: var(--cb-sub); }
        .cb-phone-note b { color: #e05252; }

        /* 공통 섹션 여백 */
        .cb-sec { padding: 96px 0; }
        @media (min-width: 960px) { .cb-sec { padding: 140px 0; } }
        .cb-step-sec { border-top: 1px solid var(--cb-line); }

        /* 진행 방식 */
        /* 단계마다 연회색 둥근 박스 — 넓은 화면에서는 한 줄에 넷.
           폭은 바로 아래 자주 묻는 질문(내용 폭 1120px)과 같은 선에 맞춘다 (좌우 여백 20px×2 포함 1160px) */
        .cb-step-sec .cb-wrap { max-width: 1160px; }
        .cb-steps { list-style: none; padding: 0; margin: 48px 0 0; display: grid; gap: 14px; }
        @media (min-width: 640px) { .cb-steps { grid-template-columns: 1fr 1fr; } }
        /* 휴대폰 — 옆으로 넘기는 줄. 박스 폭을 화면의 76%로 둬서 다음 박스가 1/3쯤 보이게 하고(넘길 수 있다는 신호),
           스크롤 막대는 숨긴다. 화면 양끝까지 붙여 넘기고, 멈출 때는 박스 왼쪽이 본문 여백(20px)에 맞는다 */
        @media (max-width: 639px) {
          .cb-steps { grid-auto-flow: column; grid-auto-columns: 76%; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 20px; margin-left: -20px; margin-right: -20px; padding: 0 20px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .cb-steps::-webkit-scrollbar { display: none; }
          .cb-steps li { scroll-snap-align: start; }
        }
        @media (min-width: 1024px) { .cb-steps { grid-template-columns: repeat(4, 1fr); gap: 22px; } }
        .cb-steps li { position: relative; overflow: hidden; background: var(--cb-soft); border-radius: 24px; padding: 28px 26px 30px; display: flex; flex-direction: column; }
        @media (min-width: 1024px) { .cb-steps li { min-height: 200px; padding: 32px 32px 34px; } }
        .cb-step-no { position: absolute; top: 10px; right: 20px; font-size: 4.6rem; font-weight: 900; line-height: 1; letter-spacing: -0.04em; color: #e4e9f0; pointer-events: none; }
        .cb-step-icon { position: relative; display: inline-flex; width: 48px; height: 48px; align-items: center; justify-content: center; border-radius: 14px; background: #fff; color: var(--cb-accent); box-shadow: 0 6px 18px rgba(17,20,24,.06); }
        .cb-steps h3 { position: relative; margin: 22px 0 10px; font-size: 1.3rem; font-weight: 800; letter-spacing: -0.02em; }
        .cb-steps p { position: relative; white-space: pre-line; margin: 0; color: var(--cb-sub); font-size: .98rem; line-height: 1.7; }


        /* 상담 */
        /* 왼쪽 위에서 번지는 옅은 파란 빛 — 흰 바탕만 이어지던 끝부분에 마무리 느낌을 준다 */
        .cb-contact { background: radial-gradient(55% 60% at 0% 0%, #e8f1ff 0%, rgba(232,241,255,0) 70%), radial-gradient(40% 50% at 100% 100%, #eef5ff 0%, rgba(238,245,255,0) 70%), #fff; }
        .cb-contact-grid { display: grid; gap: 40px; }
        @media (min-width: 960px) { .cb-contact-grid { grid-template-columns: 1fr 1.2fr; gap: 64px; align-items: center; } }
        .cb-gets { list-style: none; padding: 0; margin: 32px 0 0; display: grid; gap: 12px; }
        .cb-gets li { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.02rem; }
        .cb-gets span { flex: none; width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--cb-accent); color: #fff; }
        /* 전화 상담 — 흰 바탕 테두리 버튼, 수화기는 플로팅 전화 버튼과 같은 초록 */
        .cb-call { display: inline-flex; align-items: center; gap: 8px; margin-top: 36px; padding: 14px 22px; border-radius: 999px; background: #fff; border: 1.5px solid #d5d9df; color: #111418; font-weight: 700; text-decoration: none; transition: transform .15s, border-color .15s, box-shadow .15s; }
        .cb-call svg { color: #16a34a; }
        .cb-call:hover { transform: translateY(-1px); border-color: #111418; box-shadow: 0 8px 20px rgba(17,20,24,.08); }

        /* 신청서 — 흰 카드에 그림자, 입력칸은 연회색으로 채워 두고 누르면 흰 바탕 + 파란 테두리 */
        .cb-form { background: #fff; color: var(--cb-text); border: 1px solid var(--cb-line); border-radius: 24px; box-shadow: 0 24px 60px rgba(17,20,24,.08); padding: 26px 20px; display: grid; gap: 16px; position: relative; }
        #contact-form { scroll-margin-top: 24px; }
        /* 문의 유형 칩 — 고르면 파란 테두리, 상품 카드에서 넘어오면 미리 골라져 있다 */
        .cb-field-label { display: block; font-weight: 700; font-size: .9rem; margin-bottom: 8px; }
        .cb-plan-chips { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } /* 네 가지라 2×2 */
        .cb-plan-chip { padding: 12px 8px; border-radius: 12px; border: 1.5px solid transparent; background: var(--cb-soft); color: var(--cb-sub); font: inherit; font-size: .92rem; font-weight: 700; cursor: pointer; transition: background .15s, color .15s, border-color .15s; word-break: keep-all; }
        .cb-plan-chip:hover { border-color: #d5d9df; }
        .cb-plan-chip.is-on { background: #fff; color: var(--cb-accent); border-color: var(--cb-accent); } /* 고르면 흰 바탕에 파란 테두리·글자 */

        .cb-form-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--cb-line); }
        .cb-form-head strong { font-size: 1.25rem; letter-spacing: -0.02em; }
        .cb-form-head span { font-size: .82rem; color: var(--cb-muted); }
        .cb-form-head i { color: #e05252; font-style: normal; }
        @media (min-width: 768px) { .cb-form { padding: 36px; grid-template-columns: 1fr 1fr; } .cb-full { grid-column: 1 / -1; } }
        .cb-field label { display: block; font-weight: 700; font-size: .9rem; margin-bottom: 6px; }
        .cb-field label i { color: #e05252; font-style: normal; margin-left: 2px; }
        .cb-optional { font-weight: 500; color: var(--cb-muted); }
        .cb-field input, .cb-field select, .cb-field textarea { width: 100%; border: 1px solid transparent; border-radius: 12px; padding: 13px 15px; font: inherit; font-size: 1rem; color: var(--cb-text); background-color: var(--cb-soft); transition: background-color .15s; }
        /* 바탕은 background-color 로만 바꾼다 — background 로 통째로 바꾸면 드롭다운 꺾쇠 그림의 위치가 초기화돼 날아다닌다 */
        .cb-field input:focus, .cb-field select:focus, .cb-field textarea:focus { background-color: #fff; }
        .cb-field input:focus, .cb-field select:focus, .cb-field textarea:focus { outline: 2px solid var(--cb-accent); outline-offset: -1px; border-color: transparent; }
        .cb-field textarea { min-height: 96px; resize: vertical; }
        /* 진료과목 드롭다운 — 브라우저 기본 화살표를 지우고 얇은 꺾쇠를 오른쪽에 그린다.
           아직 고르지 않았을 때(:invalid)는 안내 글자처럼 흐리게 */
        .cb-field select { appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 44px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%238a919c' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; background-size: 12px 8px; }
        .cb-field select:hover { background-color: #eef0f3; }
        .cb-field select:focus { background-color: #fff; }
        .cb-field select:invalid { color: #9aa1ac; }
        .cb-field select option { color: var(--cb-text); }
        .cb-agree { display: flex; gap: 8px; align-items: center; font-size: .88rem; color: var(--cb-sub); line-height: 1.55; } /* 체크박스를 글자 줄 세로 가운데에 */
        .cb-agree i { color: #e05252; font-style: normal; margin-left: 2px; }
        .cb-agree:has(.cb-agree-view) { align-items: flex-start; } /* 두 줄이 되면 체크박스를 첫 줄에 맞춘다 */
        .cb-agree:has(.cb-agree-view) input { margin-top: 2px; }
        .cb-agree-view { color: var(--cb-muted); text-decoration: underline; text-underline-offset: 3px; }
        .cb-agree-view:hover { color: var(--cb-sub); }
        .cb-agree input { margin: 0; width: 18px; height: 18px; accent-color: var(--cb-accent); flex-shrink: 0; }
        .cb-error { color: #c53030; font-size: .9rem; margin: 0; }
        /* 칸별 안내 — 빠진 필수 칸은 빨간 테두리, 그 아래 빨간 한 줄 */
        .cb-field-err { margin: 6px 2px 0; color: #d64545; font-size: .85rem; font-weight: 600; }
        .cb-field.is-err input { border-color: #e05252; background-color: #fff; }
        .cb-agree.is-err { color: #d64545; }
        .cb-form .cb-btn { width: 100%; padding: 16px; font-size: 1.05rem; }
        /* 신청 완료 — 체크가 그려지고, 다음에 무슨 일이 일어나는지 세 단계로 보여 준다 */
        .cb-done { position: relative; overflow: hidden; background: #fff; color: var(--cb-text); border: 1px solid var(--cb-line); box-shadow: 0 24px 60px rgba(17,20,24,.08); border-radius: 24px; padding: 52px 28px 40px; text-align: center; }
        .cb-done::before { content: ''; position: absolute; left: 50%; top: -120px; width: 420px; height: 260px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(31,99,214,.14), rgba(31,99,214,0)); pointer-events: none; }
        .cb-done-check { position: relative; width: 76px; height: 76px; margin: 0 auto; }
        .cb-done-check svg { width: 100%; height: 100%; }
        .cb-done-check circle { fill: #1f63d6; transform-origin: center; animation: cbDonePop .5s cubic-bezier(.34,1.56,.64,1) both; }
        .cb-done-check path { fill: none; stroke: #fff; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40; stroke-dashoffset: 40; animation: cbDoneDraw .45s ease-out .35s forwards; }
        .cb-done-check::after { content: ''; position: absolute; inset: 0; border-radius: 50%; animation: cbDoneRing 1.1s ease-out .2s both; }
        @keyframes cbDonePop { from { transform: scale(.4); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes cbDoneDraw { to { stroke-dashoffset: 0; } }
        @keyframes cbDoneRing { from { box-shadow: 0 0 0 0 rgba(31,99,214,.35); } to { box-shadow: 0 0 0 22px rgba(31,99,214,0); } }
        .cb-done h3 { position: relative; margin: 24px 0 10px; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; }
        .cb-done > p { position: relative; color: #3a414c; font-weight: 500; margin: 0; line-height: 1.7; }
        .cb-done-steps { position: relative; list-style: none; padding: 0; margin: 32px auto 0; max-width: 420px; display: grid; grid-template-columns: repeat(3, 1fr); }
        .cb-done-steps::before { content: ''; position: absolute; top: 15px; left: 16.6%; right: 16.6%; height: 2px; background: linear-gradient(90deg, #1f63d6 0 50%, #e3e7ed 50% 100%); }
        .cb-done-steps li { position: relative; display: grid; justify-items: center; gap: 8px; font-size: .85rem; font-weight: 700; color: var(--cb-muted); }
        .cb-done-steps b { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: #fff; border: 2px solid #e3e7ed; color: var(--cb-muted); font-size: .85rem; }
        .cb-done-steps li.is-done { color: var(--cb-text); }
        .cb-done-steps li.is-done b { background: #1f63d6; border-color: #1f63d6; color: #fff; }
        .cb-done-steps li.is-now { color: #1f63d6; }
        /* 진행 단계와 선으로 나누고 넉넉히 띄운다. '.cb-done > p' 의 margin: 0 보다 세게 걸리도록 .cb-done 을 붙였다 */
        .cb-done .cb-done-more { max-width: 420px; margin: 24px auto 12px; padding-top: 24px; border-top: 1px solid var(--cb-line); font-size: .9rem; font-weight: 600; color: var(--cb-muted); }
        /* 버튼 두 개 — 휴대폰에서도 가로 두 칸, 같은 폭 */
        .cb-done-links { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 420px; margin: 0 auto; }
        .cb-done-link { display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 13px 10px; border-radius: 999px; border: 1.5px solid #d5d9df; font-size: .92rem; font-weight: 700; color: var(--cb-text); text-decoration: none; white-space: nowrap; transition: border-color .15s, color .15s; }
        @media (max-width: 420px) { .cb-done-links { gap: 8px; } .cb-done-link { padding: 12px 6px; font-size: .84rem; gap: 2px; } .cb-done-link svg { width: 14px; height: 14px; } }
        .cb-done-link:hover { border-color: #1f63d6; color: #1f63d6; }
        .cb-done-steps li.is-now b { border-color: #1f63d6; color: #1f63d6; animation: cbDoneNow 1.6s ease-in-out infinite; }
        @keyframes cbDoneNow { 0%, 100% { box-shadow: 0 0 0 0 rgba(31,99,214,.25); } 50% { box-shadow: 0 0 0 6px rgba(31,99,214,0); } }
        @media (prefers-reduced-motion: reduce) { .cb-done-check circle, .cb-done-check::after, .cb-done-steps li.is-now b { animation: none; } .cb-done-check path { animation: none; stroke-dashoffset: 0; } }

        /* 움직임을 줄여 달라고 설정한 방문자에게는 처음부터 다 보여 준다 */
        @media (prefers-reduced-motion: reduce) {
          .cb-line { opacity: 1; transform: none; transition: none; }
          .cb-mark::after { animation: none; transform: none; }
          .cb-drop-line { stroke-dashoffset: 0; }
          .cb-drop-area, .cb-drop-mark, .cb-drop-toast { opacity: 1; transform: none; }
          .cb-scroll i { animation: none; }
        }
      `}</style>
    </div>
  )
}
