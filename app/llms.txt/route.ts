/**
 * /llms.txt — AI 답변엔진(챗GPT·클로드·퍼플렉시티 등)이 사이트를 빠르게 파악하도록 두는 요약 파일.
 *
 * 사람이 보는 페이지는 장식이 많아 요점을 뽑기 어렵다. 여기에 "무엇을 파는 곳이고, 얼마이고,
 * 어느 페이지에 뭐가 있는지"를 평문으로 적어 두면 인용이 정확해진다.
 * 가격은 data/pricing.ts 와 병의원 플랜(clinic-blog/plans.ts)에서 직접 만들어 쓴다 — 따로 적어두면 값을 고칠 때 여기만 남는다.
 *
 * 웹블로그(/blog)의 글 목록도 싣는다 (2026-11-21) — 발행된 글이 카테고리별로 제목 · 요약과 함께 자동으로 들어간다.
 * 글을 올리거나 고치면 최대 5분 안에 반영된다 (revalidate). 글을 못 읽어 오면(DB 오류 등) 글 목록만 빼고 나머지는 그대로 내보낸다.
 */
import { makePlans, renewPlan, type MakePlan } from '@/data/pricing'
import { CLINIC_PLANS, CLINIC_PLAN_NOTE } from '@/app/(site)/clinic-blog/plans'
import { getAllPosts, getCategories } from '@/blog/lib/payload'

const BASE = 'https://weflowlab.kr'

/**
 * 한 플랜을 한 줄로 — /pricing 카드에 적힌 이름·금액·구성을 그대로 옮긴다.
 *
 * "홈페이지 제작 얼마"는 이 업종 최대 질문이라 AI 답변이 금액을 못 읽으면 그 답에서 통째로 빠진다 —
 * 페이지에 공개한 값은 여기도 공개한다. 반대로 페이지에 없는 값은 여기에도 싣지 않는다
 * (AI 가 화면에 없는 금액을 답해 버리면 방문자가 확인할 데가 없어 문의에서 말이 엇갈린다).
 */
function planLine(p: MakePlan): string {
  return [`- ${p.sub} (${p.tagline}): ${p.price}`, ...p.features, ...p.note].join(' · ')
}

// 리뉴얼은 /pricing 에서 3장 아래 한 장으로 따로 서 있다 — 여기서도 같이 싣는다
const planLines = [...makePlans, renewPlan].map(planLine).join('\n')

// 병의원 플랜 — /clinic-blog 의 '제작 플랜 & 가격 안내' 카드 그대로 (이름 · 무엇을 만드는지 · 시작 가격 · 구성)
const clinicPlanLines = CLINIC_PLANS.map(p => [`- ${p.name} (${p.tagline}): ${p.price}`, ...p.features].join(' · ')).join('\n')

/** 웹블로그 글 목록 — 카테고리별로 묶어 '- [제목](주소): 요약' 한 줄씩. 글이 없거나 못 읽으면 빈 글자 */
async function blogSection(): Promise<string> {
  try {
    const [posts, categories] = await Promise.all([getAllPosts(), getCategories()])
    if (!posts.length) return ''
    const oneLine = (t: string) => t.replace(/\s+/g, ' ').trim()
    const groups = categories
      .map(c => {
        const items = posts.filter(p => p.category === c.slug)
        if (!items.length) return ''
        const lines = items.map(p => `- [${oneLine(p.title)}](${BASE}/blog/${p.category}/${encodeURIComponent(p.slug)})${p.summary ? `: ${oneLine(p.summary)}` : ''}`)
        return `### ${c.name}\n\n${lines.join('\n')}`
      })
      .filter(Boolean)
    if (!groups.length) return ''
    return `\n## 웹블로그 글\n\nWEFLOW 웹블로그(${BASE}/blog)에 발행된 글. 업종별로 웹블로그·홈페이지가 왜 필요하고 어떻게 만드는지를 다룬다.\n\n${groups.join('\n\n')}\n`
  } catch {
    return ''
  }
}

