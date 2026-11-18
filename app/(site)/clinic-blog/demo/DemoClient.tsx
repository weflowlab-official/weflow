'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Eye, Heading2, Info, Pencil, Phone,
  Pilcrow, Plus, RotateCcw, Search, Send, Trash2, X,
} from 'lucide-react'

/**
 * 글쓰기 체험판 — 실제 웹블로그 관리자의 글쓰기 화면(blog/collections/Posts.ts)과 같은 칸 구성:
 * 제목 + 탭(카테고리 · 요약 · 본문 · FAQ · 태그), 넓은 화면에서는 오른쪽에 미리보기가 같이 움직인다.
 * 예시 글이 채워진 채로 시작하고, '발행'을 누르면 완성된 글 화면과 '함께 만들어진 것'(사이트맵·구조화 데이터·검색 미리보기)을 보여 준다.
 *
 * 서버에 아무것도 보내지 않는다 — 내용은 이 컴포넌트의 상태로만 있고 새로고침하면 예시 글로 돌아간다 (저장·업로드 없음).
 * 그래서 대표 이미지는 파일을 올리지 않고 준비된 색 셋 중에서 고른다. 본문은 안전하게 '소제목·문단' 블록으로만 다룬다 (HTML 을 받지 않는다).
 * 예시 병원·의료진은 지어낸 이름이고, 글 내용은 특정 치료를 권하지 않는 일반 안내 수준으로만 적었다.
 */

const TEL = '010-2971-7280'
const CONTACT = '/clinic-blog#contact-form'

type Block = { id: number; type: 'h2' | 'p'; text: string }
type Faq = { id: number; q: string; a: string }
type Draft = {
  title: string
  category: string
  author: string
  thumb: string
  summary: string
  points: { id: number; text: string }[]
  blocks: Block[]
  faq: Faq[]
  tags: string[]
}

const CATEGORIES = ['백내장', '녹내장', '망막', '시력교정', '안구건조증']
const AUTHORS = ['홍길동 원장 · 안과 전문의', '김영희 원장 · 안과 전문의']
// 대표 이미지 — 올리는 대신 고른다. 실제 관리자에서는 사진을 올리면 알맞은 크기로 자동 변환된다
const THUMBS = [
  { key: 'sky', name: '하늘', bg: 'linear-gradient(135deg, #dbeafe 0%, #f0f7ff 100%)', ink: '#1b4ea7' },
  { key: 'mint', name: '민트', bg: 'linear-gradient(135deg, #d1fae5 0%, #f0fdf9 100%)', ink: '#0f766e' },
  { key: 'lavender', name: '라벤더', bg: 'linear-gradient(135deg, #e9d5ff 0%, #faf5ff 100%)', ink: '#6d28d9' },
]

const SUMMARY_MAX = 200

const INITIAL: Draft = {
  title: '백내장 수술, 겨울에 받아도 괜찮을까요?',
  category: '백내장',
  author: AUTHORS[0],
  thumb: 'sky',
  summary: '백내장 수술은 계절과 관계없이 받을 수 있습니다. 수술 시기는 계절보다, 시력 저하로 일상에 불편이 있는지를 기준으로 의료진과 상담해 정합니다.',
  points: [
    { id: 1, text: '수술 시기는 계절이 아니라 일상의 불편함을 기준으로 정합니다.' },
    { id: 2, text: '수술 뒤에는 병원이 안내한 안약 사용과 생활 수칙을 지키는 것이 중요합니다.' },
  ],
  blocks: [
    { id: 1, type: 'p', text: '"겨울에 수술하면 회복이 더딘가요?" 진료실에서 자주 듣는 질문입니다. 결론부터 말씀드리면, 백내장 수술은 계절과 관계없이 받을 수 있습니다.' },
    { id: 2, type: 'h2', text: '수술 시기는 무엇으로 정하나요?' },
    { id: 3, type: 'p', text: '글씨가 뿌옇게 보이거나 야간 운전이 불편해지는 등, 시력 저하로 일상에 불편이 생겼는지가 기준입니다. 정확한 시기는 검사 결과를 보고 의료진과 상담해 정합니다.' },
    { id: 4, type: 'h2', text: '수술 뒤에는 무엇을 조심해야 하나요?' },
    { id: 5, type: 'p', text: '계절과 상관없이, 병원에서 안내한 안약 사용법과 생활 수칙을 지키는 것이 가장 중요합니다. 눈을 비비지 않고, 정해진 날짜에 경과를 확인합니다.' },
  ],
  faq: [
    { id: 1, q: '수술 뒤 세안은 언제부터 할 수 있나요?', a: '한동안 눈에 물이 들어가지 않게 주의해야 합니다. 정확한 시점은 수술 상태에 따라 다르므로 수술받은 병원의 안내를 따르세요.' },
    { id: 2, q: '양쪽 눈을 같은 날 수술하나요?', a: '보통은 한쪽씩 간격을 두고 진행합니다. 눈 상태에 따라 달라질 수 있어 상담에서 일정을 정합니다.' },
  ],
  tags: ['백내장', '백내장 수술 시기', '백내장 수술 후 관리'],
}

