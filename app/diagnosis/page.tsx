'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, FileText, LayoutTemplate, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { attributionLine } from '@/lib/attribution'
import { markNaverLead } from '@/lib/naverConversion'
import HoneypotField from '@/components/HoneypotField'
import { requestModes } from '@/data/common'
import { HONEYPOT_FIELD, wasSaved } from '@/lib/leadInput'
import { formatPhone, isValidPhone } from '@/lib/phone'
import { readStore, writeStore, removeStore } from '@/lib/safeStorage'

/** 지출 예산 선택지 — 고른 문장이 그대로 문의 메모에 "예산: …" 줄로 남는다 */
const BUDGETS = ['0~100만원', '100~200만원', '200~300만원', '300~400만원', '400만원 이상']

/**
 * 진행 방식 — 둘 중 하나를 카드로 고른다. 고른 이름이 문의의 type 칸에 저장된다
 * (예전에 '제작 종류'가 들어가던 칸이라, 관리자 목록의 그 열에 이 값이 보인다).
 */
const MODES: { value: string; Icon: LucideIcon; desc: string; badge?: string }[] = [
  { value: requestModes[0], Icon: LayoutTemplate, desc: '메인 1페이지 시안을 먼저 보고 결정합니다.', badge: '추천' },
  { value: requestModes[1], Icon: FileText, desc: '시안 없이 견적만 받습니다.' },
]

