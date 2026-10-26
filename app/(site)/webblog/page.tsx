import type { Metadata } from 'next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { CLINIC_BASE_CSS, SCENE_CSS } from '../clinic-blog/base-css'
import { AiSearchScene, PlatformDropScene, type Line } from '../clinic-blog/Scenes'
import SecurityNews from '../clinic-blog/SecurityNews'
import BlogWhy from '../clinic-blog/BlogWhy'
import { GENERAL_WHY } from '../clinic-blog/blogWhyCopy'
import HowItWorks from '../clinic-blog/HowItWorks'
import IndustryGrid from './IndustryGrid'
import HeroBackdrop from './HeroBackdrop'
import HomeVsBlog from '../clinic-blog/HomeVsBlog'
import WithHomepage from '../clinic-blog/WithHomepage'
import { HV_GENERAL, WH_GENERAL } from '../clinic-blog/homeCopy'
import ServiceCTA from '@/components/service/ServiceCTA'

/**
 * /webblog — 메인 사이트 '웹블로그란?' 탭 (헤더에서 사이트 점검 왼쪽).
 *
 * 병의원 웹블로그 페이지(/clinic-blog)의 흐름을 업종 공통으로 옮긴 것 — 섹션 부품은 그 폴더 것을 같이 쓰고 글귀만 바꿔 넘긴다.
 * 흐름: 웹블로그, 생소하시죠?(히어로) → 지금 놓치고 있는 것 셋(WHY NOW 01 검색·AI · 02 네이버 블로그 · 03 PHP 보안)
 *      → 같은 글을 써도 웹블로그는 다릅니다(BlogWhy) → 글만 쓰면 네이버·구글·AI 까지(HowItWorks)
 *      → 홈페이지 vs 웹블로그(HomeVsBlog) → 함께하면 + 상품(WithHomepage) → 전 업종 가능(IndustryGrid) → 견적(ServiceCTA)
 * 병의원 페이지와 달리 단독 랜딩이 아니라 메인 사이트 헤더·푸터·하단 버튼이 그대로 붙는다. 견적은 사이트 공통 /diagnosis 로 보낸다.
 * 색·글꼴 크기는 .cb 묶음(CLINIC_BASE_CSS) 안에서만 정의돼 메인 사이트의 어두운 테마와 섞이지 않는다.
 */

export const metadata: Metadata = {
  title: '웹블로그란? · WEFLOW',
  description:
    '우리 홈페이지 안에 쌓이는 블로그, 웹블로그. 글 하나만 올려도 네이버·구글 검색과 AI 답변에 맞춰지는 구조(SEO·AEO·GEO)를 Next.js로 만듭니다. 병원부터 인테리어·학원·법률까지 전 업종 가능합니다.',
  alternates: { canonical: '/webblog' },
  // 10-26: 메뉴에서 내렸고 내용이 웹블로그(/blog) 메인으로 옮겨가 검색에서 뺀다 (사이트맵에서도 뺐다). 링크는 따라가게 둔다
  robots: { index: false, follow: true },
  openGraph: {
    title: '웹블로그란? · WEFLOW',
    description: '경쟁업체보다 먼저 검색되는 방법 — 우리 홈페이지 안에 쌓이는 웹블로그.',
    url: '/webblog',
    // openGraph 를 정의하면 루트의 것을 통째로 덮어쓴다 — 이미지도 여기서 다시 지정해야 한다
    images: [{ url: '/images/main/og-logo-2.jpg', width: 1200, height: 630 }],
  },
}

const CUSTOMER = { who: 'me', name: '손님', short: '손님' } as const
const AI = { who: 'ai', name: 'AI 검색', short: 'AI' } as const
const BOSS = { who: 'boss', name: '대표님', short: '대표' } as const
const STAFF = { who: 'staff', name: '직원', short: '직원' } as const

