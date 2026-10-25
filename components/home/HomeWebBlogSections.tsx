import Image from 'next/image'
import { IconStethoscope, IconCheck, IconArrowUpRight, IconArticle, IconCalendarEvent, IconSparkles } from '@tabler/icons-react'
import { subIndustriesOf } from '@/blog/lib/industries'
import HomePhpSection from '@/components/home/HomePhpSection'
import InView from '@/app/(site)/clinic-blog/InView'
import { CLINIC_BASE_CSS } from '@/app/(site)/clinic-blog/base-css'

/**
 * 메인 — 제작 사례 바로 아래 세 섹션 (웹블로그 출시 알림 묶음).
 *  1) PHP 보안: 메인 카드 섹션 모양으로 다시 그린 보안 뉴스 · PHP란? · 옛 방식 vs WEFLOW (HomePhpSection)
 *  2) 웹블로그 출시: 무엇인지 짧게 + 실제 웹블로그(/blog)로 들어가는 버튼, 오른쪽에 실제 글 썸네일 여섯 장으로 그린 목록 화면 (연한 하늘 바탕)
 *  3) 병의원 전용: 병의원 웹블로그 페이지(/clinic-blog)로 보내는 파란 띠 (웹블로그 메인의 FOR CLINICS 와 같은 글귀)
 * 바깥 페이지(/blog·/clinic-blog)는 새 탭으로 연다 — 메인을 보던 자리를 잃지 않게.
 * 병의원 페이지 부품의 색·폭 변수(.cb, CLINIC_BASE_CSS)를 쓰되 최소 높이(100vh)는 끈다.
 */
const LAUNCH_POINTS = ['글만 올리면 SEO·AEO·GEO 구조가 저절로', '우리 홈페이지 주소 안에 쌓이는 블로그', '병원부터 인테리어·학원까지 전 업종']
// mo: 휴대폰(두 칸)에서만 쓰는 짧은 제목 — 너무 긴 제목만 뒤를 중간점(···)으로 줄인다. 비어 있으면 휴대폰도 전체 제목
const LAUNCH_POSTS = [
  { src: '/images/home/webblog-post-1.webp', tag: '병의원 · 치과', title: '치과에 웹블로그가 필요한 이유', mo: '' },
  { src: '/images/home/webblog-post-2.webp', tag: '생활·서비스 · 인테리어', title: '인테리어 업체에 웹블로그가 필요한 이유', mo: '인테리어 업체에 웹블로그가···' },
  { src: '/images/home/webblog-post-3.webp', tag: '웹블로그 가이드', title: 'AI는 어떤 글을 골라 인용할까?', mo: '' },
  { src: '/images/home/webblog-post-4.webp', tag: '차량·레저 · 캠핑장', title: '캠핑장에 웹블로그가 필요한 이유', mo: '' },
  { src: '/images/home/webblog-post-5.webp', tag: '금융·전문직 · 보험', title: '보험설계사에게 웹블로그가 필요한 이유', mo: '' },
  { src: '/images/home/webblog-post-6.webp', tag: '웹블로그 가이드', title: '네이버 블로그와 웹블로그, 뭐가 다를까?', mo: '' },
]

const CLINIC_POINTS = ['진료과목별로 정리되는 카테고리', '글을 읽다가 바로 병원 홈페이지·예약으로', '병원 홈페이지와 한 디자인, 한 관리자 화면']
const CLINIC_TABS = ['임플란트', '교정', '잇몸']
const CLINIC_POSTS = [
  { title: '임플란트 수술 후 일주일, 이것만 지켜 주세요', meta: '2026.10.12 · 조회 1,284' },
  { title: '임플란트 수명은 얼마나 될까요?', meta: '2026.09.30 · 조회 945' },
  { title: '뼈이식이 필요한 경우', meta: '2026.09.18 · 조회 611' },
]
// 진료과 칩 — '내과·소아청소년과' 는 PC 에서만 뺀다 (PC 는 줄이 길어진다, 휴대폰은 넉넉하다)
const SPECIALTIES = subIndustriesOf('clinic')

