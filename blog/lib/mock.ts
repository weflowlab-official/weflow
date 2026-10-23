// 시드 데이터 + 시드 전 폴백. 회사 정보는 weflowlab.kr 푸터·사업자 구조화 데이터(app/(site)/layout.tsx)와 같은 값을 쓴다.
// 실제 글은 Payload CMS 에서 작성한다 (시험 글은 lib/articles.ts).
import type { Category, ClinicInfo, Doctor } from "./types";
import { INDUSTRY_GROUPS } from "./industries";
import { KAKAO_URL, OFFICIAL_CHANNELS } from "@/data/common";

export const clinic: ClinicInfo = {
  name: "WEFLOW",
  nameEn: "WEFLOW",
  homepageUrl: "/",
  address: "",
  phone: "010-2971-7280",
  fax: "contact@weflowlab.kr",
  businessNumber: "884-07-03480",
  representatives: ["신서준"],
  hours: [{ label: "운영시간", value: "연중무휴 24시간 상담 가능" }],
  directions: "",
  parking: [],
  mapLinks: [],
  sns: [
    { label: "카카오톡 채널", href: OFFICIAL_CHANNELS.kakao },
    { label: "네이버 블로그", href: OFFICIAL_CHANNELS.blog },
    { label: "인스타그램", href: OFFICIAL_CHANNELS.instagram },
    { label: "유튜브", href: OFFICIAL_CHANNELS.youtube },
  ],
  legalLinks: [{ label: "개인정보처리방침", href: "/privacy" }],
  homepageMenu: [],
  consultUrl: "/blog#contact", // 블로그 메인 맨 아래 무료 견적 신청 폼 (components/home/InquirySection)
  kakaoChannelUrl: KAKAO_URL,
  stats: [],
  statsNote: "",
  disclaimerText: "",
  benefitsTitle: "",
  benefits: [],
  commonFaq: [],
  ctaTitle: "",
  ctaText: "",
};

// 큰 업종 = 카테고리 (lib/industries.ts)
export const categories: Category[] = INDUSTRY_GROUPS.map(({ slug, name, description, subs }) => ({ slug, name, description, subs }));

export const popularKeywords = ["SEO·AEO·GEO", "AI 검색", "병의원", "네이버 블로그"];

// 작성자 (글 하단 '이 글을 쓴 사람' 카드)
export const doctors: Doctor[] = [
  {
    slug: "weflow",
    name: "WEFLOW",
    title: "웹블로그팀",
    specialties: ["웹블로그 제작", "SEO", "AEO", "GEO"],
    bio: "업종별로 고객이 어떻게 검색하는지 살펴보고, 검색엔진과 AI 검색이 읽기 좋은 웹블로그를 설계합니다.",
    career: [],
  },
];
