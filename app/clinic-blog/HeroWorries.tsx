'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * 첫 화면의 '실시간 고민 대화' — 병원 단톡방에 메시지가 계속 올라오는 느낌을 낸다.
 *
 *  - 넓은 화면: 제목 둘레의 여섯 자리에서 각각 '입력 중…' → 메시지 등장 → 잠시 뒤 사라짐 을 반복한다.
 *    자리마다 시작 시각과 머무는 시간을 엇갈려, 늘 어딘가에서 말풍선이 오가게 한다.
 *    마우스를 움직이면 자리마다 다른 깊이로 살짝 따라 움직인다.
 *  - 좁은 화면(휴대폰·태블릿): 말풍선을 띄우지 않는다 — 제목과 버튼만으로 첫 화면을 깔끔하게 둔다 (궤도·모눈은 남긴다).
 *  - 모션 최소화: 처음 여섯 개를 움직임 없이 그대로 보여 준다.
 *
 * 메시지는 MESSAGES 를 차례로 돌려 쓴다 (자리들이 하나의 순번을 나눠 써서 같은 말이 동시에 두 번 뜨지 않는다).
 */

type Who = '원장님' | '실장님' | '환자'
const MESSAGES: { who: Who; text: string }[] = [
  { who: '원장님', text: '블로그 보고 왔다는 환자, 있었어요?' },
  { who: '실장님', text: '글은 매달 올라가고 있는데요…' },
  { who: '환자', text: '임플란트 잘하는 치과 어디야?' },
  { who: '원장님', text: '검색하면 우리 병원이 안 나와요' },
  { who: '실장님', text: '블로그 노출이 갑자기 빠졌대요' },
  { who: '원장님', text: '글 쓰는 데 매달 비용이 드는데…' },
  { who: '실장님', text: 'AI 검색엔 다른 병원만 나와요' },
  { who: '환자', text: '후기 글 보고 옆 병원 가 봤어' },
  { who: '원장님', text: '3년 쓴 블로그인데요?' },
  { who: '실장님', text: '이번 달도 예약 문의는 그대로예요' },
  { who: '원장님', text: '홈페이지랑 블로그가 따로 놀아요' },
  { who: '실장님', text: '키워드를 또 바꿔 봐야 할까요? 😥' },
]

/** 넓은 화면의 여섯 자리 — 깊이(z)가 클수록 마우스를 더 많이 따라 움직인다 */
const SLOT_DEPTH = [1, 0.6, 1.4, 0.8, 1.2, 0.7]

type Bubble = { id: number; msg: number; phase: 'typing' | 'shown' | 'out' }

