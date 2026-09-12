// 봇 거르개 — 사람에게는 보이지 않고 자동화 도구에게만 보이는 입력칸.
//
// 양식을 기계적으로 채우는 도구는 빈 칸을 찾으면 일단 채우고 본다.
// 그래서 이 칸에 값이 들어온 요청은 사람이 아니라고 보고 서버에서 버린다.
// (판정은 lib/leadInput.ts 에서 한다 — 화면은 칸을 놓기만 한다)
//
// 숨기는 방법에 조건이 몇 개 있다:
// - type="hidden" 이나 display:none 은 쓰지 않는다. 도구들이 그런 칸은 건너뛰는 경우가 많아
//   덫 구실을 못 한다. 화면 밖으로 밀어내 "있지만 안 보이게" 둔다.
// - autoComplete="off" 와 자동완성이 모르는 이름을 쓴다. 브라우저가 대신 채워 버리면
//   걸리는 건 봇이 아니라 진짜 고객이다.
// - aria-hidden 과 tabIndex={-1} 로 화면 낭독기와 탭 이동에서 뺀다.
//   눈으로 못 보는 칸이 낭독되거나 탭에 걸리면 그건 그것대로 사고다.
'use client'
import { HONEYPOT_FIELD } from '@/lib/leadInput'

export default function HoneypotField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        overflow: 'hidden',
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>이 칸은 비워 두세요</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        autoComplete="off"
        tabIndex={-1}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
