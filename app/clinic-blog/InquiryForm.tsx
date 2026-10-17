'use client'
import { useEffect, useState } from 'react'
import HoneypotField from '@/components/HoneypotField'
import { HONEYPOT_FIELD, wasSaved } from '@/lib/leadInput'
import { attributionLine } from '@/lib/attribution'
import { trackNaverLead } from '@/lib/naverConversion'
import { formatPhone, isValidPhone } from '@/lib/phone'
import { PLAN_EVENT } from './PlanButton'

/**
 * 병·의원 웹블로그 상담 신청 폼 — 일반 문의와 같은 /api/inquiries 로 보낸다.
 * 관리자 화면에서 구분되도록 type 을 '병·의원 웹블로그', source 를 'clinic-blog' 로 남기고,
 * 진료과목은 업종(industry) 칸에, 문의 유형(웹블로그만 / 홈페이지 + 웹블로그 / 상담 후 결정)은 메모 첫 줄에 넣는다.
 * 문의 유형은 상품 카드의 '이걸로 상담받기' 를 누르면 미리 골라진다 (PlanButton 이 보내는 신호를 듣는다).
 */

const PLANS = ['웹블로그만', '홈페이지 + 웹블로그', '상담 후 결정']

/** 지출 예산 — 선택 칸. 고른 값은 메모에 '예산: …' 한 줄로 남는다 */
const BUDGETS = ['0~200만원', '200~400만원', '400~600만원', '600만원 이상']

const SPECIALTIES = ['치과', '피부과', '성형외과', '한의원', '정형외과', '안과', '내과·소아과', '산부인과', '기타']

