/**
 * /service 페이지 데이터 — 제작 5단계.
 * steps 는 components/service/ServiceSteps.tsx 가 단계 카드로 뿌린다.
 */

/** 제작 단계 하나 — 번호·제목·한 줄 요약·펼쳤을 때 본문·좌측 이미지.
 *  detail 안의 '|' 는 모바일에서만 줄을 바꾸는 자리다 (넓은 화면에서는 한 칸 띄고 이어진다) */
export interface Step {
  num: string;
  title: string;
  desc: string;
  detail: string;
  image: string;
}

/** 제작 5단계 — 배열 순서가 곧 화면에 뜨는 순서 (num 과 짝을 맞춰 둘 것) */
export const steps: Step[] = [
  {
    num: "01",
    title: "상담",
    desc: "업종 및 제작 방향 확인",
    detail:
      "고객의 업종, 타겟 고객, 경쟁사 분석을 통해 최적의 제작 방향을 설정합니다.",
    image: "/images/process/process-01-consult.webp",
  },
  {
    num: "02",
    title: "기획·설계",
    desc: "문의 구조 및 전략 설계",
    detail:
      "고객이 문의로 이어지는 동선을 설계하고,|버튼 위치와 CTA 구조를 최적화합니다.",
    image: "/images/process/process-02-plan.webp",
  },
  {
    num: "03",
    title: "디자인",
    desc: "브랜드 맞춤 화면 구성",
    detail:
      "업종별 특성에 맞는 컬러, 레이아웃, 폰트를 선정하여 브랜드 아이덴티티를 구현합니다.",
    image: "/images/process/process-03-design.webp",
  },
  {
    num: "04",
    title: "개발",
    desc: "필요한 기능 구현 및 페이지 개발",
    detail: "설계안을 바탕으로 페이지와 기능을 안정적으로 개발합니다.",
    image: "/images/process/process-04-dev.webp",
  },
  {
    num: "05",
    title: "최종 점검 및 배포",
    desc: "반응형 검수 · 실제 배포",
    detail:
      "PC·모바일 반응형과 속도·오류·크로스브라우저까지 최종 점검한 뒤, 실제 도메인에 배포해 사이트를 오픈합니다.",
    image: "/images/process/process-05-responsive.webp",
  },
];
