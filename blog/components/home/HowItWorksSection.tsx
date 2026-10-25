// 메인 페이지 "웹블로그는 이렇게 검색에 자리 잡습니다" (보안 섹션 바로 아래).
// 위: 글 작성 → 자동 생성(사이트맵·구조화 데이터·요약) → 네이버·구글 수집 → 검색·AI 답변 노출 기회, 4단계.
// 아래: SEO·AEO·GEO 카드 — 각각 무엇이고, 웹블로그가 무엇을 자동으로 해 두는지.
// 문구 기준: 순위·노출을 약속하지 않는다 ("자리 잡는 구조", "노출 기회").
import { IconPencil, IconSettingsAutomation, IconWorldSearch, IconSparkles, IconArrowRight, type Icon } from "@tabler/icons-react";
import { Fragment } from "react";
import { Reveal } from "@/blog/components/ui/Reveal";
import { MobileBreaks } from "@/blog/components/ui/MobileBreaks";

// text 의 \n 은 데스크톱(가로 카드)에서만 줄바꿈 — 모바일은 카드가 넓어 한 줄로 흐르게 둔다
const STEPS: { Icon: Icon; title: string; text: string }[] = [
  { Icon: IconPencil, title: "글 작성", text: "관리자 페이지에서\n제목·본문·자주 묻는 질문만 채웁니다." },
  { Icon: IconSettingsAutomation, title: "자동으로 함께 생성", text: "사이트맵·구조화 데이터·요약이\n글과 함께 저절로 만들어집니다." },
  { Icon: IconWorldSearch, title: "네이버·구글이 수집", text: "서치어드바이저·서치콘솔에 등록된 사이트를\n검색엔진이 읽어 갑니다." },
  { Icon: IconSparkles, title: "검색·AI 답변에 노출 기회", text: "검색 결과와 AI 답변의 출처로\n우리 글이 쓰일 기회가 생깁니다." },
];

const OPTIMIZE = [
  {
    tag: "SEO",
    name: "검색 노출",
    desc: "네이버·구글 검색 결과에 잘 보이게",
    auto: ["고객이 쓰는 말로 짓는 제목·소제목 구조", "새 글마다 사이트맵 자동 갱신", "모바일에서도 빠른 로딩"],
  },
  {
    tag: "AEO",
    name: "답변 노출",
    desc: "질문에 대한 '답'으로 뽑히게",
    auto: ["글 맨 위 핵심 요약", "글마다 자주 묻는 질문", "FAQ 구조화 데이터 자동 생성"],
  },
  {
    tag: "GEO",
    name: "AI 답변 인용",
    desc: "AI가 답할 때 인용하게",
    auto: ["AI가 읽기 좋은 글자 중심 구조", "작성자·발행일·출처 정보", "AI 검색 로봇이 읽을 수 있게 공개"],
  },
];

export function HowItWorksSection() {
  return (
    <section aria-labelledby="home-how-title" className="bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary md:text-base">HOW IT WORKS</p>
          <Reveal variant="up">
            <h2 id="home-how-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              글만 쓰면, 네이버·구글에 자리 잡고
              <br />
              AI까지 읽어 가는 구조
            </h2>
          </Reveal>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            웹블로그도 같은 Next.js로 만듭니다.<br className="md:hidden" /> 글을 올리는 순간,
            <br className="hidden md:block" /> 검색엔진과 AI가 읽는 정보가 함께 만들어져 SEO·AEO·GEO에 맞춰집니다.
          </p>
        </div>

        {/* 4단계: 데스크톱 가로 — 카드 사이에 화살표 칸을 따로 두어 카드와 겹치지 않게. 모바일 세로 (화살표 없이) */}
        <ol className="mx-auto mt-10 flex max-w-[1320px] flex-col gap-3 md:mt-14 md:flex-row md:items-stretch md:gap-0">
          {STEPS.map(({ Icon, title, text }, i) => (
            <Fragment key={title}>
              <Reveal variant="fade-up" delay={0.08 * i} className="md:min-w-0 md:flex-1">
                <li className="flex h-full gap-4 rounded-[14px] border border-neutral-200 bg-white p-5 md:flex-col md:gap-0 md:p-5">
                  <span className="relative flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--brand-primary-10)] text-primary">
                    <Icon className="size-6" stroke={1.75} />
                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{i + 1}</span>
                  </span>
                  <span className="md:mt-4">
                    <strong className="block text-base font-bold text-foreground md:text-lg">{title}</strong>
                    <span className="mt-1 block text-sm leading-relaxed text-neutral-600 md:whitespace-pre-line">{text}</span>
                  </span>
                </li>
              </Reveal>
              {i < STEPS.length - 1 && (
                <li aria-hidden className="hidden w-10 shrink-0 items-center justify-center text-primary md:flex">
                  <IconArrowRight className="size-5" stroke={2.5} />
                </li>
              )}
            </Fragment>
          ))}
        </ol>

        {/* SEO · AEO · GEO */}
        <div className="mx-auto mt-12 grid max-w-[1320px] gap-3 md:mt-16 md:grid-cols-3 md:gap-4">
          {OPTIMIZE.map((o, i) => (
            <Reveal key={o.tag} variant="fade-up" delay={0.08 * i}>
              <div className="flex h-full flex-col justify-center rounded-[16px] bg-linear-to-br from-[var(--brand-primary-10)] to-[var(--brand-primary-5)] p-6 md:p-7">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">{o.tag}</span>
                  <span className="text-base font-bold text-foreground">{o.name}</span>
                </div>
                <p className="mt-1.5 text-sm text-neutral-600 md:text-[15px]">{o.desc}</p>
                <p className="mt-3 text-xs font-semibold text-primary">웹블로그가 자동으로 해 두는 것</p>
                <ul className="mt-3 space-y-1.5">
                  {o.auto.map((a) => (
                    <li key={a} className="flex gap-2 text-sm font-medium text-neutral-800 md:text-[15px]">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-neutral-400 md:text-sm"><MobileBreaks text="검색 순위와 AI 인용 여부는 각 검색엔진·AI 서비스가 정합니다.|웹블로그는 그 기회를 넓히는 구조를 만듭니다." /></p>
      </div>
    </section>
  );
}