/** WHY NOW 01 — 손님이 휴대폰으로 AI 에게 묻는다 */
const AI_LINES: Line[] = [
  { ...CUSTOMER, text: '욕실 리모델링하면 공사 기간 며칠 걸려?' },
  { ...AI, text: '보통 5~7일 정도 걸립니다. 아래 글에 공정별로 잘 정리돼 있어요.' },
  { ...AI, text: '욕실 리모델링 공정과 기간 총정리', source: '다른 업체 블로그' },
  { ...CUSTOMER, text: '오 설명 잘 돼 있네. 여기 견적 받아 볼까?' },
]

/** WHY NOW 02 — 방문자 그래프가 뚝 떨어진 뒤 */
const DROP_LINES: Line[] = [
  { ...STAFF, text: '대표님, 블로그 노출이 갑자기 다 빠졌어요.' },
  { ...BOSS, text: '3년 동안 쓴 글인데요?' },
  { ...STAFF, text: '플랫폼 쪽 문제라 저희가 할 수 있는 게 없대요.' },
]

/** WHY NOW 01 왼쪽 PC 검색 화면 — 휴대폰(인테리어)과 다른 업종(세무)으로 둬 "어느 업종이든 같다"가 보이게 */
const SEARCH = {
  query: '종합소득세 신고 방법',
  results: [
    { blog: '○○세무회계 블로그', ago: '2일 전', title: '종합소득세 신고 기간·준비 서류 총정리', text: '5월 신고 기간에 맞춰 준비할 서류와 홈택스 신고 순서를 한 번에 정리했습니다.' },
    { blog: '△△세무사사무소 블로그', ago: '5일 전', title: '프리랜서 종합소득세, 경비 처리는 어디까지?', text: '사업소득으로 신고할 때 인정받을 수 있는 경비와 놓치기 쉬운 항목을 설명합니다.' },
    { blog: '□□택스 블로그', ago: '1주 전', title: '종합소득세 환급, 이런 경우 받을 수 있어요', text: '미리 낸 세금이 더 많았다면 돌려받을 수 있습니다. 대표적인 경우를 예로 보여 드립니다.' },
  ],
  emptyText: '우리 회사 글은 보이지 않습니다',
}

