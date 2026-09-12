// 예약 접수 엔드포인트 — /api/bookings
// GET: 관리자 인증 필요 (예약 목록 조회)
// POST: 공개 — 사이트 예약 폼에서 호출

import { NextResponse } from 'next/server'
import { bookingStore } from '@/lib/store'
import { isAdmin } from '@/lib/adminAuth'
import { deviceNoteLine } from '@/lib/device'
import { parseLead } from '@/lib/leadInput'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

// 전체 예약 목록을 최신순으로 반환
export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const bookings = await bookingStore.getAll()
  return NextResponse.json(bookings)
}

/**
 * 예약 폼 제출 → 검사 후 생성된 예약을 201로 반환.
 *
 * 지금 이 창구를 부르는 화면은 없다 — /booking 페이지는 미들웨어가 /diagnosis 로 보내고,
 * 그 폼도 예약이 아니라 /api/inquiries 로 넣는다. 그래도 주소는 살아 있어 누구나 부를 수 있으므로,
 * 문의 쪽과 똑같이 막아 둔다. 개인정보를 받는 창구를 열어 둔 채로 두지 않는다.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '요청 형식이 잘못되었습니다.' }, { status: 400 })
  }

  const parsed = parseLead(body)
  if (parsed.kind === 'trap') {
    return NextResponse.json({ ok: true }, { status: 201 })
  }
  if (parsed.kind === 'reject') {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  // 예약에만 있는 값 — 희망 날짜·시간
  const b = body as Record<string, unknown>
  const date = typeof b.date === 'string' ? b.date.trim().slice(0, 20) : ''
  const time = typeof b.time === 'string' ? b.time.trim().slice(0, 20) : ''
  if (!date || !time) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
  }

  const limited = await checkRateLimit('booking', clientIp(req), { perMinute: 3, perHour: 20 })
  if (!limited.ok) {
    return NextResponse.json(
      { error: '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    )
  }

  const lead = parsed.value
  // 어떤 기기로 신청했는지 — 문의와 같은 방식으로 메모 끝에 "기기: …" 줄로 남긴다
  const noteWithDevice = [lead.note, deviceNoteLine(req.headers.get('user-agent') || '')]
    .filter(Boolean)
    .join('\n')
  const item = await bookingStore.create({
    name: lead.name,
    phone: lead.phone,
    type: lead.type,
    industry: lead.industry,
    note: noteWithDevice,
    date,
    time,
  })
  return NextResponse.json(item, { status: 201 })
}
