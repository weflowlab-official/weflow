'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ShieldAlert, Sparkles, Search, Gauge, Smartphone, MessageCircle,
  Lock, ArrowRight, Phone, Globe, RotateCcw, Check, ClipboardList,
} from 'lucide-react'
import HoneypotField from '@/components/HoneypotField'
import { HONEYPOT_FIELD, wasSaved } from '@/lib/leadInput'
import { attributionLine } from '@/lib/attribution'
import { trackNaverLead } from '@/lib/naverConversion'
import { trackGoogleLead } from '@/lib/googleConversion'
import { formatPhone, isValidPhone } from '@/lib/phone'

/**
 * 병의원 홈페이지 진단 화면 — 주소 입력 → 분석 중 → 결과(첫 카드만 열림) → 연락처를 남기면 전체가 열리고 상담으로 이어진다.
 * 메인 사이트 점검(app/(site)/check/page.tsx)과 같은 흐름이고, 이 페이지 디자인(.cb)으로 그렸다.
 * 연락처는 일반 문의와 같은 /api/inquiries 로 간다 — source 는 'clinic-diagnosis' (관리자 '사이트 점검' 탭에 모이고,
 * 유입 관리에서는 병의원 영역 문의로 센다), type 은 '병의원 사이트 진단'.
 */

const TEL = '010-2971-7280'

interface CheckItem { label: string; status: 'good' | 'warn' | 'bad'; value: string; advice: string }
interface Category { score: number; items: CheckItem[] }
type CatKey = 'tech' | 'ai' | 'seo' | 'speed' | 'mobile' | 'contact'
interface Result { finalUrl: string; overall: number; categories: Record<CatKey, Category> }

// 맨 앞(제작 기술·보안)만 바로 보여 주고, 나머지는 연락처를 남기면 열린다
const CATEGORY_META: { key: CatKey; label: string; Icon: typeof Gauge }[] = [
  { key: 'tech', label: '제작 기술 및 보안', Icon: ShieldAlert },
  { key: 'ai', label: 'AI 검색 준비도', Icon: Sparkles },
  { key: 'seo', label: '검색엔진 노출', Icon: Search },
  { key: 'speed', label: '로딩 속도', Icon: Gauge },
  { key: 'mobile', label: '모바일 대응', Icon: Smartphone },
  { key: 'contact', label: '문의 동선', Icon: MessageCircle },
]
const FREE_KEY: CatKey = 'tech'

const LOADING_STEPS = ['사이트 접속 확인', '제작 기술 및 보안 확인', 'AI 검색 준비도 분석', '리포트 작성']

const scoreColor = (n: number) => (n >= 80 ? '#15803d' : n >= 60 ? '#b45309' : '#d64545')
const dotColor = (s: CheckItem['status']) => (s === 'good' ? '#16a34a' : s === 'warn' ? '#d97706' : '#e05252')
function gradeWord(n: number) {
  if (n >= 90) return '잘 관리되고 있어요'
  if (n >= 80) return '전반적으로 잘 갖춰져 있어요'
  if (n >= 60) return '손볼 곳이 몇 군데 보여요'
  if (n >= 40) return '리뉴얼을 검토할 때예요'
  return '리뉴얼이 필요한 상태예요'
}

/** 결과 점수가 0 → 목표값으로 차오르는 연출 */
function useCountUp(target: number, run: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const started = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - started) / 900, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return value
}

