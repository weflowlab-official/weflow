// 메인 페이지 "AI 검색 장면" 데모. 왼쪽: 손님 질문 → AI 가 웹블로그 글을 읽고 인용 → 같은 사이트에서 상담 (3단계),
// 오른쪽: 글 본문의 AI 검색 대화 블록(components/post/blocks/AiChat)을 그대로 써서 장면을 보여 준다.
// 웹블로그가 무엇을 하는지 한 화면에 보이게 하려는 섹션 (weflowlab.kr/clinic-blog 의 AI 검색 장면을 업종 공통으로).
import { IconMessageQuestion, IconFileSearch, IconPhoneCall, type Icon } from "@tabler/icons-react";
import { AiChat } from "@/blog/components/post/blocks/AiChat";
import { Reveal } from "@/blog/components/ui/Reveal";

const STEPS: { Icon: Icon; title: string; text: string }[] = [
  { Icon: IconMessageQuestion, title: "손님이 AI에게 묻습니다", text: "검색창 대신 챗GPT·제미나이에 바로 질문하는 손님이 늘고 있습니다." },
  { Icon: IconFileSearch, title: "AI가 우리 글을 읽고 인용합니다", text: "질문에 답하는 글이 우리 홈페이지에 있으면, AI가 그 글을 근거로 답하고 출처로 보여 줍니다." },
  { Icon: IconPhoneCall, title: "같은 사이트에서 상담으로", text: "출처를 누른 손님은 우리 홈페이지 안에서 글을 읽고, 바로 상담까지 이어집니다." },
];

// 업종과 상관없이 읽히는 예시 (의료·금융처럼 조심해야 하는 업종은 피했다)
const EXAMPLE = {
  blockType: "aiChat" as const,
  question: "이사 업체 고를 때 뭘 확인해야 해?",
  answer: "견적에 포함되는 항목, 파손 보상 기준, 추가 요금이 붙는 경우를 먼저 확인하는 게 좋아요. 아래 글에 체크리스트로 정리되어 있어요.",
  sourceTitle: "이사 업체 고르기 전 꼭 확인할 5가지",
  sourceSite: "우리이사.com/blog",
};

export function AiSearchSection() {
  return (
    <section aria-labelledby="home-ai-title" className="bg-[var(--brand-primary-5)] py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-site-4xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-primary md:text-base">AI SEARCH</p>
          <Reveal variant="up">
            <h2 id="home-ai-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              손님은 이제
              <br />
              AI에게 먼저 묻습니다
            </h2>
          </Reveal>
          <ol className="mt-8 space-y-6">
            {STEPS.map(({ Icon, title, text }, i) => (
              <Reveal key={title} variant="fade-up" delay={0.1 * i}>
                <li className="flex gap-4">
                  <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-10)] text-primary">
                    <Icon className="size-5" stroke={1.75} />
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{i + 1}</span>
                  </span>
                  <span>
                    <strong className="block text-base font-bold text-foreground md:text-lg">{title}</strong>
                    <span className="mt-1 block text-sm leading-relaxed text-neutral-600 md:text-[15px]">{text}</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal variant="fade-up" delay={0.15}>
          <AiChat fields={EXAMPLE} />
        </Reveal>
      </div>
    </section>
  );
}
