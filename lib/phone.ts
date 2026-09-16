/**
 * 연락처 표기 — 입력칸과 서버 검사가 같은 기준을 쓰도록 한곳에 둔다.
 *
 * 화면과 서버가 따로 판단하면, 화면은 통과시키고 서버는 거절하는 번호가 생긴다.
 * 그러면 고객에게는 이유 없이 "전송에 실패했어요" 만 보인다. (2026-09-16 에 실제로 겪었다)
 */

/**
 * 저장해도 되는 번호인지 — 숫자 개수만 본다.
 *
 * 형식을 엄격하게 잡지 않는 이유: 010-1234-5678, 01012345678, +82 10 …
 * 쓰시는 표기가 제각각이라 지나치게 조이면 멀쩡한 번호가 막힌다.
 */
export function looksLikePhone(v: string): boolean {
  const digits = v.replace(/\D/g, '')
  // 7자리부터 받는다. 지역번호를 빼고 적는 시내번호(123-4567)가 일곱 자리고,
  // 대표번호(1588-1234)가 여덟 자리다. 조이면 진짜 고객이 막힌다.
  return digits.length >= 7 && digits.length <= 15
}

/**
 * 입력하는 대로 하이픈을 넣어 준다. 010-1234-5678 처럼.
 *
 * 자릿수에 따라 나누는 자리가 다르다 — 휴대폰(3-4-4), 지역번호 02(2-3-4 또는 2-4-4),
 * 나머지 지역번호(3-3-4 또는 3-4-4). 입력 중에는 아직 자릿수가 모자라므로
 * 그때그때 들어온 만큼만 끊는다.
 *
 * 국제번호(+로 시작)는 건드리지 않는다. 나라마다 자리 나누는 법이 달라
 * 한국식으로 끊으면 오히려 틀린 모양이 된다.
 */
export function formatPhone(v: string): string {
  if (v.trim().startsWith('+')) return v.replace(/[^\d+\s-]/g, '').slice(0, 20)

  const d = v.replace(/\D/g, '').slice(0, 11)

  // 0 으로 시작하지 않으면 지역번호가 없는 번호다 —
  // 대표번호(1588-1234)거나 지역번호를 빼고 적은 시내번호(123-4567).
  // 여기에 지역번호 규칙(3-3-4)을 대면 333-333-33 처럼 깨진다.
  if (!d.startsWith('0')) {
    if (d.length <= 4) return d
    return `${d.slice(0, d.length <= 7 ? 3 : 4)}-${d.slice(d.length <= 7 ? 3 : 4)}`
  }

  // 서울만 지역번호가 두 자리다
  if (d.startsWith('02')) {
    if (d.length <= 2) return d
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`
  }

  // 휴대폰(010)과 나머지 지역번호는 셋 다 세 자리로 시작한다
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`
}
