import type { ReactNode } from 'react'
import { Search, FileText, Hospital, CalendarCheck, Building2, MessageSquare, type LucideIcon } from 'lucide-react'

/**
 * '홈페이지 vs 웹블로그'(HomeVsBlog.tsx) · '홈페이지와 함께'(WithHomepage.tsx) 글귀.
 * 병의원 페이지는 특정 과가 드러나지 않는 병원 예시(*_CLINIC, 기본값 — 이름은 '우리병원', 글 주제는 여러 과를 섞는다), 메인 '웹블로그란?'(app/(site)/webblog)은 인테리어 예시(*_GENERAL).
 */

export type HomeVsBlogCopy = {
  homeIs: string // '홈페이지는 ○○'
  blogIs: string // '웹블로그는 ○○'
  rows: { label: string; home: string; blog: string }[]
  together: string // 맺음 문장의 굵은 부분
  domain: string
  brand: string
  banner: [string, string]
  bannerCta: string
  quick: [string, string, string]
  posts: { tag: string; title: string }[]
  headGold?: boolean // 'WEFLOW는 홈페이지든 웹블로그든, 이렇게 만듭니다' 를 금색 광택으로 (병의원 랜딩)
}

export const HV_CLINIC: HomeVsBlogCopy = {
  homeIs: '병원의 얼굴',
  blogIs: '환자를 데려오는 길',
  rows: [
    { label: '역할', home: '병원을 소개하고 믿음을 줍니다', blog: '검색에서 새 환자를 데려옵니다' },
    { label: '담는 내용', home: '의료진 · 진료 안내 · 오시는 길', blog: '질환 · 치료 · 관리법 이야기' },
    { label: '바뀌는 주기', home: '한 번 만들고 필요할 때 고칩니다', blog: '글이 꾸준히 쌓입니다' },
  ],
  together: '검색에서 예약까지 한 사이트 안에서',
  domain: '우리병원.com',
  brand: '우리병원',
  headGold: true,
  banner: ['가까운 곳에서', '오래 함께하겠습니다'],
  bannerCta: '진료 예약',
  quick: ['의료진', '진료 안내', '오시는 길'],
  posts: [
    // 특정 진료과로 보이지 않게 여러 과를 섞는다
    { tag: '백내장', title: '백내장 수술, 언제 받나요?' },
    { tag: '무릎', title: '무릎 통증, 운동해도 될까요?' },
    { tag: '피부', title: '여드름 흉터, 없앨 수 있나요?' },
    { tag: '검진', title: '건강검진 전날 주의할 점' },
  ],
}

export const HV_GENERAL: HomeVsBlogCopy = {
  homeIs: '우리 회사의 얼굴',
  blogIs: '손님을 데려오는 길',
  rows: [
    { label: '역할', home: '회사를 소개하고 믿음을 줍니다', blog: '검색에서 새 고객을 데려옵니다' },
    { label: '담는 내용', home: '회사 소개 · 서비스 안내 · 오시는 길', blog: '자주 묻는 질문 · 사례 · 노하우' },
    { label: '바뀌는 주기', home: '한 번 만들고 필요할 때 고칩니다', blog: '글이 꾸준히 쌓입니다' },
  ],
  together: '검색에서 상담까지 한 사이트 안에서',
  domain: '우리인테리어.com',
  brand: '우리인테리어',
  banner: ['살던 집을', '새집처럼 바꿔 드립니다'],
  bannerCta: '견적 문의',
  quick: ['시공 사례', '서비스 안내', '오시는 길'],
  posts: [
    { tag: '베란다', title: '베란다 확장, 꼭 해야 할까요?' },
    { tag: '욕실', title: '욕실 리모델링 공사 기간' },
    { tag: '주방', title: '주방 상판 소재 고르기' },
    { tag: '견적', title: '30평 인테리어 견적' },
  ],
}

export type WithHomepageCopy = {
  title: [string, string] // 두 줄 제목 (둘째 줄은 파란색)
  titleGold?: boolean // 제목 둘째 줄과, 흐름 그림 가운데 두 칸(웹블로그 · 홈페이지)의 이름을 금색 광택으로 (병의원 랜딩)
  body: ReactNode
  steps: { Icon: LucideIcon; label: string; sub: string }[]
  domain: string
  path: [string, string] // 주소 뒷부분 — 블로그 글 → 홈페이지 안내 화면
  stayDesc: ReactNode
  brandTitle: string
}

export const WH_CLINIC: WithHomepageCopy = {
  // 가격 카드 ALL-IN-ONE 첫 줄을 누르면 이 섹션으로 온다 — 같은 말, 같은 금색으로 받는다
  title: ['홈페이지와 웹블로그를,', '하나의 사이트 안에서, 한 번에 /blog'],
  titleGold: true,
  body: <>웹블로그와 홈페이지를 함께 두면, <br className="ch-mo" />검색에서 예약까지 한 사이트 안에서 이어집니다.</>,
  steps: [
    { Icon: Search, label: '검색', sub: '“무릎 통증 원인”' },
    { Icon: FileText, label: '웹블로그', sub: '통증 원인과 관리법' },
    { Icon: Hospital, label: '홈페이지', sub: '의료진 · 장비 · 오시는 길' },
    { Icon: CalendarCheck, label: '예약', sub: '진료 예약' },
  ],
  domain: '우리병원.com',
  path: ['blog/knee-pain', 'doctors'],
  stayDesc: <>글을 읽은 환자가 <br className="ch-mo" />같은 사이트 안에서 바로 병원 정보를 봅니다.</>,
  brandTitle: '병원 이미지가 이어져요',
}

export const WH_GENERAL: WithHomepageCopy = {
  title: ['블로그가 데려온 손님을,', '홈페이지가 상담으로'],
  body: <>웹블로그와 홈페이지를 함께 두면, <br className="ch-mo" />검색에서 상담까지 한 사이트 안에서 이어집니다.</>,
  steps: [
    { Icon: Search, label: '검색', sub: '“욕실 리모델링 기간”' },
    { Icon: FileText, label: '블로그 글', sub: '공정별 기간 정리' },
    { Icon: Building2, label: '홈페이지', sub: '시공 사례 · 오시는 길' },
    { Icon: MessageSquare, label: '상담', sub: '견적 문의' },
  ],
  domain: '우리인테리어.com',
  path: ['blog/bathroom', 'portfolio'],
  stayDesc: <>글을 읽은 손님이 <br className="ch-mo" />같은 사이트 안에서 바로 회사 정보를 봅니다.</>,
  brandTitle: '회사 이미지가 이어져요',
}
