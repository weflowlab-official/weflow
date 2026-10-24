import type { ReactNode } from 'react'
import { Search, FileText, Hospital, CalendarCheck, Building2, MessageSquare, type LucideIcon } from 'lucide-react'

/**
 * '홈페이지 vs 웹블로그'(HomeVsBlog.tsx) · '홈페이지와 함께'(WithHomepage.tsx) 글귀.
 * 병의원 페이지는 치과 예시(*_CLINIC, 기본값), 메인 '웹블로그란?'(app/(site)/webblog)은 인테리어 예시(*_GENERAL).
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
  brand: '우리병원치과',
  banner: ['건강한 미소를', '오래 지켜드립니다'],
  bannerCta: '진료 예약',
  quick: ['의료진', '진료 안내', '오시는 길'],
  posts: [
    { tag: '사랑니', title: '사랑니는 꼭 빼야 하나요?' },
    { tag: '임플란트', title: '임플란트 수술 후 일주일' },
    { tag: '교정', title: '투명교정, 몇 살까지 될까요?' },
    { tag: '잇몸', title: '양치할 때 피가 난다면' },
  ],
}

export const HV_GENERAL: HomeVsBlogCopy = {
  homeIs: '우리 회사의 얼굴',
  blogIs: '손님을 데려오는 길',
  rows: [
    { label: '역할', home: '회사를 소개하고 믿음을 줍니다', blog: '검색에서 새 손님을 데려옵니다' },
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
  body: ReactNode
  steps: { Icon: LucideIcon; label: string; sub: string }[]
  domain: string
  path: [string, string] // 주소 뒷부분 — 블로그 글 → 홈페이지 안내 화면
  stayDesc: ReactNode
  brandTitle: string
  /** 상품 카드 — 웹블로그 · 함께 · 홈페이지 순. 없으면 상품 카드 묶음을 통째로 뺀다 (버튼이 같은 페이지 상담 폼으로 가서, 폼이 있는 병의원 랜딩에서만) */
  plans?: { for: string; items: string[] }[]
}

export const WH_CLINIC: WithHomepageCopy = {
  title: ['블로그가 데려온 환자를,', '홈페이지가 예약으로'],
  body: <>웹블로그와 홈페이지를 함께 두면, <br className="ch-mo" />검색에서 예약까지 한 사이트 안에서 이어집니다.</>,
  steps: [
    { Icon: Search, label: '검색', sub: '“임플란트 붓기”' },
    { Icon: FileText, label: '블로그 글', sub: '수술 후 관리법' },
    { Icon: Hospital, label: '홈페이지', sub: '의료진 · 장비 · 오시는 길' },
    { Icon: CalendarCheck, label: '예약', sub: '진료 예약' },
  ],
  domain: '우리병원.com',
  path: ['blog/implant', 'doctors'],
  stayDesc: <>글을 읽은 환자가 <br className="ch-mo" />같은 사이트 안에서 바로 병원 정보를 봅니다.</>,
  brandTitle: '병원 이미지가 이어져요',
  plans: [
    { for: '이미 병원 홈페이지가 있다면', items: ['진료과목별 웹블로그', '쉬운 글쓰기 관리자 화면', '기존 홈페이지와 연결', 'SEO·AEO·GEO 구조 설계'] },
    { for: '새로 만들거나 리뉴얼한다면', items: ['홈페이지와 웹블로그를 한 디자인으로', '관리자 화면 하나로 모두 관리', '문의·예약이 한곳에 쌓임', 'SEO·AEO·GEO 구조 설계'] },
    { for: '홈페이지부터 만들고 싶다면', items: ['병원 맞춤 디자인 홈페이지', '의료진 · 진료 안내 · 오시는 길', '문의·예약 접수', 'SEO·AEO·GEO 구조 설계'] },
  ],
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
