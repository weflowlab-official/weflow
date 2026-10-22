// tailwindcss 대신 postcss-tailwind-split 을 쓴다 — 사이트는 Tailwind v3, /blog 는 v4 로
// 파일 위치에 따라 나눠 처리한다 (postcss/tailwind-split/index.js).
module.exports = {
  plugins: {
    'postcss-tailwind-split': {},
    autoprefixer: {},
  },
}
