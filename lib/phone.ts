/**
 * 연락처 표기 — 입력칸과 서버 검사가 같은 기준을 쓰도록 한곳에 둔다.
 *
 * 화면과 서버가 따로 판단하면, 화면은 통과시키고 서버는 거절하는 번호가 생긴다.
 * 그러면 고객에게는 이유 없이 "전송에 실패했어요" 만 보인다. (2026-09-16 에 실제로 겪었다)
 */

/**
 * 입력하는 대로 하이픈을 넣어 준다.
 *
 * 한국 번호는 지역번호 자리 수로 두 갈래다 — 서울(02)만 두 자리, 나머지는 세 자리.
 * 가운데 토막이 셋이냐 넷이냐는 전체 길이로 갈린다.
 *
 *   02-111-2222    02-1111-2222
 *   031-111-2222   010-1234-5678
 *
 * 02 로 시작하는 것만 두 자리로 끊고, 나머지는 0 으로 시작하든 아니든 똑같이 센다.
 * 앞자리로 한국 번호인지 따지지 않는다 — 따지면 하이픈이 아예 안 붙는 번호가 생긴다.
 */
export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)

  if (d.startsWith('02')) {
    if (d.length <= 2) return d
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`
  }

  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`
}

/** 입력칸에서 쓰는 검사 — 숫자 아홉 자리 이상이면 받는다 (입력은 열한 자리에서 끊긴다) */
export function isValidPhone(v: string): boolean {
  return v.replace(/\D/g, '').length >= 9
}

/**
 * 서버에서 쓰는 검사 — 화면보다 느슨하게 둔다.
 *
 * 입력칸이 한국 번호만 받더라도 여기까지 조이지는 않는다. 국제번호나 대표번호가
 * API 로 들어오는 경우까지 막으면, 받을 수 있었던 문의를 버리게 된다.
 * 저장이 목적이므로 사람이 정상적으로 채웠다면 나올 수 없는 값만 거른다.
 */
export function looksLikePhone(v: string): boolean {
  const digits = v.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}
