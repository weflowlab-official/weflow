// 웹블로그 글 썸네일(① 사진형) 뽑기 — posts.json 의 문구를 photos/<slug>.png 위에 얹어 out/<slug>-1.png (2000×2000) 로 저장한다.
// 사진이 없는 글은 건너뛴다. 실행: PW_DIR=<playwright 가 설치된 폴더> node render.cjs [slug...]
// 색은 웹블로그 파랑(#1b4ea7 · #1f63d6)을 연하게 — 라벨·하단 띠 #6d9be6, 강조 글씨 #3d74d1.
const fs = require('fs')
const path = require('path')
const { chromium } = require(require.resolve('playwright', { paths: [process.env.PW_DIR || __dirname] }))

const DIR = __dirname
const posts = JSON.parse(fs.readFileSync(path.join(DIR, 'posts.json'), 'utf8'))
const only = process.argv.slice(2)
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(DIR, '../../public/logo.png')).toString('base64')

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function html(p, photo) {
  // 라벨 — 쉼표 뒤에서 두 줄로 ("병의원 홍보, / 고민이라면?")
  const label = p.label.includes(', ') ? p.label.replace(', ', ',<br>') : esc(p.label)
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=block">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 2000px; height: 2000px; font-family: 'Pretendard Variable', sans-serif; }
  .card { position: relative; width: 2000px; height: 2000px; overflow: hidden; background: url(${photo}) center / cover; }
  /* 글 쪽(왼쪽)을 살짝 밝혀 글씨가 사진에 묻히지 않게 */
  .card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.25) 45%, rgba(255,255,255,0) 68%); }
  /* 얇은 흰 테두리 — 시안처럼 하단 띠 위에서 끝난다 */
  .frame { position: absolute; left: 160px; right: 160px; top: 160px; bottom: 470px; border: 5px solid rgba(255,255,255,.95); }
  .label { position: absolute; left: 0; top: 380px; padding: 52px 120px 52px 160px; border-radius: 0 999px 999px 0; background: #6d9be6; color: #fff; font-size: 64px; font-weight: 600; line-height: 1.45; letter-spacing: -0.02em; }
  .sub { position: absolute; left: 160px; top: 760px; font-size: 136px; font-weight: 600; line-height: 1.25; letter-spacing: -0.04em; color: #111418; }
  .big { position: absolute; left: 150px; top: 1110px; font-weight: 900; letter-spacing: -0.05em; line-height: 1; color: #3d74d1; white-space: nowrap; text-shadow: 0 6px 24px rgba(255,255,255,.6); }
  .en { position: absolute; left: 170px; top: 1360px; font-family: 'Dancing Script', cursive; font-size: 118px; color: rgba(61,116,209,.55); white-space: nowrap; }
  .band { position: absolute; left: 0; right: 0; bottom: 0; height: 300px; display: flex; align-items: center; justify-content: center; gap: 34px; background: #6d9be6; color: #fff; }
  .band img { width: 104px; height: 104px; }
  .band b { font-size: 92px; font-weight: 800; letter-spacing: -0.02em; }
  .band span { font-size: 72px; font-weight: 600; opacity: .9; }
</style></head><body>
<div class="card">
  <div class="frame"></div>
  <div class="label">${label}</div>
  <div class="sub">${p.sub.map(esc).join('<br>')}</div>
  <div class="big" id="big">${esc(p.big)}</div>
  <div class="en">${esc(p.en)}</div>
  <div class="band"><img src="${logo}" alt=""><b>WEFLOW</b><span>웹블로그</span></div>
</div>
<script>
  // 강조 글씨 — 기본 260px, 테두리 오른쪽(1840px) 안에 들어갈 때까지 줄인다
  const el = document.getElementById('big'); let fs = 260
  el.style.fontSize = fs + 'px'
  while (el.getBoundingClientRect().right > 1800 && fs > 120) { fs -= 4; el.style.fontSize = fs + 'px' }
</script>
</body></html>`
}

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 2000, height: 2000 } })
  fs.mkdirSync(path.join(DIR, 'out'), { recursive: true })
  for (const p of posts) {
    if (only.length && !only.includes(p.slug)) continue
    const file = ['png', 'jpg', 'jpeg', 'webp'].map(e => path.join(DIR, 'photos', `${p.slug}.${e}`)).find(f => fs.existsSync(f))
    if (!file) continue
    const ext = path.extname(file).slice(1).replace('jpg', 'jpeg')
    const photo = `data:image/${ext};base64,` + fs.readFileSync(file).toString('base64')
    await page.setContent(html(p, photo), { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    // 글꼴이 늦게 들어오면 강조 글씨 폭이 바뀌므로 한 번 더 맞춘다
    await page.evaluate(() => { const el = document.getElementById('big'); let fs = 260; el.style.fontSize = fs + 'px'; while (el.getBoundingClientRect().right > 1800 && fs > 120) { fs -= 4; el.style.fontSize = fs + 'px' } })
    const out = path.join(DIR, 'out', `${p.slug}-1.png`)
    await page.screenshot({ path: out })
    console.log('saved', path.relative(DIR, out))
  }
  await browser.close()
})()
