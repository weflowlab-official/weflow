// 파일 위치에 따라 Tailwind 버전을 나눠 적용하는 PostCSS 플러그인.
//
// 사이트(styles/globals.css)는 Tailwind v3 로 만들어져 있고, /blog 웹블로그(blog/ 아래 CSS)는
// 모두의안과 웹블로그를 그대로 가져와 Tailwind v4 로 되어 있다. 두 버전은 문법이 달라
// 한쪽 플러그인이 다른 쪽 파일을 만나면 에러가 나므로, 파일 경로를 보고 하나만 돌린다.
//   - blog/ 아래 CSS            → @tailwindcss/postcss (v4)
//   - node_modules·Payload 관리자 → 손대지 않음
//   - 그 밖(사이트)              → tailwindcss (v3)
//
// postcss.config.js 에 이름(문자열)으로 넣어야 Next(webpack·Turbopack 모두)가 읽을 수 있어서
// package.json 의 file: 의존성으로 node_modules 에 연결해 둔다.
const path = require('path')
const postcss = require('postcss')

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'blog') + path.sep
const PAYLOAD_DIR = path.join(ROOT, 'app', '(payload)') + path.sep
const NODE_MODULES = path.sep + 'node_modules' + path.sep

let v3
let v4
const siteProcessor = () => (v3 ??= postcss([require('tailwindcss')()]))
const blogProcessor = () => (v4 ??= postcss([require('@tailwindcss/postcss')({ base: ROOT })]))

function pick(file) {
  if (!file) return siteProcessor()
  if (file.includes(NODE_MODULES) || file.startsWith(PAYLOAD_DIR)) return null
  if (file.startsWith(BLOG_DIR)) return blogProcessor()
  return siteProcessor()
}

module.exports = () => ({
  postcssPlugin: 'postcss-tailwind-split',
  async Once(root, { result }) {
    const file = root.source?.input?.file
    const processor = pick(file)
    if (!processor) return
    // 같은 root 를 그 자리에서 고친다. 감시 대상 파일 정보(dependency 메시지)는 바깥 결과로 넘겨야
    // 클래스를 고쳤을 때 개발 서버가 CSS 를 다시 만든다.
    const sub = await processor.process(root, { ...result.opts, from: file })
    if (sub.root !== root) {
      root.removeAll()
      root.append(sub.root.nodes)
    }
    result.messages.push(...sub.messages)
  },
})
module.exports.postcss = true
