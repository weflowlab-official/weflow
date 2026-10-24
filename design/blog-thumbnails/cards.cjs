// 웹블로그 글 카드 뽑기 — ② 핵심 4가지(out/common-2.png) · ③ 상담 안내(out/common-3.png). 모든 글이 같은 두 장을 쓴다. 2000×2000.
// 배경은 모든 글이 같은 사진 한 장(photos/common.*)을 흐리게 깔고, 그 위에 반투명 흰 판을 얹어 글을 넣는다.
// 파랑은 웹블로그 색을 연하게 — 라벨 알약 #6d9be6(① 라벨·띠와 같은 색), 글자 강조 #2f66c4.
// 실행: PW_DIR=<playwright 가 설치된 폴더> node cards.cjs
const fs = require('fs')
const path = require('path')
const { chromium } = require(require.resolve('playwright', { paths: [process.env.PW_DIR || __dirname] }))

const DIR = __dirname
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// 아이콘 — 검색 · AI 반짝이 · 방패 · 말풍선 (lucide 모양)
const ICONS = [
  '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
  '<path d="M12 2.5c.55 5.1 4.4 8.95 9.5 9.5-5.1.55-8.95 4.4-9.5 9.5-.55-5.1-4.4-8.95-9.5-9.5 5.1-.55 8.95-4.4 9.5-9.5z"/>',
  '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
]

