'use client'
import { useEffect, useRef } from 'react'
import { ArrowRight, Lock, CalendarCheck, Check } from 'lucide-react'
import { CLINIC_WHY, type BlogWhyCopy, type DemoCopy } from './blogWhyCopy'

/**
 * '그래서, 웹블로그' 화면 — 메인의 '왜 WEFLOW?'(components/home/HomeWhyIntro.tsx) 와 같은 방식이다.
 *
 * 화면 한 장이 붙어 있는 동안 스크롤에 맞춰 차례로 진행된다:
 *  1) 두 줄 질문이 양옆에서 가운데로 미끄러져 들어온다.
 *  2) '웹블로그' 에 강조색이 들어온다.
 *  3) 질문이 위로 빠지고, 답 네 개가 하나씩 올라왔다가 올라간다 — 답마다 왼쪽 카드 안의 화면이 돈다.
 *  4) 맺음 — 상담으로 내려가는 버튼이 남는다.
 *
 * 글귀(데모 속 가게·글 제목, 설명, 맺음)는 copy 로 받는다 — blogWhyCopy.tsx 의 CLINIC_WHY(기본)·GENERAL_WHY.
 * 메인과 달리 바탕을 어둡게 바꾸지 않는다 — 병원 페이지는 처음부터 끝까지 흰 바탕으로 둔다.
 * 값은 스크롤 위치로 직접 계산해 넣는다 — 올리면 그대로 되감긴다.
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/** 01 · 주소가 바뀌고, 그 아래로 글이 쌓인다 */
function OwnDemo({ d }: { d: DemoCopy }) {
  const posts = d.posts
  return (
    <div className="bw bw-own" aria-hidden="true">
      <div className="bw-top">
        <i /><i /><i />
        <span className="bw-url">
          {/* 빨간 줄은 글자 묶음 안에 둬서 주소 길이만큼만 그어진다 */}
          <span className="bw-own-old"><span className="bw-old-text">{d.oldUrl}<b className="bw-strike" /></span></span>
          {/* 자물쇠와 주소를 한 덩어리로 — 사이에 간격이 끼면 'com/ blog' 처럼 떨어져 보인다 */}
          <span className="bw-own-new"><span className="bw-new-text"><Lock size={11} /> {d.domain}/<strong>blog</strong></span></span>
        </span>
      </div>
      <div className="bw-body">
        <div className="bw-blog-head">
          <strong>{d.brand} 블로그</strong>
          <span className="bw-own-chip"><Check size={11} /> {d.ownChip}</span>
        </div>
        {posts.map((p, i) => (
          <div key={p.title} className={`bw-art bw-own-r${i + 1}`}>
            <span className={`bw-art-thumb bw-art-thumb-${i + 1}`} />
            <div className="bw-art-text">
              <small>{p.tag}</small>
              <b>{p.title}</b>
              <p>{p.excerpt}</p>
              <span>{p.meta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 02 · 환자가 묻고, AI 가 우리 병원 글을 출처로 답한다 */
function SearchDemo({ d }: { d: DemoCopy }) {
  return (
    <div className="bw bw-ai" aria-hidden="true">
      <div className="bw-top">
        <i /><i /><i />
        <span className="bw-url">
          {/* 히어로 아래 휴대폰 화면의 'AI 검색' 과 같은 반짝이 */}
          <svg className="bw-spark" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id="bwSpark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f8cff" />
                <stop offset="100%" stopColor="#9b6bff" />
              </linearGradient>
            </defs>
            <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" fill="url(#bwSpark)" />
          </svg>
          AI 검색
        </span>
      </div>
      <div className="bw-body">
        <p className="bw-q">{d.q}</p>
        <span className="bw-dots"><i /><i /><i /></span>
        <p className="bw-a">{d.a}</p>
        <div className="bw-src">
          <span className="bw-src-label">출처</span>
          <strong>{d.brand} 블로그</strong>
          <span>{d.posts[0].title}</span>
        </div>
      </div>
      {/* 입력창 — 질문이 한 자씩 쳐진 뒤 보내기를 누르면 위로 말풍선이 올라간다 */}
      <div className="bw-input">
        <span className="bw-input-ph">무엇이든 물어보세요</span>
        <span className="bw-input-typed">{d.q}</span>
        <i className="bw-send">
          <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </i>
      </div>
    </div>
  )
}

/** 03 · 탭이 바뀌면 그 진료의 글만 모인다 */
function CategoryDemo({ d }: { d: DemoCopy }) {
  const { tabs, lists } = d
  return (
    <div className="bw bw-cat" aria-hidden="true">
      <div className="bw-top">
        <i /><i /><i />
        <span className="bw-url">{d.domain}/blog</span>
      </div>
      <div className="bw-body">
        {/* 탭 쪽으로 살짝 확대해 보여 준다 (아래 글은 잘려도 된다) */}
        <div className="bw-cat-zoom">
        <div className="bw-tabs">
          {/* 고른 탭 뒤의 검정 알약 — 탭 자체 바탕을 바꾸지 않고 이것 하나가 옆으로 미끄러진다 */}
          <i className="bw-tab-ind" />
          {tabs.map((t, i) => (
            <span key={t} className={`bw-tab bw-tab-${i + 1}`}>{t}</span>
          ))}
        </div>
        <div className="bw-lists">
          {lists.map((l, i) => (
            <div key={i} className={`bw-list bw-list-${i + 1}`}>
              {l.map((p, k) => (
                <div key={p.title} className="bw-art">
                  <span className={`bw-art-thumb bw-art-thumb-${((i + k) % 3) + 1}`} />
                  <div className="bw-art-text">
                    <small>{tabs[i]}</small>
                    <b>{p.title}</b>
                    <p>{p.excerpt}</p>
                    <span>{p.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

/** 04 · 글 아래 버튼을 누르면 원래 쓰던 병원 홈페이지로 넘어간다 */
function ReserveDemo({ d }: { d: DemoCopy }) {
  return (
    <div className="bw bw-rsv" aria-hidden="true">
      <div className="bw-top">
        <i /><i /><i />
        <span className="bw-url">
          <span className="bw-u bw-u-blog">{d.domain}/blog/{d.rsv.path}</span>
          <span className="bw-u bw-u-home"><Lock size={11} /> {d.domain}</span>
        </span>
      </div>
      <div className="bw-body">
        <small className="bw-rsv-tag">{d.rsv.tag}</small>
        <strong className="bw-rsv-title">{d.rsv.title[0]}<br />{d.rsv.title[1]}</strong>
        {/* 본문 네 줄이 한 줄씩 쭉 쭉 써진 뒤 버튼이 눌린다 */}
        <i className="bw-line bw-rsv-l1" style={{ width: '92%' }} />
        <i className="bw-line bw-rsv-l2" style={{ width: '84%' }} />
        <i className="bw-line bw-rsv-l3" style={{ width: '88%' }} />
        <i className="bw-line bw-rsv-l4" style={{ width: '60%' }} />
        <span className="bw-rsv-btn">{d.brand} 홈페이지 바로가기 <ArrowRight size={13} /></span>

        {/* 넘어간 뒤 — 병원이 원래 쓰던 홈페이지 첫 화면 */}
        <div className="bw-home">
          <div className="bw-home-nav">
            <strong>{d.brand}</strong>
            {d.home.nav.map(t => <span key={t}>{t}</span>)}
          </div>
          <div className="bw-home-hero">
            <small>{d.home.small}</small>
            <strong>{d.home.title}</strong>
            <span className="bw-home-cta"><CalendarCheck size={12} /> {d.home.cta}</span>
          </div>
          <div className="bw-home-quick">
            {d.home.quick.map(t => <span key={t}>{t}</span>)}
          </div>
          {/* 오늘 진료 안내 + 공지 한 줄 — 실제 병원 홈페이지 첫 화면에 흔히 있는 자리 */}
          <div className="bw-home-info">
            <p><i className="bw-home-dot" /> <b>{d.home.now}</b> {d.home.hours}</p>
            <p><em>공지</em> {d.home.notice}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 05 · 관리자 페이지 — 창을 반으로 나눠 왼쪽은 환자가 보는 실제 화면, 오른쪽은 관리자 수정 화면.
 * 오른쪽에서 고치면 왼쪽이 바로 바뀐다.
 *  장면 1 (0~48%): 새 글을 쓰고 발행 → 왼쪽 블로그 목록 맨 위에 새 글이 들어온다
 *  장면 2 (50~100%): 배너 사진을 고르고 문구를 바꿔 저장 → 왼쪽 홈페이지 배너가 바뀐다
 */
function AdminDemo({ d }: { d: DemoCopy }) {
  return (
    <div className="bw bw-adm" aria-hidden="true">
      <div className="bw-top">
        <i /><i /><i />
        <span className="bw-url"><Lock size={11} style={{ marginRight: '.3em', color: '#12a37a' }} /> {d.domain}/admin</span>
      </div>
      <div className="bw-body bw-adm-body">
        {/* 왼쪽 — 실제 화면 */}
        <div className="bw-adm-live">
          <span className="bw-adm-tag"><i /> 실제 화면</span>
          {/* 장면 1 — 블로그 목록 */}
          <div className="bw-adm-lp bw-adm-lp1">
            <b className="bw-adm-lp-title">{d.brand} 블로그</b>
            <div className="bw-adm-new">
              <div className="bw-adm-post"><span className="bw-adm-th bw-adm-th-new" /><span><em>NEW</em>{d.adm.newPost}</span></div>
            </div>
            <div className="bw-adm-post"><span className="bw-adm-th" /><span>{d.adm.posts[0]}</span></div>
            <div className="bw-adm-post"><span className="bw-adm-th bw-adm-th-2" /><span>{d.adm.posts[1]}</span></div>
          </div>
          {/* 장면 2 — 홈페이지 배너 */}
          <div className="bw-adm-lp bw-adm-lp2">
            <div className="bw-adm-nav"><b>{d.brand}</b><i /><i /><i /></div>
            <div className="bw-adm-banner">
              <i className="bw-adm-bg-a" /><i className="bw-adm-bg-b" />
              {/* 문구와 버튼을 한 묶음으로 배너 세로 가운데에 — 옛 문구·새 문구는 같은 자리에 겹쳐 둔다 */}
              <div className="bw-adm-bcontent">
                <span className="bw-adm-btxt">
                  <span className="bw-adm-bt bw-adm-bt-old">{d.adm.oldBanner[0]}<br />{d.adm.oldBanner[1]}</span>
                  <span className="bw-adm-bt bw-adm-bt-new">{d.adm.newBanner[0]}<br />{d.adm.newBanner[1]}</span>
                </span>
                {/* 오른쪽 설정의 '버튼 문구' 와 같은 버튼 */}
                <span className="bw-adm-bbtn">{d.adm.button}</span>
              </div>
            </div>
            <div className="bw-adm-quick"><i /><i /><i /></div>
            {/* 배너 아래로 이어지는 내용 — 의료진 소개 · 공지. 아래가 흐려지며 잘려 '더 있다' 는 느낌을 준다 */}
            <b className="bw-adm-sec">{d.adm.section}</b>
            <div className="bw-adm-docs">
              <span><i /><u /><u /></span>
              <span><i /><u /><u /></span>
            </div>
            <b className="bw-adm-sec">공지사항</b>
            <div className="bw-adm-notice"><u /><u /></div>
          </div>
        </div>

        {/* 오른쪽 — 관리자 수정 화면 */}
        <div className="bw-adm-edit">
          <div className="bw-adm-tabs"><span className="bw-adm-tab1">글쓰기</span><span className="bw-adm-tab2">디자인 수정</span></div>
          {/* 장면 1 — 새 글 */}
          <div className="bw-adm-ep bw-adm-ep1">
            <label>제목</label>
            <span className="bw-adm-input"><span className="bw-adm-type1">{d.adm.newPost}</span></span>
            <label>본문</label>
            <div className="bw-adm-area">
              <i className="bw-line bw-adm-l1" style={{ width: '92%' }} />
              <i className="bw-line bw-adm-l2" style={{ width: '84%' }} />
              <i className="bw-line bw-adm-l3" style={{ width: '58%' }} />
            </div>
            <label>사진 선택</label>
            {/* 갤러리에서 고르듯 — 세 장이 놓여 있고, 차례로 테두리와 순서 번호가 붙으며 골라진다 */}
            <div className="bw-adm-photos">
              {[1, 2, 3].map(n => (
                <span key={n} className={`bw-adm-photo bw-adm-photo${n}`}><em>{n}</em></span>
              ))}
            </div>
            <span className="bw-adm-btn bw-adm-pub">발행하기</span>
          </div>
          {/* 장면 2 — 배너 수정 */}
          <div className="bw-adm-ep bw-adm-ep2">
            <label>배너 사진</label>
            <div className="bw-adm-thumbs"><i className="bw-adm-tb1" /><i className="bw-adm-tb2" /><i className="bw-adm-tb3" /></div>
            <label>배너 문구</label>
            <span className="bw-adm-input">
              <span className="bw-adm-old">{d.adm.oldBanner.join(' ')}</span>
              <span className="bw-adm-type2">{d.adm.newBanner.join(' ')}</span>
            </span>
            {/* 아래가 비지 않게 — 배너에 딸린 설정 두 가지 (움직이지 않는 칸) */}
            <label>버튼 문구</label>
            <span className="bw-adm-input bw-adm-input--static">{d.adm.button}</span>
            <span className="bw-adm-toggle"><span>메인 화면에 바로 노출</span><i /></span>
            <span className="bw-adm-btn bw-adm-save">저장하기</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 순서 — 앞의 STORY 01~03 고민에 같은 순서로 답한다: 노출(01) → 예약(02) → 안정성(03), 그다음 직접 관리 · 카테고리 정리
const ANSWER_ORDER = [
  { id: 'search', Demo: SearchDemo },
  { id: 'reserve', Demo: ReserveDemo },
  { id: 'own', Demo: OwnDemo },
  { id: 'admin', Demo: AdminDemo },
  { id: 'category', Demo: CategoryDemo },
] as const
const ANSWER_COUNT = ANSWER_ORDER.length

// 진행 구간 — 단위는 '화면 높이의 몇 배'. 섹션이 화면에 붙은 뒤로 스크롤한 거리 기준이다.
const LIT_AT = 0.35 // '웹블로그' 에 강조색
const ASK_OUT_FROM = 0.75 // 질문이 위로 빠져나가기 시작
const ASK_OUT_LEN = 0.3
const ANS_FROM = 0.95 // 첫 답이 들어오기 시작
const ANS_LEN = 0.75 // 답 하나가 차지하는 길이
const ANS_IN = 0.3 // 그중 들어오는 데 쓰는 비율
const ANS_OUT = 0.25 // 그중 나가는 데 쓰는 비율
const END_HOLD = 0.5 // 맺음 장면이 다 들어온 뒤 머무는 길이
const END_FROM = ANS_FROM + ANS_LEN * ANSWER_COUNT
const PIN_LEN = END_FROM + ANS_LEN * ANS_IN + END_HOLD

export default function BlogWhy({ copy = CLINIC_WHY }: { copy?: BlogWhyCopy }) {
  const ANSWERS = ANSWER_ORDER.map(a => ({ ...a, ...copy.answers[a.id] }))
  const sectionRef = useRef<HTMLElement>(null)
  const askRef = useRef<HTMLDivElement>(null)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const endBgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    const ask = askRef.current
    const end = endRef.current
    const endBg = endBgRef.current
    if (!el || !ask || !end || !endBg) return
    // 모션 최소화 설정에서는 CSS 가 질문과 답을 차례로 쌓아 그대로 보여준다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      const s = vh - top // 섹션 윗변이 화면 바닥을 지난 뒤로 스크롤한 거리
      const p = -top / vh // 화면에 붙은 뒤로 스크롤한 거리 (화면 높이의 배수)

      // 1) 질문 등장
      el.style.setProperty('--bw-x', easeOut(clamp01(s / (vh * 1.1))).toFixed(4))

      // 2) 강조색
      el.classList.toggle('is-lit', p >= LIT_AT)

      // 3) 질문 퇴장
      const out = clamp01((p - ASK_OUT_FROM) / ASK_OUT_LEN)
      ask.style.opacity = String(1 - out)
      ask.style.transform = `translate3d(0, ${-out * 48}px, 0)`

      // 3) 답 — 들어오고, 머물고, 나간다
      answerRefs.current.forEach((a, i) => {
        if (!a) return
        const t = (p - (ANS_FROM + ANS_LEN * i)) / ANS_LEN
        const enter = easeOut(clamp01(t / ANS_IN))
        const exit = clamp01((t - (1 - ANS_OUT)) / ANS_OUT)
        const opacity = Math.min(enter, 1 - exit)
        a.style.opacity = String(opacity)
        // 보이는 동안만 .is-on — 카드 안 화면은 이 클래스가 붙을 때 처음부터 돈다
        a.classList.toggle('is-on', opacity > 0.05)
        a.style.transform = `translate3d(0, ${(1 - enter) * 44 - exit * 44}px, 0)`
      })

      // 4) 맺음 — 가운데서 파란 원이 퍼져 화면을 덮고, 그 위로 문구가 올라온다.
      //    원이 거의 다 찬 뒤(.is-end)에 장점 칩이 하나씩 튀어나온다. 다 보이기 전에는 버튼이 눌리지 않게 한다
      // 맺음은 답 하나가 들어오는 것과 비슷한 짧은 거리 안에 다 보이게 한다 — 예전엔 원이 다 찬 뒤에야 글이 올라와 한참 내려야 했다
      const END_IN = ANS_LEN * ANS_IN * 0.8
      const bg = easeOut(clamp01((p - END_FROM) / END_IN))
      endBg.style.clipPath = `circle(${(bg * 150).toFixed(2)}vmax at 50% 50%)`
      const fin = easeOut(clamp01((p - END_FROM - END_IN * 0.25) / END_IN))
      end.style.opacity = String(fin)
      end.style.transform = `translate3d(0, ${(1 - fin) * 44}px, 0) scale(${(0.94 + fin * 0.06).toFixed(4)})`
      end.style.pointerEvents = fin > 0.6 ? 'auto' : 'none'
      el.classList.toggle('is-end', fin > 0.6)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="webblog"
      className="bwy"
      aria-labelledby="bwy-title"
      style={{ '--bw-len': PIN_LEN } as React.CSSProperties}
    >
      <div className="bwy-pin">
        <div ref={askRef} className="bwy-ask">
          <p className="bwy-eyebrow">WHY WEB BLOG</p>
          <h2 id="bwy-title" className="bwy-title">
            <span className="bwy-line bwy-line--a">같은 글을 써도,</span>
            <span className="bwy-line bwy-line--b">
              <span className="bwy-hl">웹블로그</span>는 다릅니다
            </span>
          </h2>
          {/* 웹블로그가 무엇인지 한 줄 — '웹블로그' 에 파란색이 들어올 때 함께 올라온다 */}
          <p className="bwy-def">
            웹블로그는 <b>{copy.where}</b>의 블로그입니다.<br />
            글 쓰는 방법은 같고, 글이 쌓이는 곳만 달라집니다.
          </p>
        </div>

        <div className="bwy-answers">
          {ANSWERS.map((a, i) => (
            <div
              key={a.id}
              ref={node => {
                answerRefs.current[i] = node
              }}
              className="bwy-answer"
            >
              <div className="bwy-card">
                <a.Demo d={copy.demo} />
              </div>
              <div className="bwy-text">
                <p className="bwy-num">
                  {String(i + 1).padStart(2, '0')}
                  <span> / {String(ANSWERS.length).padStart(2, '0')}</span>
                </p>
                <h3 className="bwy-answer-title">{a.title}</h3>
                <p className="bwy-desc">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 맺음 — 파란 원이 퍼진 바탕 위에 큰 문구 · 장점 칩 네 개 · 상담 버튼 */}
        <div ref={endBgRef} className="bwy-end-bg" aria-hidden="true" />
        <div ref={endRef} className="bwy-end">
          <p className="bwy-end-eyebrow">{copy.end.eyebrow}</p>
          <h3 className="bwy-end-title">
            {copy.end.lead}<span>{copy.end.accent}</span>
          </h3>
          <p className="bwy-end-desc">{copy.end.desc}</p>
          <ul className="bwy-end-chips">
            {copy.end.chips.map((t, i) => (
              <li key={t} style={{ '--i': i } as React.CSSProperties}>
                <Check size={15} /> {t}
              </li>
            ))}
          </ul>
          <a href={copy.end.href} className="bwy-btn">
            {copy.end.label} <ArrowRight size={20} />
          </a>
        </div>
      </div>

      <style>{`
        .bwy { position: relative; height: calc(100svh * (1 + var(--bw-len))); background: #fff; border-top: 1px solid #e9ebef; }
        .bwy-pin { position: sticky; top: 0; height: 100svh; overflow: hidden; background: #fff; color: #111418; }

        /* ── 질문 ── */
        .bwy-ask { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 4vh; /* 정가운데보다 아주 살짝 위 — 8vh 는 너무 높았고 0 은 낮아 보였다 */ will-change: transform, opacity; }
        .bwy-eyebrow { margin: 0 0 clamp(1.25rem, 3.5vh, 2.25rem); font-size: clamp(.8rem, 1.1vw, .92rem); font-weight: 700; letter-spacing: .26em; color: #1f63d6; opacity: var(--bw-x, 0); }
        .bwy-title { margin: 0; font-size: clamp(1.95rem, 5vw, 4rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.25; text-align: center; }
        .bwy-line { display: block; white-space: nowrap; will-change: transform; }
        .bwy-line--a { transform: translate3d(calc((1 - var(--bw-x, 0)) * -70vw), 0, 0); }
        .bwy-line--b { transform: translate3d(calc((1 - var(--bw-x, 0)) * 70vw), 0, 0); }
        .bwy-hl { transition: color .5s ease; }
        .bwy.is-lit .bwy-hl { color: #1f63d6; }
        .bwy-def { margin: clamp(1.5rem, 4vh, 2.25rem) 0 0; padding: 0 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem); line-height: 1.75; color: #4b5360; text-align: center; opacity: 0; transform: translateY(12px); transition: opacity .5s ease, transform .5s ease; }
        .bwy-def b { color: #111418; }
        .bwy.is-lit .bwy-def { opacity: 1; transform: none; }

        /* ── 답 — 왼쪽 카드, 오른쪽 글 ── */
        .bwy-answers { position: absolute; inset: 0; pointer-events: none; }
        .bwy-answer { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: clamp(2rem, 5vw, 5rem); padding: 0 1.5rem; opacity: 0; will-change: transform, opacity; }
        .bwy-text { flex: 0 1 26rem; min-width: 0; }
        .bwy-num { margin: 0 0 clamp(1rem, 3vh, 1.5rem); font-size: clamp(.95rem, 1.3vw, 1.1rem); font-weight: 700; letter-spacing: .1em; color: #1f63d6; }
        .bwy-num span { color: #b4bac4; font-weight: 500; }
        .bwy-answer-title { margin: 0; font-size: clamp(1.7rem, 3.6vw, 3rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.25; white-space: pre-line; }
        .bwy-desc { white-space: pre-line; margin: clamp(1rem, 3vh, 1.5rem) 0 0; font-size: clamp(1rem, 1.5vw, 1.2rem); line-height: 1.65; color: #4b5360; }

        /* 파스텔 하늘색 카드 — 창은 위·왼쪽만 띄우고 오른쪽·아래는 카드 끝까지 붙인다 (메인 카드와 같은 모양) */
        .bwy-card { position: relative; flex: none; width: min(46vw, 540px); aspect-ratio: 1 / .78; border-radius: 28px; overflow: hidden; background: linear-gradient(135deg, #e3f0ff 0%, #b4d6fa 100%); container-type: inline-size; }
        @media (min-width: 801px) { .bwy-mo { display: none; } }
        @media (max-width: 800px) {
          /* 휴대폰 위치는 메인의 '왜 WEFLOW?'(components/home/HomeWhyIntro.tsx) 와 똑같이 — 질문·답 모두 화면 정가운데 */
          .bwy-ask { padding-bottom: 0; padding-top: 3vh; } /* 메인과 같은 정가운데에서 아주 조금 아래로 */
          /* 정의 두 줄 — '웹블로그는 우리 병원 홈페이지 안의 블로그입니다.' / '글 쓰는 방법은 같고, …' 가 각각 한 줄에 들어가게 화면 폭에 맞춘 크기 */
          .bwy-def { padding: 0 12px; font-size: 3.55vw; letter-spacing: -0.02em; line-height: 1.8; }
          /* 설명은 쉼표 뒤에서만 줄이 바뀌게 — 화면 폭에 맞춰 조금 작게 */
          .bwy-desc { font-size: 3.85vw; letter-spacing: -0.02em; }
          .bwy-answer { flex-direction: column; gap: 1.75rem; text-align: center; }
          .bwy-card { width: min(84vw, 420px); border-radius: 20px; }
          .bwy-text { flex: none; }
        }

        /* ── 맺음 ── */
        /* 위 여백으로 내용을 살짝 내린다 — 헤더 높이(76px)+3vh 는 너무 낮았고, 0 은 너무 높았다. 그 중간 */
        .bwy-end { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: calc(38px + 1.5vh) 1.5rem 0; text-align: center; opacity: 0; pointer-events: none; will-change: transform, opacity; }
        .bwy-end-bg { position: absolute; inset: 0; /* 위는 파랑, 아래로 갈수록 흰색 — 다음 섹션(흰 바탕)으로 끊기지 않고 이어진다. 글자가 놓이는 가운데까지는 파랑을 유지한다 */
          background: linear-gradient(180deg, #4f8ded 0%, #5893ee 45%, #9fc3f6 75%, #e9f2fe 92%, #ffffff 100%); clip-path: circle(0 at 50% 50%); }
        .bwy-end { color: #fff; }
        .bwy-end-eyebrow { margin: 0 0 clamp(1rem, 3vh, 1.75rem); font-size: clamp(.78rem, 1.1vw, .92rem); font-weight: 700; letter-spacing: .3em; color: rgba(255,255,255,.7); }
        .bwy-end-title { margin: 0; font-size: clamp(2rem, 4.6vw, 3.6rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.2; }
        .bwy-end-title span { color: #e3f0ff; }
        .bwy-end-desc { margin: clamp(1rem, 2.6vh, 1.5rem) 0 0; font-size: clamp(1rem, 1.5vw, 1.15rem); color: rgba(255,255,255,.9); }
        /* 칩 네 개를 같은 폭으로 — 같은 크기 칸 격자라 가장 긴 문구 폭에 나머지가 맞춰진다 (좁은 화면은 2×2) */
        .bwy-end-chips { list-style: none; padding: 0; margin: clamp(1.5rem, 4vh, 2.5rem) 0 0; display: inline-grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 760px) { .bwy-end-chips { grid-template-columns: repeat(2, 1fr); } }
        .bwy-end-chips li { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 16px; white-space: nowrap; border-radius: 999px; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.22); font-weight: 700; font-size: .98rem; opacity: 0; transform: translateY(10px) scale(.85); transition: opacity .35s ease, transform .5s cubic-bezier(.34,1.56,.64,1); transition-delay: calc(var(--i) * .12s); }
        .bwy-end-chips svg { color: #8ff0c8; }
        .bwy.is-end .bwy-end-chips li { opacity: 1; transform: none; }
        .bwy-btn { display: inline-flex; align-items: center; gap: 10px; margin-top: clamp(1.75rem, 5vh, 3rem); background: #fff; color: #1f63d6; font-weight: 800; font-size: clamp(1rem, 1.4vw, 1.1rem); padding: 18px 34px; border-radius: 999px; text-decoration: none; box-shadow: 0 14px 34px rgba(20,60,130,.25); transition: transform .2s, box-shadow .2s; }
        .bwy-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 42px rgba(20,60,130,.32); }
        .bwy-btn svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .bwy-btn:hover svg { transform: translateX(4px); }

        /* ── 카드 안 창 — 글자 크기를 카드 폭에 맞춰, 카드가 줄면 창 안도 같이 준다 ── */
        .bw { position: absolute; top: 7cqw; left: 7cqw; right: 0; bottom: 0; background: #fff; border-top-left-radius: 14px; box-shadow: 0 10px 40px rgba(20,60,110,.22); font-size: 2.7cqw; overflow: hidden; display: flex; flex-direction: column; text-align: left; color: #111418; }
        .bw-top { display: flex; align-items: center; gap: .45em; padding: .9em 1.2em; border-bottom: 1px solid #eef0f3; background: #fafbfc; }
        .bw-top > i { width: .7em; height: .7em; border-radius: 50%; background: #ff5f57; }
        .bw-top > i:nth-child(2) { background: #febc2e; }
        .bw-top > i:nth-child(3) { background: #28c840; }
        .bw-spark { width: 1.15em; height: 1.15em; margin-right: .35em; flex: none; }
        .bw-ai .bw-url { color: #111418; font-weight: 700; }

        /* AI 검색 입력창 — 창 바닥에 고정 (내용과 달리 한 바퀴 끝에 지워지지 않는다) */
        .bw-input { position: relative; display: flex; align-items: center; margin: 0 1.2em 1.1em; height: 2.9em; padding: 0 .45em 0 1.1em; border: 1px solid #e3e7ed; border-radius: 999px; background: #fff; box-shadow: 0 2px 8px rgba(17,20,24,.04); }
        .bw-input-ph { color: #9aa1ac; font-size: .95em; }
        .bw-input-typed { position: absolute; left: 1.1em; top: 50%; transform: translateY(-50%); font-size: .95em; color: #111418; white-space: nowrap; clip-path: inset(0 100% 0 0); }
        .bw-send { margin-left: auto; width: 2.1em; height: 2.1em; border-radius: 50%; background: #c9cfd8; display: inline-flex; align-items: center; justify-content: center; }
        .bw-send svg { width: 1.05em; height: 1.05em; }
        .is-on .bw-input-ph { animation: bw2Ph 9s linear infinite; }
        .is-on .bw-input-typed { animation: bw2Type 9s steps(15, end) infinite; }
        .is-on .bw-send { animation: bw2Send 9s ease-out infinite; }
        @keyframes bw2Ph { 0%, 3% { opacity: 1 } 4%, 22% { opacity: 0 } 24%, 100% { opacity: 1 } }
        @keyframes bw2Type { 0%, 4% { clip-path: inset(0 100% 0 0) } 18%, 21.5% { clip-path: inset(0 0 0 0) } 22%, 100% { clip-path: inset(0 100% 0 0) } }
        /* 두세 글자쯤 쳐졌을 때(약 7%)부터 파랗게 */
        @keyframes bw2Send { 0%, 6.8% { background: #c9cfd8; transform: none } 7%, 20% { background: #1f63d6; transform: none } 21% { background: #1f63d6; transform: scale(.82) } 22.5% { background: #1f63d6; transform: none } 25%, 100% { background: #c9cfd8; transform: none } }
        .bw-url { position: relative; margin-left: .8em; flex: 1; height: 2em; display: flex; align-items: center; padding: 0 1em; background: #f1f3f6; border-radius: 999px; color: #6b7380; font-size: .9em; }
        .bw-body { position: relative; flex: 1; padding: 1.4em 1.5em; display: flex; flex-direction: column; gap: .8em; }
        .bw-post { display: flex; align-items: center; gap: .9em; font-weight: 600; font-size: 1.05em; line-height: 1.35; }
        .bw-thumb { flex: none; width: 3.6em; height: 2.8em; border-radius: .6em; background: linear-gradient(135deg, #d9e8fc, #d6f2ea); }
        .bw-line { display: block; height: .7em; border-radius: 999px; background: #eceef1; }

        /* 한 바퀴 끝에서 내용을 지웠다가 처음에 다시 그려, 되감기는 순간이 안 보이게 한다 */
        @keyframes bwFade { 0% { opacity: 0 } 4%, 94% { opacity: 1 } 100% { opacity: 0 } }
        .is-on .bw-body { animation: bwFade 8s linear infinite; }
        .is-on .bw-ai .bw-body, .is-on .bw-cat .bw-body { animation-duration: 9s; }
        .is-on .bw-adm .bw-body { animation-duration: 12s; }

        /* 01 · 주소 */
        .bw-own-old, .bw-own-new { position: absolute; left: 1em; right: 1em; display: flex; align-items: center; white-space: nowrap; }
        .bw-old-text { position: relative; }
        .bw-new-text { display: inline-flex; align-items: center; color: #111418; clip-path: inset(0 100% 0 0); }
        .bw-new-text svg { color: #12a37a; margin-right: .3em; }
        .bw-strike { position: absolute; left: 0; right: 0; top: 50%; height: 1.5px; background: #e05252; transform: scaleX(0); transform-origin: left; }

        /* 블로그 글 목록 — 블로그 이름, 그 아래 글 카드(썸네일 · 분류 · 제목 · 미리보기 · 날짜·조회) */
        .bw-own .bw-body { gap: .75em; padding-top: 1.1em; }
        .bw-blog-head { display: flex; align-items: center; justify-content: space-between; padding-bottom: .7em; border-bottom: 1px solid #eef0f3; opacity: 0; }
        .bw-blog-head strong { font-size: 1.1em; letter-spacing: -0.02em; }
        .bw-own-chip { display: inline-flex; align-items: center; gap: .3em; background: #e9f7f1; color: #0f8a6c; font-weight: 700; font-size: .82em; padding: .4em .8em; border-radius: 999px; opacity: 0; }
        .bw-art { display: flex; gap: .9em; align-items: center; opacity: 0; }
        .bw-art-thumb { flex: none; width: 5.2em; height: 4em; border-radius: .6em; }
        .bw-art-thumb-1 { background: linear-gradient(135deg, #d9e8fc, #b9d3f7); }
        .bw-art-thumb-2 { background: linear-gradient(135deg, #d6f2ea, #aee3d3); }
        .bw-art-thumb-3 { background: linear-gradient(135deg, #f1e6fb, #d8c6f3); }
        .bw-art-text { min-width: 0; display: grid; gap: .12em; }
        .bw-art-text small { color: #12a37a; font-weight: 700; font-size: .78em; }
        .bw-art-text b { font-size: .98em; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bw-art-text p { margin: 0; color: #6b7380; font-size: .82em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bw-art-text span { color: #9aa1ac; font-size: .74em; }
        .is-on .bw-own-old { animation: bw1Old 8s linear infinite; }
        .is-on .bw-strike { animation: bw1Strike 8s ease-out infinite; }
        .is-on .bw-own-new { animation: bw1New 8s ease-out infinite; }
        .is-on .bw-new-text { animation: bw1Type 8s steps(16, end) infinite; }
        .is-on .bw-blog-head { animation: bw1Head 8s ease-out infinite; }
        .is-on .bw-own-r1 { animation: bw1R1 8s ease-out infinite; }
        .is-on .bw-own-r2 { animation: bw1R2 8s ease-out infinite; }
        .is-on .bw-own-r3 { animation: bw1R3 8s ease-out infinite; }
        .is-on .bw-own-chip { animation: bw1Chip 8s cubic-bezier(.16,1,.3,1) infinite; }
        /* 순서: 옛 주소에 빨간 줄 → 옛 주소 사라짐 → 새 주소가 바로 한 글자씩 → 블로그 이름 → 글 세 개 → 소유 표시 */
        @keyframes bw1Old { 0%, 15% { opacity: 1 } 18%, 100% { opacity: 0 } }
        @keyframes bw1Strike { 0%, 4% { transform: scaleX(0) } 12%, 100% { transform: scaleX(1) } }
        @keyframes bw1New { 0%, 18% { opacity: 0 } 18.5%, 100% { opacity: 1 } }
        @keyframes bw1Type { 0%, 18.5% { clip-path: inset(0 100% 0 0) } 30%, 100% { clip-path: inset(0 0 0 0) } }
        @keyframes bw1Head { 0%, 32% { opacity: 0; transform: translateY(6px) } 36%, 100% { opacity: 1; transform: none } }
        @keyframes bw1R1 { 0%, 38% { opacity: 0; transform: translateY(10px) } 43%, 100% { opacity: 1; transform: none } }
        @keyframes bw1R2 { 0%, 46% { opacity: 0; transform: translateY(10px) } 51%, 100% { opacity: 1; transform: none } }
        @keyframes bw1R3 { 0%, 54% { opacity: 0; transform: translateY(10px) } 59%, 100% { opacity: 1; transform: none } }
        @keyframes bw1Chip { 0%, 64% { opacity: 0; transform: scale(.8) } 70%, 100% { opacity: 1; transform: none } }

        /* 02 · AI 검색 */
        .bw-q, .bw-a { margin: 0; padding: .75em 1.1em; border-radius: 1.2em; max-width: 82%; line-height: 1.45; font-size: 1.05em; opacity: 0; }
        .bw-q { align-self: flex-end; background: #1f63d6; color: #fff; border-bottom-right-radius: .35em; }
        /* 답변은 글자 길이만큼만 — 세로로 쌓는 상자라 그냥 두면 가로로 꽉 늘어난다 (출처 카드는 넓게 둔다) */
        .bw-a { align-self: flex-start; width: fit-content; background: #f1f3f6; border-bottom-left-radius: .35em; }
        .bw-dots { display: inline-flex; gap: .3em; padding: .9em 1.1em; background: #f1f3f6; border-radius: 1.2em; align-self: flex-start; opacity: 0; position: absolute; top: 5.2em; left: 1.5em; }
        .bw-dots i { width: .5em; height: .5em; border-radius: 50%; background: #9aa1ac; animation: bwDot 1s ease-in-out infinite; }
        .bw-dots i:nth-child(2) { animation-delay: .15s; }
        .bw-dots i:nth-child(3) { animation-delay: .3s; }
        @keyframes bwDot { 0%, 100% { transform: translateY(0); opacity: .5 } 50% { transform: translateY(-.25em); opacity: 1 } }
        .bw-src { display: grid; gap: .25em; padding: .9em 1.1em; border: 1.5px solid #e3e7ed; border-radius: .9em; max-width: 82%; opacity: 0; }
        .bw-src-label { font-size: .8em; font-weight: 700; color: #9aa1ac; }
        .bw-src strong { color: #1f63d6; font-size: 1em; }
        .bw-src span:last-child { color: #4b5360; font-size: .92em; }
        .is-on .bw-q { animation: bw2Q 9s ease-out infinite; }
        .is-on .bw-dots { animation: bw2Dots 9s linear infinite; }
        .is-on .bw-a { animation: bw2A 9s ease-out infinite; }
        .is-on .bw-src { animation: bw2Src 9s ease-out infinite; }
        @keyframes bw2Q { 0%, 22% { opacity: 0; transform: translateY(10px) } 25%, 100% { opacity: 1; transform: none } }
        @keyframes bw2Dots { 0%, 27% { opacity: 0 } 29%, 41% { opacity: 1 } 42%, 100% { opacity: 0 } }
        @keyframes bw2A { 0%, 42% { opacity: 0; transform: translateY(10px) } 46%, 100% { opacity: 1; transform: none } }
        @keyframes bw2Src { 0%, 54% { opacity: 0; transform: translateY(10px) } 58%, 66% { opacity: 1; transform: none; border-color: #e3e7ed; box-shadow: none } 72%, 100% { opacity: 1; transform: none; border-color: #1f63d6; box-shadow: 0 0 0 .3em rgba(31,99,214,.12) } }

        /* 03 · 진료과목 탭 */
        .bw-cat .bw-body { padding-top: .9em; overflow: hidden; }
        .bw-cat-zoom { position: relative; flex: 1; display: flex; flex-direction: column; gap: .8em; transform-origin: 0 0; }
        /* 탭 — 따로 떨어진 회색 칩 세 개, 고른 칩 위로 검정 알약(.bw-tab-ind)이 미끄러진다 (칩 폭 5.2em + 간격 .4em = 한 칸 5.6em) */
        /* 겹치는 순서: 회색 칩 바탕(::before, 맨 아래) → 검정 알약 → 칩 글자(맨 위) */
        .bw-tabs { position: relative; isolation: isolate; align-self: flex-start; display: flex; gap: .4em; font-size: .95em; }
        .bw-tab { position: relative; width: 5.2em; padding: .5em 0; text-align: center; font-weight: 700; color: #8a919c; }
        .bw-tab::before { content: ''; position: absolute; inset: 0; z-index: -1; border-radius: 999px; background: #f1f3f6; }
        .bw-tab-1 { color: #fff; }
        .bw-tab-ind { position: absolute; z-index: 0; top: 0; bottom: 0; left: 0; width: 5.2em; border-radius: 999px; background: #111418; }
        .is-on .bw-tab-ind { animation: bw3Ind 9s cubic-bezier(.65,0,.35,1) infinite; }
        .is-on .bw-cat-zoom { animation: bw3Zoom 9s cubic-bezier(.65,0,.35,1) infinite; }
        @keyframes bw3Ind { 0%, 31% { transform: translateX(0) } 34%, 64% { transform: translateX(5.6em) } 67%, 100% { transform: translateX(11.2em) } }
        /* 확대만 한다 — 1.18배여도 탭 세 개가 다 보여서 옆으로 따라갈 필요가 없다 */
        @keyframes bw3Zoom { 0%, 3% { transform: none } 9%, 92% { transform: scale(1.18) } 98%, 100% { transform: none } }
        .bw-lists { position: relative; flex: 1; }
        .bw-list { position: absolute; inset: 0; display: flex; flex-direction: column; gap: .75em; padding-top: .5em; }
        .bw-cat .bw-art { opacity: 1; }
        .bw-list-2, .bw-list-3 { opacity: 0; }
        .is-on .bw-tab-1 { animation: bw3T1 9s linear infinite; }
        .is-on .bw-tab-2 { animation: bw3T2 9s linear infinite; }
        .is-on .bw-tab-3 { animation: bw3T3 9s linear infinite; }
        .is-on .bw-list-1 { animation: bw3L1 9s ease-out infinite; }
        .is-on .bw-list-2 { animation: bw3L2 9s ease-out infinite; }
        .is-on .bw-list-3 { animation: bw3L3 9s ease-out infinite; }
        /* 글자색은 알약이 미끄러지는 동안(31~34%, 64~67%)에 같이 바뀐다 — 먼저 바뀌면 깜빡여 보인다 */
        @keyframes bw3T1 { 0%, 31% { color: #fff } 34%, 100% { color: #8a919c } }
        @keyframes bw3T2 { 0%, 31% { color: #8a919c } 34%, 64% { color: #fff } 67%, 100% { color: #8a919c } }
        @keyframes bw3T3 { 0%, 64% { color: #8a919c } 67%, 100% { color: #fff } }
        @keyframes bw3L1 { 0%, 30% { opacity: 1; transform: none } 33%, 100% { opacity: 0; transform: translateY(-6px) } }
        @keyframes bw3L2 { 0%, 33% { opacity: 0; transform: translateY(8px) } 37%, 63% { opacity: 1; transform: none } 66%, 100% { opacity: 0; transform: translateY(-6px) } }
        @keyframes bw3L3 { 0%, 66% { opacity: 0; transform: translateY(8px) } 70%, 100% { opacity: 1; transform: none } }

        /* 05 · 관리자 페이지 — 왼쪽 실제 화면 / 오른쪽 수정 화면. 장면 1(0~48%) 글쓰기 → 장면 2(50~100%) 디자인 수정 */
        .bw-adm-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 0; }
        .bw-adm-live { position: relative; background: #f3f6fa; border-right: 1px solid #e6ebf2; overflow: hidden; }
        .bw-adm-tag { position: absolute; z-index: 2; top: .7em; left: .8em; display: inline-flex; align-items: center; gap: .35em; padding: .3em .7em; border-radius: 999px; background: #fff; font-size: .7em; font-weight: 800; color: #0f8a6c; box-shadow: 0 2px 8px rgba(17,20,24,.06); }
        .bw-adm-tag i { width: .55em; height: .55em; border-radius: 50%; background: #12a37a; animation: bwLive 1.4s ease-in-out infinite; }
        @keyframes bwLive { 50% { opacity: .3; } }
        .bw-adm-lp { position: absolute; inset: 2.6em .8em .8em; border-radius: .7em; background: #fff; box-shadow: 0 6px 18px rgba(17,20,24,.06); padding: .8em; display: flex; flex-direction: column; gap: .5em; overflow: hidden; }
        .bw-adm-lp2 { opacity: 0; padding: 0; gap: 0; }
        .bw-adm-lp-title { font-size: .78em; padding-bottom: .4em; border-bottom: 1px solid #eef0f3; }
        .bw-adm-post { display: flex; align-items: center; gap: .5em; font-size: .72em; font-weight: 700; color: #111418; white-space: nowrap; overflow: hidden; }
        .bw-adm-post em { font-style: normal; font-size: .82em; color: #fff; background: #e05252; padding: .05em .4em; border-radius: .3em; margin-right: .35em; }
        .bw-adm-th { flex: none; width: 2.8em; height: 2.1em; border-radius: .4em; background: linear-gradient(135deg, #d9e8fc, #b9d3f7); }
        .bw-adm-th-2 { background: linear-gradient(135deg, #d6f2ea, #aee3d3); }
        .bw-adm-th-new { background: linear-gradient(135deg, #f1e6fb, #d8c6f3); }
        .bw-adm-new { max-height: 0; opacity: 0; overflow: hidden; border-radius: .5em; }
        .bw-adm-new .bw-adm-post { padding: .3em; }
        .bw-adm-nav { display: flex; align-items: center; gap: .4em; padding: .55em .7em; border-bottom: 1px solid #eef0f3; }
        .bw-adm-nav b { font-size: .72em; margin-right: auto; }
        .bw-adm-nav i { width: 1.6em; height: .35em; border-radius: 999px; background: #e3e7ed; }
        .bw-adm-banner { position: relative; height: 8em; margin: .6em; border-radius: .6em; overflow: hidden; }
        .bw-adm-banner > i { position: absolute; inset: 0; }
        .bw-adm-bg-a { background: linear-gradient(135deg, #cfd8e3, #a9b5c5); }
        .bw-adm-bg-b { background: linear-gradient(135deg, #6aa2f2, #1f63d6); opacity: 0; }
        .bw-adm-bcontent { position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: .5em; padding-left: .8em; }
        .bw-adm-btxt { display: grid; }
        .bw-adm-bt { grid-area: 1 / 1; color: #fff; font-size: .78em; font-weight: 800; line-height: 1.3; }
        .bw-adm-bbtn { padding: .35em .75em; border-radius: 999px; background: #fff; color: #1f63d6; font-size: .62em; font-weight: 800; }
        .bw-adm-bt-new { opacity: 0; }
        .bw-adm-quick { display: grid; grid-template-columns: repeat(3, 1fr); gap: .4em; margin: 0 .6em; }
        .bw-adm-quick i { height: 1.8em; border-radius: .4em; background: #f3f5f8; }
        .bw-adm-lp2::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3em; background: linear-gradient(rgba(255,255,255,0), #fff); pointer-events: none; }
        .bw-adm-sec { display: block; margin: 1.2em 0 .6em calc(.85em / .66); font-size: .66em; } /* 도형 왼쪽 선(.6em)보다 살짝 안쪽 — 글자 크기 .66em 만큼 나눠 맞춘다 */
        .bw-adm-docs { display: grid; grid-template-columns: 1fr 1fr; gap: .4em; margin: 0 .6em; }
        .bw-adm-docs span { display: grid; grid-template-columns: 1.8em 1fr; grid-template-rows: auto auto; column-gap: .4em; row-gap: .3em; align-items: center; padding: .4em; border-radius: .4em; background: #f7f8fa; }
        .bw-adm-docs i { grid-row: 1 / 3; width: 1.8em; height: 1.8em; border-radius: 50%; background: linear-gradient(135deg, #dfe7f2, #c5d2e4); }
        .bw-adm-docs u, .bw-adm-notice u { display: block; height: .32em; border-radius: 999px; background: #e3e7ed; }
        .bw-adm-docs u + u { width: 60%; }
        .bw-adm-notice { display: grid; gap: .35em; margin: 0 .6em; }
        .bw-adm-notice u + u { width: 75%; }

        .bw-adm-edit { position: relative; padding: .8em .9em; display: flex; flex-direction: column; }
        .bw-adm-tabs { display: flex; gap: .3em; margin-bottom: .7em; }
        .bw-adm-tabs span { padding: .35em .7em; border-radius: 999px; font-size: .72em; font-weight: 700; color: #8a919c; background: #f3f5f8; }
        /* !important 를 쓰면 애니메이션이 못 덮어써서 탭이 안 바뀐다 — 선택자를 한 단계 구체적으로 써서 이긴다 */
        .bw-adm-tabs .bw-adm-tab1 { background: #111418; color: #fff; }
        .bw-adm-ep { position: absolute; left: .9em; right: .9em; top: 3em; bottom: .8em; display: flex; flex-direction: column; gap: .35em; }
        .bw-adm-ep2 { opacity: 0; }
        .bw-adm-ep label { font-size: .68em; font-weight: 700; color: #8a919c; margin-top: .2em; }
        .bw-adm-input { position: relative; display: block; height: 2.1em; padding: 0 .6em; border: 1px solid #e3e7ed; border-radius: .5em; font-size: .78em; font-weight: 700; line-height: 2.1em; white-space: nowrap; overflow: hidden; }
        .bw-adm-type1, .bw-adm-type2 { display: inline-block; clip-path: inset(0 100% 0 0); }
        .bw-adm-type2, .bw-adm-old { position: absolute; left: .6em; top: 0; }
        .bw-adm-area { display: flex; flex-direction: column; gap: .45em; padding: .6em; border: 1px solid #e3e7ed; border-radius: .5em; }
        .bw-adm-area .bw-line { height: .5em; }
        .bw-adm-l1, .bw-adm-l2, .bw-adm-l3 { transform: scaleX(0); transform-origin: left; }
        /* 사진 고르기 — 단색 사진 세 장. 고르면 파란 테두리와 오른쪽 위 순서 번호가 톡 붙는다 */
        .bw-adm-photos { display: flex; gap: .8em; padding-left: 2px; } /* 고르면 바깥으로 테두리가 생기니 사이를 넉넉히 */
        .bw-adm-photo { position: relative; width: 3.4em; height: 3.4em; border-radius: .45em; box-shadow: 0 0 0 0 #1f63d6; filter: saturate(.55) brightness(1.08); }
        .bw-adm-photo1 { background: #4f8ded; }
        .bw-adm-photo2 { background: #5fbf9f; }
        .bw-adm-photo3 { background: #f2a65a; }
        /* 휴대폰 — 카드가 작아 번호가 뭉개지니 번호·흐림은 빼고 파란 테두리만 생기게 */
        /* (번호 모양 규칙이 이 아래에 있어서, 선택자를 한 단계 더 구체적으로 써야 덮어쓴다) */
        @media (max-width: 800px) {
          .bw-adm-photos .bw-adm-photo { filter: none !important; }
          .bw-adm-photos .bw-adm-photo em { display: none; }
        }
        .bw-adm-photo em { position: absolute; top: -.35em; right: -.35em; width: 1.25em; height: 1.25em; border-radius: 50%; background: #1f63d6; border: 2px solid #fff; color: #fff; font-style: normal; font-size: .62em; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; transform: scale(0); }
        .bw-adm-btn { position: absolute; right: 0; bottom: 0; padding: .55em 1em; border-radius: .5em; background: #1f63d6; color: #fff; font-size: .74em; font-weight: 700; }
        .bw-adm-input--static { color: #6b7380; font-weight: 600; }
        .bw-adm-toggle { display: flex; align-items: center; justify-content: space-between; margin-top: .45em; padding: .55em .6em; border-radius: .5em; background: #f7f8fa; font-size: .72em; font-weight: 700; color: #3a414c; }
        .bw-adm-toggle i { position: relative; width: 2.2em; height: 1.25em; border-radius: 999px; background: #1f63d6; }
        .bw-adm-toggle i::after { content: ''; position: absolute; top: .15em; right: .15em; width: .95em; height: .95em; border-radius: 50%; background: #fff; }
        .bw-adm-thumbs { display: flex; gap: .4em; }
        .bw-adm-thumbs i { width: 3.4em; height: 2.4em; border-radius: .45em; border: 2px solid transparent; }
        .bw-adm-thumbs .bw-adm-tb1 { background: linear-gradient(135deg, #cfd8e3, #a9b5c5); border-color: #111418; }
        .bw-adm-tb2 { background: linear-gradient(135deg, #6aa2f2, #1f63d6); }
        .bw-adm-tb3 { background: linear-gradient(135deg, #d6f2ea, #7fcfb5); }

        .is-on .bw-adm-lp1, .is-on .bw-adm-ep1 { animation: bw5S1 12s linear infinite; }
        .is-on .bw-adm-lp2, .is-on .bw-adm-ep2 { animation: bw5S2 12s linear infinite; }
        .is-on .bw-adm-tab1 { animation: bw5Tab1 12s linear infinite; }
        .is-on .bw-adm-tab2 { animation: bw5Tab2 12s linear infinite; }
        .is-on .bw-adm-type1 { animation: bw5Type1 12s steps(14, end) infinite; }
        .is-on .bw-adm-l1 { animation: bw5L1 12s linear infinite; }
        .is-on .bw-adm-l2 { animation: bw5L2 12s linear infinite; }
        .is-on .bw-adm-l3 { animation: bw5L3 12s linear infinite; }
        .is-on .bw-adm-photo1 { animation: bw5Pick1 12s ease infinite; }
        .is-on .bw-adm-photo2 { animation: bw5Pick2 12s ease infinite; }
        .is-on .bw-adm-photo3 { animation: bw5Pick3 12s ease infinite; }
        .is-on .bw-adm-photo1 em { animation: bw5No1 12s cubic-bezier(.34,1.56,.64,1) infinite; }
        .is-on .bw-adm-photo2 em { animation: bw5No2 12s cubic-bezier(.34,1.56,.64,1) infinite; }
        .is-on .bw-adm-photo3 em { animation: bw5No3 12s cubic-bezier(.34,1.56,.64,1) infinite; }
        .is-on .bw-adm-pub { animation: bw5Pub 12s ease-in-out infinite; }
        .is-on .bw-adm-new { animation: bw5New 12s cubic-bezier(.16,1,.3,1) infinite; }
        .is-on .bw-adm-tb1 { animation: bw5Tb1 12s linear infinite; }
        .is-on .bw-adm-tb2 { animation: bw5Tb2 12s linear infinite; }
        .is-on .bw-adm-bg-b { animation: bw5Bg 12s ease infinite; }
        .is-on .bw-adm-old { animation: bw5Old 12s linear infinite; }
        .is-on .bw-adm-type2 { animation: bw5Type2 12s steps(14, end) infinite; }
        .is-on .bw-adm-save { animation: bw5Save 12s ease-in-out infinite; }
        .is-on .bw-adm-bt-old { animation: bw5BtOld 12s ease infinite; }
        .is-on .bw-adm-bt-new { animation: bw5BtNew 12s ease infinite; }
        .is-on .bw-adm-banner { animation: bw5Flash 12s ease infinite; }
        @keyframes bw5S1 { 0%, 47% { opacity: 1; } 49%, 100% { opacity: 0; } }
        @keyframes bw5S2 { 0%, 49% { opacity: 0; } 51%, 100% { opacity: 1; } }
        @keyframes bw5Tab1 { 0%, 48% { background: #111418; color: #fff; } 50%, 100% { background: #f3f5f8; color: #8a919c; } }
        @keyframes bw5Tab2 { 0%, 48% { background: #f3f5f8; color: #8a919c; } 50%, 100% { background: #111418; color: #fff; } }
        /* 장면 1 — 제목(4~13%) · 본문 세 줄(14~23%) · 사진 첨부(24%) · 발행(28%) → 왼쪽에 새 글(30~34%) */
        @keyframes bw5Type1 { 0%, 4% { clip-path: inset(0 100% 0 0); } 13%, 100% { clip-path: inset(0 0 0 0); } }
        @keyframes bw5L1 { 0%, 14% { transform: scaleX(0); } 17%, 100% { transform: scaleX(1); } }
        @keyframes bw5L2 { 0%, 17.5% { transform: scaleX(0); } 20.5%, 100% { transform: scaleX(1); } }
        @keyframes bw5L3 { 0%, 21% { transform: scaleX(0); } 23%, 100% { transform: scaleX(1); } }
        /* 사진 세 장을 차례로 고른다 (23.5% · 25% · 26.5%) */
        @keyframes bw5Pick1 { 0%, 23.5% { box-shadow: 0 0 0 0 #1f63d6; filter: saturate(.55) brightness(1.08); } 24.2%, 100% { box-shadow: 0 0 0 2px #1f63d6; filter: none; } }
        @keyframes bw5Pick2 { 0%, 25% { box-shadow: 0 0 0 0 #1f63d6; filter: saturate(.55) brightness(1.08); } 25.7%, 100% { box-shadow: 0 0 0 2px #1f63d6; filter: none; } }
        @keyframes bw5Pick3 { 0%, 26.5% { box-shadow: 0 0 0 0 #1f63d6; filter: saturate(.55) brightness(1.08); } 27.2%, 100% { box-shadow: 0 0 0 2px #1f63d6; filter: none; } }
        @keyframes bw5No1 { 0%, 23.5% { transform: scale(0); } 24.8%, 100% { transform: scale(1); } }
        @keyframes bw5No2 { 0%, 25% { transform: scale(0); } 26.3%, 100% { transform: scale(1); } }
        @keyframes bw5No3 { 0%, 26.5% { transform: scale(0); } 27.8%, 100% { transform: scale(1); } }
        @keyframes bw5Pub { 0%, 29% { transform: none; } 30.5% { transform: scale(.9); } 32%, 100% { transform: none; } }
        @keyframes bw5New { 0%, 32% { max-height: 0; opacity: 0; background: transparent; } 36% { max-height: 4em; opacity: 1; background: #eef4fe; } 44%, 100% { max-height: 4em; opacity: 1; background: transparent; } }
        /* 장면 2 — 두 번째 사진 고름(56%) → 왼쪽 배경 바로 바뀜 · 문구 지우고 새로 씀(63~74%) · 저장(79%) → 왼쪽 문구 바뀜 */
        @keyframes bw5Tb1 { 0%, 55% { border-color: #111418; } 56%, 100% { border-color: transparent; } }
        @keyframes bw5Tb2 { 0%, 55% { border-color: transparent; } 56%, 100% { border-color: #111418; } }
        @keyframes bw5Bg { 0%, 56% { opacity: 0; } 60%, 100% { opacity: 1; } }
        @keyframes bw5Old { 0%, 61% { opacity: 1; } 63%, 100% { opacity: 0; } }
        @keyframes bw5Type2 { 0%, 63% { clip-path: inset(0 100% 0 0); } 74%, 100% { clip-path: inset(0 0 0 0); } }
        @keyframes bw5Save { 0%, 78% { transform: none; } 79.5% { transform: scale(.9); } 81%, 100% { transform: none; } }
        @keyframes bw5BtOld { 0%, 81% { opacity: 1; } 83%, 100% { opacity: 0; } }
        @keyframes bw5BtNew { 0%, 82% { opacity: 0; transform: translateY(.4em); } 85%, 100% { opacity: 1; transform: none; } }
        @keyframes bw5Flash { 0%, 81% { box-shadow: 0 0 0 0 rgba(31,99,214,0); } 84% { box-shadow: 0 0 0 .3em rgba(31,99,214,.35); } 92%, 100% { box-shadow: 0 0 0 0 rgba(31,99,214,0); } }

        /* 04 · 글 → 병원 홈페이지 */
        .bw-u { position: absolute; left: 1em; right: 1em; display: flex; align-items: center; gap: .3em; white-space: nowrap; }
        .bw-u-home { opacity: 0; color: #111418; font-weight: 700; }
        .bw-u-home svg { color: #12a37a; }
        .bw-rsv-tag { color: #12a37a; font-weight: 700; font-size: .9em; }
        .bw-rsv-title { font-size: 1.35em; line-height: 1.35; margin-bottom: .3em; }
        .bw-rsv-btn { position: absolute; left: 1.5em; right: 1.5em; bottom: 1.4em; display: flex; align-items: center; justify-content: center; gap: .4em; background: #111418; color: #fff; font-weight: 700; font-size: 1.02em; padding: .9em; border-radius: .8em; }
        .bw-home { position: absolute; inset: 0; background: #fff; display: flex; flex-direction: column; opacity: 0; transform: translateX(12%); }
        .bw-home-nav { display: flex; align-items: center; gap: 1.1em; padding: .9em 1.4em; border-bottom: 1px solid #eef0f3; font-size: .85em; color: #6b7380; }
        .bw-home-nav strong { color: #111418; font-size: 1.15em; margin-right: auto; }
        .bw-home-hero { margin: 1em 1.2em 0; padding: 1.4em 1.4em 1.5em; border-radius: .9em; background: linear-gradient(135deg, #e3f0ff, #cfe3fb); display: grid; gap: .5em; justify-items: start; }
        .bw-home-hero small { color: #1f63d6; font-weight: 700; font-size: .8em; }
        .bw-home-hero strong { font-size: 1.25em; line-height: 1.3; letter-spacing: -0.03em; white-space: nowrap; }
        .bw-home-cta { display: inline-flex; align-items: center; gap: .35em; margin-top: .3em; background: #1f63d6; color: #fff; font-weight: 700; font-size: .9em; padding: .65em 1.1em; border-radius: 999px; }
        .bw-home-quick { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6em; margin: .9em 1.2em 0; }
        .bw-home-info { margin: .9em 1.2em 0; padding: .2em 1em; border: 1px solid #eef0f3; border-radius: .7em; }
        .bw-home-info p { margin: 0; padding: .7em 0; display: flex; align-items: center; gap: .45em; font-size: .82em; color: #6b7380; white-space: nowrap; overflow: hidden; }
        .bw-home-info p + p { border-top: 1px solid #eef0f3; }
        .bw-home-info b { color: #0f8a6c; }
        .bw-home-info em { font-style: normal; font-weight: 700; color: #1f63d6; background: #eaf1fd; padding: .15em .55em; border-radius: .4em; }
        .bw-home-dot { width: .55em; height: .55em; border-radius: 50%; background: #12a37a; box-shadow: 0 0 0 .25em rgba(18,163,122,.18); flex: none; margin-left: .3em; /* 둘레 빛무리(.25em)가 줄 상자에 잘리지 않게 */ }
        .bw-home-quick span { text-align: center; padding: .85em 0; border-radius: .7em; background: #f4f6f9; font-size: .85em; font-weight: 700; color: #4b5360; }
        .bw-rsv-l1, .bw-rsv-l2, .bw-rsv-l3, .bw-rsv-l4 { transform: scaleX(0); transform-origin: left; }
        .is-on .bw-rsv-l1 { animation: bw4L1 8s linear infinite; }
        .is-on .bw-rsv-l2 { animation: bw4L2 8s linear infinite; }
        .is-on .bw-rsv-l3 { animation: bw4L3 8s linear infinite; }
        .is-on .bw-rsv-l4 { animation: bw4L4 8s linear infinite; }
        @keyframes bw4L1 { 0%, 4% { transform: scaleX(0) } 8.5%, 100% { transform: scaleX(1) } }
        @keyframes bw4L2 { 0%, 9% { transform: scaleX(0) } 13.5%, 100% { transform: scaleX(1) } }
        @keyframes bw4L3 { 0%, 14% { transform: scaleX(0) } 18.5%, 100% { transform: scaleX(1) } }
        @keyframes bw4L4 { 0%, 19% { transform: scaleX(0) } 22%, 100% { transform: scaleX(1) } }
        .is-on .bw-rsv-btn { animation: bw4Btn 8s ease-in-out infinite; }
        .is-on .bw-home { animation: bw4Home 8s cubic-bezier(.16,1,.3,1) infinite; }
        .is-on .bw-u-blog { animation: bw4UBlog 8s linear infinite; }
        .is-on .bw-u-home { animation: bw4UHome 8s linear infinite; }
        .is-on .bw-home-cta { animation: bw4Cta 8s ease-out infinite; }
        /* 순서: 본문 네 줄이 차례로 써짐(4~22%) → 버튼이 반짝(23~30%) → 눌림(32%) → 주소가 우리병원.com 으로, 홈페이지가 옆에서 밀려 들어옴 → 예약 버튼이 반짝 */
        @keyframes bw4Btn {
          0%, 23% { transform: none; box-shadow: 0 0 0 0 rgba(17,20,24,.3) }
          29% { box-shadow: 0 0 0 .7em rgba(17,20,24,0) }
          30% { transform: none }
          32% { transform: scale(.95) }
          35%, 100% { transform: none }
        }
        @keyframes bw4Home { 0%, 35% { opacity: 0; transform: translateX(12%) } 42%, 100% { opacity: 1; transform: none } }
        @keyframes bw4UBlog { 0%, 35% { opacity: 1 } 37%, 100% { opacity: 0 } }
        @keyframes bw4UHome { 0%, 36% { opacity: 0 } 38%, 100% { opacity: 1 } }
        @keyframes bw4Cta { 0%, 56% { box-shadow: 0 0 0 0 rgba(31,99,214,.45) } 68%, 100% { box-shadow: 0 0 0 .8em rgba(31,99,214,0) } }

        /* 모션 최소화 — 붙잡지 않고 질문과 답을 차례로 쌓아 보여준다 (카드 안은 마지막 장면으로) */
        @media (prefers-reduced-motion: reduce) {
          .bwy { height: auto; }
          .bwy-pin { position: static; height: auto; padding: 6rem 0; }
          .bwy-ask, .bwy-answers, .bwy-answer, .bwy-end { position: static; }
          .bwy-eyebrow { opacity: 1; }
          .bwy-line--a, .bwy-line--b { transform: none; }
          .bwy-hl { color: #1f63d6; }
          .bwy-def { opacity: 1; transform: none; }
          .bwy-answers { pointer-events: auto; }
          .bwy-answer { opacity: 1; margin-top: 4.5rem; }
          .bwy-end { opacity: 1; pointer-events: auto; margin-top: 5rem; padding: 5rem 1.5rem; background: #4f8ded; }
          .bwy-end-bg { display: none; }
          .bwy-end-chips li { opacity: 1; transform: none; }
          .bw-own-old, .bw-list-1 { opacity: 0; }
          .bw-new-text { clip-path: none; }
          .bw-own-new, .bw-blog-head, .bw-art, .bw-own-chip, .bw-q, .bw-a, .bw-src, .bw-list-3, .bw-home, .bw-u-home { opacity: 1; }
          .bw-home { transform: none; }
          .bw-rsv-l1, .bw-rsv-l2, .bw-rsv-l3, .bw-rsv-l4 { transform: none; }
          .bw-u-blog { opacity: 0; }
          .bw-tab-1 { color: #8a919c; }
          .bw-tab-3 { color: #fff; }
          .bw-tab-ind { transform: translateX(11.2em); }
        }
      `}</style>
    </section>
  )
}
