// /robots.txt 를 만들어 주는 파일 (빌드 시 생성).
// 검색엔진 크롤러에게 수집 허용 범위와 사이트맵 위치를 알린다.
import type { MetadataRoute } from 'next'

const BASE = 'https://weflowlab.kr'

// 어디를 막을지는 모든 크롤러에게 똑같이 적용한다
// /blogadmin 은 웹블로그 관리자, /blog/next/ 는 블로그 미리보기·조회수용 내부 경로
const DISALLOW = ['/admin', '/api/', '/blogadmin', '/blog/next/']

/**
 * AI 답변엔진 크롤러 — 챗GPT·클로드·퍼플렉시티 등이 사이트를 읽고 인용해 가는 통로다.
 * '*' 로도 이미 허용되지만, 이름을 적어 두면 앞으로 누가 규칙을 손댈 때 의도가 남는다.
 *
 * 주의: robots.txt 는 가장 구체적으로 일치하는 그룹 하나만 적용된다.
 * 이름을 따로 적은 크롤러에게는 '*' 그룹의 Disallow 가 상속되지 않으므로
 * 아래에서 같은 DISALLOW 를 다시 붙여 준다 — 빼먹으면 관리자 페이지가 열린다.
 */
const AI_CRAWLERS = [
  'GPTBot', // 챗GPT 학습
  'OAI-SearchBot', // 챗GPT 검색
  'ChatGPT-User', // 챗GPT가 사용자 요청으로 즉시 열어볼 때
  'ClaudeBot', // 클로드
  'Claude-User',
  'PerplexityBot', // 퍼플렉시티
  'Perplexity-User',
  'Google-Extended', // 구글 제미나이·AI 개요
  'Applebot-Extended', // 애플 인텔리전스
  'CCBot', // Common Crawl — 여러 모델이 여기서 데이터를 받아 간다
]

// 전체 공개 · 관리자와 API만 차단
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: DISALLOW },
    ],
    // 웹블로그 글 목록은 따로 만든다 (app/(blog)/blog/sitemap.ts)
    sitemap: [`${BASE}/sitemap.xml`, `${BASE}/blog/sitemap.xml`],
    host: BASE,
  }
}