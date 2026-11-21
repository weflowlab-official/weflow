// /robots.txt — 검색엔진 크롤러에게 수집 허용 범위와 사이트맵 위치를 알린다.
//
// 예전에는 app/robots.ts(Next 의 robots 규격)로 만들었는데, 다음(Daum) 웹마스터 도구의 소유 확인이
// robots.txt 안에 '#DaumWebMasterTool:…' 한 줄을 요구한다 (2026-11-21). 그 규격으로는 이런 주석 줄을 넣을 수 없어
// 글자를 직접 만들어 내보내는 방식으로 바꿨다. 나머지 내용은 예전과 한 글자도 다르지 않게 맞췄다.

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

// 다음 웹마스터 도구(webmaster.daum.net) 소유 확인 — 발급받은 줄 그대로. 지우면 인증이 풀린다.
// PIN코드를 다시 발급받으면 이 줄도 새 것으로 바꿔야 한다
const DAUM_VERIFY = '#DaumWebMasterTool:5a619c74d75f9029300ad0a1ce6351836a463816c898b9ef1d3cf4294bd8c7ba:9OXzxfMP1b1VGCOsL/bJCQ=='

const rules = ['Allow: /', ...DISALLOW.map(p => `Disallow: ${p}`)]

// 전체 공개 · 관리자와 API만 차단. 웹블로그 글 목록 사이트맵은 따로 만든다 (app/(blog)/blog/sitemap.ts)
const BODY = [
  'User-Agent: *',
  ...rules,
  '',
  ...AI_CRAWLERS.map(a => `User-Agent: ${a}`),
  ...rules,
  '',
  `Host: ${BASE}`,
  `Sitemap: ${BASE}/sitemap.xml`,
  `Sitemap: ${BASE}/blog/sitemap.xml`,
  '',
  DAUM_VERIFY,
  '',
].join('\n')

export const dynamic = 'force-static'

export function GET() {
  return new Response(BODY, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
