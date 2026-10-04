/**
 * /llms.txt — AI 답변엔진(챗GPT·클로드·퍼플렉시티 등)이 사이트를 빠르게 파악하도록 두는 요약 파일.
 *
 * 사람이 보는 페이지는 장식이 많아 요점을 뽑기 어렵다. 여기에 "무엇을 파는 곳이고, 얼마이고,
 * 어느 페이지에 뭐가 있는지"를 평문으로 적어 두면 인용이 정확해진다.
 * 가격은 data/pricing.ts 에서 직접 만들어 쓴다 — 따로 적어두면 값을 고칠 때 여기만 남는다.
 */
import { makePlans, renewPlan, type MakePlan } from '@/data/pricing'

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

const BODY = `# WEFLOW (위플로우)

> 홈페이지·랜딩페이지 제작과 광고 연동·운영 관리를 함께 맡는 대한민국 홈페이지 제작 업체.
> 만들어 주고 끝내지 않고, 문의가 들어오는 구조까지 설계하는 것을 내세운다.

- 사업자등록번호: 884-07-03480
- 대표: 신서준
- 문의: contact@weflowlab.kr / 010-2971-7280
- 서비스 지역: 대한민국 전역 (비대면 진행)

## 제작 플랜과 가격

${planLines}

모든 플랜에 월 운영관리(서버·보안 관리, 정기 점검, 수정, 장애 대응)가 들어 있다.
관리자 페이지는 LANDING·BRAND 는 희망 시, SIGNATURE 는 맞춤형으로 제공한다. 모든 금액은 VAT 별도이다.
홈페이지 리뉴얼은 기존 사이트 규모에 따라 금액을 협의한다.

## 주요 페이지

- [홈](${BASE}/): 서비스 전체 요약과 제작 사례·가격 안내
- [WEFLOW 혜택](${BASE}/benefits): 제작과 함께 제공하는 항목(1:1 전담·관리자 페이지·유지보수)과 상담부터 배포까지 5단계 제작 과정
- [왜 WEFLOW?](${BASE}/difference): 템플릿 제작 업체와 최신 기술(React·Next.js)로 직접 만드는 WEFLOW의 차이 — 기능 제약·보안·속도·검색 노출·디자인
- [제작 플랜·가격](${BASE}/pricing): 플랜별 구성과 금액, 홈페이지 리뉴얼
- [제작 사례](${BASE}/cases): 실제로 제작한 사이트를 업종·플랜별로 정리한 포트폴리오
- [이용 가이드](${BASE}/guide): 제작 의뢰 전에 알아 두면 좋은 내용
- [회사 소개](${BASE}/about): 사업자 정보와 소개
- [사이트 자동 점검](${BASE}/check): 주소를 입력하면 로딩 속도·검색 노출·모바일 대응·문의 동선을 바로 분석
- [무료 상담 신청](${BASE}/diagnosis): 홈페이지 상담과 제작 방향 안내

## 참고

- 사이트맵: ${BASE}/sitemap.xml
- 블로그: https://blog.naver.com/weflowlab
`

export const dynamic = 'force-static'

export function GET() {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}