export default function DiagnosisPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    budget: '',
    // 추천하는 쪽을 미리 골라 둔다 — 바꾸지 않아도 그대로 신청된다
    mode: MODES[0].value,
    ref: '',
    industry: '',
    note: '',
    agree: false,
  })
  // 봇 거르개 — 사람은 못 보는 칸이라 정상 신청에서는 늘 빈 문자열로 나간다
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  // 실패 사유를 담는다. 빈 문자열이면 실패 없음.
  // 예전엔 true/false 라 어떤 이유로 막혔는지 화면에서 알 수 없었고,
  // 고객이 "안 돼요" 라고만 알려 주면 원인을 추측할 수밖에 없었다.
  const [submitError, setSubmitError] = useState('')
  // 개인정보 동의 안내문 펼침 — 커튼장인 폼과 같은 '내용 보기 / 닫기' 토글
  const [privacyOpen, setPrivacyOpen] = useState(false)

  // 폼 자동 채움 — 맞춤 플랜 위젯에서 넘어온 값만 (방문자가 직접 고른 답).
  useEffect(() => {
    const raw = readStore('session', 'weflow_quiz_prefill')
    if (!raw) return
    try {
      const p = JSON.parse(raw)
      // sessionStorage(외부 상태) → 클라이언트 전용 프리필
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(f => ({
        ...f,
        industry: p.industry || f.industry,
        note: p.note || f.note,
      }))
    } catch {}
    removeStore('session', 'weflow_quiz_prefill')
  }, [])

  // 작성 "중간"인 사람만 이탈 모달 대상: 뭔가 입력했지만 필수항목은 아직 미완성
  useEffect(() => {
    // 진행 방식은 처음부터 골라져 있으므로 '손댔는지'를 볼 때는 세지 않는다
    const touched = !!(form.name || form.phone || form.budget || form.ref || form.industry || form.note || form.agree)
    const complete = !!(form.name && form.phone && form.industry.trim() && form.budget && form.agree)
    if (touched && !complete) {
      writeStore('session', 'weflow_form_intent', '1')
      window.dispatchEvent(new Event('weflow-intent'))  // 뒤로가기 트랩 무장
    } else {
      removeStore('session', 'weflow_form_intent')
    }
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !isValidPhone(form.phone) || !form.industry.trim() || !form.budget || !form.agree) {
      setShowErrors(true)
      const firstId =
        !form.name ? 'dg-name'
        : !isValidPhone(form.phone) ? 'dg-phone'
        : !form.industry.trim() ? 'dg-industry'
        : !form.budget ? 'dg-budget'
        : 'dg-agree'
      const el = document.getElementById(firstId)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.focus({ preventScroll: true })
      }
      return
    }
    setLoading(true)
    setSubmitError('')
    try {
      // 유입 경로(광고 키워드·검색·리퍼러)를 메모에 붙여 관리자에서 문의별로 보이게 한다
      const attr = attributionLine()
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 문의 테이블에는 예산·참고 사이트 칸이 따로 없다 — 메모 맨 위에 줄로 붙여 보낸다
        // (관리자 상세의 '추가요청사항'과 엑셀에 그대로 보인다). 진행 방식은 type 칸에 싣는다.
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          type: form.mode,
          industry: form.industry.trim(),
          agree: form.agree,
          [HONEYPOT_FIELD]: honeypot,
          note: [
            `예산: ${form.budget}`,
            form.ref.trim() && `참고 사이트: ${form.ref.trim()}`,
            form.note,
            attr && `유입: ${attr}`,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      })
      // 서버가 사유를 적어 보내면(400 등) 그 문장을 그대로 쓴다.
      // 없으면 상태 코드만 들고 나가 아래 catch 에서 안내를 고른다.
      if (!res.ok) {
        const reason = await res.json().then(d => d?.error).catch(() => null)
        throw new Error(typeof reason === 'string' && reason ? reason : String(res.status))
      }
      // 허니팟에 걸린 요청에도 성공으로 답하므로 res.ok 만으로는 저장 여부를 알 수 없다 —
      // 실제로 저장된 응답에만 문의 id 가 들어 있다 (lib/leadInput.ts 의 wasSaved 설명 참고)
      const saved = wasSaved(await res.json().catch(() => null))
      setShowErrors(false)
      // 이탈 모달(뒤로가기 트랩)을 먼저 푼다
      removeStore('session', 'weflow_form_intent')
      // 네이버 전환은 완료 주소(/diagnosis/success)에서 쏜다. 여기서는 표시만 남긴다 —
      // 허니팟에 걸려 저장되지 않은 요청에도 완료 화면은 똑같이 보여 주되,
      // 광고 전환으로는 세지 않기 위해서다.
      if (saved) markNaverLead()
      // loading 은 끄지 않는다 — 화면이 바뀔 때까지 버튼이 다시 눌리지 않게 둔다
      router.push('/diagnosis/success')
    } catch (e) {
      setLoading(false)
      const code = e instanceof Error ? e.message : ''
      // 429 는 고장이 아니라 "너무 자주 눌렀다" 는 뜻이다. 실패로 안내하면
      // 고객이 계속 다시 누르고, 그러면 제한이 더 길어진다.
      // 숫자면 상태 코드(사유 없음), 문장이면 서버가 적어 보낸 사유다
      const isStatus = /^\d{3}$/.test(code)
      setSubmitError(
        code === '429'
          ? '요청이 몰려 잠시 막혔어요. 1분 뒤에 다시 눌러 주세요.'
          : !isStatus && code
            ? code
            : `전송에 실패했어요. 잠시 후 다시 시도해 주세요.${code ? ` (${code})` : ''}`,
      )
    }
  }

  // 완료 화면은 /diagnosis/success 로 옮겼다 — 주소가 따로 있어야 뒤로가기·새로고침이
  // 자연스럽게 돌고, 광고·분석에서 "완료까지 간 사람"을 주소 하나로 셀 수 있다.

  return (
    // 메인과 같은 흰 바탕 — .theme-light 가 색 변수를 밝은 값으로 바꾼다 (styles/globals.css).
    <div className="theme-light" style={{ background: 'var(--section-a)' }}>
      {/* ── 본문 — PC·모바일 모두 폼만 보인다 (h1 은 폼 제목 '맞춤 견적 받기') ── */}
      <section className="dg-section">
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
                <h1 className="dg-form-title">맞춤 견적 받기</h1>
                <p className="c-muted" style={{ margin: '0.6rem 0 0', lineHeight: 1.6, fontSize: '1.02rem', wordBreak: 'keep-all' }}>
                  간단한 정보만 남겨주시면 <br className="br-mobile" />
                  확인 후 빠르게 연락드립니다.
                </p>
              </div>

                <HoneypotField value={honeypot} onChange={setHoneypot} />

                <div className="dg-field">
                  <label className="form-label">이름 <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="dg-name" className="form-input" placeholder="홍길동" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  {showErrors && !form.name && <p className="field-error">* 이름을 입력해 주세요</p>}
                </div>

                <div className="dg-field">
                  <label className="form-label">연락처 <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="dg-phone" className="form-input" type="tel" inputMode="tel" autoComplete="tel"
                    placeholder="010-0000-0000" maxLength={13} value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))} />
                  {showErrors && !form.phone && <p className="field-error">* 연락처를 입력해 주세요</p>}
                  {showErrors && !!form.phone && !isValidPhone(form.phone) && (
                    <p className="field-error">* 연락처 형식으로 입력해주세요</p>
                  )}
                </div>

                {/* 진행 방식 — 카드 둘 중 하나. 안쪽은 라디오 버튼이라 키보드(방향키)로도 고를 수 있다 */}
                <div className="dg-field" role="radiogroup" aria-labelledby="dg-mode-label">
                  <span id="dg-mode-label" className="form-label">진행 방식 <span style={{ color: '#ef4444' }}>*</span></span>
                  <div className="dg-modes">
                    {MODES.map(({ value, Icon, desc, badge }) => {
                      const on = form.mode === value
                      return (
                        <label key={value} className={on ? 'dg-mode is-on' : 'dg-mode'}>
                          <input
                            type="radio"
                            name="dg-mode"
                            className="dg-mode__input"
                            value={value}
                            checked={on}
                            onChange={() => setForm(f => ({ ...f, mode: value }))}
                          />
                          <span className="dg-mode__top">
                            <span className="dg-mode__icon"><Icon size={20} strokeWidth={2} aria-hidden="true" /></span>
                            <span className="dg-mode__check" aria-hidden="true">
                              {on && <Check size={14} strokeWidth={3} />}
                            </span>
                          </span>
                          <span className="dg-mode__name">
                            {value}
                            {badge && <span className="dg-mode__badge">{badge}</span>}
                          </span>
                          <span className="dg-mode__desc">{desc}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* 참고 사이트 — 선택. type="url" 은 쓰지 않는다: 'naver.com' 처럼 앞머리 없이 적으면
                    브라우저가 제출을 막아 버린다 */}
                <div className="dg-field">
                  <label className="form-label" htmlFor="dg-ref">참고 사이트 주소 <span className="dg-optional">(선택)</span></label>
                  <input
                    id="dg-ref"
                    className="form-input"
                    type="text"
                    inputMode="url"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    maxLength={300}
                    placeholder="참고할 사이트 주소를 적어주세요"
                    value={form.ref}
                    onChange={e => setForm(f => ({ ...f, ref: e.target.value }))}
                  />
                </div>

                {/* 업종 — 필수. 문의 테이블의 industry 칸에 그대로 저장돼 관리자 상세의 '업종'에 보인다 */}
                <div className="dg-field">
                  <label className="form-label" htmlFor="dg-industry">업종 <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    id="dg-industry"
                    className="form-input"
                    maxLength={40}
                    placeholder="기업/비즈니스, 인테리어, 차량/타이어 등"
                    value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  />
                  {showErrors && !form.industry.trim() && <p className="field-error">* 업종을 입력해 주세요</p>}
                </div>

                <div className="dg-field">
                  <label className="form-label" htmlFor="dg-budget">지출 예산 <span style={{ color: '#ef4444' }}>*</span></label>
                  <select id="dg-budget" className="form-input" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} style={{ cursor: 'pointer' }}>
                    <option value="">선택해 주세요</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {showErrors && !form.budget && <p className="field-error">* 지출 예산을 선택해 주세요</p>}
                </div>

                {/* 자유 입력 — 원하는 것을 미리 적어 두면 상담이 빨라진다 (선택) */}
                <div className="dg-field">
                  <label className="form-label">추가 문의 사항</label>
                  <textarea
                    id="dg-note"
                    className="form-input"
                    rows={4}
                    placeholder="추가 문의 사항이 있다면 작성해 주세요."
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
                        <p>1. 수집 항목 및 목적: 성함, 연락처, 업종, 지출 예산, 진행 방식, 참고 사이트 주소, 문의 내용을 맞춤 견적·상담 및 확인 전화 안내를 위해 수집하며, 명시된 목적 외의 용도로 이용하지 않습니다.</p>
                        <p>2. 보유 및 이용 기간: 상담 종료 후 1년까지</p>
                      </div>
                    </div>
                  </div>
                  {showErrors && !form.agree && (
                    <p className="field-error">* 개인정보 수집에 동의해 주세요</p>
                  )}
                </div>

                <button type="submit" className="btn-primary dg-wide" disabled={loading}
                  style={{ fontSize: '1.15rem', padding: '1.1rem', justifyContent: 'center', width: '100%' }}>
                  {loading ? '제출 중...' : '맞춤 견적 받아보기 →'}
                </button>
                {submitError && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.95rem', fontWeight: 500 }}>
                    <XCircle size={17} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                    {submitError}
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
        .dg-section { padding: clamp(2rem, 5vw, 3rem) 1.5rem; }
        .dg-optional { font-weight: 400; color: var(--text-muted); }
        .dg-card {
          /* 카드도 흰색 — 바탕과 같은 색이라, 옅은 테두리와 넓게 퍼지는 그림자로 띄운다 */
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(17, 17, 17, 0.08), 0 2px 8px rgba(17, 17, 17, 0.04);
          /* 위(CALL TO ACTION)와 아래(전화 안내) 여백이 같게 */
          padding: 1.75rem 1.5rem;
        }
        @media (max-width: 640px) {
          /* 좁은 화면 — 바깥 여백을 줄여 진행 방식 카드 두 장이 설 자리를 넓힌다 */
          .dg-section { padding-left: 1rem; padding-right: 1rem; }
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
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text);
          word-break: keep-all;
        }
        .br-mobile { display: none; }
        @media (max-width: 640px) { .br-mobile { display: inline; } }

        /* ── 진행 방식 — 카드 두 장 중 하나를 고른다 ── */
        .dg-modes { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
        .dg-mode {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 0.95rem 0.95rem 1rem;
          border: 1.5px solid var(--border);
          border-radius: 14px;
          background: var(--bg);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .dg-mode:hover { border-color: var(--outline); }
        .dg-mode.is-on { border-color: var(--accent); background: var(--accent-light); }
        /* 라디오 버튼은 화면에서만 감춘다 — 탭·방향키로는 그대로 잡힌다 */
        .dg-mode__input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; pointer-events: none; }
        .dg-mode:has(.dg-mode__input:focus-visible) { outline: 2px solid var(--accent); outline-offset: 2px; }
        .dg-mode__top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem; }
        .dg-mode__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: var(--surface-container);
          color: var(--text-secondary);
          transition: background 0.15s, color 0.15s;
        }
        .dg-mode.is-on .dg-mode__icon { background: var(--accent); color: #fff; }
        /* 오른쪽 위 동그라미 — 고르면 강조색으로 채워지고 체크가 들어온다 */
        .dg-mode__check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          border: 1.5px solid var(--outline-variant);
          color: #fff;
          transition: background 0.15s, border-color 0.15s;
        }
        .dg-mode.is-on .dg-mode__check { background: var(--accent); border-color: var(--accent); }
        .dg-mode__name {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--text);
          word-break: keep-all;
        }
        .dg-mode.is-on .dg-mode__name { color: var(--accent); }
        .dg-mode__badge {
          padding: 1px 8px;
          border-radius: 6px;
          background: var(--accent);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .dg-mode__desc {
          margin-top: 0.3rem;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-muted);
          word-break: keep-all;
        }

        /* 좁은 화면 — '시안 먼저 받기' 와 '추천' 칩이 한 줄에 서게 카드 안쪽 여백·틈·제목 글씨를 조금씩 줄인다
           (화면 폭 360px 에서 카드 안쪽 약 117px, 제목 + 칩 약 115px) */
        @media (max-width: 640px) {
          .dg-modes { gap: 0.5rem; }
          .dg-mode { padding: 0.8rem 0.65rem 0.9rem; }
          .dg-mode__name { gap: 0.3rem; font-size: clamp(0.9rem, 4.1vw, 1.05rem); letter-spacing: -0.03em; }
          .dg-mode__badge { padding: 1px 6px; font-size: 0.66rem; letter-spacing: 0; }
        }

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
