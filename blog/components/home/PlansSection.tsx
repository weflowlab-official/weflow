// 메인 페이지 상품 3종: 웹블로그만 / 웹블로그 + 홈페이지(추천) / 홈페이지만. "웹블로그란?" 섹션 바로 아래.
// weflowlab.kr/clinic-blog 의 상품 카드를 업종 공통 문구로 옮긴 것. 가격은 상담에서 안내하므로 적지 않는다.
// '이걸로 상담받기'를 누르면 맨 아래 견적 폼의 문의 유형이 미리 골라진다 (PlanButton → InquiryForm).
import { IconBrowser, IconCheck, IconNotebook, IconStarFilled, type Icon } from "@tabler/icons-react";
import { Reveal } from "@/blog/components/ui/Reveal";
import { PlanButton } from "./PlanButton";

type Plan = { name: string; plan: string; who: string; Icons: Icon[]; points: string[]; recommended?: boolean };

// plan: 견적 폼 문의 유형 칩과 같은 이름 (InquiryForm 의 PLANS)
const PLANS: Plan[] = [
  {
    name: "웹블로그",
    plan: "웹블로그만",
    who: "이미 홈페이지가 있다면",
    Icons: [IconNotebook],
    points: ["업종별 카테고리 웹블로그", "기존 홈페이지 주소 아래에 연결", "쉬운 글쓰기 관리자 화면", "SEO·AEO·GEO 구조 설계"],
  },
  {
    name: "웹블로그 + 홈페이지",
    plan: "웹블로그 + 홈페이지",
    who: "새로 만들거나 리뉴얼한다면",
    Icons: [IconNotebook, IconBrowser],
    points: ["홈페이지와 웹블로그를 한 디자인으로", "관리자 화면 하나로 모두 관리", "문의·상담이 한곳에 쌓임", "SEO·AEO·GEO 구조 설계"],
    recommended: true,
  },
  {
    name: "홈페이지",
    plan: "홈페이지만",
    who: "홈페이지부터 만들고 싶다면",
    Icons: [IconBrowser],
    points: ["업종 맞춤 디자인 홈페이지", "회사 소개·서비스·오시는 길", "문의 접수", "웹블로그는 나중에 추가 가능"],
  },
];

export function PlansSection() {
  return (
    <section aria-labelledby="home-plans-title" className="bg-[var(--brand-primary-5)] py-16 md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary md:text-base">PLANS</p>
          <Reveal variant="up">
            <h2 id="home-plans-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              웹블로그만, 홈페이지만,
              <br className="md:hidden" /> 또는 함께
            </h2>
          </Reveal>
          <p className="mt-3 text-base text-neutral-600 md:text-lg">지금 상황에 맞게 고르세요. 둘을 함께하면 검색에서 상담까지 한 사이트 안에서 이어집니다.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1056px] gap-4 md:mt-14 md:grid-cols-3 md:items-stretch">
          {/* 모바일은 추천(웹블로그 + 홈페이지)을 맨 앞으로, md 이상은 가운데 그대로 */}
          {PLANS.map((p, i) => (
            <Reveal key={p.plan} variant="fade-up" delay={0.08 * i} className={p.recommended ? "order-first md:order-none md:-my-3" : ""}>
              <div
                className={`relative flex h-full flex-col rounded-[18px] p-6 md:p-7 ${
                  p.recommended
                    ? "bg-linear-to-br from-primary to-[#0d2858] text-white shadow-[0_20px_50px_0_var(--brand-primary-20)]"
                    : "border border-neutral-200 bg-white"
                }`}
              >
                {p.recommended && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#fee500] px-3 py-1 text-xs font-bold text-[#191919]">
                    <IconStarFilled className="size-3" />
                    추천
                    <IconStarFilled className="size-3" />
                  </span>
                )}
                <div className="flex gap-1.5">
                  {p.Icons.map((PlanIcon, k) => (
                    <span key={k} className={`flex size-10 items-center justify-center rounded-[10px] ${p.recommended ? "bg-white/15 text-white" : "bg-[var(--brand-primary-10)] text-primary"}`}>
                      <PlanIcon className="size-5" stroke={1.75} />
                    </span>
                  ))}
                </div>
                <p className={`mt-4 text-sm font-semibold ${p.recommended ? "text-white/70" : "text-neutral-500"}`}>{p.who}</p>
                <h3 className="mt-0.5 text-xl font-bold md:text-2xl">{p.name}</h3>
                <ul className="mt-5 space-y-2.5">
                  {p.points.map((t) => (
                    <li key={t} className={`flex gap-2 text-[15px] ${p.recommended ? "text-white/90" : "text-neutral-700"}`}>
                      <IconCheck className={`mt-0.5 size-4 shrink-0 ${p.recommended ? "text-[#9fbdf5]" : "text-primary"}`} stroke={2.5} />
                      {t}
                    </li>
                  ))}
                </ul>
                {/* 버튼은 카드 맨 아래에 맞춘다 (세 카드 버튼 높이가 같게) */}
                <div className="mt-auto pt-7">
                  <PlanButton
                    plan={p.plan}
                    className={`h-12 w-full rounded-[12px] text-base font-bold transition-colors ${
                      p.recommended ? "bg-white text-primary hover:bg-neutral-100" : "border border-primary bg-white text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    이걸로 상담받기
                  </PlanButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
