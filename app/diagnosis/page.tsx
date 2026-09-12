'use client'
import { useState, useEffect } from 'react'
import { Check, Phone, XCircle } from 'lucide-react'
import { projectTypes } from '@/data/common'
import { attributionLine } from '@/lib/attribution'
import { trackNaverLead } from '@/lib/naverConversion'
import { trackSmartlogInquiry } from '@/lib/smartlog'
import HoneypotField from '@/components/HoneypotField'
import { HONEYPOT_FIELD } from '@/lib/leadInput'

export default function DiagnosisPage() {
  const [form, setForm] = useState({ name: '', phone: '', type: '', industry: '', note: '', agree: false })
  // 봇 거르개 — 사람은 못 보는 칸이라 정상 신청에서는 늘 빈 문자열로 나간다
  const [honeypot, setHoneypot] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  // 개인정보 동의 안내문 펼침 — 커튼장인 폼과 같은 '내용 보기 / 닫기' 토글
  const [privacyOpen, setPrivacyOpen] = useState(false)

  // 폼 자동 채움 — 맞춤 플랜 위젯에서 넘어온 값만 (방문자가 직접 고른 답).
  // 유입 키워드로는 채우지 않는다 — 검색어만으로 제작 종류를 단정할 수 없다.
  useEffect(() => {
    const raw = sessionStorage.getItem('weflow_quiz_prefill')
    if (!raw) return
    try {
      const p = JSON.parse(raw)
      // sessionStorage(외부 상태) → 클라이언트 전용 프리필
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(f => ({
        ...f,
        type: p.type || f.type,
        industry: p.industry || f.industry,
        note: p.note || f.note,
      }))
    } catch {}
    sessionStorage.removeItem('weflow_quiz_prefill')
  }, [])

  // 작성 "중간"인 사람만 이탈 모달 대상: 뭔가 입력했지만 필수항목은 아직 미완성
  useEffect(() => {
    const touched = !!(form.name || form.phone || form.type || form.industry || form.note || form.agree)
    const complete = !!(form.name && form.phone && form.type && form.agree)
    if (touched && !complete) {
      sessionStorage.setItem('weflow_form_intent', '1')
      window.dispatchEvent(new Event('weflow-intent'))  // 뒤로가기 트랩 무장
    } else {
      sessionStorage.removeItem('weflow_form_intent')
    }
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.type || !form.agree) {
      setShowErrors(true)
      const firstId =
        !form.name ? 'dg-name'
        : !form.phone ? 'dg-phone'
        : !form.type ? 'dg-type'
        : 'dg-agree'
      const el = document.getElementById(firstId)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.focus({ preventScroll: true })
      }
      return
    }
    setLoading(true)
    setSubmitError(false)
    try {
      // 유입 경로(광고 키워드·검색·리퍼러)를 메모에 붙여 관리자에서 문의별로 보이게 한다
      const attr = attributionLine()
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          [HONEYPOT_FIELD]: honeypot,
          note: [form.note, attr && `유입: ${attr}`].filter(Boolean).join('\n'),
        }),
      })
      if (!res.ok) throw new Error('request failed')
      setLoading(false)
      setShowErrors(false)
      // 네이버 광고·스마트로그에 "신청 완료" 전환을 알린다 (각 스크립트가 켜져 있을 때만 동작)
      trackNaverLead()
      trackSmartlogInquiry()
      // 완료 화면이 그려지기 전에 미리 상단으로 (스크롤이 움직이는 게 안 보이도록)
      window.scrollTo(0, 0)
      setSubmitted(true)
      sessionStorage.removeItem('weflow_form_intent')
    } catch {
      setLoading(false)
      setSubmitError(true)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <style>{`
          @keyframes done-in {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: none; }
          }
          @media (prefers-reduced-motion: reduce) {
            .done-panel { animation: none !important; }
          }
        `}</style>
        <div className="done-panel" style={{ textAlign: 'center', maxWidth: '420px', animation: 'done-in 0.45s ease-out both' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem',
          }}>
            <Check size={34} color="#16a34a" strokeWidth={2.5} />
          </div>
          <h2 className="title-1 emphasized" style={{ marginBottom: '1rem' }}>
            무료 상담 신청 완료!
          </h2>
          <p className="c-muted" style={{ lineHeight: 1.8, marginBottom: '1.75rem', fontSize: '1.1rem' }}>
            담당자가 확인 후 <strong style={{ color: 'var(--text)' }}>24시간 내</strong>에 연락드리겠습니다.<br />
            연중무휴 상담 가능합니다.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:010-2971-7280" style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              background: 'var(--accent)', color: 'var(--on-accent)', border: '1.5px solid var(--accent)',
              padding: '0.8rem 1.5rem', borderRadius: '8px', fontSize: '1rem',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }} className="emphasized">
              <Phone size={16} strokeWidth={2.5} /> 바로 전화하기
            </a>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', type: '', industry: '', note: '', agree: false }); setShowErrors(false); setSubmitError(false) }}
              className="semibold"
              style={{ flex: 1, background: 'var(--surface)', border: '1.5px solid var(--accent)', color: 'var(--accent)', borderRadius: '8px', padding: '0.8rem 1.5rem', fontSize: '1rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              다시 신청하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--section-a)' }}>
      {/* ── 본문 — PC·모바일 모두 폼만 보인다 (h1 은 폼 제목 '무료 상담 신청') ── */}
      <section style={{ padding: 'clamp(2rem, 5vw, 3rem) 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="diag-grid">

            {/* 예약 페이지(/booking)의 예약 정보 카드와 구조까지 같게 맞춘다 —
                제목과 입력칸이 같은 flex 상자 안에 있어야 간격이 똑같이 떨어진다 */}
            <form
              onSubmit={handleSubmit}
              className="dg-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {/* 카드 헤더 — 무엇을 신청하는지와 부담이 없다는 것을 먼저 말한다 */}
              <div style={{ textAlign: 'center' }}>
                <p className="caption-1 emphasized c-accent" style={{ letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>CALL TO ACTION</p>
                <h1 className="dg-form-title">무료 상담 신청</h1>
                <p className="c-muted" style={{ margin: '0.6rem 0 0', lineHeight: 1.6, fontSize: '1.02rem', wordBreak: 'keep-all' }}>
                  이름 · 전화번호만 남겨주시면 확인 후 빠르게 연락드립니다.
                </p>
              </div>

                <HoneypotField value={honeypot} onChange={setHoneypot} />

                <div className="dg-field">
                  <label className="form-label">이름 <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="dg-name" className="form-input" placeholder="홍길동" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  {showErrors && !form.name && <p className="field-error">이름을 입력해 주세요</p>}
                </div>

                <div className="dg-field">
                  <label className="form-label">연락처 <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="dg-phone" className="form-input" placeholder="010-0000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  {showErrors && !form.phone && <p className="field-error">연락처를 입력해 주세요</p>}
                </div>

                <div className="dg-field">
                  <label className="form-label">제작 종류 <span style={{ color: '#ef4444' }}>*</span></label>
                  <select id="dg-type" className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ cursor: 'pointer' }}>
                    <option value="">선택해 주세요</option>
                    {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {showErrors && !form.type && <p className="field-error">제작 종류를 선택해 주세요</p>}
                </div>

                {/* 자유 입력 — 원하는 것을 미리 적어 두면 상담이 빨라진다 (선택) */}
                <div className="dg-field">
                  <label className="form-label">추가 문의 사항</label>
                  <textarea
                    id="dg-note"
                    className="form-input"
                    rows={4}
                    placeholder="추가 문의사항이 있다면 작성해 주세요."
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    style={{ resize: 'vertical', lineHeight: 1.6, minHeight: '6.5rem' }}
                  />
                </div>

                {/* 개인정보 동의 — 체크 한 줄 + '내용 보기'로 펼치는 안내문 (커튼장인 폼과 같은 구조) */}
                <div className="dg-consent dg-wide">
                  <label className="dg-consent__label">
                    <input id="dg-agree" type="checkbox" checked={form.agree} onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))}
                      style={{ width: '17px', height: '17px', accentColor: 'var(--accent)', flexShrink: 0 }} />
                    <span>개인정보 수집 및 이용에 동의합니다. <span style={{ color: '#f55a64', whiteSpace: 'nowrap' }}>(필수)</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(v => !v)}
                    aria-expanded={privacyOpen}
                    aria-controls="dg-privacy-text"
                    className="dg-consent__toggle"
                  >
                    {privacyOpen ? '닫기' : '내용 보기'}
                  </button>
                  {/* grid-rows 0fr ↔ 1fr 로 높이 애니메이션 */}
                  <div id="dg-privacy-text" className={`dg-consent__body${privacyOpen ? ' is-open' : ''}`}>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="dg-consent__text">
                        <p>1. 수집 항목 및 목적: 성함, 연락처, 제작 종류, 문의 내용을 무료 상담 및 확인 전화 안내를 위해 수집하며, 명시된 목적 외의 용도로 이용하지 않습니다.</p>
                        <p>2. 보유 및 이용 기간: 상담 종료 후 1년까지</p>
                      </div>
                    </div>
                  </div>
                  {showErrors && !form.agree && (
                    <p className="field-error">개인정보 수집에 동의해 주세요</p>
                  )}
                </div>

                <button type="submit" className="btn-primary dg-wide" disabled={loading}
                  style={{ fontSize: '1.15rem', padding: '1.1rem', justifyContent: 'center', width: '100%' }}>
                  {loading ? '제출 중...' : '무료 상담 신청 →'}
                </button>
                {submitError && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.95rem', fontWeight: 500 }}>
                    <XCircle size={17} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                    전송에 실패했어요. 잠시 후 다시 시도해 주세요.
                  </div>
                )}
                {/* 대체 연락 수단 — 폼이 부담스러우면 전화로 */}
                <p className="c-muted" style={{ textAlign: 'center', margin: '-0.5rem 0 0', fontSize: '0.98rem' }}>
                  또는 전화{' '}
                  <a href="tel:010-2971-7280" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                    010-2971-7280
                  </a>
                </p>

            </form>
          </div>
        </div>
      </section>

      <style>{`
        /* 상담 폼은 예약 페이지(/booking)의 .booking-card 와 같은 여백·글씨 크기를 쓴다 */
        .dg-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          /* 위(CALL TO ACTION)와 아래(전화 안내) 여백이 같게 */
          padding: 1.75rem 1.5rem;
        }
        @media (max-width: 640px) {
          .dg-card { padding: 1.35rem 1.1rem; border-radius: 12px; }
        }
        .dg-card .form-input { font-size: 1.08rem; }
        .dg-card .form-label { font-size: 1.02rem; }
        /* 입력칸·동의 체크줄·신청 버튼 — 카드보다 좁게, 가운데 정렬 */
        .dg-field, .dg-wide { width: 100%; max-width: 480px; margin-left: auto; margin-right: auto; }

        /* 카드 헤더 제목 */
        .dg-form-title {
          margin: 0.6rem 0 0;
          font-size: clamp(1.7rem, 5vw, 2.1rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text);
          word-break: keep-all;
        }
        .br-mobile { display: none; }
        @media (max-width: 640px) { .br-mobile { display: inline; } }

        /* 개인정보 동의 박스 */
        .dg-consent {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          background: var(--bg);
          padding: 0.9rem 1rem;
        }
        .dg-consent__label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          font-size: 1.02rem;
          line-height: 1.5;
          color: var(--text);
          word-break: keep-all;
        }
        .dg-consent__toggle {
          align-self: flex-end;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.92rem;
          color: var(--text-muted);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .dg-consent__toggle:hover { color: var(--text); }
        .dg-consent__body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease-out;
        }
        .dg-consent__body.is-open { grid-template-rows: 1fr; }
        .dg-consent__text {
          margin-top: 0.6rem;
          padding-top: 0.7rem;
          border-top: 1px solid var(--border);
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--text-muted);
          word-break: keep-all;
        }
        .dg-consent__text p { margin: 0 0 0.5rem; }
        .dg-consent__text p:last-child { margin-bottom: 0; }

        /* 예약 페이지의 .bk-section-title 과 같은 서식 */
        .dg-section-title {
          font-weight: 600; font-size: 1.28rem; color: var(--text);
          letter-spacing: -0.01em;
          margin: 0 0 -0.4rem; display: flex; align-items: center; gap: 0.4rem;
        }
        .field-error {
          color: #ef4444;
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0.4rem 0 0;
        }
        /* PC·모바일 모두 폼 하나만 가운데 */
        .diag-grid { display: flex; justify-content: center; }
        .dg-card { width: 100%; max-width: 550px; }
      `}</style>
    </div>
  )
}
