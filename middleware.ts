// 모든 페이지 요청보다 먼저 실행되는 미들웨어 (matcher 범위: 정적파일·API 제외).
// 하는 일은 둘 — 깨진 링크는 홈으로, 접은 경로는 지금 쓰는 경로로 보낸다.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 깨진 링크 안전장치:
// 마크다운 대괄호 등 잘못 붙은 문자([ ] ( ))가 URL 경로에 섞여 들어오면
// 404로 이탈시키지 않고 홈으로 보낸다. (예: weflowlab.kr/] → weflowlab.kr/)
const BROKEN = /[[\]()]/

/**
 * 접은 경로 → 지금 쓰는 경로 (영구 이동).
 *
 * /booking 은 메뉴에서 내리고 사이트맵에서도 뺐지만, 색인에서 빠진 건 아니라
 * 아직 네이버 검색으로 두 달에 10여 명이 들어온다. 그대로 두면 쓰지 않는 예약 폼을 만나고,
 * 혹시 넣어도 아무도 안 보는 자리에 쌓인다. 문의로 보내 준다.
 *
 * next.config 의 redirects 를 쓰지 않는 이유 — 그쪽은 308 만 내보낸다.
 * 자연검색 유입이 대부분 네이버라, 확실히 따라오는 301 로 직접 내보낸다.
 *
 * 되돌리려면 이 표에서 줄만 지우면 된다 (app/booking/page.tsx 는 그대로 둔다).
 * 단, 301 은 브라우저가 오래 기억하므로 되돌린 뒤에도 한동안 이동할 수 있다.
 */
const MOVED: Record<string, string> = {
  '/booking': '/diagnosis',
  // /reviews 는 메뉴에서 내린 뒤로 쓰지 않는데, 주소로는 열려서 두 달에 100명 넘게 들어왔다.
  // 후기가 한 건뿐인 채로 방치된 페이지를 보여 주느니, 성격이 가장 가까운 제작 사례로 보낸다.
  // 되살리려면 이 줄만 지우면 된다 (app/reviews/page.tsx 는 그대로 둔다).
  '/reviews': '/cases',
}

// 경로를 디코딩해 깨진 문자가 있는지 보고, 있으면 홈으로 보낸다
// 블로그 관리자(Payload) 테마 쿠키 — Payload 기본값은 쿠키가 없으면 기기의 다크 모드를 따라가는데,
// 첫 방문은 흰 화면으로 시작하게 하되 계정 페이지의 테마 선택(라이트/다크/자동)은 그대로 쓰게 한다 (선택하면 같은 쿠키를 덮어쓴다).
const PAYLOAD_THEME_COOKIE = 'payload-theme'

function blogAdminTheme(req: NextRequest) {
  if (req.cookies.has(PAYLOAD_THEME_COOKIE)) return NextResponse.next()
  // 이번 요청의 서버 렌더에도 light 가 반영되도록 요청 쿠키에 먼저 넣고, 응답에도 심는다
  req.cookies.set(PAYLOAD_THEME_COOKIE, 'light')
  const res = NextResponse.next({ request: req })
  res.cookies.set(PAYLOAD_THEME_COOKIE, 'light', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  return res
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/blogadmin' || pathname.startsWith('/blogadmin/')) return blogAdminTheme(req)
  let decoded = pathname
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    // 잘못된 인코딩도 깨진 링크로 간주
    const url = req.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (BROKEN.test(pathname) || BROKEN.test(decoded)) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // 끝 슬래시를 떼고 찾는다 — /booking 과 /booking/ 이 같은 줄에 걸리게
  const moved = MOVED[decoded.replace(/\/+$/, '') || '/']
  if (moved) {
    const url = req.nextUrl.clone()
    url.pathname = moved
    // search 는 그대로 둔다 — 위 깨진 링크와 달리 여기는 정상 유입이라,
    // utm·n_query 를 떼면 PageTracker 가 어디서 왔는지 못 남긴다
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// 정적 파일·API·내부 경로는 제외
export const config = {
  matcher: ['/((?!_next|api).*)'],
}