const TABS = [
  { key: 'category', label: '카테고리' },
  { key: 'summary', label: '요약' },
  { key: 'content', label: '본문' },
  { key: 'faq', label: 'FAQ' },
  { key: 'tags', label: '태그' },
] as const
type TabKey = (typeof TABS)[number]['key']

const TODAY = (() => {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})()

/** 완성된 글 화면 — 편집 중 미리보기와 발행 뒤 화면이 같이 쓴다 */
function Article({ d }: { d: Draft }) {
  const thumb = THUMBS.find(t => t.key === d.thumb) ?? THUMBS[0]
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  return (
    <article className="dm-art">
      <p className="dm-art-cat">{d.category}</p>
      <h1>{d.title || '제목을 입력해 주세요'}</h1>
      <p className="dm-art-meta">{d.author} · {TODAY}</p>
      {/* 대표 이미지 — 제목이 들어간 색 카드 */}
      <div className="dm-art-thumb" style={{ background: thumb.bg, color: thumb.ink }}>
        <span>{d.category}</span>
        <strong>{d.title || '제목'}</strong>
        <em>우리안과 웹블로그 · 예시</em>
      </div>
      {(d.summary || d.points.length > 0) && (
        <div className="dm-art-sum">
          <b>핵심 요약</b>
          {d.summary && <p>{d.summary}</p>}
          {d.points.some(p => p.text.trim()) && (
            <ul>{d.points.filter(p => p.text.trim()).map(p => <li key={p.id}>{p.text}</li>)}</ul>
          )}
        </div>
      )}
      <div className="dm-art-body">
        {d.blocks.filter(b => b.text.trim()).map(b => (b.type === 'h2' ? <h2 key={b.id}>{b.text}</h2> : <p key={b.id}>{b.text}</p>))}
      </div>
      {d.faq.some(f => f.q.trim()) && (
        <div className="dm-art-faq">
          <h2>자주 묻는 질문</h2>
          {d.faq.filter(f => f.q.trim()).map(f => (
            <div key={f.id} className={openFaq === f.id ? 'is-open' : undefined}>
              <button type="button" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)} aria-expanded={openFaq === f.id}>
                <span>Q. {f.q}</span> <ChevronDown size={18} />
              </button>
              {openFaq === f.id && <p>{f.a}</p>}
            </div>
          ))}
        </div>
      )}
      {d.tags.length > 0 && (
        <p className="dm-art-tags">{d.tags.map(t => <span key={t}>#{t}</span>)}</p>
      )}
    </article>
  )
}