const page = (photo, body, extraCss = '') => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 2000px; height: 2000px; font-family: 'Pretendard Variable', sans-serif; color: #111418; }
  .card { position: relative; width: 2000px; height: 2000px; overflow: hidden; }
  /* 배경 — 공통 사진을 살짝만 흐려 분위기는 남기고 글은 잘 읽히게 */
  .bg { position: absolute; inset: -80px; background: url(${photo}) center / cover; filter: blur(14px) saturate(1.1); }
  .card::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,.28); }
  .in { position: absolute; inset: 0; z-index: 1; }
  .tag { position: absolute; top: 170px; left: 50%; transform: translateX(-50%); padding: 16px 46px; border-radius: 999px; background: #6d9be6; color: #fff; font-size: 46px; font-weight: 700; white-space: nowrap; }
  .title { position: absolute; left: 140px; right: 140px; text-align: center; font-weight: 800; letter-spacing: -0.045em; line-height: 1.2; }
  .title span { display: block; white-space: nowrap; }
  .panel { position: absolute; left: 140px; right: 140px; bottom: 150px; border-radius: 64px; background: rgba(255,255,255,.84); box-shadow: 0 40px 100px rgba(40,60,100,.14); }
  ${extraCss}
</style></head><body><div class="card"><div class="bg"></div><div class="in">${body}</div></div>
<script>
  // 큰 제목 — 줄마다 기본 크기에서 1720px 안에 들어갈 때까지 줄인다
  function fit() { document.querySelectorAll('.title span').forEach(el => { let fs = +el.dataset.fs || 140; el.style.fontSize = fs + 'px'; while (el.scrollWidth > 1720 && fs > 90) { fs -= 4; el.style.fontSize = fs + 'px' } }) }
  fit()
</script></body></html>`

// ② 핵심 4가지 — 모든 글이 같은 카드 한 장. 김이태안과 장비 카드처럼 원 안에 사진(photos/point-1~4.png) 네 개를 가로로
const POINTS = [
  ['SEO 검색 노출', '손님이 검색하는 말로'],
  ['AI 답변 인용', 'AI가 우리 글을 출처로'],
  ['최신 기술 · 보안', 'PHP 없이 Next.js로'],
  ['바로 상담 연결', '읽던 글에서 바로 문의'],
]
const PILLS = ['#a9c6f2', '#86aeee', '#5f92e3', '#3d74d1'] // 01 → 04 로 갈수록 진하게 (시안의 초록 단계처럼)
const pointPhoto = n => {
  const f = path.join(DIR, 'photos', `point-${n}.png`)
  return 'data:image/png;base64,' + fs.readFileSync(f).toString('base64')
}

function card2(photo) {
  // 한 줄 설명을 제목 글자 아래 끝과 판 위 끝 사이 정가운데에 둔다 — 아래 fit() 뒤에 실제 글자 위치로 다시 맞춘다
  const centerLead = `<script>
    window.centerLead = () => {
      const t = document.querySelector('.title span'), l = document.querySelector('.lead'), pn = document.querySelector('.panel')
      const r = document.createRange(); r.selectNodeContents(t); const tb = r.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(t).fontSize) * 0.12)
      const gap = pn.getBoundingClientRect().top - tb, h = l.getBoundingClientRect().height
      l.style.top = (tb + (gap - h) / 2) + 'px'
    }
  </script>`
  const cells = POINTS.map(([t, d], i) => `
    <div class="pt">
      <span class="ph" style="background-image:url(${pointPhoto(i + 1)})"></span>
      <span class="pill" style="background:${PILLS[i]}">Point 0${i + 1}</span>
      <b>${esc(t)}</b>
      <p class="d">${esc(d)}</p>
    </div>`).join('')
  return page(photo, `
    <span class="tag">WEFLOW 웹블로그</span>
    <h1 class="title" style="top: 310px"><span data-fs="150">웹블로그가 필요한 이유</span></h1>
    <p class="lead">글 하나로 검색부터 상담까지</p>
    <div class="panel" style="top: 690px; bottom: 190px; left: 60px; right: 60px"><div class="grid">${cells}</div></div>${centerLead}`, `
    .lead { position: absolute; top: 540px; line-height: 1; left: 0; right: 0; text-align: center; font-size: 54px; font-weight: 600; color: #3a4a66; letter-spacing: -0.03em; }
    .grid { position: absolute; inset: 0 40px; display: grid; grid-template-columns: repeat(4, 1fr); align-content: center; }
    .pt { display: flex; flex-direction: column; align-items: center; text-align: center; }
    /* 사진 원 — 가는 파란 테두리 */
    .ph { width: 400px; height: 400px; border-radius: 50%; border: 3px solid #6d9be6; background-size: cover; background-position: center; box-shadow: 0 20px 50px rgba(47,102,196,.15); }
    .pill { margin-top: 50px; padding: 12px 40px; border-radius: 999px; color: #fff; font-size: 40px; font-weight: 700; }
    .pt b { margin-top: 32px; font-size: 56px; font-weight: 800; letter-spacing: -0.04em; white-space: nowrap; }
    .pt .d { margin-top: 14px; font-size: 40px; font-weight: 500; color: #4b5360; letter-spacing: -0.03em; white-space: nowrap; }`)
}

function card3(photo) {
  const rows = [['상담', '24시간 문의 가능'], ['견적', '맞춤 견적 무료'], ['구성', '웹블로그 · 홈페이지 · 함께']]
  // 알약 · 제목 · 판을 한 묶음으로 화면 세로 가운데에 — 판은 내용 크기만큼만
  return page(photo, `
    <div class="stack">
      <span class="tag2">WEFLOW 웹블로그</span>
      <h1 class="t3">웹블로그 상담 안내</h1>
      <div class="box">
        <p class="addr">weflowlab.kr/blog</p>
        <p class="tel">Tel. 010-2971-7280</p>
        <div class="rows">${rows.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
      </div>
    </div>`, `
    .stack { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .tag2 { padding: 16px 46px; border-radius: 999px; background: #6d9be6; color: #fff; font-size: 46px; font-weight: 700; }
    .t3 { margin-top: 50px; font-size: 150px; font-weight: 800; letter-spacing: -0.045em; line-height: 1.1; }
    .box { margin-top: 90px; width: 1720px; padding: 84px 140px 80px; border-radius: 64px; background: rgba(255,255,255,.86); box-shadow: 0 40px 100px rgba(40,60,100,.14); text-align: center; }
    .addr { font-size: 54px; font-weight: 600; color: #4b5360; }
    .addr { line-height: 1.2; }
    .tel { margin-top: 40px; font-size: 132px; font-weight: 800; letter-spacing: -0.03em; color: #2f66c4; line-height: 1; }
    .rows { margin-top: 60px; text-align: left; }
    .rows div { display: grid; grid-template-columns: 260px 1fr; padding: 40px 10px; font-size: 64px; border-top: 2px solid rgba(47,102,196,.14); }
    .rows div:last-child { border-bottom: 2px solid rgba(47,102,196,.14); }
    .rows b { font-weight: 800; color: #2f66c4; }
    .rows span { font-weight: 600; }`)
}

;(async () => {
  const file = ['png', 'jpg', 'jpeg', 'webp'].map(e => path.join(DIR, 'photos', `common.${e}`)).find(f => fs.existsSync(f))
  if (!file) throw new Error('photos/common.(png|jpg|webp) 배경 사진이 없습니다')
  const ext = path.extname(file).slice(1).replace('jpg', 'jpeg')
  const photo = `data:image/${ext};base64,` + fs.readFileSync(file).toString('base64')
  const browser = await chromium.launch()
  const pg = await browser.newPage({ viewport: { width: 2000, height: 2000 } })
  fs.mkdirSync(path.join(DIR, 'out'), { recursive: true })
  const shot = async (html, name) => {
    await pg.setContent(html, { waitUntil: 'networkidle' })
    await pg.evaluate(() => document.fonts.ready)
    await pg.evaluate(() => { fit(); if (document.querySelector('.lead')) centerLead() }) // 글꼴이 들어온 뒤 제목 폭·한 줄 설명 위치를 다시 맞춘다
    await pg.screenshot({ path: path.join(DIR, 'out', name) })
    console.log('saved out/' + name)
  }
  await shot(card2(photo), 'common-2.png')
  await shot(card3(photo), 'common-3.png')
  await browser.close()
})()
