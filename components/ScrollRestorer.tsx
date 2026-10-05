'use client'
import { useEffect } from 'react'

/**
 * 뒤로 가기·앞으로 가기 때 보고 있던 자리로 되돌린다.
 *
 * 이 사이트는 브라우저의 스크롤 복원을 꺼 두었다 (app/layout.tsx — 새로고침하면 늘 맨 위에서 시작하게).
 * 그 바람에 카드나 버튼을 눌러 다른 페이지에 갔다가 뒤로 오면, 보던 자리가 아니라 맨 위로 돌아왔다.
 * 여기서는 '뒤로·앞으로'일 때만 직접 되돌린다 — 새로고침과 보통의 링크 이동은 그대로 맨 위에서 시작한다.
 *
 * 방법: 주소마다 마지막 스크롤 위치를 적어 두었다가, 그 주소로 뒤로·앞으로 돌아오면 그 위치로 옮긴다.
 * 적어 두는 곳은 메모리다 — 페이지 사이를 오가는 동안에는 화면이 통째로 다시 뜨지 않으므로 남아 있고,
 * 새로고침하면 사라진다 (그때는 되돌리지 않는 게 맞다). 저장소가 막힌 인앱 브라우저에서도 그대로 돈다.
 *
 * 화면에 그리는 것은 없다.
 */

/** 주소(경로 + 쿼리) → 마지막 스크롤 위치 */
const positions = new Map<string, number>()
const here = () => window.location.pathname + window.location.search

/** 되돌린 뒤에도 이 시간 동안은 위치를 붙잡아 둔다 — 그 사이 이전 페이지가 그려지며 높이가 바뀐다 */
const HOLD_MS = 1200

export default function ScrollRestorer() {
  useEffect(() => {
    let saveTimer: ReturnType<typeof setTimeout> | undefined
    let raf = 0
    // 되돌리는 중에는 적지 않는다 — 페이지가 바뀌며 생기는 스크롤(높이가 줄어 밀려 올라가는 것 등)이
    // 방금 읽어 온 위치를 덮어쓰면 안 된다
    let restoring = false

    const onScroll = () => {
      if (restoring) return
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        if (!restoring) positions.set(here(), window.scrollY)
      }, 100)
    }

    const stopRestoring = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      restoring = false
    }

    // 뒤로·앞으로 — 주소는 이미 돌아갈 곳으로 바뀌어 있다. 그 주소에 적어 둔 위치를 읽어 옮긴다.
    // 이전 페이지가 아직 다 안 그려졌을 수 있으므로(높이가 모자라면 그 위치까지 못 간다),
    // 잠깐 동안 프레임마다 다시 맞춘다. 그 사이 방문자가 직접 움직이면 바로 손을 뗀다.
    const onPop = () => {
      clearTimeout(saveTimer)
      stopRestoring()
      const y = positions.get(here())
      if (!y || y < 1) return
      restoring = true
      const until = performance.now() + HOLD_MS
      const step = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (max >= y - 2 && Math.abs(window.scrollY - y) > 2) {
          // html 에 부드러운 스크롤이 걸려 있어, 'instant' 를 주지 않으면 맨 위에서부터 훑어 내려간다
          window.scrollTo({ top: y, behavior: 'instant' })
        }
        if (performance.now() < until) raf = requestAnimationFrame(step)
        else stopRestoring()
      }
      raf = requestAnimationFrame(step)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('popstate', onPop)
    // 방문자가 직접 움직이기 시작하면 붙잡기를 그만둔다
    window.addEventListener('wheel', stopRestoring, { passive: true })
    window.addEventListener('touchstart', stopRestoring, { passive: true })
    window.addEventListener('keydown', stopRestoring)
    return () => {
      clearTimeout(saveTimer)
      stopRestoring()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('wheel', stopRestoring)
      window.removeEventListener('touchstart', stopRestoring)
      window.removeEventListener('keydown', stopRestoring)
    }
  }, [])

  return null
}