export default function DemoClient() {
  const [d, setD] = useState<Draft>(INITIAL)
  const [tab, setTab] = useState<TabKey>('category')
  const [view, setView] = useState<'edit' | 'preview' | 'done'>('edit') // preview 는 좁은 화면에서만 쓴다
  const [tagInput, setTagInput] = useState('')
  const [titleErr, setTitleErr] = useState(false)
  const nextId = useRef(100)
  const id = () => nextId.current++

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD(v => ({ ...v, [key]: value }))

  const publish = () => {
    if (!d.title.trim()) {
      setTitleErr(true)
      setView('edit')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setView('done')
    window.scrollTo({ top: 0 })
  }
  const backToEdit = () => {
    setView('edit')
    window.scrollTo({ top: 0 })
  }
  const reset = () => {
    setD(INITIAL)
    setTab('category')
    setTitleErr(false)
    backToEdit()
  }
  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (t && !d.tags.includes(t) && d.tags.length < 10) set('tags', [...d.tags, t.slice(0, 20)])
    setTagInput('')
  }

  const slug = d.title.trim().replace(/[?!.,'"]/g, '').replace(/\s+/g, '-').slice(0, 40) || '글-주소'

  return (
    <div className={`dm dm--${view}`}>
      {/* ── 위 띠 — 관리자 화면처럼. 왼쪽 돌아가기, 오른쪽 발행 ── */}
      <header className="dm-top">
        <Link href="/clinic-blog" className="dm-brand">
          <Image src="/logo.png" alt="" width={24} height={24} style={{ filter: 'brightness(0)' }} />
          WEFLOW <i /> <span>웹블로그 관리자</span> <em>체험판</em>
        </Link>
        {view !== 'done' ? (
          <div className="dm-top-actions">
            {/* 체험판은 저장하지 않는다 — '저장됨'이라고 쓰면 위 안내와 어긋나니, 실제 관리자의 동작으로만 말한다 */}
            <span className="dm-saved"><Check size={14} strokeWidth={3} /> 실제 관리자페이지는 쓰는 동안 자동 저장</span>
            <button type="button" className="dm-publish" onClick={publish}><Send size={16} /> 발행</button>
          </div>
        ) : (
          <a href={CONTACT} className="dm-publish">우리 병원에도 도입하기 <ArrowRight size={16} /></a>
        )}
      </header>

      {view !== 'done' && (
        <p className="dm-note">
          <Info size={15} /> 체험용 화면입니다. 입력한 내용은 어디에도 저장되지 않고, 새로고침하면 처음으로 돌아갑니다.
        </p>
      )}

      {view !== 'done' ? (
        <div className="dm-work">
          {/* ── 왼쪽: 글쓰기 ── */}
          <section className="dm-editor" aria-label="글쓰기">
            <label className="dm-label" htmlFor="dm-title">제목</label>
            <input
              id="dm-title"
              className={`dm-title${titleErr && !d.title.trim() ? ' is-err' : ''}`}
              value={d.title}
              onChange={e => set('title', e.target.value)}
              placeholder="환자가 검색하는 말 그대로 써 보세요"
              maxLength={60}
            />
            {titleErr && !d.title.trim() && <p className="dm-err">* 제목을 입력해 주세요</p>}

            <div className="dm-tabs" role="tablist">
              {TABS.map(t => (
                <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'is-on' : undefined} onClick={() => setTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'category' && (
              <div className="dm-panel">
                <p className="dm-help">글을 쓰기 전에 먼저 정합니다. 카테고리와 작성자를 고르면 미리보기에 바로 반영됩니다.</p>
                <div className="dm-row">
                  <div>
                    <label className="dm-label" htmlFor="dm-cat">카테고리</label>
                    <select id="dm-cat" value={d.category} onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="dm-label" htmlFor="dm-author">작성자 (의료진)</label>
                    <select id="dm-author" value={d.author} onChange={e => set('author', e.target.value)}>
                      {AUTHORS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                <span className="dm-label">썸네일 이미지 (목록 카드·공유 미리보기)</span>
                <div className="dm-thumbs">
                  {THUMBS.map(t => (
                    <button key={t.key} type="button" className={d.thumb === t.key ? 'is-on' : undefined} onClick={() => set('thumb', t.key)} aria-pressed={d.thumb === t.key}>
                      <i style={{ background: t.bg }} /> {t.name}
                    </button>
                  ))}
                </div>
                <p className="dm-help dm-help--sm">체험판에서는 색만 고릅니다. 실제 관리자에서는 사진을 올리면 알맞은 크기로 자동 변환됩니다.</p>
              </div>
            )}

            {tab === 'summary' && (
              <div className="dm-panel">
                <label className="dm-label" htmlFor="dm-summary">핵심 요약 <small>글 맨 위 요약 상자 · 검색·AI 검색 노출용, 1~2문장</small></label>
                <textarea id="dm-summary" value={d.summary} onChange={e => set('summary', e.target.value.slice(0, SUMMARY_MAX))} rows={4} placeholder="질문에 대한 답을 먼저, 한두 문장으로" />
                <p className="dm-count">{d.summary.length} / {SUMMARY_MAX}자</p>
                <span className="dm-label">핵심 포인트 <small>요약 상자 아래 불릿, 3~5개 권장</small></span>
                {d.points.map((p, i) => (
                  <div key={p.id} className="dm-line">
                    <input value={p.text} aria-label={`핵심 포인트 ${i + 1}`} onChange={e => set('points', d.points.map(x => (x.id === p.id ? { ...x, text: e.target.value } : x)))} maxLength={80} />
                    <button type="button" aria-label="삭제" onClick={() => set('points', d.points.filter(x => x.id !== p.id))}><Trash2 size={16} /></button>
                  </div>
                ))}
                {d.points.length < 5 && (
                  <button type="button" className="dm-add" onClick={() => set('points', [...d.points, { id: id(), text: '' }])}><Plus size={16} /> 핵심 포인트 추가</button>
                )}
              </div>
            )}

            {tab === 'content' && (
              <div className="dm-panel">
                <p className="dm-help">소제목과 문단을 차례로 채웁니다. 소제목은 환자가 묻는 질문처럼 쓰면 검색과 AI가 읽기 좋습니다.</p>
                {d.blocks.map(b => (
                  <div key={b.id} className={`dm-block dm-block--${b.type}`}>
                    <span className="dm-block-tag">{b.type === 'h2' ? <><Heading2 size={14} /> 소제목</> : <><Pilcrow size={14} /> 문단</>}</span>
                    {b.type === 'h2' ? (
                      <input value={b.text} aria-label="소제목" onChange={e => set('blocks', d.blocks.map(x => (x.id === b.id ? { ...x, text: e.target.value } : x)))} placeholder="소제목" maxLength={60} />
                    ) : (
                      <textarea value={b.text} aria-label="문단" onChange={e => set('blocks', d.blocks.map(x => (x.id === b.id ? { ...x, text: e.target.value } : x)))} rows={3} placeholder="내용을 입력하세요" maxLength={600} />
                    )}
                    <button type="button" aria-label="블록 삭제" onClick={() => set('blocks', d.blocks.filter(x => x.id !== b.id))}><Trash2 size={16} /></button>
                  </div>
                ))}
                {d.blocks.length < 12 && (
                  <div className="dm-add-row">
                    <button type="button" className="dm-add" onClick={() => set('blocks', [...d.blocks, { id: id(), type: 'h2', text: '' }])}><Plus size={16} /> 소제목</button>
                    <button type="button" className="dm-add" onClick={() => set('blocks', [...d.blocks, { id: id(), type: 'p', text: '' }])}><Plus size={16} /> 문단</button>
                  </div>
                )}
              </div>
            )}

            {tab === 'faq' && (
              <div className="dm-panel">
                <p className="dm-help">환자가 자주 묻는 질문과 답을 적습니다. 발행하면 AI와 검색엔진이 읽는 형식으로 자동으로 함께 올라갑니다.</p>
                {d.faq.map((f, i) => (
                  <div key={f.id} className="dm-faq">
                    <div className="dm-faq-head">
                      <b>질문 {i + 1}</b>
                      <button type="button" aria-label="질문 삭제" onClick={() => set('faq', d.faq.filter(x => x.id !== f.id))}><Trash2 size={16} /></button>
                    </div>
                    <input value={f.q} aria-label="질문" placeholder="질문" onChange={e => set('faq', d.faq.map(x => (x.id === f.id ? { ...x, q: e.target.value } : x)))} maxLength={80} />
                    <textarea value={f.a} aria-label="답변" placeholder="답변" rows={3} onChange={e => set('faq', d.faq.map(x => (x.id === f.id ? { ...x, a: e.target.value } : x)))} maxLength={400} />
                  </div>
                ))}
                {d.faq.length < 6 && (
                  <button type="button" className="dm-add" onClick={() => set('faq', [...d.faq, { id: id(), q: '', a: '' }])}><Plus size={16} /> 질문 추가</button>
                )}
              </div>
            )}

            {tab === 'tags' && (
              <div className="dm-panel">
                <span className="dm-label">관련 검색어 <small>글 끝 해시태그 칩</small></span>
                <div className="dm-tags">
                  {d.tags.map(t => (
                    <span key={t}>#{t} <button type="button" aria-label={`${t} 삭제`} onClick={() => set('tags', d.tags.filter(x => x !== t))}><X size={13} strokeWidth={3} /></button></span>
                  ))}
                </div>
                <div className="dm-line">
                  <input
                    value={tagInput}
                    aria-label="태그 입력"
                    placeholder="태그를 쓰고 Enter"
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      // 한글 조합 중 Enter 는 글자 확정이라 건너뛴다 (태그가 두 번 들어가는 것을 막는다)
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    maxLength={20}
                  />
                  <button type="button" className="dm-line-add" onClick={addTag}>추가</button>
                </div>
              </div>
            )}

            <p className="dm-auto"><CheckCircle2 size={16} /> 사이트맵 · 구조화 데이터 · 검색 미리보기는 발행할 때 자동으로 만들어집니다.</p>
          </section>

          {/* ── 오른쪽: 미리보기 (좁은 화면에서는 아래 바의 '미리보기'로 전환) ── */}
          <aside className="dm-preview" aria-label="미리보기">
            <p className="dm-preview-bar"><Eye size={15} /> 미리보기 <span>ourclinic.co.kr/blog/{slug}</span></p>
            <div className="dm-preview-body"><Article d={d} /></div>
          </aside>
        </div>
      ) : (
        /* ── 발행 뒤: 함께 만들어진 것 + 완성된 글 + 상담 ── */
        <div className="dm-done">
          <div className="dm-done-head">
            <span className="dm-done-icon"><Check size={26} strokeWidth={3} /></span>
            <h1>방금 쓴 글, 이렇게 올라갑니다</h1>
            <p>실제 웹블로그라면 이 순간, <br className="cb-mo" />아래 세 가지가 글과 함께 자동으로 만들어집니다.</p>
            <ul className="dm-made">
              <li><Check size={15} strokeWidth={3} /> 사이트맵에 새 글 추가</li>
              <li><Check size={15} strokeWidth={3} /> 글·FAQ 구조화 데이터</li>
              <li><Check size={15} strokeWidth={3} /> 검색·공유 미리보기</li>
            </ul>
          </div>

          {/* 검색 결과에 보이는 모습 — 제목과 핵심 요약이 그대로 쓰인다 */}
          <div className="dm-serp">
            <p className="dm-serp-label"><Search size={15} /> 검색 결과에는 이렇게 준비됩니다</p>
            <div>
              <small>우리안과 · ourclinic.co.kr › blog</small>
              <strong>{d.title}</strong>
              <p>{d.summary || '핵심 요약을 쓰면 이 자리에 보입니다.'}</p>
            </div>
            <em>검색 순위나 노출을 약속하는 화면은 아닙니다. 검색엔진이 읽어 갈 제목과 요약이 글과 함께 준비된다는 예시입니다.</em>
          </div>

          <div className="dm-done-art"><Article d={d} /></div>

          <div className="dm-cta">
            <h2>우리 병원 웹블로그도 <br className="cb-mo" />이렇게 쓸 수 있습니다</h2>
            <p>진료과목에 맞춘 카테고리와 글쓰기 화면을 <br className="cb-mo" />병원에 맞게 만들어 드립니다.</p>
            <div>
              <a href={`tel:${TEL}`} className="dm-cta-line"><Phone size={16} fill="currentColor" /> 전화 상담</a>
              <a href={CONTACT} className="dm-cta-fill">우리 병원에도 도입하기 <ArrowRight size={17} /></a>
            </div>
            <p className="dm-cta-links">
              <button type="button" onClick={backToEdit}><ArrowLeft size={15} /> 글 다시 고치기</button>
              <button type="button" onClick={reset}><RotateCcw size={15} /> 처음부터 다시</button>
            </p>
          </div>
        </div>
      )}

      {/* ── 좁은 화면 아래 바 — 편집 ↔ 미리보기 전환, 발행 ── */}
      {view !== 'done' && (
        <div className="dm-bar">
          {view === 'edit' ? (
            <button type="button" onClick={() => { setView('preview'); window.scrollTo({ top: 0 }) }}><Eye size={18} /> 미리보기</button>
          ) : (
            <button type="button" onClick={backToEdit}><Pencil size={17} /> 계속 쓰기</button>
          )}
          <button type="button" className="is-fill" onClick={publish}><Send size={17} /> 발행하기</button>
        </div>
      )}

      <style>{`
        .dm { min-height: 100vh; background: #f4f5f7; }
        .dm-top { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 60px; padding: 0 clamp(14px, 3vw, 28px); background: #fff; border-bottom: 1px solid var(--cb-line); }
        .dm-brand { display: inline-flex; align-items: center; gap: 8px; min-width: 0; color: var(--cb-text); font-weight: 800; font-size: 1.1rem; letter-spacing: -0.02em; text-decoration: none; white-space: nowrap; }
        .dm-brand i { width: 1px; height: 13px; background: #d5d9df; }
        .dm-brand span { font-weight: 600; font-size: .95rem; color: var(--cb-sub); }
        .dm-brand em { font-style: normal; padding: 3px 8px; border-radius: 999px; background: #e8f0fc; color: var(--cb-accent); font-size: .74rem; font-weight: 800; }
        @media (max-width: 480px) { .dm-brand span, .dm-brand i { display: none; } }
        .dm-top-actions { display: flex; align-items: center; gap: 14px; }
        .dm-saved { display: none; align-items: center; gap: 5px; color: var(--cb-muted); font-size: .85rem; font-weight: 600; }
        @media (min-width: 640px) { .dm-saved { display: inline-flex; } }
        .dm-saved svg { color: #16a34a; }
        .dm-publish { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 18px; border: 0; border-radius: 10px; background: var(--cb-accent); color: #fff; font: inherit; font-size: .95rem; font-weight: 700; text-decoration: none; cursor: pointer; white-space: nowrap; transition: background .15s; }
        .dm-publish:hover { background: #1852b5; }
        .dm-note { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0; padding: 9px 16px; background: #fff8e6; color: #8a6116; font-size: .86rem; font-weight: 600; text-align: center; word-break: keep-all; }
        .dm-note svg { flex: none; }

        .dm-work { display: grid; gap: 20px; max-width: 1360px; margin: 0 auto; padding: 20px clamp(12px, 3vw, 28px) 110px; align-items: start; }
        @media (min-width: 1024px) { .dm-work { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); padding-bottom: 60px; } }

        .dm-editor, .dm-preview { min-width: 0; border: 1px solid var(--cb-line); border-radius: 16px; background: #fff; }
        .dm-editor { padding: 22px 18px; }
        @media (min-width: 640px) { .dm-editor { padding: 28px; } }
        .dm-label { display: block; margin: 0 0 7px; font-size: .9rem; font-weight: 700; color: var(--cb-text); }
        .dm-label small { margin-left: 6px; font-size: .8rem; font-weight: 500; color: var(--cb-muted); }
        .dm-editor input, .dm-editor select, .dm-editor textarea { width: 100%; padding: 12px 14px; border: 1px solid #dfe3e8; border-radius: 10px; background: #fff; font: inherit; font-size: 1rem; line-height: 1.6; color: var(--cb-text); transition: border-color .15s, box-shadow .15s; }
        .dm-editor textarea { resize: vertical; display: block; }
        /* 드롭다운 — 브라우저 기본 화살표를 지우고 얇은 꺾쇠를 오른쪽에 그린다 (랜딩 상담 폼의 드롭다운과 같은 모양). 높이는 입력칸과 같게 */
        .dm-editor select { appearance: none; -webkit-appearance: none; height: 50px; padding: 0 44px 0 14px; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%238a919c' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; background-size: 12px 8px; text-overflow: ellipsis; }
        .dm-editor input:focus, .dm-editor select:focus, .dm-editor textarea:focus { outline: 0; border-color: var(--cb-accent); box-shadow: 0 0 0 3px rgba(31,99,214,.14); }
        .dm-editor .dm-title { padding: 14px 16px; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }
        .dm-title.is-err { border-color: #e05252; }
        .dm-err { margin: 6px 2px 0; color: #d64545; font-size: .85rem; font-weight: 600; }

        .dm-tabs { display: flex; gap: 4px; margin: 22px 0 0; border-bottom: 1px solid var(--cb-line); overflow-x: auto; scrollbar-width: none; }
        .dm-tabs::-webkit-scrollbar { display: none; }
        .dm-tabs button { flex: none; padding: 11px 14px; border: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; background: none; font: inherit; font-size: .97rem; font-weight: 700; color: var(--cb-muted); cursor: pointer; white-space: nowrap; }
        .dm-tabs button.is-on { color: var(--cb-accent); border-bottom-color: var(--cb-accent); }
        .dm-panel { display: grid; gap: 12px; padding-top: 20px; }
        .dm-panel > .dm-label { margin: 8px 0 -5px; }
        .dm-help { margin: 0; padding: 11px 14px; border-radius: 10px; background: var(--cb-soft); color: var(--cb-sub); font-size: .9rem; line-height: 1.6; word-break: keep-all; }
        .dm-help--sm { padding: 0; background: none; color: var(--cb-muted); font-size: .84rem; }
        .dm-row { display: grid; gap: 12px; }
        @media (min-width: 560px) { .dm-row { grid-template-columns: 1fr 1fr; } }
        .dm-thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .dm-thumbs button { display: grid; gap: 8px; padding: 8px 8px 10px; border: 1.5px solid #dfe3e8; border-radius: 12px; background: #fff; font: inherit; font-size: .88rem; font-weight: 700; color: var(--cb-sub); cursor: pointer; }
        .dm-thumbs button i { display: block; aspect-ratio: 16 / 10; border-radius: 8px; }
        .dm-thumbs button.is-on { border-color: var(--cb-accent); color: var(--cb-accent); box-shadow: 0 0 0 3px rgba(31,99,214,.14); }
        .dm-count { margin: -6px 2px 0; text-align: right; color: var(--cb-muted); font-size: .82rem; }
        .dm-line { display: flex; gap: 8px; }
        .dm-line > button, .dm-block > button, .dm-faq-head button { flex: none; width: 44px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #dfe3e8; border-radius: 10px; background: #fff; color: var(--cb-muted); cursor: pointer; transition: color .15s, border-color .15s; }
        .dm-line > button:hover, .dm-block > button:hover, .dm-faq-head button:hover { color: #d64545; border-color: #f0b4b4; }
        .dm-line .dm-line-add { width: auto; padding: 0 16px; font: inherit; font-size: .92rem; font-weight: 700; color: var(--cb-text); }
        .dm-line .dm-line-add:hover { color: var(--cb-accent); border-color: var(--cb-accent); }
        .dm-add { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 14px; border: 1.5px dashed #cdd3db; border-radius: 10px; background: #fff; font: inherit; font-size: .93rem; font-weight: 700; color: var(--cb-sub); cursor: pointer; transition: color .15s, border-color .15s; }
        .dm-add:hover { color: var(--cb-accent); border-color: var(--cb-accent); }
        .dm-add-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .dm-block { display: grid; grid-template-columns: minmax(0, 1fr) 44px; gap: 6px 8px; }
        .dm-block-tag { grid-column: 1 / -1; display: inline-flex; align-items: center; gap: 4px; font-size: .78rem; font-weight: 700; color: var(--cb-muted); }
        .dm-block--h2 input { font-size: 1.08rem; font-weight: 800; }
        .dm-block > button { align-self: stretch; min-height: 44px; }
        .dm-faq { display: grid; gap: 8px; padding: 14px; border: 1px solid var(--cb-line); border-radius: 12px; background: var(--cb-soft); }
        .dm-faq-head { display: flex; align-items: center; justify-content: space-between; }
        .dm-faq-head b { font-size: .88rem; color: var(--cb-accent); }
        .dm-faq-head button { width: 34px; height: 34px; }
        .dm-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .dm-tags span { display: inline-flex; align-items: center; gap: 4px; padding: 6px 6px 6px 12px; border-radius: 999px; background: #e8f0fc; color: var(--cb-accent); font-size: .9rem; font-weight: 700; }
        .dm-tags button { display: inline-flex; width: 20px; height: 20px; align-items: center; justify-content: center; border: 0; border-radius: 50%; background: rgba(31,99,214,.14); color: var(--cb-accent); cursor: pointer; }
        .dm-auto { display: flex; align-items: flex-start; gap: 8px; margin: 24px 0 0; padding: 14px 16px; border-radius: 12px; background: #eefbf3; color: #166534; font-size: .9rem; font-weight: 600; line-height: 1.6; word-break: keep-all; }
        .dm-auto svg { flex: none; margin-top: 3px; }

        .dm-preview { overflow: hidden; }
        @media (min-width: 1024px) { .dm-preview { position: sticky; top: 80px; max-height: calc(100vh - 100px); display: flex; flex-direction: column; } .dm-preview-body { overflow-y: auto; } }
        .dm-preview-bar { display: flex; align-items: center; gap: 6px; margin: 0; padding: 11px 16px; border-bottom: 1px solid var(--cb-line); background: var(--cb-soft); color: var(--cb-sub); font-size: .85rem; font-weight: 700; }
        .dm-preview-bar span { margin-left: auto; min-width: 0; padding: 4px 10px; border-radius: 999px; background: #fff; border: 1px solid var(--cb-line); color: var(--cb-muted); font-size: .78rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        /* 좁은 화면 — 편집과 미리보기 중 하나만 보인다 */
        @media (max-width: 1023px) {
          .dm--edit .dm-preview { display: none; }
          .dm--preview .dm-editor { display: none; }
        }

        .dm-art { padding: 26px 20px 30px; }
        @media (min-width: 640px) { .dm-art { padding: 34px 36px 40px; } }
        .dm-art-cat { display: inline-block; margin: 0 0 12px; padding: 5px 12px; border-radius: 999px; background: #e8f0fc; color: var(--cb-accent); font-size: .82rem; font-weight: 800; }
        .dm-art h1 { margin: 0; font-size: clamp(1.45rem, 3vw, 1.9rem); line-height: 1.35; font-weight: 800; letter-spacing: -0.03em; word-break: keep-all; }
        .dm-art-meta { margin: 10px 0 0; color: var(--cb-muted); font-size: .88rem; }
        .dm-art-thumb { display: grid; align-content: center; gap: 10px; aspect-ratio: 16 / 9; margin: 22px 0 0; padding: 8% 9%; border-radius: 14px; }
        .dm-art-thumb span { justify-self: start; padding: 5px 12px; border-radius: 999px; background: rgba(255,255,255,.75); font-size: .8rem; font-weight: 800; }
        .dm-art-thumb strong { font-size: clamp(1.2rem, 3.2vw, 1.8rem); line-height: 1.35; font-weight: 800; letter-spacing: -0.03em; word-break: keep-all; }
        .dm-art-thumb em { font-style: normal; font-size: .82rem; font-weight: 600; opacity: .75; }
        .dm-art-sum { margin: 24px 0 0; padding: 20px 22px; border-radius: 14px; background: #f1f6fe; border: 1px solid #dbe7fb; }
        .dm-art-sum b { display: block; margin-bottom: 8px; color: var(--cb-accent); font-size: .88rem; font-weight: 800; }
        .dm-art-sum p { margin: 0; font-weight: 600; line-height: 1.75; word-break: keep-all; }
        .dm-art-sum ul { margin: 12px 0 0; padding: 0 0 0 18px; display: grid; gap: 5px; color: var(--cb-sub); font-size: .95rem; line-height: 1.65; }
        .dm-art-body h2, .dm-art-faq h2 { margin: 32px 0 10px; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; word-break: keep-all; }
        .dm-art-body p { margin: 14px 0 0; color: #2b313a; font-size: 1.02rem; line-height: 1.85; word-break: keep-all; white-space: pre-line; }
        .dm-art-faq > div { border-bottom: 1px solid var(--cb-line); }
        .dm-art-faq button { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 15px 2px; border: 0; background: none; font: inherit; font-size: 1rem; font-weight: 700; color: var(--cb-text); text-align: left; cursor: pointer; word-break: keep-all; }
        .dm-art-faq button svg { flex: none; color: var(--cb-muted); transition: transform .2s; }
        .dm-art-faq .is-open button svg { transform: rotate(180deg); }
        .dm-art-faq div p { margin: 0; padding: 0 2px 16px; color: var(--cb-sub); line-height: 1.75; word-break: keep-all; }
        .dm-art-tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 26px 0 0; }
        .dm-art-tags span { padding: 6px 12px; border-radius: 999px; background: var(--cb-soft); color: var(--cb-sub); font-size: .88rem; font-weight: 600; }

        .dm-done { max-width: 820px; margin: 0 auto; padding: 36px clamp(12px, 3vw, 28px) 80px; display: grid; gap: 18px; }
        .dm-done-head { text-align: center; padding: 14px 0 6px; }
        .dm-done-icon { display: inline-flex; width: 60px; height: 60px; align-items: center; justify-content: center; border-radius: 50%; background: var(--cb-accent); color: #fff; animation: dmPop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes dmPop { from { transform: scale(.4); opacity: 0; } to { transform: none; opacity: 1; } }
        .dm-done-head h1 { margin: 16px 0 8px; font-size: min(1.8rem, 6.4vw); font-weight: 800; letter-spacing: -0.03em; white-space: nowrap; }
        .dm-done-head p { margin: 0; color: var(--cb-sub); line-height: 1.7; word-break: keep-all; }
        /* 칩 셋 — 모두 가장 긴 칩의 폭에 맞춘다 (폭을 내용만큼만 잡은 격자의 1fr 칸은 서로 같아진다). 넓은 화면은 한 줄에 셋 */
        .dm-made { list-style: none; margin: 18px auto 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: fit-content; max-width: 100%; }
        .dm-made li { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 14px; border-radius: 999px; background: #eefbf3; color: #166534; font-size: .92rem; font-weight: 700; white-space: nowrap; }
        /* 휴대폰 — 위에 하나, 아래에 둘. 네 칸으로 나눠 칩마다 두 칸씩 쓰면 위의 하나도 아래 둘과 같은 폭으로 가운데에 온다 */
        @media (max-width: 560px) {
          .dm-made { grid-template-columns: repeat(4, 1fr); gap: 8px 6px; }
          .dm-made li { grid-column: span 2; padding: 9px 10px; font-size: .86rem; }
          .dm-made li:first-child { grid-column: 2 / 4; }
        }
        .dm-serp, .dm-done-art, .dm-cta { border: 1px solid var(--cb-line); border-radius: 16px; background: #fff; }
        .dm-serp { padding: 20px 22px; }
        .dm-serp-label { display: flex; align-items: center; gap: 6px; margin: 0 0 12px; color: var(--cb-sub); font-size: .88rem; font-weight: 700; }
        .dm-serp div { padding: 16px 18px; border-radius: 12px; background: var(--cb-soft); }
        .dm-serp small { display: block; color: var(--cb-muted); font-size: .84rem; }
        .dm-serp strong { display: block; margin: 4px 0; color: #1a0dab; font-size: 1.15rem; font-weight: 600; line-height: 1.4; word-break: keep-all; }
        .dm-serp div p { margin: 0; color: var(--cb-sub); font-size: .93rem; line-height: 1.65; word-break: keep-all; }
        .dm-serp em { display: block; margin-top: 10px; font-style: normal; color: var(--cb-muted); font-size: .8rem; line-height: 1.6; word-break: keep-all; }
        /* 마지막 상담 상자 — 파스텔 블루 그라데이션 (검은 바탕은 무거워 보여 바꿨다) */
        .dm-cta { padding: 38px 22px; text-align: center; background: linear-gradient(135deg, #dbe9ff 0%, #eaf2ff 50%, #f3f0ff 100%); border-color: #d5e3fa; color: var(--cb-text); }
        .dm-cta h2 { margin: 0; font-size: clamp(1.4rem, 3.4vw, 1.8rem); line-height: 1.38; font-weight: 800; letter-spacing: -0.03em; white-space: pre-line; }
        .dm-cta > p { margin: 12px 0 22px; color: var(--cb-sub); line-height: 1.7; word-break: keep-all; }
        /* 버튼 둘을 같은 폭으로 — 폭을 내용만큼만 잡은 두 칸 격자라 긴 쪽(왼쪽)에 오른쪽이 맞춰진다. 휴대폰에서는 위아래로 쌓아 화면 폭을 채운다 */
        .dm-cta > div { display: inline-grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 560px) { .dm-cta > div { display: grid; grid-template-columns: 1fr; } }
        .dm-cta-fill, .dm-cta-line { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 15px 24px; border-radius: 999px; font-weight: 700; font-size: 1.02rem; text-decoration: none; white-space: nowrap; }
        .dm-cta-fill { background: #1f63d6; color: #fff; }
        .dm-cta-fill:hover { background: #1852b5; }
        .dm-cta-line { border: 1.5px solid #c9d6ea; background: #fff; color: var(--cb-text); }
        .dm-cta-line svg { color: #16a34a; }
        .dm-cta .dm-cta-links { display: flex; justify-content: center; gap: 18px; margin: 22px 0 0; }
        .dm-cta-links button { display: inline-flex; align-items: center; gap: 5px; border: 0; background: none; font: inherit; font-size: .9rem; font-weight: 600; color: #6b7686; cursor: pointer; }
        .dm-cta-links button:hover { color: var(--cb-text); }

        .dm-bar { display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 30; gap: 8px; padding: 10px 12px max(10px, env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -6px 20px rgba(17,20,24,.1); }
        @media (max-width: 1023px) { .dm-bar { display: grid; grid-template-columns: 1fr 1fr; } }
        .dm-bar button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 52px; border: 1.5px solid #d5d9df; border-radius: 14px; background: #fff; font: inherit; font-size: 1rem; font-weight: 700; color: var(--cb-text); cursor: pointer; }
        .dm-bar button.is-fill { border-color: var(--cb-accent); background: var(--cb-accent); color: #fff; }
        @media (prefers-reduced-motion: reduce) { .dm-done-icon { animation: none; } }
      `}</style>
    </div>
  )
}
