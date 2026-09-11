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
 * 한 플랜을 한 줄로 — /pricing 카드에 적힌 금액을 그대로 옮긴다.
 *
 * 한동안 여기만 "상담 문의"로 가려 두었는데, 정작 /pricing 카드와 구조화 데이터(Offer)에는
 * 금액이 그대로 나가고 있어 앞뒤가 맞지 않았다. "홈페이지 제작 얼마"는 이 업종 최대 질문이라
 * AI 답변이 금액을 못 읽으면 그 답에서 통째로 빠진다 — 페이지에 공개한 값은 여기도 공개한다.
 *
 * note 는 줄 배열이라 그대로 넣으면 쉼표로 붙는다 — 가운뎃점으로 이어 붙인다.
 */
function planLine(p: MakePlan): string {
  const discount = p.originalPrice ? ` (정가 ${p.originalPrice}, ${p.discount} 할인)` : ''
  return [
    `- ${p.sub} (${p.name}): ${p.price}${discount}`,
    `월 유지보수 ${p.maintenance}`,
    `관리자 페이지 옵션 ${p.adminPrice}(월 ${p.adminMaintenance})`,
    ...p.note,
  ].join(' · ')
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

관리자 페이지는 옵션이며, 문의·예약 확인과 회원 관리, 실시간 사이트 반영,
방문·유입 통계를 직접 다룰 수 있게 해 준다. 모든 금액은 VAT 별도이며,
월 유지보수는 수정 횟수에 제한을 두지 않는다.
홈페이지 리뉴얼(RENEW)은 기존 사이트 규모에 따라 금액을 협의한다.

## 주요 페이지

- [홈](${BASE}/): 서비스 전체 요약과 제작 사례·가격 안내
- [서비스 안내](${BASE}/service): 기획·디자인·개발부터 광고 연동·운영까지 6단계 제작 과정
- [왜 WEFLOW?](${BASE}/difference): 템플릿 제작 업체와 최신 기술(React·Next.js)로 직접 만드는 WEFLOW의 차이 — 기능 제약·보안·속도·검색 노출·디자인
- [제작 플랜·가격](${BASE}/pricing): 플랜별 구성과 금액, 관리자 페이지 옵션, 관리 플랜
- [제작 사례](${BASE}/cases): 실제로 제작한 사이트를 업종·플랜별로 정리한 포트폴리오
- [이용 가이드](${BASE}/guide): 제작 의뢰 전에 알아 두면 좋은 내용
- [혜택 안내](${BASE}/benefits): 제작 시 함께 제공하는 항목
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