export default function WebBlogPage() {
  return (
    <>
      <div className="cb wb">
        {/* ── 히어로 — 생소한 말을 먼저 짚고, 경쟁업체를 이기는 방법이라고 답한다 ── */}
        {/* 배경은 웹블로그(/blog) 히어로와 같게 — 격자·번짐·궤도·마우스 픽셀 (HeroBackdrop) */}
        <section className="wb-hero">
          <HeroBackdrop />
          <div className="cb-wrap">
            <p className="wb-tag">WEFLOW 웹블로그</p>
            <h1 className="wb-h1">
              웹블로그, 생소하시죠?<br />
              <span className="cb-mark">경쟁업체보다 먼저</span><br className="cb-mo" /> 검색되는 방법입니다
            </h1>
            <p className="wb-lead">
              우리 홈페이지 안에 쌓이는 블로그.<br />
              글 하나만 올려도 <br className="cb-mo" /><b>네이버·구글 검색</b>과 <b>AI 답변</b>에 맞춰집니다.
            </p>
            <div className="wb-btns">
              <a href="/diagnosis" className="wb-btn wb-btn--fill">맞춤 견적 받기 <ArrowRight size={18} /></a>
              <a href="/blog" target="_blank" rel="noopener noreferrer" className="wb-btn">실제 웹블로그 보기 <ArrowUpRight size={18} /></a>
            </div>
          </div>
        </section>

        <AiSearchScene
          id="story"
          title={<>요즘 손님은{'\n'}<span className="cb-hl">검색창과 AI에게</span> 먼저 묻습니다</>}
          body={<>
            맡길 곳을 찾는 손님은 <br className="cb-mo" />바로 전화하지 않습니다.<br />
            궁금한 걸 검색하고 AI에게도 물어본 뒤, <br className="cb-mo" />거기서 만난 글을 쓴 업체를 기억합니다.
          </>}
          search={SEARCH}
          lines={AI_LINES}
          note={<>손님이 기억하는 건, <br className="cb-mo" />이 글을 쓴 <b>경쟁업체</b>입니다.</>}
        />

        <PlatformDropScene
          title={<>그렇다고 <span className="cb-hl">블로그에만</span> 쌓으면,{'\n'}그 글은 우리 것이 아닙니다</>}
          body={<>
            블로그 검색 노출은 갈수록 줄고, <br className="cb-mo" />플랫폼 정책은 언제든 바뀝니다.<br />
            몇 년 동안 쌓은 글이 한순간에 힘을 잃어도<br />
            <span className="cb-hl">우리가 손쓸 수 있는 게 없습니다.</span>
          </>}
          lines={DROP_LINES}
        />

        <SecurityNews who="우리 회사" />

        <BlogWhy copy={GENERAL_WHY} />

        <HowItWorks who="우리" customer="손님이" />

        {/* 홈페이지와 무엇이 다르고, 함께하면 무엇이 좋은지 (상품 카드는 빼고, 견적은 맨 아래 CTA 로) */}
        <HomeVsBlog copy={HV_GENERAL} />
        <WithHomepage copy={WH_GENERAL} />

        <IndustryGrid />
      </div>

      <ServiceCTA
        title={<>우리 업종 웹블로그,<br />어떻게 만들지 궁금하다면?</>}
        sub={<>카테고리 구성부터 비용까지, <br className="svc-cta__br" />맞춤 견적으로 바로 정리해 드립니다.</>}
      />

      <style>{CLINIC_BASE_CSS + SCENE_CSS + `
        /* 메인 사이트 헤더(64px)가 위에 붙어 있어 .cb 의 최소 높이(100vh)는 필요 없다 */
        .wb { min-height: 0; }
        .cb-mo { display: inline; }
        @media (min-width: 768px) { .cb-mo { display: none; } }

        /* 첫 화면을 꽉 채운다 — 메인 사이트 헤더(64px)를 뺀 높이, 내용은 세로 가운데 */
        .wb-hero { position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: center; min-height: calc(100svh - 64px); padding: 64px 0; text-align: center; background: #fff; }
        .wb-hero > .cb-wrap { width: 100%; }
        /* 휴대폰 — 화면 아래 고정 바(56px + 홈 인디케이터 몫, styles/globals.css 의 .mobile-cta-bar) 위에서 끝나, 조금만 내려도 다음 섹션이 이어진다 */
        @media (max-width: 768px) { .wb-hero { min-height: calc(100svh - 64px - 56px - max(0px, env(safe-area-inset-bottom) - 0.75rem)); padding: 32px 0; } }
        .wb-tag { margin: 0 0 20px; font-weight: 700; font-size: clamp(1rem, 1.5vw, 1.2rem); color: var(--cb-accent); }
        .wb-h1 { margin: 0; font-size: clamp(2rem, 5vw, 3.8rem); line-height: 1.25; font-weight: 800; letter-spacing: -0.04em; }
        @media (max-width: 767px) { .wb-h1 { font-size: clamp(1.8rem, 8.4vw, 2.3rem); } }
        .wb-lead { margin: 24px 0 0; font-size: clamp(1.02rem, 1.6vw, 1.2rem); line-height: 1.75; color: var(--cb-sub); }
        .wb-lead b { color: var(--cb-text); }
        .wb-btns { display: inline-grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 36px; }
        .wb-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 15px 26px; border-radius: 999px; border: 1.5px solid #d5d9df; background: #fff; color: var(--cb-text); font-weight: 700; font-size: 1rem; text-decoration: none; white-space: nowrap; transition: border-color .15s, background .15s; }
        .wb-btn:hover { border-color: var(--cb-text); }
        .wb-btn--fill { background: var(--cb-text); border-color: var(--cb-text); color: #fff; }
        .wb-btn--fill:hover { background: var(--cb-accent); border-color: var(--cb-accent); }
        @media (max-width: 480px) { .wb-btns { display: grid; width: 100%; max-width: 340px; margin: 32px auto 0; gap: 8px; } .wb-btn { padding: 13px 8px; font-size: .9rem; } }
      `}</style>
    </>
  )
}
