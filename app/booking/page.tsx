'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check, CalendarDays, Clock, User, XCircle } from 'lucide-react'
import { projectTypes } from '@/data/common'
import { attributionLine } from '@/lib/attribution'
import { trackNaverLead } from '@/lib/naverConversion'
import { trackSmartlogInquiry } from '@/lib/smartlog'
import Reveal from '@/components/Reveal'
import SplitText from '@/components/SplitText'

const AM_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30']
const PM_SLOTS = ['12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30']
const WEEKDAYS = ['일','월','화','수','목','금','토']
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay() }
function pad(n: number) { return String(n).padStart(2, '0') }

export default function BookingPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', type: '', industry: '', note: '', agree: false })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  // 작성 "중간"인 사람만 이탈 모달 대상: 뭔가 건드렸지만 필수항목은 아직 미완성
  useEffect(() => {
    const touched = !!(selectedDay || selectedSlot || customTime ||
      form.name || form.phone || form.type || form.industry || form.note || form.agree)
    const complete = !!(selectedDay && (selectedSlot || customTime) &&
      form.name && form.phone && form.type && form.agree)
    if (touched && !complete) {
      sessionStorage.setItem('weflow_form_intent', '1')
      window.dispatchEvent(new Event('weflow-intent'))  // 뒤로가기 트랩 무장
    } else {
      sessionStorage.removeItem('weflow_form_intent')
    }
  }, [selectedDay, selectedSlot, customTime, form])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)

  const isPast = (day: number) =>
    new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const isTimeDisabled = (slot: string) => {
    if (!selectedDay) return false
    const sel = new Date(year, month, selectedDay)
    if (sel.toDateString() !== today.toDateString()) return false
    const [h, m] = slot.split(':').map(Number)
    return h * 60 + m <= today.getHours() * 60 + today.getMinutes()
  }

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
    setSelectedDay(null); setSelectedSlot(''); setCustomTime('')
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
    setSelectedDay(null); setSelectedSlot(''); setCustomTime('')
  }

  const dateStr = selectedDay
    ? `${year}년 ${month + 1}월 ${selectedDay}일 (${WEEKDAYS[new Date(year, month, selectedDay).getDay()]})`
    : null
  const timeStr = customTime || selectedSlot || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDay || (!selectedSlot && !customTime) || !form.name || !form.phone || !form.type || !form.agree) {
      setShowErrors(true)
      const firstId =
        !selectedDay ? 'bk-date'
        : (!selectedSlot && !customTime) ? 'bk-time'
        : !form.name ? 'bk-name'
        : !form.phone ? 'bk-phone'
        : !form.type ? 'bk-type'
        : 'bk-agree'
      const el = document.getElementById(firstId)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.focus({ preventScroll: true })
      }
      return
    }
    setLoading(true)
    setSubmitError(false)
    const date = `${year}-${pad(month + 1)}-${pad(selectedDay)}`
    const time = customTime || selectedSlot
    try {
      // 예약도 문의로 저장한다 — 관리자 문의 관리 한곳에서 '예약 신청' 칩으로 구분해 보이게.
      // 희망 일시는 메모 첫 줄, 유입 경로(광고 키워드·검색·리퍼러)는 마지막 줄에 붙인다
      const attr = attributionLine()
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, type: form.type, industry: form.industry,
          note: [`희망 일시: ${date} ${time}`, form.note, attr && `유입: ${attr}`].filter(Boolean).join('\n'),
          agree: true,
          source: 'booking',
        }),
      })
      if (!res.ok) throw new Error('request failed')
      setLoading(false)
      setShowErrors(false)
      // 네이버 광고·스마트로그에 "예약 완료" 전환을 알린다 (각 스크립트가 켜져 있을 때만 동작)
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
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.75rem',
          }}>
            <Check size={34} color="#16a34a" strokeWidth={2.5} />
          </div>
          <h2 className="title-1 emphasized" style={{ marginBottom: '1rem' }}>예약이 접수되었습니다</h2>
          <p className="c-muted" style={{ lineHeight: 1.8, marginBottom: '1.75rem', fontSize: '1.1rem' }}>
            담당자가 확인 후 빠르게 연락드리겠습니다.
          </p>
          {dateStr && timeStr && (
            <div style={{
              background: 'var(--accent-light)', border: '1.5px solid var(--border)',
              borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem 1.25rem', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarDays size={17} color="var(--accent)" strokeWidth={2} />
                <span className="subhead semibold c-primary" style={{ fontSize: '1.1rem' }}>{dateStr}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={17} color="var(--accent)" strokeWidth={2} />
                <span className="subhead emphasized c-accent" style={{ fontSize: '1.1rem' }}>{timeStr}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setSubmitted(false); setSelectedDay(null); setSelectedSlot(''); setCustomTime('')
              setForm({ name: '', phone: '', type: '', industry: '', note: '', agree: false })
              setShowErrors(false)
            }}
            className="btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 1.75rem' }}
          >
            다른 예약 하기
          </button>
        </div>
      </div>
    )
  }

  /* ── 시간 슬롯 버튼 ── */
  const SlotButton = ({ slot }: { slot: string }) => {
    const disabled = isTimeDisabled(slot)
    const active = selectedSlot === slot
    return (
      <button type="button" disabled={disabled} onClick={() => { setSelectedSlot(slot); setCustomTime('') }}
        style={{
          padding: '0.32rem 0',
          border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '7px', cursor: disabled ? 'not-allowed' : 'pointer',
          background: active ? 'var(--accent-light)' : disabled ? 'var(--surface)' : 'var(--surface-container)',
          color: active ? 'var(--accent)' : disabled ? 'var(--outline)' : 'var(--text-secondary)',
          fontSize: '0.92rem', fontWeight: active ? 700 : 500,
          fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center',
        }}>
        {slot}
      </button>
    )
  }

  return (
    <div style={{ background: 'var(--section-a)', minHeight: '100vh' }}>
      {/* ── 헤더 ── */}
      <section style={{ background: 'var(--section-b)', borderBottom: '1px solid var(--border)', padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 3vw, 1.5rem) clamp(1.25rem, 2vw, 2rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal variant="up">
            <span className="footnote emphasized c-accent" style={{ letterSpacing: '0.12em' }}>BOOKING</span>
          </Reveal>
          <SplitText
            as="h1"
            className="title-1 bk-heading"
            style={{ margin: '0.6rem 0 0.4rem', wordBreak: 'keep-all' }}
            segments={[
              { text: '예약 ' },
              { text: '신청', className: 'c-accent' },
            ]}
          />
          <Reveal variant="up" delay={0.1}>
            <p className="subhead c-muted" style={{ margin: 0 }}>날짜와 시간을 선택하고 정보를 입력해 주세요</p>
          </Reveal>
        </div>
      </section>

      {/* ── 본문 ── */}
      <section style={{ padding: 'clamp(1.25rem, 2vw, 2rem) clamp(1rem, 3vw, 1.5rem) clamp(2rem, 5vw, 3rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <form onSubmit={handleSubmit}>
            <div className="booking-layout">

            {/* ── 왼쪽: 달력 ── */}
            <div className="booking-left">
            <div className="booking-card" id="bk-date">
              <p className="bk-section-title"><CalendarDays size={15} color="var(--accent)" strokeWidth={2} /> 날짜 선택 <span style={{ color: '#ef4444' }}>*</span></p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <button type="button" onClick={prevMonth} className="cal-nav-btn"><ChevronLeft size={16} strokeWidth={2.5} /></button>
                <p className="callout emphasized c-primary" style={{ margin: 0, fontSize: '1.15rem' }}>{year}년 {MONTHS[month]}</p>
                <button type="button" onClick={nextMonth} className="cal-nav-btn"><ChevronRight size={16} strokeWidth={2.5} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.35rem' }}>
                {WEEKDAYS.map((d, i) => (
                  <div key={d} className="emphasized" style={{ textAlign: 'center', padding: '0.45rem 0', fontSize: '1.05rem', color: i === 0 ? '#ef4444' : i === 6 ? 'var(--accent)' : 'var(--text-muted)' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const past = isPast(day)
                  const selected = selectedDay === day
                  const isToday = new Date(year, month, day).toDateString() === today.toDateString()
                  const dow = new Date(year, month, day).getDay()
                  return (
                    <button key={day} type="button" disabled={past}
                      onClick={() => { setSelectedDay(day); setSelectedSlot(''); setCustomTime('') }}
                      style={{
                        border: isToday && !selected ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                        borderRadius: '12px', padding: '1.2rem 0',
                        fontSize: '1.3rem', fontWeight: selected ? 700 : isToday ? 700 : 400,
                        cursor: past ? 'not-allowed' : 'pointer',
                        background: selected ? 'var(--accent)' : 'transparent',
                        color: selected ? 'var(--on-accent)' : past ? 'var(--outline)' : dow === 0 ? '#ef4444' : dow === 6 ? 'var(--accent)' : 'var(--text)',
                        fontFamily: 'inherit', transition: 'all 0.15s',
                      }}>
                      {day}
                    </button>
                  )
                })}
              </div>
              {showErrors && !selectedDay && (
                <p className="field-error">날짜를 선택해 주세요</p>
              )}
            </div>

            {/* 2. 시간 선택 (달력 아래) */}
            <div className="booking-card" id="bk-time">
              <p className="bk-section-title">
                <Clock size={15} color="var(--accent)" strokeWidth={2} /> 시간 선택 <span style={{ color: '#ef4444' }}>*</span>
                {!selectedDay && <span className="caption-1 medium c-muted" style={{ marginLeft: '0.3rem' }}>날짜를 먼저 선택해주세요</span>}
              </p>
              <div style={{ opacity: selectedDay ? 1 : 0.4, pointerEvents: selectedDay ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                <div className="slot-grid">
                  {[...AM_SLOTS, ...PM_SLOTS].map(s => <SlotButton key={s} slot={s} />)}
                </div>
              </div>
              {showErrors && selectedDay && !selectedSlot && !customTime && (
                <p className="field-error">시간을 선택해 주세요</p>
              )}
            </div>

            {/* 3. 시간 직접입력 */}
            <div className="booking-card">
              <p className="bk-section-title"><Clock size={15} color="var(--accent)" strokeWidth={2} /> 시간 직접 입력</p>
              <input type="text" className="form-input" placeholder="희망 시간을 입력해주세요"
                value={customTime} onChange={e => { setCustomTime(e.target.value); setSelectedSlot('') }} />
            </div>

            {/* 선택 요약 바 */}
            {(dateStr || timeStr) && (
              <div style={{
                background: 'var(--surface)', border: '1.5px solid var(--accent)',
                borderRadius: '12px', padding: '0.85rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarDays size={17} color="var(--accent)" strokeWidth={2} />
                  <span className="subhead semibold c-primary" style={{ fontSize: '1.1rem' }}>{dateStr}</span>
                </div>
                {timeStr && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={17} color="var(--accent)" strokeWidth={2} />
                    <span className="subhead emphasized c-accent" style={{ fontSize: '1.1rem' }}>{timeStr}</span>
                  </div>
                )}
              </div>
            )}
            </div>

            {/* ── 오른쪽: 예약 정보·제출 ── */}
            <div className="booking-right">

            {/* 예약 정보 — 아래 여백을 위(제목 행간 포함)와 시각적으로 같게 살짝 더 준다 */}
            <div className="booking-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '1.85rem' }}>
              <p className="bk-section-title bk-form-title"><User size={15} color="var(--accent)" strokeWidth={2} /> 예약 정보</p>

              <div>
                <label className="form-label">이름 <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="bk-name" className="form-input" placeholder="홍길동" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                {showErrors && !form.name && <p className="field-error">이름을 입력해 주세요</p>}
              </div>
              <div>
                <label className="form-label">연락처 <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="bk-phone" className="form-input" placeholder="010-0000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                {showErrors && !form.phone && <p className="field-error">연락처를 입력해 주세요</p>}
              </div>
              <div>
                <label className="form-label">제작 종류 <span style={{ color: '#ef4444' }}>*</span></label>
                <select id="bk-type" className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ cursor: 'pointer' }}>
                  <option value="">선택해 주세요</option>
                  {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {showErrors && !form.type && <p className="field-error">제작 종류를 선택해 주세요</p>}
              </div>
            </div>

            {/* 동의 + 제출 */}
            <div className="booking-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label className="subhead c-secondary" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', cursor: 'pointer', lineHeight: 1.5, fontSize: '1.05rem' }}>
                <input id="bk-agree" type="checkbox" checked={form.agree} onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))}
                  style={{ marginTop: '3px', width: '17px', height: '17px', accentColor: 'var(--accent)', flexShrink: 0 }} />
                개인정보 수집 및 상담 동의 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {showErrors && !form.agree && (
                <p className="field-error" style={{ marginTop: '-0.5rem' }}>개인정보 수집에 동의해 주세요</p>
              )}
              <button type="submit" className="btn-primary" disabled={loading}
                style={{ fontSize: '1.15rem', padding: '1.1rem', justifyContent: 'center', width: '100%' }}>
                {loading ? '접수 중...' : '예약 신청하기'}
              </button>
              {submitError && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.95rem', fontWeight: 500 }}>
                  <XCircle size={17} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                  전송에 실패했어요. 잠시 후 다시 시도해 주세요.
                </div>
              )}
              <p className="c-muted" style={{ textAlign: 'center', margin: 0, fontSize: '0.95rem' }}>
                연중무휴 24시간 ·{' '}
                <br className="br-mobile" />
                담당자가 직접 확인 후 연락드립니다
              </p>
            </div>

            </div>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        .bk-heading { font-size: clamp(2rem, 4.5vw, 3rem); line-height: 1.2; }
        .field-error {
          color: #ef4444;
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0.4rem 0 0;
        }
        .booking-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 1.25rem;
          align-items: start;
        }
        .booking-left { display: flex; flex-direction: column; gap: 1.1rem; }
        /* 오른쪽 컬럼 — 스크롤 시 따라다니고 하단이 왼쪽 끝에 맞음 */
        .booking-right {
          display: flex; flex-direction: column; gap: 1.1rem;
          position: sticky; top: 96px;
        }
        @media (max-width: 880px) {
          .booking-layout { grid-template-columns: 1fr; }
          .booking-left { position: static; }
          .booking-right { position: static; }
        }
        .bk-section-title {
          font-weight: 600; font-size: 1.28rem; color: var(--text);
          letter-spacing: -0.01em;
          margin: 0 0 1rem; display: flex; align-items: center; gap: 0.4rem;
        }
        /* 오른쪽 예약 정보 카드만 — 필드 간격(1.5rem gap)이 있어 제목 아래를 좁힌다 */
        .bk-form-title { margin-bottom: -0.4rem; }
        /* 폼 내부 글씨 키우기 (booking 페이지 전용) */
        .booking-card .form-input { font-size: 1.08rem; }
        .booking-card .form-label { font-size: 1.02rem; }
        .booking-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
        }
        @media (max-width: 640px) {
          .booking-card { padding: 1.1rem; border-radius: 12px; }
        }
        .cal-nav-btn {
          background: var(--surface-container); border: none; border-radius: 8px;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-secondary); transition: background 0.15s;
        }
        .cal-nav-btn:hover { background: var(--surface-container-high); }
        .slot-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.35rem;
        }
        @media (max-width: 480px) {
          .slot-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </div>
  )
}