export default function HomeWebBlogSections() {
  return (
    <div className="cb hwb">
      {/* 1) PHP 보안 뉴스 */}
      <HomePhpSection />

      {/* 2) 웹블로그 출시 */}
      <section className="hwl" aria-labelledby="hwl-title">
        <div className="cb-wrap hwl-wrap">
          <div className="hwl-text">
            <p className="hwl-tag"><IconSparkles size={16} /> NEW · WEFLOW 웹블로그 출시</p>
            <h2 id="hwl-title" className="hwl-title">
              글 하나로 검색부터<br />
              <span>AI 답변까지</span>, 웹블로그
            </h2>
            <p className="hwl-desc">
              우리 홈페이지 안에 쌓이는 블로그입니다.<br />
              네이버·구글 검색과 AI 답변에 맞춰진 구조로,<br /> 플랫폼이 바뀌어도 글은 그대로 남습니다.
            </p>
            <ul className="hwl-points">
              {LAUNCH_POINTS.map(t => <li key={t}><span><IconCheck size={14} stroke={3} /></span>{t}</li>)}
            </ul>
            <div className="hwl-btns">
              <a href="/blog" target="_blank" rel="noopener noreferrer" className="hwl-btn hwl-btn--fill">웹블로그 둘러보기 <IconArrowUpRight size={18} /></a>
            </div>
          </div>

          {/* 오른쪽 — 실제 웹블로그 글 썸네일로 그린 목록 화면. 누르면 웹블로그로 */}
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="hwl-win" aria-label="웹블로그 둘러보기 (새 탭)">
            <span className="hwl-bar"><i /><i /><i /><em>weflowlab.kr/blog</em></span>
            <InView className="hwl-list">
              {LAUNCH_POSTS.map((p, i) => (
                <span key={p.src} className="hwl-post" style={{ '--i': i } as React.CSSProperties}>
                  <Image src={p.src} alt="" width={640} height={640} sizes="(min-width: 960px) 180px, 30vw" />
                  <small>{p.tag}</small>
                  <b>{p.mo ? <><span className="hwl-t-pc">{p.title}</span><span className="hwl-t-mo">{p.mo}</span></> : p.title}</b>
                </span>
              ))}
            </InView>
          </a>
        </div>
      </section>

      {/* 3) 병의원 전용 */}
      <section className="hcf" aria-labelledby="hcf-title">
        <div className="cb-wrap hcf-wrap">
          <div className="hcf-box">
            <div className="hcf-text">
              <p className="hcf-eyebrow"><IconStethoscope size={16} /> FOR CLINICS</p>
              {/* PC 는 두 줄 (줄마다 끊기지 않게), 휴대폰은 네 줄 */}
              <h2 id="hcf-title" className="hcf-title">
                <span className="hcf-line">병의원 웹블로그에<br className="cb-mo" /> 글 하나 올렸을 뿐인데,</span>
                <span className="hcf-line"><em>SEO·AEO·GEO</em>까지<br className="cb-mo" /> 한 번에 챙겨진다면?</span>
              </h2>
              <p className="hcf-desc">
                병원에 맞춘 전용 웹블로그도 있습니다. 진료과목별 카테고리와<br className="cb-pc" />
                {' '}예약으로 이어지는 구조까지, 병의원 전용 페이지에서 자세히 안내해 드립니다.
              </p>
              <ul className="hcf-points">
                {CLINIC_POINTS.map(t => <li key={t}><span><IconCheck size={14} stroke={3} /></span>{t}</li>)}
              </ul>
              <div className="hcf-btns">
                <a href="/clinic-blog" target="_blank" rel="noopener noreferrer" className="hcf-btn hcf-btn--fill">병의원 웹블로그 알아보기 <IconArrowUpRight size={18} /></a>
                <a href="/blog/clinic" target="_blank" rel="noopener noreferrer" className="hcf-btn"><IconArticle size={18} /> 병의원 글 둘러보기</a>
              </div>
              <div className="hcf-chips">
                {SPECIALTIES.map(s => (
                  <a key={s.slug} href={`/blog/clinic?sub=${s.slug}`} target="_blank" rel="noopener noreferrer" className={s.slug === 'internal-pediatrics' ? 'hcf-mo-only' : undefined}>{s.name}</a>
                ))}
              </div>
            </div>

            <figure className="hcf-fig">
              <InView className="hcf-win">
                <div className="hcf-wbar"><i /><i /><i /><span>우리병원.com/blog</span></div>
                <div className="hcf-body">
                  <p className="hcf-brand">우리병원치과 블로그</p>
                  <div className="hcf-tabs">{CLINIC_TABS.map((t, i) => <span key={t} className={i === 0 ? 'is-on' : ''}>{t}</span>)}</div>
                  <ul className="hcf-posts">
                    {CLINIC_POSTS.map((p, i) => (
                      <li key={p.title} style={{ '--i': i } as React.CSSProperties} className={i === 0 ? 'is-first' : ''}>
                        <b>{p.title}</b>
                        <small>{p.meta}</small>
                      </li>
                    ))}
                  </ul>
                  <div className="hcf-rsv">
                    <span>글을 읽고 바로 예약까지</span>
                    <em><IconCalendarEvent size={14} /> 진료 예약</em>
                  </div>
                </div>
              </InView>
              <figcaption>이해를 돕기 위한 예시 화면입니다.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <style>{CLINIC_BASE_CSS + `
        .hwb { min-height: 0; }

        /* ── 2) 웹블로그 출시 ── */
        .hwl { padding: 96px 0; background: linear-gradient(180deg, #f3f7ff 0%, #ffffff 100%); }
        @media (min-width: 960px) { .hwl { padding: 140px 0; } }
        .hwl-wrap { max-width: 1160px; display: grid; gap: 48px; align-items: center; }
        @media (min-width: 960px) { .hwl-wrap { grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 64px; } }
        .hwl-tag { display: inline-flex; align-items: center; gap: 6px; margin: 0; padding: 7px 14px; border-radius: 999px; background: #e7f0ff; color: #1f63d6; font-size: .9rem; font-weight: 800; }
        .hwl-title { margin: 20px 0 0; font-size: clamp(1.8rem, 3.6vw, 2.6rem); font-weight: 800; line-height: 1.3; letter-spacing: -0.04em; color: #111418; }
        .hwl-title span { color: #1f63d6; }
        .hwl-desc { margin: 20px 0 0; font-size: 1.08rem; line-height: 1.8; color: #4b5360; word-break: keep-all; }
        .hwl-points { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 10px; }
        .hwl-points li { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #111418; }
        .hwl-points span { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 22px; height: 22px; border-radius: 50%; background: #1f63d6; color: #fff; }
        .hwl-btns { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px; }
        .hwl-btn { display: inline-flex; align-items: center; gap: 6px; height: 52px; padding: 0 26px; border-radius: 999px; border: 1.5px solid #d5d9df; background: #fff; color: #111418; font-weight: 700; text-decoration: none; transition: border-color .15s, background .15s; }
        .hwl-btn:hover { border-color: #111418; }
        .hwl-btn--fill { background: #1f63d6; border-color: #1f63d6; color: #fff; }
        .hwl-btn--fill:hover { background: #1852b5; border-color: #1852b5; }
        @media (max-width: 959px) { .hwl-text { text-align: center; } .hwl-points { justify-items: center; } .hwl-btns { justify-content: center; } }

        /* 휴대폰 — 장점 세 줄은 글을 왼쪽 정렬, 묶음은 가운데 */
        @media (max-width: 640px) { .hwl-points { justify-items: start; width: fit-content; margin-left: auto; margin-right: auto; } }
        .hwl-win { display: block; overflow: hidden; border-radius: 20px; background: #fff; box-shadow: 0 30px 80px rgba(31,99,214,.16); border: 1px solid #e3ebf8; text-decoration: none; color: #111418; transition: transform .25s ease, box-shadow .25s ease; }
        .hwl-win:hover { transform: translateY(-4px); box-shadow: 0 36px 90px rgba(31,99,214,.22); }
        .hwl-bar { display: flex; align-items: center; gap: 7px; padding: 13px 16px; border-bottom: 1px solid #eef0f3; background: #fafbfc; }
        .hwl-bar i { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; }
        .hwl-bar i:nth-child(2) { background: #febc2e; }
        .hwl-bar i:nth-child(3) { background: #28c840; }
        .hwl-bar em { flex: 1; margin-left: 8px; padding: 5px 14px; border-radius: 999px; background: #f1f3f6; color: #6b7380; font-size: .82rem; font-style: normal; }
        .hwl-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 22px; }
        .hwl-post { display: grid; gap: 6px; opacity: 0; transform: translateY(14px); transition: opacity .5s ease, transform .5s ease; transition-delay: calc(var(--i) * .1s); }
        .hwl-list.is-in .hwl-post { opacity: 1; transform: none; }
        .hwl-post img { width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; border-radius: 12px; }
        .hwl-post small { margin-top: 4px; font-size: .74rem; font-weight: 700; color: #1f63d6; }
        .hwl-post b { font-size: .88rem; line-height: 1.4; word-break: keep-all; }
        .hwl-t-mo { display: none; }
        @media (max-width: 640px) { .hwl-t-pc { display: none; } .hwl-t-mo { display: block; } }
        /* PC 는 3×2 로 여섯 개, 휴대폰은 2×2 로 네 개만 */
        @media (max-width: 640px) { .hwl-list { grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 14px; } .hwl-post:nth-child(n+5) { display: none; } .hwl-post b { font-size: .8rem; } .hwl-post small { font-size: .68rem; } }

        /* ── 3) 병의원 전용 ── */
        .hcf { padding: 0 0 96px; background: #fff; }
        @media (min-width: 960px) { .hcf { padding-bottom: 140px; } }
        .hcf-wrap { max-width: 1160px; }
        .hcf-box { display: grid; gap: 40px; align-items: center; overflow: hidden; padding: 28px 22px; border-radius: 24px; color: #fff; background: linear-gradient(135deg, #1b4ea7, #0d2858); }
        @media (min-width: 768px) { .hcf-box { padding: 40px; } }
        @media (min-width: 1024px) { .hcf-box { grid-template-columns: minmax(0, 1fr) minmax(0, .9fr); gap: 56px; padding: 56px; } }
        .hcf-eyebrow { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0; font-size: .9rem; font-weight: 600; color: rgba(255,255,255,.7); }
        .hcf-title { margin: 16px 0 0; text-align: center; font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800; line-height: 1.3; letter-spacing: -0.03em; }
        .hcf-title em { font-style: normal; color: #9fbdf5; }
        .hcf-line { display: block; }
        @media (min-width: 1024px) { .hcf-title { font-size: 1.9rem; } .hcf-line { white-space: nowrap; } }
        @media (min-width: 768px) { .hcf-eyebrow { justify-content: flex-start; } .hcf-title { text-align: left; } }
        .hcf-desc { margin: 24px 0 0; font-size: .95rem; line-height: 1.75; color: rgba(255,255,255,.78); word-break: keep-all; }
        .hcf-points { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 10px; }
        .hcf-points li { display: flex; align-items: center; gap: 10px; font-size: .98rem; font-weight: 600; }
        .hcf-points span { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,.15); }
        .hcf-btns { display: flex; flex-direction: column; gap: 10px; margin-top: 32px; }
        @media (min-width: 640px) { .hcf-btns { flex-direction: row; } }
        .hcf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 48px; padding: 0 24px; border-radius: 999px; border: 1px solid rgba(255,255,255,.4); color: #fff; font-weight: 700; text-decoration: none; white-space: nowrap; transition: background .15s; }
        .hcf-btn:hover { background: rgba(255,255,255,.1); }
        .hcf-btn--fill { background: #fff; border-color: #fff; color: #1b4ea7; }
        .hcf-btn--fill:hover { background: #eef2f7; }
        .hcf-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 24px; }
        .hcf-chips a { padding: 4px 12px; border-radius: 999px; background: rgba(255,255,255,.1); color: rgba(255,255,255,.85); font-size: .82rem; text-decoration: none; transition: background .15s, color .15s; }
        .hcf-chips a:hover { background: #fff; color: #1b4ea7; }
        @media (min-width: 768px) { .hcf-chips .hcf-mo-only { display: none; } }
        .hcf-fig { margin: 0; }
        .hcf-win { overflow: hidden; border-radius: 16px; background: #fff; color: #111418; box-shadow: 0 24px 60px rgba(0,0,0,.35); }
        .hcf-wbar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
        .hcf-wbar i { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; }
        .hcf-wbar i:nth-child(2) { background: #febc2e; }
        .hcf-wbar i:nth-child(3) { background: #28c840; }
        .hcf-wbar span { flex: 1; margin-left: 8px; padding: 4px 12px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 1px #e5e7eb; font-size: .75rem; color: #737373; }
        .hcf-body { padding: 20px; }
        @media (min-width: 768px) { .hcf-body { padding: 24px; } }
        .hcf-brand { margin: 0; font-weight: 700; }
        .hcf-tabs { display: flex; gap: 16px; margin-top: 12px; border-bottom: 1px solid #e5e7eb; font-size: .88rem; }
        .hcf-tabs span { margin-bottom: -1px; padding-bottom: 8px; border-bottom: 2px solid transparent; color: #737373; }
        .hcf-tabs .is-on { border-bottom-color: #1b4ea7; color: #1b4ea7; font-weight: 700; }
        .hcf-posts { list-style: none; margin: 8px 0 0; padding: 0; }
        .hcf-posts li { margin: 0 -8px; padding: 8px; border-radius: 10px; opacity: 0; transform: translateY(8px); transition: opacity .5s ease, transform .5s ease, background .5s ease; transition-delay: calc(.3s + var(--i) * .3s); }
        .hcf-posts b { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: .94rem; font-weight: 600; }
        .hcf-posts small { display: block; margin-top: 2px; font-size: .75rem; color: #a3a3a3; }
        .hcf-win.is-in .hcf-posts li { opacity: 1; transform: none; }
        .hcf-win.is-in .hcf-posts li.is-first { background: rgba(27,78,167,.05); transition-delay: .3s, .3s, 1.4s; }
        .hcf-rsv { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding: 12px 16px; border-radius: 12px; background: rgba(27,78,167,.05); opacity: 0; transform: translateY(8px); transition: opacity .5s ease 1.9s, transform .5s ease 1.9s; }
        .hcf-win.is-in .hcf-rsv { opacity: 1; transform: none; }
        .hcf-rsv span { font-size: .88rem; font-weight: 600; color: #404040; }
        .hcf-rsv em { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 999px; background: #1b4ea7; color: #fff; font-style: normal; font-size: .75rem; font-weight: 700; }
        .hcf-fig figcaption { margin-top: 10px; text-align: center; font-size: .75rem; color: rgba(255,255,255,.5); }
        @media (prefers-reduced-motion: reduce) { .hwl-post, .hcf-posts li, .hcf-rsv { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </div>
  )
}
