'use client'
import { useId, useState, type ReactNode } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import HoneypotField from '@/components/HoneypotField'
import { HONEYPOT_FIELD, wasSaved } from '@/lib/leadInput'
import { attributionLine } from '@/lib/attribution'
import { trackNaverLead } from '@/lib/naverConversion'
import { trackGoogleLead } from '@/lib/googleConversion'
import { formatPhone, isValidPhone } from '@/lib/phone'

/**
 * 간편 견적 — 이름과 번호만 남기는 짧은 띠. 맨 아래 상담 폼(InquiryForm)까지 내려가지 않고도 문의할 수 있게
 * 페이지 중간 두 곳에 둔다: 가격 안내 카드 아래(ClinicPlans 안), 홈페이지 vs 웹블로그 아래.
 *
 * 접수는 상담 폼과 같은 /api/inquiries (type '병의원 웹블로그', source 'clinic-blog').
 * 관리자 화면에서 구분되게 메모 첫 줄에 '간편 견적 (어디서 남겼는지)' 를 적는다.
 * 한 페이지에 두 번 쓰이므로 입력칸 id 는 useId 로 만든다. 모양(.qq)은 page.tsx 의 <style> 에 있다.
 */
export default function QuickQuote({ place, title, desc }: {
  /** 어디에 놓인 띠인지 — 메모에 남는다 (예: '가격 안내 아래') */
  place: string
  title: ReactNode
  desc: ReactNode
}) {
  const id = useId()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('') // 서버·네트워크 오류 — 맨 아래 한 줄
  // 빈 칸으로 눌렀을 때 — 사이트 점검(check/CheckClient)처럼 빠진 칸마다 바로 아래에 빨간 한 줄을 한꺼번에 띄운다. 칸을 채우면 그 줄만 사라진다
  const [showErrors, setShowErrors] = useState(false)
  const phoneOk = isValidPhone(phone)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phoneOk || !agree) return setShowErrors(true)
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          type: '병의원 웹블로그',
          note: [`간편 견적 (${place})`, attributionLine() && `유입: ${attributionLine()}`].filter(Boolean).join('\n'),
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
      if (wasSaved(await res.json().catch(() => null))) {
        trackNaverLead()
        trackGoogleLead()
      }
      setDone(true)
    } catch {
      setError('네트워크 연결을 확인한 뒤 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="qq">
      <div className="qq-text">
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
      {done ? (
        <p className="qq-done" role="status">
          <span><Check size={18} strokeWidth={3} /></span>
          {/* 휴대폰에서는 두 줄 — '○○님, 접수됐어요.' 다음에 줄을 바꾼다 (cb-mo 는 휴대폰에서만 살아 있는 줄바꿈) */}
          <b>{name.trim()}님, 접수됐어요. <br className="cb-mo" />담당자가 확인 후 연락드릴게요.</b>
        </p>
      ) : (
        <form className="qq-form" onSubmit={onSubmit} noValidate>
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <div className="qq-row">
            <div>
              <input
                id={`${id}-name`}
                aria-label="성함"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="성함"
                autoComplete="name"
                maxLength={40}
              />
              {showErrors && !name.trim() && <small>* 성함을 입력해 주세요</small>}
            </div>
            <div>
              <input
                id={`${id}-phone`}
                aria-label="연락처"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={13}
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="연락처 (010-0000-0000)"
              />
              {showErrors && !phoneOk && <small>{phone ? '* 연락처를 다시 확인해 주세요' : '* 연락처를 입력해 주세요'}</small>}
            </div>
            {/* 동의 — 휴대폰에서는 버튼 바로 위, 넓은 화면에서는 입력 줄 아래 (CSS 격자 자리로 옮긴다) */}
            <div className="qq-f-agree">
              <label className="qq-agree">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                <span>
                  [필수] 개인정보 수집·이용에 동의합니다.{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">내용 보기</a>
                </span>
              </label>
              {showErrors && !agree && <small className="qq-agree-err">* 개인정보 수집에 동의해 주세요</small>}
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? '접수 중…' : <>간편 견적 받기 <ArrowRight size={17} strokeWidth={2.5} /></>}
            </button>
          </div>
          {error && <p className="qq-error" role="alert">* {error}</p>}
        </form>
      )}
    </div>
  )
}
