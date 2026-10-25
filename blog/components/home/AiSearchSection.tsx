// 메인 페이지 "AI 검색" 섹션. 위: 고객이 검색창·AI 에게 먼저 묻는 장면(weflowlab.kr/webblog 의 WHY NOW 01 그림을 그대로),
// 아래: 웹블로그가 있으면 어떻게 바뀌는지 3단계 (질문에 답하는 글 → AI 인용 → 같은 사이트에서 상담).
// 그림(PC 검색 결과 + 휴대폰 AI 대화)은 메인 사이트 부품(app/(site)/clinic-blog/Scenes 의 AiVisual)을 같이 쓴다 —
// 모양·색 변수는 siteSceneCss 의 .site-scene 으로 넣어 준다.
import { IconFileText, IconFileSearch, IconPhoneCall, type Icon } from "@tabler/icons-react";
import { AiVisual, type Line } from "@/app/(site)/clinic-blog/Scenes";
import { SITE_SCENE_CSS } from "./siteSceneCss";
import { Reveal } from "@/blog/components/ui/Reveal";
import { MobileBreaks } from "@/blog/components/ui/MobileBreaks";

// text 의 "|" 는 모바일에서만 줄바꿈 (components/ui/MobileBreaks)
const STEPS: { Icon: Icon; title: string; text: string }[] = [
  { Icon: IconFileText, title: "질문에 답하는 글을 우리 홈페이지에", text: "고객이 검색하고 AI에게 묻는 질문에|답하는 글을 우리 사이트 안에 쌓습니다." },
  { Icon: IconFileSearch, title: "AI가 우리 글을 읽고 인용합니다", text: "AI가 그 글을 근거로 답하고,|출처로 우리 회사를 보여 줍니다." },
  { Icon: IconPhoneCall, title: "같은 사이트에서 상담으로", text: "출처를 누른 고객은 우리 홈페이지 안에서|글을 읽고, 바로 상담까지 이어집니다." },
];

// 왼쪽 PC 검색 화면 — 휴대폰(인테리어)과 다른 업종(세무)으로 둬 "어느 업종이든 같다"가 보이게 (/webblog 와 같은 예시)
const SEARCH = {
  query: "종합소득세 신고 방법",
  results: [
    { blog: "○○세무회계 블로그", ago: "2일 전", title: "종합소득세 신고 기간·준비 서류 총정리", text: "5월 신고 기간에 맞춰 준비할 서류와 홈택스 신고 순서를 한 번에 정리했습니다." },
    { blog: "△△세무사사무소 블로그", ago: "5일 전", title: "프리랜서 종합소득세, 경비 처리는 어디까지?", text: "사업소득으로 신고할 때 인정받을 수 있는 경비와 놓치기 쉬운 항목을 설명합니다." },
    { blog: "□□택스 블로그", ago: "1주 전", title: "종합소득세 환급, 이런 경우 받을 수 있어요", text: "미리 낸 세금이 더 많았다면 돌려받을 수 있습니다. 대표적인 경우를 예로 보여 드립니다." },
  ],
  emptyText: "고객이 찾는 답, 전부 다른 업체 글입니다",
};

const CUSTOMER = { who: "me", name: "고객", short: "고객" } as const;
const AI = { who: "ai", name: "AI 검색", short: "AI" } as const;
// 오른쪽 휴대폰 — 고객이 AI 에게 묻고, AI 는 다른 업체 글을 인용한다
const AI_LINES: Line[] = [
  { ...CUSTOMER, text: "욕실 리모델링하면 공사 기간 며칠 걸려?" },
  { ...AI, text: "보통 5~7일 정도 걸립니다. 아래 글에 공정별로 잘 정리돼 있어요." },
  { ...AI, text: "욕실 리모델링 공정과 기간 총정리", source: "다른 업체 블로그" },
  { ...CUSTOMER, text: "오 설명 잘 돼 있네. 여기 견적 받아 볼까?" },
];

export function AiSearchSection() {
  return (
    <section aria-labelledby="home-ai-title" className="bg-[var(--brand-primary-5)] py-16 md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        {/* 소개: 가운데 정렬 */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary md:text-base">AI SEARCH</p>
          <Reveal variant="up">
            <h2 id="home-ai-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              요즘 고객은
              <br />
              <span className="bg-[linear-gradient(transparent_58%,var(--brand-primary-20)_58%)] px-0.5">검색창과 AI에게</span> 먼저 묻습니다
            </h2>
          </Reveal>
          <Reveal variant="fade-up" delay={0.15}>
            <p className="mt-5 text-base font-medium leading-relaxed text-neutral-700 md:text-lg">
              <MobileBreaks text="맡길 곳을 찾는 고객은 바로 전화하지 않습니다.|궁금한 걸 검색하고 AI에게도 물어본 뒤,|거기서 만난 글을 쓴 업체를 기억합니다." />
            </p>
          </Reveal>
        </div>

        {/* PC 검색 결과 + 휴대폰 AI 검색 (메인 사이트 WHY NOW 01 그림) */}
        <div className="site-scene ais-cb mx-auto max-w-[1040px]">
          <AiVisual search={SEARCH} lines={AI_LINES} />
        </div>

        {/* 웹블로그가 있으면 — 3단계 */}
        <h3 className="mt-16 text-center text-xl font-bold leading-snug md:mt-24 md:text-2xl">
          웹블로그가 있으면, <br className="md:hidden" />
          <span className="text-primary">우리 글이 인용됩니다</span>
        </h3>
        <ol className="mx-auto mt-8 grid max-w-[1056px] gap-3 md:mt-10 md:grid-cols-3 md:gap-4">
          {STEPS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} variant="fade-up" delay={0.08 * i}>
              <li className="flex h-full gap-3.5 rounded-[14px] bg-white p-5 md:flex-col md:gap-0 md:p-6">
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-10)] text-primary">
                  <Icon className="size-5" stroke={1.75} />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{i + 1}</span>
                </span>
                <span className="md:mt-4">
                  <strong className="block text-base font-bold text-foreground md:text-lg">{title}</strong>
                  <span className="mt-1 block text-sm leading-relaxed text-neutral-600 md:text-[15px]">
                    <MobileBreaks text={text} />
                  </span>
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* 그림 모양과 색 변수 — 메인 사이트 .cb 와 같은 값 */}
      <style>{SITE_SCENE_CSS + `
        .ais-cb .cb-ai-visual { margin-top: 40px; }
        @media (min-width: 768px) { .ais-cb .cb-ai-visual { margin-top: 56px; } }
      `}</style>
    </section>
  );
}
