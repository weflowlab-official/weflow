/**
 * 병의원 웹블로그 페이지의 바탕 — 색 변수 · 본문 폭 · 줄바꿈 도우미.
 * 본 페이지(page.tsx)와 404(not-found.tsx)가 같이 쓴다.
 */
export const CLINIC_BASE_CSS = `
        .cb {
          --cb-text: #111418;
          --cb-sub: #4b5360;
          --cb-muted: #8a919c;
          --cb-line: #e9ebef;
          --cb-soft: #f7f8fa;
          --cb-accent: #1f63d6;
          --cb-bubble-me: #1f63d6;
          --cb-bubble-you: #f1f3f6;
          background: #fff;
          color: var(--cb-text);
          min-height: 100vh;
        }
        .cb-wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
        .cb-pc { display: none; }
        @media (min-width: 768px) { .cb-pc { display: inline; } }
        /* 휴대폰에서만 줄을 바꾸는 자리 */
        @media (min-width: 768px) { .cb-mo { display: none; } }
`