export default function CheckClient() {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle')
  const [step, setStep] = useState(0)
  // 입력칸 바로 밑 빨간 안내 — 주소 오류·접속 실패·횟수 제한. 입력한 주소는 그대로 남긴다
  const [notice, setNotice] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const [unlocked, setUnlocked] = useState(false)
  const [lead, setLead] = useState({ name: '', phone: '', agree: false })
  const [honeypot, setHoneypot] = useState('') // 봇 거르개 — 사람은 못 보는 칸
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const overallShown = useCountUp(result?.overall ?? 0, phase === 'done')

  // 분석 중 단계 문구를 순서대로 넘긴다
  useEffect(() => {
    if (phase !== 'loading') return
    setStep(0)
    const t = setInterval(() => setStep(s => Math.min(s + 1, LOADING_STEPS.length - 1)), 1100)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'done') resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [phase])

  // target 을 받는 이유 — ?url= 로 넘어온 주소는 setUrl 직후 곧바로 점검을 걸어야 하는데, 그 시점엔 url 상태가 아직 갱신 전이다
  const runCheck = async (target?: string) => {
    const value = (target ?? url).trim()
    if (phase === 'loading') return
    if (!value) {
      setNotice('병원 홈페이지 주소를 입력해 주세요.')
      inputRef.current?.focus()
      return
    }
    setPhase('loading')
    setResult(null)
    setUnlocked(false)
    setLead({ name: '', phone: '', agree: false })
    setShowErrors(false)
    setNotice('')
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value, mode: 'clinic' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setNotice(data.error || '분석하지 못했습니다. 잠시 후 다시 시도해 주세요.')
        setPhase('idle')
        return
      }
      setResult(data)
      setPhase('done')
    } catch {
      setNotice('분석하지 못했습니다. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.')
      setPhase('idle')
    }
  }

  // ?url= 로 주소를 들고 오면 바로 점검을 건다 (useSearchParams 를 쓰면 페이지를 Suspense 로 감싸야 해서 window 에서 읽는다)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('url')
    if (!q) return
    setUrl(q)
    void runCheck(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const phoneOk = isValidPhone(lead.phone)

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lead.name.trim() || !phoneOk || !lead.agree) {
      setShowErrors(true)
      return
    }
    if (!result) return
    setSubmitting(true)
    try {
      const c = result.categories
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name.trim(),
          phone: lead.phone,
          type: '병의원 사이트 진단',
          industry: '',
          note: [
            `진단 사이트: ${result.finalUrl}`,
            `종합 ${result.overall}점 (기술·보안 ${c.tech.score} · AI검색 ${c.ai.score} · 검색 ${c.seo.score} · 속도 ${c.speed.score} · 모바일 ${c.mobile.score} · 문의동선 ${c.contact.score})`,
            `제작 방식: ${c.tech.items[0]?.value ?? '-'}`,
            attributionLine() && `유입: ${attributionLine()}`,
          ].filter(Boolean).join('\n'),
          agree: true,
          source: 'clinic-diagnosis',
          [HONEYPOT_FIELD]: honeypot,
        }),
      })
      // 허니팟에 걸린 요청에도 성공으로 답하므로, 실제 저장된 응답에만 광고 전환을 알린다 (lib/leadInput.ts 의 wasSaved)
      if (res.ok && wasSaved(await res.json().catch(() => null))) {
        trackNaverLead()
        trackGoogleLead()
      }
    } catch {
      /* 저장이 실패해도 리포트는 열어 준다 — 방문자 경험을 막지 않는다 */
    } finally {
      setUnlocked(true)
      setSubmitting(false)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
  }

  const checkAnother = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    inputRef.current?.focus({ preventScroll: true })
    inputRef.current?.select()
  }

  return (
    <>
      {/* ── 제목 + 주소 입력 ── */}
      <section className="ckc-hero">
        <div className="cb-wrap">
          <p className="cb-chapter">FREE CHECK</p>
          <h1 className="ckc-h1">
            우리 병원 홈페이지,<br />
            <span className="cb-mark">지금 몇 점일까요?</span>
          </h1>
          <p className="cb-body ckc-lead">
            주소만 넣으면 제작 기술과 보안, AI 검색 준비도까지<br />
            <b>우리 병원 홈페이지를 바로 진단해 드립니다.</b>
          </p>

          {phase !== 'loading' ? (
            <form
              className="ckc-inputrow"
              onSubmit={e => {
                e.preventDefault()
                void runCheck()
              }}
              noValidate
            >
              <label className="ckc-input">
                <Globe size={19} aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={url}
                  onChange={e => {
                    setUrl(e.target.value)
                    if (notice) setNotice('')
                  }}
                  placeholder="병원 홈페이지 주소 (예: ourclinic.co.kr)"
                  aria-label="병원 홈페이지 주소"
                  inputMode="url"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={300}
                />
              </label>
              <button type="submit" className="ckc-go">무료 AI 진단하기 <ArrowRight size={18} strokeWidth={2.5} /></button>
            </form>
          ) : (
            <div className="ckc-loading" role="status">
              <span className="ckc-spinner" aria-hidden="true" />
              <ol>
                {LOADING_STEPS.map((s, i) => (
                  <li key={s} className={i < step ? 'is-done' : i === step ? 'is-now' : ''}>
                    {i < step ? <Check size={14} strokeWidth={3} /> : <i />} {s}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {notice && phase !== 'loading' && <p className="ckc-notice" role="alert">{notice}</p>}
          {/* 무엇을 보는지 — 여섯 가지를 칩으로 (결과 카드와 같은 이름·아이콘·순서) */}
          <ul className="ckc-chips" aria-label="진단 항목 6가지">
            {CATEGORY_META.map(({ key, label, Icon }) => (
              <li key={key}><Icon size={14} strokeWidth={2.3} /> {label}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 진단 결과 ── */}
      {phase === 'done' && result && (
        <section className="ckc-result">
          <div className="cb-wrap">
            <div ref={resultRef} className="ckc-scoretop">
              <p className="ckc-url">{result.finalUrl}</p>
              <p className="ckc-score" style={{ color: scoreColor(result.overall) }}>
                {overallShown}<span> / 100</span>
              </p>
              <p className="ckc-grade">{gradeWord(result.overall)}</p>
            </div>

            <div className="ckc-grid">
              {CATEGORY_META.map(({ key, label, Icon }) => {
                const cat = result.categories[key]
                if (!cat) return null
                const locked = !unlocked && key !== FREE_KEY
                return (
                  <div key={key} className="ckc-card">
                    <div className="ckc-card-head">
                      <span><Icon size={18} strokeWidth={2.2} /> {label}</span>
                      <b style={{ color: scoreColor(cat.score) }}>{cat.score}점</b>
                    </div>
                    <div className="ckc-bar" aria-hidden="true">
                      <span style={{ width: `${cat.score}%`, background: scoreColor(cat.score) }} />
                    </div>
                    <ul className={locked ? 'is-locked' : undefined} aria-hidden={locked}>
                      {cat.items.map(item => (
                        <li key={item.label}>
                          <div>
                            <i style={{ background: dotColor(item.status) }} />
                            <strong>{item.label}</strong>
                            <em title={item.value}>{item.value}</em>
                          </div>
                          <p>{item.advice}</p>
                        </li>
                      ))}
                    </ul>
                    {locked && (
                      <div className="ckc-lock">
                        <span><Lock size={14} strokeWidth={2.4} /> 연락처를 남기면 바로 확인할 수 있어요</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {!unlocked ? (
              <form onSubmit={submitLead} className="ckc-lead-form" noValidate>
                <h2>전체 진단 결과를 바로 확인하세요</h2>
                <p>연락처를 남기면 <br className="cb-mo" />나머지 항목을 바로 확인할 수 있고, <br className="cb-mo" />전담 매니저가 결과를 바탕으로 <br className="cb-mo" />리뉴얼 방향을 무료로 안내드립니다.</p>
                <HoneypotField value={honeypot} onChange={setHoneypot} />
                <div className="ckc-lead-row">
                  <div>
                    <input placeholder="성함" aria-label="성함" value={lead.name} onChange={e => setLead(f => ({ ...f, name: e.target.value }))} autoComplete="name" maxLength={40} />
                    {showErrors && !lead.name.trim() && <small>* 성함을 입력해 주세요</small>}
                  </div>
                  <div>
                    <input placeholder="연락처 (010-0000-0000)" aria-label="연락처" value={lead.phone} onChange={e => setLead(f => ({ ...f, phone: formatPhone(e.target.value) }))} type="tel" inputMode="numeric" autoComplete="tel" maxLength={13} />
                    {showErrors && !phoneOk && <small>{lead.phone ? '* 연락처를 다시 확인해 주세요' : '* 연락처를 입력해 주세요'}</small>}
                  </div>
                </div>
                <label className="ckc-agree">
                  <input type="checkbox" checked={lead.agree} onChange={e => setLead(f => ({ ...f, agree: e.target.checked }))} />
                  <span>[필수] 개인정보 수집·이용에 동의합니다. <a href="/privacy" target="_blank" rel="noopener noreferrer">내용 보기</a></span>
                </label>
                {showErrors && !lead.agree && <small className="ckc-agree-err">* 개인정보 수집에 동의해 주세요</small>}
                <button type="submit" className="ckc-go ckc-go--wide" disabled={submitting}>
                  {submitting ? '확인 중…' : <>전체 결과 확인하기 <ArrowRight size={18} strokeWidth={2.5} /></>}
                </button>
              </form>
            ) : (
              <div className="ckc-after">
                <span className="ckc-after-icon"><Check size={22} strokeWidth={3} /></span>
                <h2>리뉴얼 방향이 궁금하신가요?</h2>
                <p>전담 매니저가 진단 결과를 살펴본 뒤, <br className="cb-mo" />빠르게 연락드려 항목별 개선 방향을 안내드리겠습니다.</p>
                <div className="ckc-after-btns">
                  <a href={`tel:${TEL}`} className="ckc-btn-line"><Phone size={17} fill="currentColor" /> 바로 전화 상담</a>
                  <Link href="/clinic-blog#contact-form" className="ckc-btn-fill"><ClipboardList size={17} /> 맞춤 견적 받기</Link>
                </div>
                <button type="button" className="ckc-again" onClick={checkAnother}><RotateCcw size={15} /> 다른 주소 진단하기</button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 점검의 한계를 한 줄로 — 리뉴얼해야 하는 이유는 랜딩(/clinic-blog)의 '왜 WEFLOW?' 섹션이 맡는다 (여기는 점검만 한다) */}
      <p className="ckc-foot">진단은 밖에서 보이는 정보만으로 판단합니다. <br className="cb-mo" />정확한 상태는 상담에서 함께 확인해 드립니다.</p>

      <style>{`
        .ckc-hero { padding: calc(76px + clamp(48px, 9vw, 96px)) 0 clamp(48px, 7vw, 80px); text-align: center; background: radial-gradient(60% 70% at 50% 0%, #e8f1ff 0%, rgba(232,241,255,0) 70%), #fff; }
        .ckc-h1 { margin: 0; font-size: clamp(1.75rem, 4.6vw, 3rem); line-height: 1.28; font-weight: 800; letter-spacing: -0.04em; }
        /* 휴대폰 — 31px 고정. 가장 긴 줄('우리 병원 홈페이지,')이 360px 폰에서도 한 줄에 들어간다 */
        @media (max-width: 767px) { .ckc-h1 { font-size: 31px; } }
        /* .cb-body 의 margin 이 뒤에서 덮어쓰지 않게 한 단계 세게 건다 — 안 그러면 가운데 정렬이 풀려 왼쪽으로 붙는다 */
        .ckc-hero .ckc-lead { max-width: 820px; margin: 22px auto 0; word-break: keep-all; }
        .ckc-lead b { color: var(--cb-text); }
        /* 휴대폰 — 세 줄(첫 문장 둘로 + 굵은 줄)로 고정. 가장 긴 줄이 화면 폭에 딱 들어가게 글자가 폭에 맞춰 줄어든다 */
        @media (max-width: 560px) { .ckc-hero .ckc-lead { font-size: min(1.05rem, calc((100vw - 40px) / 27)); white-space: nowrap; } }

        .ckc-inputrow { display: flex; gap: 10px; max-width: 640px; margin: 34px auto 0; }
        .ckc-input { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; height: 60px; padding: 0 18px; border-radius: 16px; border: 1.5px solid #d5d9df; background: #fff; color: var(--cb-muted); box-shadow: 0 10px 30px rgba(17,20,24,.06); transition: border-color .15s; }
        .ckc-input:focus-within { border-color: var(--cb-accent); }
        .ckc-input input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font: inherit; font-size: 1.05rem; color: var(--cb-text); }
        .ckc-go { flex: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 60px; padding: 0 26px; border: 0; border-radius: 16px; background: var(--cb-accent); color: #fff; font: inherit; font-size: 1.05rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background .15s; }
        .ckc-go:hover { background: #1852b5; }
        .ckc-go:disabled { opacity: .6; cursor: default; }
        .ckc-go--wide { display: flex; width: 100%; max-width: 680px; margin: 4px auto 0; }
        /* 휴대폰 — 위아래로 쌓는다. 세로 방향에서는 flex: 1 이 높이를 0 에서 시작하게 만들어 입력칸이 납작해지므로 flex 를 끈다 */
        @media (max-width: 560px) { .ckc-inputrow { flex-direction: column; } .ckc-input { flex: none; } .ckc-input, .ckc-go { height: 56px; } .ckc-input input { font-size: 1rem; } }
        .ckc-notice { margin: 12px 0 0; color: #d64545; font-size: .93rem; font-weight: 600; }
        /* 칩 — 모두 가장 긴 칩의 폭에 맞춘다 (폭을 내용만큼만 잡은 격자의 1fr 칸은 가장 넓은 칸에 맞춰 같아진다). 휴대폰·태블릿 3칸(두 줄) */
        .ckc-chips { list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 7px; width: fit-content; max-width: 100%; margin: 22px auto 0; padding: 0; }
        @media (min-width: 561px) { .ckc-chips { grid-template-columns: repeat(3, 1fr); } }
        /* 넓은 화면 — 한 줄, 칩마다 글자 길이만큼 (폭을 맞추지 않는다) */
        @media (min-width: 1000px) { .ckc-chips { display: flex; justify-content: center; } }
        .ckc-chips li { display: flex; align-items: center; justify-content: center; gap: 5px; padding: 7px 12px; border-radius: 999px; background: #fff; border: 1px solid #dfe5ee; color: var(--cb-sub); font-size: .86rem; font-weight: 600; white-space: nowrap; }
        .ckc-chips svg { flex: none; color: var(--cb-accent); }
        /* 휴대폰 — 3개씩 두 줄. 폭이 모자라 글자와 아이콘이 화면 폭에 맞춰 같이 줄어든다 */
        @media (max-width: 560px) { .ckc-chips { grid-template-columns: repeat(3, 1fr); gap: 6px; width: 100%; } .ckc-chips li { gap: .25em; padding: 8px 2px; font-size: min(.8rem, 2.7vw); } .ckc-chips svg { width: 1.15em; height: 1.15em; } }

        .ckc-loading { display: flex; align-items: center; justify-content: center; gap: 22px; max-width: 640px; min-height: 60px; margin: 34px auto 0; text-align: left; }
        .ckc-spinner { flex: none; width: 44px; height: 44px; border-radius: 50%; border: 4px solid #e3e9f3; border-top-color: var(--cb-accent); animation: ckcSpin .8s linear infinite; }
        @keyframes ckcSpin { to { transform: rotate(360deg); } }
        .ckc-loading ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
        .ckc-loading li { display: flex; align-items: center; gap: 8px; font-size: .95rem; font-weight: 600; color: #b3b9c2; }
        .ckc-loading li i { width: 14px; height: 14px; border-radius: 50%; border: 2px solid currentColor; }
        .ckc-loading li.is-done { color: var(--cb-sub); }
        .ckc-loading li.is-done svg { color: #16a34a; }
        .ckc-loading li.is-now { color: var(--cb-accent); }

        .ckc-result { padding: clamp(40px, 6vw, 72px) 0; border-top: 1px solid var(--cb-line); background: var(--cb-soft); }
        .ckc-scoretop { text-align: center; scroll-margin-top: 24px; }
        .ckc-url { margin: 0 0 4px; color: var(--cb-muted); font-size: .9rem; word-break: break-all; }
        .ckc-score { margin: 0; font-size: clamp(4rem, 12vw, 6rem); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; }
        .ckc-score span { font-size: .35em; font-weight: 700; color: var(--cb-muted); }
        .ckc-grade { margin: 8px 0 0; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }

        .ckc-grid { display: grid; gap: 14px; margin-top: 36px; }
        @media (min-width: 820px) { .ckc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .ckc-card { position: relative; min-width: 0; padding: 22px 22px 20px; border: 1px solid var(--cb-line); border-radius: 20px; background: #fff; }
        .ckc-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .ckc-card-head span { display: inline-flex; align-items: center; gap: 7px; font-size: 1.08rem; font-weight: 800; letter-spacing: -0.02em; }
        .ckc-card-head svg { color: var(--cb-accent); }
        .ckc-card-head b { font-size: 1.15rem; font-weight: 800; }
        .ckc-bar { height: 6px; margin: 12px 0 4px; border-radius: 999px; background: #eef0f3; overflow: hidden; }
        .ckc-bar span { display: block; height: 100%; border-radius: 999px; transition: width .8s cubic-bezier(.16,1,.3,1); }
        .ckc-card ul { list-style: none; margin: 0; padding: 0; }
        .ckc-card ul.is-locked { filter: blur(7px); pointer-events: none; user-select: none; }
        .ckc-card li { padding: 13px 0; border-bottom: 1px solid #f0f2f5; }
        .ckc-card li:last-child { border-bottom: 0; padding-bottom: 0; }
        .ckc-card li div { display: flex; align-items: center; gap: 8px; }
        .ckc-card li i { flex: none; width: 9px; height: 9px; border-radius: 50%; }
        .ckc-card li strong { flex: none; font-size: .98rem; font-weight: 700; white-space: nowrap; }
        .ckc-card li em { margin-left: auto; min-width: 0; font-style: normal; font-size: .86rem; color: var(--cb-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ckc-card li p { margin: 5px 0 0 17px; color: var(--cb-sub); font-size: .9rem; line-height: 1.6; word-break: keep-all; }
        .ckc-lock { position: absolute; inset: 70px 0 0; display: flex; align-items: center; justify-content: center; padding: 0 16px; }
        .ckc-lock span { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 999px; background: #111418; color: #fff; font-size: .88rem; font-weight: 700; box-shadow: 0 10px 26px rgba(17,20,24,.25); word-break: keep-all; text-align: center; }

        .ckc-lead-form, .ckc-after { margin: 14px 0 0; padding: 30px 22px; border: 1px solid var(--cb-line); border-radius: 24px; background: #fff; box-shadow: 0 24px 60px rgba(17,20,24,.08); text-align: center; }
        @media (min-width: 640px) { .ckc-lead-form, .ckc-after { padding: 38px 40px; } }
        .ckc-lead-form h2, .ckc-after h2 { margin: 0; font-size: 1.4rem; font-weight: 800; letter-spacing: -0.03em; word-break: keep-all; }
        .ckc-lead-form > p, .ckc-after > p { margin: 10px 0 22px; color: var(--cb-sub); line-height: 1.7; word-break: keep-all; }
        /* 상자는 결과 카드와 같은 폭, 안의 입력칸·동의·버튼은 가운데 680px 로 모은다 */
        .ckc-lead-row { display: grid; gap: 10px; max-width: 680px; margin: 0 auto; text-align: left; }
        @media (min-width: 560px) { .ckc-lead-row { grid-template-columns: 1fr 1.3fr; } }
        .ckc-lead-row input { width: 100%; height: 54px; padding: 0 16px; border: 1px solid transparent; border-radius: 12px; background: var(--cb-soft); font: inherit; font-size: 1rem; color: var(--cb-text); }
        .ckc-lead-row input:focus { outline: 2px solid var(--cb-accent); outline-offset: -1px; background: #fff; }
        .ckc-lead-form small { display: block; margin: 6px 2px 0; color: #d64545; font-size: .85rem; font-weight: 600; text-align: left; }
        .ckc-agree { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 16px 0; font-size: .9rem; color: var(--cb-sub); cursor: pointer; }
        .ckc-agree input { width: 18px; height: 18px; margin: 0; flex: none; accent-color: var(--cb-accent); }
        /* 휴대폰 — 동의 문구를 늘 한 줄에. 폭이 모자라면 글자가 화면 폭에 맞춰 줄어든다 */
        @media (max-width: 560px) { .ckc-agree { gap: 5px; font-size: min(.9rem, 3.08vw); white-space: nowrap; } .ckc-agree input { width: 15px; height: 15px; } }
        .ckc-agree a { color: var(--cb-muted); text-underline-offset: 3px; }
        .ckc-lead-form .ckc-agree-err { margin: -8px 0 12px; text-align: center; }

        .ckc-after-icon { display: inline-flex; width: 52px; height: 52px; align-items: center; justify-content: center; margin-bottom: 14px; border-radius: 50%; background: var(--cb-accent); color: #fff; }
        .ckc-after-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 460px; margin: 0 auto; }
        .ckc-btn-line, .ckc-btn-fill { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 15px 14px; border-radius: 999px; font-weight: 700; font-size: 1rem; text-decoration: none; white-space: nowrap; transition: background .15s, border-color .15s; }
        .ckc-btn-line { border: 1.5px solid #d5d9df; background: #fff; color: var(--cb-text); }
        .ckc-btn-line svg { color: #16a34a; }
        .ckc-btn-line:hover { border-color: var(--cb-text); }
        .ckc-btn-fill { border: 1.5px solid var(--cb-text); background: var(--cb-text); color: #fff; }
        .ckc-btn-fill:hover { background: var(--cb-accent); border-color: var(--cb-accent); }
        @media (max-width: 420px) { .ckc-btn-line, .ckc-btn-fill { font-size: .9rem; padding: 14px 8px; } }
        .ckc-again { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; border: 0; background: none; font: inherit; font-size: .92rem; font-weight: 600; color: var(--cb-muted); cursor: pointer; }
        .ckc-again:hover { color: var(--cb-text); }

        .ckc-foot { max-width: 720px; margin: 0 auto; padding: 28px 20px 56px; color: var(--cb-muted); font-size: .85rem; line-height: 1.7; text-align: center; word-break: keep-all; }
        @media (prefers-reduced-motion: reduce) { .ckc-spinner { animation-duration: 2s; } .ckc-bar span { transition: none; } }
      `}</style>
    </>
  )
}
