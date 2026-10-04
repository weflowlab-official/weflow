/**
 * 본문 글꼴 중 가장 많이 쓰는 굵기 둘을 미리 받아 두게 한다 — 글꼴 자체는 globals.css 의 @font-face 가 선언한다.
 *
 * 미리 받지 않으면 브라우저는 CSS 를 다 읽고 그 굵기의 글자를 만난 뒤에야 받기 시작해,
 * 시스템 글꼴로 먼저 그렸다가 바꿔 끼우는 순간이 늦어진다.
 * 여섯 굵기를 전부 미리 받으면 첫 화면의 영상·사진과 다투므로, 제목(700)과 본문 강조(600)만 당긴다.
 * (글꼴이 오기 전에는 font-display: swap 으로 시스템 글꼴이 바로 보인다)
 */
export default function FontLoader() {
  return (
    <>
      {[600, 700].map(w => (
        <link
          key={w}
          rel="preload"
          as="font"
          type="font/woff2"
          href={`/fonts/WeflowSans-${w}.woff2`}
          crossOrigin="anonymous"
        />
      ))}
    </>
  )
}
