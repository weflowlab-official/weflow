'use client'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * 병의원 웹블로그 페이지의 자주 묻는 질문 — 메인의 자주 묻는 질문(components/home/HomeFaqSection.tsx)과 같은 모양이다.
 * 왼쪽에 제목과 '찾으시는 질문이 없나요?' + 상담 버튼, 오른쪽에 선으로만 나눈 질문 목록.
 *
 * 질문을 누르면 답이 부드럽게 펼쳐지고, 한 번에 하나만 열린다. 열리면 + 가 45° 돌아 × 가 된다.
 * 접혀 있어도 답변 글은 HTML 에 그대로 실린다 (높이만 0 으로 접는다).
 * 메인과 달리 상담 버튼은 이 페이지 아래 상담 폼(#contact)으로 내려간다 — 메인 사이트로 나가지 않는다.
 */

const FAQ = [
  { q: '지금 쓰는 네이버 블로그는 그만둬야 하나요?', a: '아니요, 함께 운영하셔도 됩니다. 웹블로그는 우리 병원 주소에서 따로 운영됩니다.' },
  { q: '이미 병원 홈페이지가 있어요. 웹블로그만 만들 수 있나요?', a: '네. 기존 홈페이지 주소 아래(예: 병원주소/blog)에 붙이거나 별도 주소로 만들 수 있습니다. 상담을 통해 병원에 더 맞는 방식을 안내해 드립니다.' },
  { q: '웹블로그 없이 홈페이지만 만들 수도 있나요?', a: '네. 홈페이지만 먼저 만들고, 필요할 때 웹블로그를 같은 디자인으로 이어 붙일 수 있습니다.' },
  { q: '웹블로그도 네이버 검색에 나오나요?', a: '네. 네이버·구글이 잘 읽을 수 있도록 검색 구조부터 설계하고, 오픈할 때 검색엔진 등록까지 마칩니다. 다만 검색 순위는 글의 내용과 꾸준함에 따라 달라집니다.' },
  { q: '제작 기간과 비용은 어느 정도인가요?', a: '카테고리 수, 디자인 범위, 홈페이지 연동 방식에 따라 달라집니다. 상담을 통해 우리 병원에 맞춰 안내해 드립니다.' },
  { q: '오픈한 뒤에 수정이 필요하면 어떻게 하나요?', a: '오픈 후에도 디자인 수정이나 기능 추가가 필요하면 상담을 통해 도와드립니다.' },
]

export default function ClinicFaq() {
  const [open, setOpen] = useState(-1) // 열려 있는 질문 번호 (-1 = 모두 접힘)

  return (
    <section id="faq" className="cf" aria-labelledby="cf-title">
      <div className="cf-inner">
        {/* 왼쪽 묶음 — 좁은 화면에서는 풀려서 제목은 목록 위로, 물어보기는 목록 아래로 간다 */}
        <div className="cf-side">
          <header className="cf-head">
            <p className="cf-eyebrow">FAQ</p>
            <h2 id="cf-title" className="cf-title">궁금하신 점을 모았어요</h2>
          </header>
          <div className="cf-ask">
            <p>찾으시는 질문이 없나요?</p>
            <a href="#contact-form" className="cf-cta">
              상담으로 물어보기
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <ul className="cf-list">
          {FAQ.map((f, i) => {
            const on = open === i
            return (
              <li key={f.q} className={on ? 'cf-item is-open' : 'cf-item'}>
                <h3 className="cf-q">
                  <button type="button" aria-expanded={on} aria-controls={`cf-a-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    <span className="cf-q__mark" aria-hidden="true">Q</span>
                    <span className="cf-q__text">{f.q}</span>
                    <span className="cf-q__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`cf-a-${i}`} className="cf-a" role="region" aria-hidden={!on}>
                  <div className="cf-a__in">
                    <span className="cf-a__mark" aria-hidden="true">A</span>
                    <p>{f.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <style>{`
        .cf { background: #f7f8fa; color: #111418; padding: clamp(5rem, 10vw, 8.75rem) 20px; }
        .cf-inner { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, .75fr) minmax(0, 1.5fr); gap: clamp(2rem, 6vw, 6rem); align-items: start; }

        .cf-eyebrow { margin: 0 0 16px; font-weight: 700; font-size: .85rem; letter-spacing: .22em; color: #1f63d6; }
        .cf-title { margin: 0; font-size: clamp(1.7rem, 3.4vw, 2.5rem); font-weight: 800; letter-spacing: -0.035em; line-height: 1.3; }
        .cf-ask { margin-top: clamp(2rem, 4vw, 3rem); }
        .cf-ask p { margin: 0 0 .85rem; font-size: clamp(.95rem, 1.35vw, 1.08rem); line-height: 1.65; color: #4b5360; }
        .cf-cta { display: inline-flex; align-items: center; gap: .4rem; padding: .85rem 1.5rem; border: 1.5px solid #111418; border-radius: 999px; background: #111418; color: #fff; font-size: 1rem; font-weight: 700; text-decoration: none; white-space: nowrap; transition: background .15s, border-color .15s; }
        /* 마우스를 올리면 헤더의 '무료 상담' 버튼처럼 파랗게 바뀐다 */
        .cf-cta:hover { background: #1f63d6; border-color: #1f63d6; }
        .cf-cta svg { transition: transform .3s cubic-bezier(.16,1,.3,1); }
        .cf-cta:hover svg { transform: translateX(3px); }

        /* 질문 목록 — 상자 없이 가는 선으로만 나눈다 */
        .cf-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid #111418; }
        .cf-item { border-bottom: 1px solid #e3e5e8; }
        .cf-q { margin: 0; font-size: inherit; font-weight: inherit; }
        .cf-q button { width: 100%; display: flex; align-items: center; gap: clamp(.75rem, 1.6vw, 1.1rem); padding: clamp(1.15rem, 2.2vw, 1.6rem) .25rem; border: 0; background: none; color: #111418; font: inherit; text-align: left; cursor: pointer; }
        .cf-q__mark, .cf-a__mark { flex: none; width: 1.1em; font-size: clamp(1rem, 1.5vw, 1.2rem); font-weight: 800; color: #b9bdc4; transition: color .2s; }
        .cf-q__text { flex: 1; font-size: clamp(1.02rem, 1.55vw, 1.2rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.45; word-break: keep-all; transition: color .2s; }
        /* 더하기 표시 — 열리면 45° 돌아 × 가 되고, 동그라미가 검게 채워진다 */
        .cf-q__icon { position: relative; flex: none; width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #d5d8dd; transition: transform .4s cubic-bezier(.16,1,.3,1), background .2s, border-color .2s; }
        .cf-q__icon::before, .cf-q__icon::after { content: ''; position: absolute; top: 50%; left: 50%; width: 13px; height: 1.6px; border-radius: 2px; background: #111418; transform: translate(-50%, -50%); transition: background .2s; }
        .cf-q__icon::after { transform: translate(-50%, -50%) rotate(90deg); }
        .cf-q button:hover .cf-q__text, .cf-item.is-open .cf-q__text,
        .cf-q button:hover .cf-q__mark, .cf-item.is-open .cf-q__mark { color: #1f63d6; }
        .cf-q button:hover .cf-q__icon { border-color: #111418; }
        .cf-item.is-open .cf-q__icon { transform: rotate(45deg); background: #111418; border-color: #111418; }
        .cf-item.is-open .cf-q__icon::before, .cf-item.is-open .cf-q__icon::after { background: #fff; }

        /* 답변 — 줄 높이를 0fr ↔ 1fr 로 바꿔 내용 높이만큼 부드럽게 펼친다. A 는 Q 와 같은 세로줄에 */
        .cf-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s cubic-bezier(.16,1,.3,1); }
        .cf-item.is-open .cf-a { grid-template-rows: 1fr; }
        .cf-a__in { min-height: 0; overflow: hidden; display: flex; gap: clamp(.75rem, 1.6vw, 1.1rem); padding: 0 3.2rem 0 .25rem; opacity: 0; transition: opacity .3s; }
        .cf-item.is-open .cf-a__in { opacity: 1; transition: opacity .4s .1s; }
        .cf-a__mark { color: #1f63d6; opacity: .45; line-height: 1.6; }
        .cf-a__in p { margin: 0; padding-bottom: clamp(1.25rem, 2.4vw, 1.75rem); font-size: clamp(.95rem, 1.3vw, 1.05rem); line-height: 1.75; color: #4b5360; word-break: keep-all; }

        /* 좁은 화면 — 제목 → 목록 → 물어보기 순으로 한 줄에 쌓는다 */
        @media (max-width: 860px) {
          .cf-inner { grid-template-columns: 1fr; }
          .cf-side { display: contents; }
          .cf-head { order: 1; }
          .cf-list { order: 2; }
          .cf-ask { order: 3; margin-top: 0; text-align: center; }
          .cf-q__icon { width: 32px; height: 32px; }
          .cf-a__in { padding-right: .5rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-a, .cf-a__in, .cf-q__icon { transition: none; }
        }
      `}</style>
    </section>
  )
}
