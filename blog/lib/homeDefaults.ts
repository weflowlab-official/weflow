// 메인 페이지 기본 문구의 단일 출처.
// - 프론트 컴포넌트: Payload 'home' 글로벌 값이 비어 있을 때 이 문구를 보여 준다.
// - Payload 설정(globals/HomePage.ts): 필드 defaultValue 로 써서 새 DB 에서도 관리자 화면에 미리 채워진다.
// - 시드(/api/blog/dev-seed): 비어 있는 필드를 이 문구로 채워 관리자가 "지금 보이는 글"을 그대로 수정할 수 있게 한다.
// 노출·순위를 보장하는 말은 쓰지 않는다 (lib/clinicDefaults.ts 문구 기준 참고).
// "|" 는 모바일에서만 줄바꿈(components/ui/MobileBreaks), "\n" 은 모든 화면에서 줄바꿈.
import type { ClinicInfo, FaqItem } from "./types";

// 히어로
// 메인 사이트 '웹블로그란?'(app/(site)/webblog) 히어로와 같은 문구 (2026-10-25)
export const heroTitle = (_clinic: Pick<ClinicInfo, "name">) => "웹블로그, 생소하시죠?\n경쟁업체보다 먼저 검색되는 방법";
export const HERO_TEXT = "우리 홈페이지 안에 쌓이는 블로그. 글 하나만 올려도 네이버·구글 검색과 AI 답변에 맞춰집니다.";
export const SEARCH_PLACEHOLDER = "업종이나 궁금한 점을 검색해 보세요";

// 배너 슬라이드 (이미지는 관리자에서 올린다. 없으면 회색 자리표시)
export const BANNERS: { label: string; text: string }[] = [
  {
    label: "검색에 등록되고\nAI가 읽는 웹블로그",
    text: "우리 회사 홈페이지 주소 아래에 글이 쌓이고,|네이버·구글·AI 검색이 그 글을 읽어 갑니다.",
  },
  {
    label: "병의원부터 차량·금융까지\n모든 업종",
    text: "업종에 맞게 카테고리와 글 구조를 설계하고,|글을 읽은 고객이 바로 상담으로 이어지게 만듭니다.",
  },
];

// 핵심 요약 (ABOUT)
export const SUMMARY_TITLE = "웹블로그는|우리 홈페이지 안의 블로그입니다";
export const summaryText = (clinic: Pick<ClinicInfo, "name" | "address">) =>
  `글 쓰는 방법은 블로그와 같지만,|글이 쌓이는 곳은 우리 회사 홈페이지 주소 아래입니다.\n${clinic.name}는 검색 노출(SEO)·답변 노출(AEO)·|AI 답변 인용(GEO)까지 고려해|웹블로그 구조를 처음부터 설계합니다.`;

// 장점 카드 4개 (WHY). 아이콘은 components/home/StrengthsSection 에서 순서대로 붙는다.
export const KEY_POINTS: { title: string; text: string }[] = [
  { title: "네이버·구글 등록까지", text: "검색엔진 등록을 대신 해 드리고,\n새 글은 사이트맵에 저절로 올라갑니다." },
  { title: "AI 검색이 읽는 글", text: "핵심 요약·질문과 답변·구조화 데이터로\nAI 검색이 읽고 인용하기 좋게 만듭니다." },
  { title: "SEO·AEO·GEO 구조 설계", text: "검색·답변·AI 인용까지\n처음부터 구조를 설계합니다." },
  { title: "모든 업종 가능", text: "병의원·차량·금융·인테리어·학원까지\n업종에 맞게 카테고리를 짭니다." },
];

// 자주 묻는 질문
export const faq = (clinic: Pick<ClinicInfo, "name" | "hours" | "parking" | "directions" | "phone">): FaqItem[] => [
  {
    question: "웹블로그는 네이버 블로그와 무엇이 다른가요?",
    answer:
      "글 쓰는 방법은 비슷하지만, 글이 네이버가 아니라 우리 회사 홈페이지 주소 아래에 쌓입니다. 플랫폼 정책이 바뀌어도 글이 그대로 남고, 글을 읽은 고객이 같은 사이트 안에서 바로 회사 정보와 상담으로 이어집니다.",
  },
  {
    question: "글을 올리면 네이버·구글에 바로 나오나요?",
    answer:
      "네이버 서치어드바이저와 구글 서치콘솔 등록은 저희가 대신 해 드리고, 새 글은 사이트맵에 자동으로 올라가 검색엔진이 가져갈 수 있게 됩니다. 다만 검색 결과에서 몇 번째에 보일지는 검색엔진이 정하므로 순위를 약속드리지는 않습니다.",
  },
  {
    question: "SEO·AEO·GEO가 무엇인가요?",
    answer:
      "SEO는 검색 결과에 잘 보이게 하는 것, AEO는 '질문에 대한 답'으로 뽑히게 하는 것, GEO는 AI가 답변을 만들 때 우리 글을 인용하게 하는 것입니다. WEFLOW 웹블로그는 세 가지를 모두 고려해 글의 구조를 만듭니다.",
  },
  {
    question: "저희 업종도 만들 수 있나요?",
    answer:
      "네. 병의원·차량·금융·인테리어·학원·음식점 등 업종에 맞춰 카테고리와 글 구조를 설계합니다. 이 블로그의 업종별 글에서 비슷한 업종의 예시를 먼저 보셔도 좋습니다.",
  },
  {
    question: "글은 누가 쓰나요?",
    answer: `관리자 페이지에서 직접 쓰고 고칠 수 있게 만들어 드립니다. 상담은 ${clinic.phone} 또는 카카오톡으로 편하게 문의해 주세요.`,
  },
];
