/**
 * 연락처 표기 — 입력칸과 서버 검사가 같은 기준을 쓰도록 한곳에 둔다.
 *
 * 화면과 서버가 따로 판단하면, 화면은 통과시키고 서버는 거절하는 번호가 생긴다.
 * 그러면 고객에게는 이유 없이 "전송에 실패했어요" 만 보인다. (2026-09-16 에 실제로 겪었다)
 */

/**
 * 입력하는 대로 하이픈을 넣어 준다 — 010-1234-5678.
 *
 * 휴대폰 한 가지 형식만 다룬다. 지역번호·대표번호까지 받으려고 자릿수별로 나누면
 * 333-333-33, 9999-9999998 처럼 엉뚱하게 끊기는 경우를 계속 만나게 된다.
 * 상담 신청에 적는 번호는 사실상 휴대폰이라, 규칙 하나로 두는 편이 안 깨진다.
 */
export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

/** 입력칸에서 쓰는 검사 — 휴대폰 열한 자리 */
export function isMobilePhone(v: string): boolean {
  return v.replace(/\D/g, '').length === 11
}

/**
 * 서버에서 쓰는 검사 — 화면보다 느슨하게 둔다.
 *
 * 입력칸이 휴대폰만 받더라도 여기까지 조이지는 않는다. 지역번호로 남기는 사업자나
 * 국제번호가 API 로 들어오는 경우까지 막으면, 받을 수 있었던 문의를 버리게 된다.
 * 저장이 목적이므로 사람이 정상적으로 채웠다면 나올 수 없는 값만 거른다.
 */
export function looksLikePhone(v: string): boolean {
  const digits = v.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}
