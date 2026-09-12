// 문의·예약 폼으로 들어온 값을 저장 전에 한 번 거르는 곳.
//
// 폼 화면에서도 검사하지만 그건 브라우저 안에서만 도는 것이라, 주소만 알면
// 그 검사를 통째로 건너뛰고 API 를 직접 부를 수 있다. 실제로 지켜지는 건 여기뿐이다.
//
// 원칙 하나 — 길면 자르고, 없으면 막는다.
// 글자 수가 넘쳤다고 문의를 반려하면 진짜 고객을 잃는다. 저장이 목적이므로 잘라서 받는다.
// 반대로 이름·연락처가 비었거나 개인정보 동의가 없으면 그건 받으면 안 되는 것이라 막는다.

/** 필드별 최대 글자 수 — 화면 입력칸이 쓰는 범위보다 넉넉하되 무한정은 아니게 */
const LIMITS = {
  name: 40,
  phone: 20,
  type: 40,
  industry: 40,
  note: 2000,
  source: 40,
} as const

/** 저장 직전 형태 — 모두 문자열로 다듬어진 상태 */
export interface LeadInput {
  name: string
  phone: string
  type: string
  industry: string
  note: string
  source: string
  agree: boolean
}

/**
 * 검사 결과 세 갈래.
 * - ok    : 저장해도 되는 값
 * - trap  : 허니팟에 걸림 → 저장하지 않되 성공한 척한다 (아래 설명)
 * - reject: 사람이 정상적으로 채웠다면 나올 수 없는 값
 */
export type LeadParse =
  | { kind: 'ok'; value: LeadInput }
  | { kind: 'trap' }
  | { kind: 'reject'; error: string }

/**
 * 접수가 실제로 저장됐는지 — 응답 본문에 문의 id 가 있는지로 가른다.
 *
 * 허니팟에 걸린 요청에도 성공(201)으로 답한다. 거절로 답하면 상대가 그 칸을 알아채고
 * 비워서 다시 오기 때문이다. 그래서 화면 쪽에서는 res.ok 만으로 저장 여부를 알 수 없다.
 *
 * 이걸 가려야 하는 이유 — 폼이 접수 성공 시 네이버·스마트로그에 전환을 쏜다.
 * 실제 브라우저를 띄워 자동 조작하는 봇이 오면 문의는 안 남는데 전환만 쌓여,
 * 광고 성과가 부풀려진 채로 집행 판단의 근거가 된다.
 *
 * 저장된 응답은 만들어진 문의 한 건을 그대로 돌려주므로 id 가 있고, 덫에 걸린 응답에는 없다.
 * 따로 표시를 넣지 않고 이 차이를 쓰는 이유는, 표시를 두면 그것부터 읽고 우회하기 때문이다.
 */
export function wasSaved(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false
  const id = (body as { id?: unknown }).id
  return typeof id === 'string' && id !== ''
}

/** 값이 무엇으로 오든 문자열로 만들어 앞뒤 공백을 떼고 정해진 길이에서 자른다 */
function clamp(v: unknown, max: number): string {
  if (v == null) return ''
  const s = typeof v === 'string' ? v : String(v)
  return s.trim().slice(0, max)
}

/**
 * 허니팟 — 화면에서 숨겨 둔 입력칸의 이름.
 * 사람 눈에 보이지 않으니 사람은 채울 수 없고, 양식을 기계적으로 훑는 도구는
 * 빈 칸을 보면 채우고 본다. 채워져 있으면 사람이 아니다.
 *
 * 이름을 고를 때 주의할 것 — company·organization·email 처럼 브라우저가 아는 이름을 쓰면
 * 자동완성이 대신 채워 넣는다. 그러면 덫에 걸리는 건 봇이 아니라 진짜 고객이다.
 * 자동완성 후보에 없는 이름을 쓰고, 입력칸에도 autoComplete="off" 를 건다.
 */
export const HONEYPOT_FIELD = 'contact_reference'

/**
 * 연락처에 숫자가 최소 몇 개는 있어야 한다.
 * 형식을 엄격하게 잡지 않는 이유 — 010-1234-5678, 01012345678, +82 10 …
 * 쓰시는 표기가 제각각이라 지나치게 조이면 멀쩡한 번호가 막힌다.
 */
function looksLikePhone(v: string): boolean {
  const digits = v.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15
}

/** 폼 본문 한 덩어리를 검사해 저장할 값으로 바꾼다 */
export function parseLead(body: unknown): LeadParse {
  if (typeof body !== 'object' || body === null) {
    return { kind: 'reject', error: '요청 형식이 잘못되었습니다.' }
  }
  const b = body as Record<string, unknown>

  // 허니팟이 먼저다 — 걸렸으면 나머지를 볼 이유가 없다
  if (clamp(b[HONEYPOT_FIELD], 200) !== '') return { kind: 'trap' }

  const name = clamp(b.name, LIMITS.name)
  const phone = clamp(b.phone, LIMITS.phone)
  const type = clamp(b.type, LIMITS.type)

  if (!name || !phone || !type) {
    return { kind: 'reject', error: '필수 항목이 누락되었습니다.' }
  }
  if (!looksLikePhone(phone)) {
    return { kind: 'reject', error: '연락처를 다시 확인해 주세요.' }
  }

  // 개인정보 동의는 수집의 전제조건이다. 화면에서 체크를 받고 있어도 서버가 확인하지
  // 않으면 동의 없는 기록이 DB 에 남을 수 있고, 그건 /privacy 에 적어 둔 방침과도 어긋난다.
  if (b.agree !== true) {
    return { kind: 'reject', error: '개인정보 수집·이용에 동의해 주세요.' }
  }

  return {
    kind: 'ok',
    value: {
      name,
      phone,
      type,
      industry: clamp(b.industry, LIMITS.industry),
      note: clamp(b.note, LIMITS.note),
      source: clamp(b.source, LIMITS.source) || 'web',
      agree: true,
    },
  }
}