const body = (blog: string) => `# WEFLOW (위플로우)

> 홈페이지·랜딩페이지·웹블로그 제작과 오픈 후 월 운영관리를 함께 맡는 대한민국 홈페이지 제작 업체.
> 만들어 주고 끝내지 않고, 문의가 들어오는 구조까지 설계하는 것을 내세운다.

- 사업자등록번호: 884-07-03480
- 대표: 신서준
- 문의: contact@weflowlab.kr / 010-2971-7280
- 서비스 지역: 대한민국 전역 (비대면 진행)

## 제작 플랜과 가격

${planLines}

모든 플랜에 월 운영관리(서버·보안 관리, 정기 점검, 수정, 장애 대응 등)가 들어 있다.
관리자 페이지는 LANDING·BRAND 는 희망 시, SIGNATURE 는 맞춤형으로 제공한다. 모든 금액은 VAT 별도이다.
홈페이지 리뉴얼은 기존 사이트 규모에 따라 금액을 협의한다.

## 병의원 제작 플랜과 가격

병의원 전용 안내 페이지(${BASE}/clinic-blog)의 플랜. 웹블로그만, 홈페이지만, 또는 둘을 함께 만든다.

${clinicPlanLines}

금액은 제작 시작 가격이며 ${CLINIC_PLAN_NOTE}.

## 주요 페이지

- [홈](${BASE}/): 서비스 전체 요약과 제작 사례·가격 안내
- [WEFLOW 혜택](${BASE}/benefits): 제작과 함께 제공하는 항목(1:1 전담·관리자 페이지·유지보수)과 상담부터 배포까지 5단계 제작 과정
- [왜 WEFLOW?](${BASE}/difference): 템플릿 제작 업체와 최신 기술(React·Next.js)로 직접 만드는 WEFLOW의 차이 — 기능 제약·보안·속도·검색 노출·디자인
- [제작 플랜·가격](${BASE}/pricing): 플랜별 구성과 금액, 홈페이지 리뉴얼
- [제작 사례](${BASE}/cases): 실제로 제작한 사이트를 업종·플랜별로 정리한 포트폴리오
- [이용 가이드](${BASE}/guide): 제작 의뢰 전에 알아 두면 좋은 내용
- [회사 소개](${BASE}/about): 사업자 정보와 소개
- [사이트 자동 점검](${BASE}/check): 주소를 입력하면 로딩 속도·검색 노출·모바일 대응·문의 동선을 바로 분석
- [맞춤 견적 받기](${BASE}/diagnosis): 홈페이지 맞춤 견적과 제작 방향 안내
- [병의원 웹블로그](${BASE}/clinic-blog): 병원 주소에서 운영하는 병의원 전용 웹블로그 — 네이버·구글 검색과 AI 답변에 인용되도록 설계하고, 홈페이지와 함께 제작
- [병원 홈페이지 무료 진단](${BASE}/clinic-blog/check): 병원 홈페이지 주소를 넣으면 제작 기술·보안, AI 검색 준비도, 검색 노출, 속도, 모바일, 문의 동선을 바로 진단
- [웹블로그](${BASE}/blog): 업종별 웹블로그 소개와 글 — 차량·금융·병의원·인테리어 등 업종마다 웹블로그가 필요한 이유, SEO·AEO·GEO 구조 설계
${blog}
## 참고

- 사이트맵: ${BASE}/sitemap.xml
- 웹블로그 사이트맵: ${BASE}/blog/sitemap.xml
- 블로그: https://blog.naver.com/weflowlab
`

// 최대 5분에 한 번 다시 만든다 — 새 글이 다음 배포를 기다리지 않고 들어온다 (웹블로그 사이트맵과 같은 방식)
export const revalidate = 300

export async function GET() {
  return new Response(body(await blogSection()), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