/** 말풍선에 붙는 시각 — 방금 온 메시지처럼 지금 시각을 쓴다 */
function now() {
  const d = new Date()
  const h = d.getHours()
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`
}

function Message({ b }: { b: Bubble }) {
  const m = MESSAGES[b.msg]
  if (b.phase === 'typing')
    return (
      <div className="hw-bubble hw-typing" key={`t${b.id}`}>
        <i /><i /><i />
      </div>
    )
  return (
    <div className={`hw-bubble hw-${m.who === '원장님' ? 'dr' : m.who === '실장님' ? 'mg' : 'pt'} ${b.phase === 'out' ? 'is-out' : ''}`} key={`m${b.id}`}>
      <div className="hw-head">
        <span className="hw-avatar">{m.who === '원장님' ? '원장' : m.who === '실장님' ? '실장' : '환자'}</span>
        <b>{m.who}</b>
        <time>{now()}</time>
      </div>
      <p>{m.text}</p>
    </div>
  )
}

export default function HeroWorries() {
  const rootRef = useRef<HTMLDivElement>(null)
  const seq = useRef(0) // 다음에 쓸 메시지 순번 (자리들이 나눠 쓴다)
  const ids = useRef(0)
  const [mode, setMode] = useState<'wide' | 'narrow' | 'still' | null>(null)
  const [slots, setSlots] = useState<(Bubble | null)[]>(() => SLOT_DEPTH.map(() => null))

  // 어떤 모양으로 돌릴지 — 화면 폭과 모션 설정을 한 번 본다
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMode('still')
      setSlots(SLOT_DEPTH.map((_, i) => ({ id: i, msg: i, phase: 'shown' })))
      return
    }
    const mq = window.matchMedia('(min-width: 1100px)')
    const pick = () => setMode(mq.matches ? 'wide' : 'narrow')
    pick()
    mq.addEventListener('change', pick)
    return () => mq.removeEventListener('change', pick)
  }, [])

  // 넓은 화면 — 자리마다 '입력 중 → 등장 → 퇴장' 을 엇갈려 반복
  useEffect(() => {
    if (mode !== 'wide') return
    const timers: ReturnType<typeof setTimeout>[] = []
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms))
    const set = (i: number, b: Bubble | null) => setSlots(prev => prev.map((v, k) => (k === i ? b : v)))

    const run = (i: number) => {
      const id = ++ids.current
      const msg = seq.current++ % MESSAGES.length
      set(i, { id, msg, phase: 'typing' })
      later(() => set(i, { id, msg, phase: 'shown' }), 900)
      const stay = 3800 + ((i * 937) % 1600) // 자리마다 머무는 시간을 조금씩 다르게
      later(() => set(i, { id, msg, phase: 'out' }), 900 + stay)
      later(() => {
        set(i, null)
        later(() => run(i), 500)
      }, 900 + stay + 350)
    }
    SLOT_DEPTH.forEach((_, i) => later(() => run(i), 300 + i * 650))
    return () => timers.forEach(clearTimeout)
  }, [mode])

  // 마우스를 따라 움직이기 — 넓은 화면에서만.
  // 마우스 위치(목표)로 곧장 가지 않고 매 프레임 남은 거리의 8%씩 다가가, 반 박자 늦게 미끄러지듯 따라온다.
  // 목표에 거의 닿으면 프레임 돌리기를 멈춘다 (마우스가 가만히 있으면 아무 계산도 안 한다)
  useEffect(() => {
    if (mode !== 'wide') return
    const el = rootRef.current
    if (!el) return
    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    const tick = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.setProperty('--mx', cx.toFixed(4))
      el.style.setProperty('--my', cy.toFixed(4))
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [mode])

  return (
    <div ref={rootRef} className="hw" aria-hidden="true">
      {/* 옅은 모눈 — 가운데만 보이고 가장자리로 갈수록 사라진다 */}
      <div className="hw-grid" />

      {/* 태양계 궤도 — 제목 뒤 동심원 셋. 궤도마다 점 하나가 다른 속도로 돌고, 궤도 묶음은 마우스 반대로 살짝 움직인다 */}
      <div className="hw-orbits">
        <div className="hw-orbit hw-o1"><i /></div>
        <div className="hw-orbit hw-o2"><i /><i className="hw-dot-sm" /></div>
        <div className="hw-orbit hw-o3"><i /></div>
      </div>

      {/* 넓은 화면 — 제목 둘레의 여섯 자리 */}
      <div className="hw-slots">
        {slots.map((b, i) => (
          <div key={i} className={`hw-slot hw-s${i}`} style={{ '--z': SLOT_DEPTH[i] } as React.CSSProperties}>
            <div className="hw-float">{b && <Message b={b} />}</div>
          </div>
        ))}
      </div>

      <style>{`
        .hw { --mx: 0; --my: 0; }

        .hw-grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(#e2e7ee 1px, transparent 1px), linear-gradient(90deg, #e2e7ee 1px, transparent 1px); background-size: 88px 88px; background-position: center; -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 75%); mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 75%); }

        /* 궤도 — 가운데 기준 동심원. 바깥 궤도일수록 크고 느리게 돈다 */
        .hw-orbits { position: absolute; left: 50%; top: calc(50% - 16px); width: 0; height: 0; pointer-events: none; transform: translate3d(calc(var(--mx) * 16px), calc(var(--my) * 12px), 0); }
        .hw-orbit { position: absolute; left: 0; top: 0; border-radius: 50%; transform: translate(-50%, -50%); animation: hwSpin linear infinite; }
        .hw-o1 { width: min(560px, 78vw); height: min(560px, 78vw); border: 1px solid #e3e9f2; animation-duration: 40s; }
        .hw-o2 { width: min(860px, 120vw); height: min(860px, 120vw); border: 1px dashed #c9d8f0; animation-duration: 70s; animation-direction: reverse; }
        .hw-o3 { width: min(1180px, 165vw); height: min(1180px, 165vw); border: 1px solid #edf0f4; animation-duration: 110s; }
        /* 궤도 위의 점 — 원 꼭대기에 붙어 있고, 원이 돌면 같이 돈다 */
        .hw-orbit i { position: absolute; left: 50%; top: 0; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: #1f63d6; box-shadow: 0 0 0 6px rgba(31,99,214,.12); }
        .hw-o2 i.hw-dot-sm { top: auto; bottom: 0; width: 6px; height: 6px; margin: 0 0 -3px -3px; background: #7fb0f5; box-shadow: none; }
        .hw-o3 i { left: 0; top: 50%; margin: -4px 0 0 -4px; width: 8px; height: 8px; background: #9fc3f6; box-shadow: 0 0 0 5px rgba(159,195,246,.18); }
        @keyframes hwSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .hw-slots { position: absolute; inset: 0; max-width: 1440px; margin: 0 auto; pointer-events: none; }
        /* 말풍선 자리 — 깊이(--z)만큼 마우스 반대로 밀리고 살짝 기운다 (부드러운 따라옴은 스크립트가 맡는다) */
        .hw-slot { position: absolute; transform: translate3d(calc(var(--mx) * var(--z) * -44px), calc(var(--my) * var(--z) * -32px), 0) rotate(calc(var(--mx) * var(--z) * -2.5deg)); }
        .hw-s0 { top: 15%; left: 4%; }
        .hw-s1 { top: 13%; right: 5%; }
        .hw-s2 { top: 45%; left: 2%; }
        .hw-s3 { top: 48%; right: 2%; }
        .hw-s4 { bottom: 12%; left: 8%; }
        .hw-s5 { bottom: 10%; right: 7%; }
        /* 제목 양옆 가운데 두 자리는 화면이 아주 넓을 때만 — 그보다 좁으면 말풍선이 제목에 겹친다 */
        @media (max-width: 1399px) { .hw-s2, .hw-s3 { display: none; } }
        .hw-float { animation: hwFloat 6s ease-in-out infinite; }
        .hw-s1 .hw-float, .hw-s4 .hw-float { animation-duration: 7.5s; animation-delay: -2s; }
        .hw-s2 .hw-float, .hw-s5 .hw-float { animation-duration: 6.8s; animation-delay: -4s; }
        @keyframes hwFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        /* 말풍선 — 이름·시간이 붙은 메신저 모양. 오른쪽 자리는 꼬리를 오른쪽에 */
        .hw-bubble { width: max-content; max-width: 270px; background: #fff; border: 1px solid #e9ebef; border-radius: 20px; border-bottom-left-radius: 7px; padding: 11px 15px 13px; box-shadow: 0 16px 40px rgba(17,20,24,.08); text-align: left; animation: hwPop .55s cubic-bezier(.34,1.56,.64,1) both; transform-origin: 0 100%; }
        .hw-s1 .hw-bubble, .hw-s3 .hw-bubble, .hw-s5 .hw-bubble, .is-right .hw-bubble { border-bottom-left-radius: 20px; border-bottom-right-radius: 7px; transform-origin: 100% 100%; }
        .hw-bubble.is-out { animation: hwOut .35s ease-in both; }
        @keyframes hwPop { from { opacity: 0; transform: translateY(14px) scale(.7); } to { opacity: 1; transform: none; } }
        @keyframes hwOut { to { opacity: 0; transform: translateY(-10px) scale(.9); } }
        .hw-head { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; }
        .hw-avatar { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: .6rem; font-weight: 800; }
        .hw-dr .hw-avatar { background: #e6eefc; color: #1f63d6; }
        .hw-mg .hw-avatar { background: #eef0f3; color: #4b5360; }
        .hw-pt .hw-avatar { background: #def5ee; color: #0f8a6c; }
        .hw-head b { font-size: .82rem; color: #111418; }
        .hw-head time { font-size: .72rem; color: #9aa1ac; margin-left: auto; padding-left: 12px; }
        .hw-bubble p { margin: 0; font-size: 1rem; font-weight: 600; line-height: 1.45; color: #111418; letter-spacing: -0.01em; }
        .hw-typing { display: inline-flex; gap: 6px; padding: 14px 18px; }
        .hw-typing i { width: 8px; height: 8px; border-radius: 50%; background: #b4bac4; animation: hwDot 1s ease-in-out infinite; }
        .hw-typing i:nth-child(2) { animation-delay: .15s; }
        .hw-typing i:nth-child(3) { animation-delay: .3s; }
        @keyframes hwDot { 0%, 100% { transform: translateY(0); opacity: .5; } 50% { transform: translateY(-4px); opacity: 1; } }

        .hw-feed { display: none; }
        @media (max-width: 1099px) { .hw-slots { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .hw-float, .hw-bubble, .hw-typing i { animation: none; }
          .hw-orbit { animation: none; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  )
}
