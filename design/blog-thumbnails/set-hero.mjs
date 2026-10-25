// 웹블로그 메인 히어로 제목·문구를 바꾼다 — Payload REST API(/api/blog/globals/home), 관리자 계정으로 로그인해서.
// 처음 글을 넣을 때 문구가 DB 에 저장돼 있어 코드 기본값(blog/lib/homeDefaults.ts)만 바꿔서는 화면이 안 바뀐다.
// 문구는 기본값과 같게 맞춘다. 메인 페이지 글로벌에 임시저장(drafts)이 켜져 있어 발행 상태(_status)를 함께 보낸다.
//
// 실행: BLOG_URL=https://weflowlab.kr BLOG_EMAIL=... BLOG_PASSWORD='...' node design/blog-thumbnails/set-hero.mjs
const BASE = (process.env.BLOG_URL || 'http://localhost:3000').replace(/\/$/, '')
const API = `${BASE}/api/blog`
const HERO_TITLE = '웹블로그, 생소하시죠?\n경쟁업체보다 먼저 검색되는 방법'
const HERO_TEXT = '우리 홈페이지 안에 쌓이는 블로그. 글 하나만 올려도 네이버·구글 검색과 AI 답변에 맞춰집니다.'

if (!process.env.BLOG_EMAIL || !process.env.BLOG_PASSWORD) {
  console.error('BLOG_EMAIL · BLOG_PASSWORD 가 필요합니다 (웹블로그 관리자 계정)')
  process.exit(1)
}

const call = async (method, url, body, token) => {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: body && JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : {}
}

;(async () => {
  const { token } = await call('POST', '/users/login', { email: process.env.BLOG_EMAIL, password: process.env.BLOG_PASSWORD })
  await call('POST', '/globals/home', { heroTitle: HERO_TITLE, heroText: HERO_TEXT, _status: 'published' }, token)
  console.log(`✓ ${BASE} 웹블로그 히어로 문구를 바꿨습니다`)
})().catch(e => { console.error(e.message); process.exit(1) })
