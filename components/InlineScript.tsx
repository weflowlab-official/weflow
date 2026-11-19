'use client'

/**
 * 화면이 그려지기 전에 바로 실행돼야 하는 짧은 인라인 스크립트.
 *
 * 서버가 만든 HTML 에서는 평범한 스크립트(type="text/javascript")라 브라우저가 읽는 즉시 실행한다.
 * 브라우저에서 React 가 이 태그를 다시 그릴 때(개발 중 새로고침 없이 코드가 바뀔 때 등)는 type="text/plain" 으로 바꿔
 * "Encountered a script tag while rendering React component" 경고가 뜨지 않게 한다 — 어차피 그때는 실행되지 않는 태그다.
 * 서버와 브라우저의 type 이 달라지는 건 suppressHydrationWarning 으로 넘긴다.
 * Next.js 문서(node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md)의 InlineScript 그대로다.
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