export default function InquiryForm() {
  const [clinic, setClinic] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [budget, setBudget] = useState('')
  const [plan, setPlan] = useState('')
  const [note, setNote] = useState('')
  const [agree, setAgree] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('') // 서버·네트워크 오류 — 버튼 위에 한 줄
  // 칸별 안내 — 비어 있는 필수 칸 바로 아래에 띄운다. 그 칸을 다시 고치면 지운다
  const [errs, setErrs] = useState<{ name?: string; phone?: string; agree?: string }>({})
  const [done, setDone] = useState(false)

  // 상품 카드에서 고른 문의 유형을 받아 둔다
  useEffect(() => {
    const onPlan = (e: Event) => setPlan((e as CustomEvent<string>).detail)
    window.addEventListener(PLAN_EVENT, onPlan)
    return () => window.removeEventListener(PLAN_EVENT, onPlan)
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // 필수 칸을 한 번에 다 보고, 빠진 칸마다 그 아래에 안내를 띄운다
    const next: typeof errs = {}
    if (!name.trim()) next.name = '이름을 입력해 주세요'
    if (!phone.trim()) next.phone = '연락처를 입력해 주세요'
    else if (!isValidPhone(phone)) next.phone = '연락처를 다시 확인해 주세요'
    if (!agree) next.agree = '개인정보 수집에 동의해 주세요'
    setErrs(next)
    if (Object.keys(next).length) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          type: '병·의원 웹블로그',
          industry: specialty,
          note: [
            plan && `문의 유형: ${plan}`,
            budget && `예산: ${budget}`,
            clinic.trim() && `병원명: ${clinic.trim()}`,
            note.trim(),
            attributionLine() && `유입: ${attributionLine()}`,
          ].filter(Boolean).join('\n'),
          agree: true,
          source: 'clinic-blog',
          [HONEYPOT_FIELD]: honeypot,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error || '접수 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.')
        return
      }
      // 허니팟에 걸린 요청도 성공으로 답하므로, 실제 저장된 응답에만 전환을 쏜다 (lib/leadInput.ts 참고)
      if (wasSaved(await res.json().catch(() => null))) trackNaverLead()
      setDone(true)
    } catch {
      setError('네트워크 연결을 확인한 뒤 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div id="contact-form" className="cb-done" role="status">
        {/* 파란 동그라미가 톡 튀어나오고, 그 위에 체크가 그려진다 */}
        <div className="cb-done-check" aria-hidden="true">
          <svg viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="38" />
            <path d="M24 39l9 9 19-19" />
          </svg>
        </div>
        <h3>{name.trim()}님, 신청이 접수됐어요</h3>
        <p>
          남겨 주신 연락처로<br />
          담당자가 확인 후 직접 연락드릴게요.
        </p>
        {/* 지금 어디쯤인지 — 신청은 끝났고, 다음은 담당자 연락 */}
        <ol className="cb-done-steps">
          <li className="is-done"><b>✓</b>신청 완료</li>
          <li className="is-now"><b>2</b>담당자 연락</li>
          <li><b>3</b>맞춤 구성 안내</li>
        </ol>
      </div>
    )
  }

  return (
    <form id="contact-form" className="cb-form" onSubmit={onSubmit} noValidate>
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="cb-form-head cb-full">
        <strong>무료 상담 신청</strong>
      </div>
      {/* 문의 유형 — 셋 중 하나를 고르는 칩. 선택 칸이라 안 골라도 신청된다 */}
      <div className="cb-field cb-full" role="radiogroup" aria-label="문의 유형">
        <span className="cb-field-label">문의 유형</span>
        <div className="cb-plan-chips">
          {PLANS.map(p => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={plan === p}
              className={`cb-plan-chip${plan === p ? ' is-on' : ''}`}
              onClick={() => setPlan(plan === p ? '' : p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="cb-field">
        <label htmlFor="cb-clinic">병원명</label>
        <input id="cb-clinic" value={clinic} onChange={e => setClinic(e.target.value)} placeholder="예) 위플로우치과" maxLength={40} />
      </div>
      <div className="cb-field">
        <label htmlFor="cb-specialty">진료과목</label>
        {/* required 는 '아직 안 고름' 을 흐린 글자로 보이게 하려는 것뿐 — 이 칸은 선택이라 제출 검사는 하지 않는다 (noValidate) */}
        <select id="cb-specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} required>
          <option value="" disabled>선택해 주세요</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="cb-field cb-full">
        <label htmlFor="cb-budget">지출 예산</label>
        <select id="cb-budget" value={budget} onChange={e => setBudget(e.target.value)} required>
          <option value="" disabled>선택해 주세요</option>
          {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className={`cb-field ${errs.name ? 'is-err' : ''}`}>
        <label htmlFor="cb-name">담당자 성함<i>*</i></label>
        <input
          id="cb-name"
          value={name}
          onChange={e => {
            setName(e.target.value)
            if (errs.name) setErrs(v => ({ ...v, name: undefined }))
          }}
          autoComplete="name"
          maxLength={40}
          aria-invalid={!!errs.name}
          aria-describedby={errs.name ? 'cb-name-err' : undefined}
        />
        {errs.name && <p id="cb-name-err" className="cb-field-err">* {errs.name}</p>}
      </div>
      <div className={`cb-field ${errs.phone ? 'is-err' : ''}`}>
        <label htmlFor="cb-phone">연락처<i>*</i></label>
        <input
          id="cb-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={e => {
            setPhone(formatPhone(e.target.value))
            if (errs.phone) setErrs(v => ({ ...v, phone: undefined }))
          }}
          placeholder="010-0000-0000"
          aria-invalid={!!errs.phone}
          aria-describedby={errs.phone ? 'cb-phone-err' : undefined}
        />
        {errs.phone && <p id="cb-phone-err" className="cb-field-err">* {errs.phone}</p>}
      </div>
      <div className="cb-field cb-full">
        <label htmlFor="cb-note">문의 내용</label>
        <textarea
          id="cb-note"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="운영 중인 블로그·홈페이지 주소나 궁금한 점을 적어 주세요 (선택)"
          maxLength={1500}
        />
      </div>
      <div className="cb-full">
        <label className={`cb-agree ${errs.agree ? 'is-err' : ''}`}>
          <input
            type="checkbox"
            checked={agree}
            onChange={e => {
              setAgree(e.target.checked)
              if (errs.agree) setErrs(v => ({ ...v, agree: undefined }))
            }}
            aria-invalid={!!errs.agree}
            aria-describedby={errs.agree ? 'cb-agree-err' : undefined}
          />
          <span>[필수] 개인정보 수집·이용에 동의합니다.<i>*</i></span>
        </label>
        {errs.agree && <p id="cb-agree-err" className="cb-field-err">* {errs.agree}</p>}
      </div>
      {error && <p className="cb-error cb-full" role="alert">{error}</p>}
      <button type="submit" className="cb-btn cb-full" disabled={submitting}>
        {submitting ? '접수 중…' : '무료 상담 신청하기'}
      </button>
    </form>
  )
}
