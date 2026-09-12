// 문의 접수 엔드포인트 — /api/inquiries
// GET: 관리자 인증 필요 (문의 목록 조회)
// POST: 공개 — 상담 폼에서 호출

import { NextResponse } from 'next/server'
import { inquiryStore } from '@/lib/store'
import { isAdmin } from '@/lib/adminAuth'
import { deviceNoteLine } from '@/lib/device'
import { parseLead } from '@/lib/leadInput'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

// 전체 문의 목록을 최신순으로 반환
export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const inquiries = await inquiryStore.getAll()
  return NextResponse.json(inquiries)
}

/**
 * 문의 폼 제출 → 검사 후 생성된 문의를 201로 반환 (source는 어느 폼에서 왔는지).
 *
 * 인증이 없는 공개 창구라, 폼 화면을 거치지 않고 주소로 바로 부를 수 있다.
 * 그래서 들어온 값을 여기서 다시 본다 — 화면 검사는 편의고, 실제 방어는 이쪽이다.
 * 값 검사 규칙은 lib/leadInput.ts 에 모아 뒀다 (예약 쪽과 같은 규칙을 쓰기 위함).
 */
export async function POST(req: Request) {
  // 깨진 본문이 오면 예전에는 여기서 그대로 터져 500 이 찍혔다.
  // 봇이 두드리면 로그가 500 으로 덮여 정작 진짜 오류를 못 찾게 된다.
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '요청 형식이 잘못되었습니다.' }, { status: 400 })
  }

  const parsed = parseLead(body)

  // 허니팟에 걸린 요청 — 저장하지 않으면서 성공한 것처럼 답한다.
  // 거절로 답하면 상대가 "이 칸 때문이구나" 를 알아채고 비워서 다시 보낸다.
  if (parsed.kind === 'trap') {
    return NextResponse.json({ ok: true }, { status: 201 })
  }
  if (parsed.kind === 'reject') {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  // 횟수 제한 — 같은 곳에서 문의가 쏟아지는 것만 막는다.
  //
  // 넉넉하게 잡은 이유: 국내 이동통신은 여러 사용자가 같은 IP 로 나가는 경우가 많다.
  // 조이면 스팸보다 진짜 문의를 먼저 막게 되고, 그 손해가 훨씬 크다.
  // 1시간 20회면 사람이 정상적으로 넘을 일은 없으면서 자동 반복은 확실히 걸린다.
  const limited = await checkRateLimit('inquiry', clientIp(req), { perMinute: 3, perHour: 20 })
  if (!limited.ok) {
    return NextResponse.json(
      { error: '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    )
  }

  const lead = parsed.value
  // 어떤 기기로 신청했는지 — 브라우저 정보로 판별해 메모 끝에 "기기: 모바일" 줄로 남긴다
  const noteWithDevice = [lead.note, deviceNoteLine(req.headers.get('user-agent') || '')]
    .filter(Boolean)
    .join('\n')
  const item = await inquiryStore.create({ ...lead, note: noteWithDevice })
  return NextResponse.json(item, { status: 201 })
}
