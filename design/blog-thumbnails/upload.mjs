// 뽑은 이미지(out/)를 웹블로그 글에 붙인다 — Payload REST API(/api/blog)로 미디어를 올리고 글을 고친다.
//  · 썸네일(thumbnail): 그 글의 ① <slug>-1.png
//  · 상단 이미지 슬라이드(images): ① → ② common-2 → ③ common-3
// 공통 ②·③은 한 번만 올려 모든 글이 같이 쓴다 (이미 올라가 있으면 그것을 쓴다. 카드를 새로 바꿨으면 FRESH=1). 이미 붙어 있는 썸네일·슬라이드는 이것으로 바뀐다.
//
// DB 에 직접 붙지 않고 배포된 사이트(또는 로컬 dev 서버)의 API 를 거친다 — 관리자 계정으로 로그인해서 쓴다.
// 올리기 전에 2000px PNG 를 1600px WebP 로 줄인다 (Vercel 함수 요청 크기 4.5MB 제한 안으로. Payload 가 다시 WebP 로 만든다).
//
// 실행 (로컬에서 먼저 확인 → 운영):
//   BLOG_URL=http://localhost:3000 BLOG_EMAIL=... BLOG_PASSWORD=... node design/blog-thumbnails/upload.mjs
//   BLOG_URL=https://weflowlab.kr  BLOG_EMAIL=... BLOG_PASSWORD=... node design/blog-thumbnails/upload.mjs
// 일부 글만: 뒤에 slug 를 붙인다. DRY=1 이면 무엇을 할지 출력만 하고 올리지 않는다.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const DIR = path.dirname(fileURLToPath(import.meta.url))
const BASE = (process.env.BLOG_URL || 'http://localhost:3000').replace(/\/$/, '')
const API = `${BASE}/api/blog`
const DRY = process.env.DRY === '1'
const only = process.argv.slice(2)
const posts = JSON.parse(fs.readFileSync(path.join(DIR, 'posts.json'), 'utf8'))

if (!DRY && (!process.env.BLOG_EMAIL || !process.env.BLOG_PASSWORD)) {
  console.error('BLOG_EMAIL · BLOG_PASSWORD 가 필요합니다 (웹블로그 관리자 계정)')
  process.exit(1)
}

let token = ''
async function api(method, url, body, isForm = false) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { ...(token ? { Authorization: `JWT ${token}` } : {}), ...(isForm ? {} : { 'Content-Type': 'application/json' }) },
    body: isForm ? body : body && JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : {}
}

async function upload(file, alt) {
  const webp = await sharp(path.join(DIR, 'out', file)).resize(1600).webp({ quality: 88 }).toBuffer()
  const form = new FormData()
  form.append('file', new Blob([webp], { type: 'image/webp' }), file.replace(/\.png$/, '.webp'))
  form.append('_payload', JSON.stringify({ alt }))
  const { doc } = await api('POST', '/media', form, true)
  console.log(`  올림 ${file} → media ${doc.id}`)
  return doc.id
}

// 공통 ②·③ 카드 — 같은 alt 의 미디어가 이미 있으면 다시 올리지 않고 그것을 쓴다 (돌릴 때마다 같은 그림이 쌓이지 않게).
// 카드 그림을 새로 바꿨다면 FRESH=1 로 돌려 새로 올린다.
async function uploadOnce(file, alt) {
  if (process.env.FRESH !== '1') {
    const found = await api('GET', `/media?where[alt][equals]=${encodeURIComponent(alt)}&sort=-createdAt&limit=1&depth=0`)
    const id = found.docs?.[0]?.id
    if (id) { console.log(`  있음 ${file} → media ${id} (다시 올리지 않음)`); return id }
  }
  return upload(file, alt)
}

;(async () => {
  console.log(`대상: ${API}${DRY ? ' (DRY — 올리지 않음)' : ''}`)
  if (!DRY) {
    const login = await api('POST', '/users/login', { email: process.env.BLOG_EMAIL, password: process.env.BLOG_PASSWORD })
    token = login.token
  }

  const targets = posts.filter(p => !only.length || only.includes(p.slug))
  for (const p of targets) if (!fs.existsSync(path.join(DIR, 'out', `${p.slug}-1.png`))) throw new Error(`out/${p.slug}-1.png 가 없습니다`)

  const c2 = DRY ? 'common-2' : await uploadOnce('common-2.png', '웹블로그가 필요한 이유 — SEO 검색 노출 · AI 답변 인용 · 최신 기술과 보안 · 바로 상담 연결')
  const c3 = DRY ? 'common-3' : await uploadOnce('common-3.png', 'WEFLOW 웹블로그 상담 안내 — Tel. 010-2971-7280')

  for (const p of targets) {
    const found = DRY ? { docs: [{ id: '?' }] } : await api('GET', `/posts?where[slug][equals]=${encodeURIComponent(p.slug)}&depth=0&limit=1`)
    const post = found.docs?.[0]
    if (!post) { console.log(`✗ ${p.slug} — 글이 없어 건너뜀`); continue }
    if (DRY) { console.log(`· ${p.slug} — 썸네일 ${p.slug}-1 · 슬라이드 [${p.slug}-1, ${c2}, ${c3}]`); continue }
    const thumb = await upload(`${p.slug}-1.png`, `${p.big} — ${p.sub.join(' ')}`)
    // 발행 상태를 그대로 두려고 _status 를 함께 보낸다 (글에 임시저장(drafts)이 켜져 있다)
    await api('PATCH', `/posts/${post.id}`, { thumbnail: thumb, images: [{ image: thumb }, { image: c2 }, { image: c3 }], _status: 'published' })
    console.log(`✓ ${p.slug} (post ${post.id})`)
  }
  console.log('끝')
})().catch(e => { console.error(e.message); process.exit(1) })
