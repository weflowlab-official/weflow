// 본문 블록: AI 검색 대화 (예시). 손님 질문 → AI 답변 → 출처로 인용된 블로그 글 카드. lib/postBlocks.ts 의 AiChatBlock.
// weflowlab.kr/clinic-blog 의 AI 검색 장면을 글 안에 맞게 줄였다 — 움직임 없이 말풍선만.
// 특정 서비스(챗GPT 등)의 화면처럼 보이지 않게 일반 'AI 검색' 표시를 쓰고, 아래에 예시 화면 문구를 붙인다.
import { IconFileText, IconSparkles } from "@tabler/icons-react";
import type { AiChatFields } from "@/blog/lib/postBlocks";

// floatingCaption: 아래 "예시 화면" 문구를 높이 계산에서 빼고 카드 바로 밑에 띄운다.
// fill: 카드를 부모 높이만큼 늘리고 대화는 그 안 세로 가운데에 둔다.
// elevated: 카드 안을 흰색으로 하고 그림자를 준다 (색 있는 배경 위에 놓을 때 카드가 묻히지 않게).
// (셋 다 메인 AI 검색 섹션에서 쓴다. 글 본문에서는 쓰지 않는다)
type Props = { fields: AiChatFields; floatingCaption?: boolean; fill?: boolean; elevated?: boolean };

export function AiChat({ fields, floatingCaption = false, fill = false, elevated = false }: Props) {
  return (
    <figure className={`${floatingCaption ? "relative" : "my-8"} ${fill ? "flex h-full flex-col" : ""}`}>
      <div
        className={`overflow-hidden rounded-[16px] border border-neutral-200 ${elevated ? "bg-white shadow-[0_16px_40px_0_var(--brand-primary-10)]" : "bg-neutral-50"} ${fill ? "flex flex-1 flex-col" : ""}`}
      >
        {/* 상단 바: AI 검색 */}
        <div className="flex items-center gap-2 border-b border-neutral-200 bg-white px-4 py-3 md:px-5">
          <span className="flex size-7 items-center justify-center rounded-full bg-[var(--brand-primary-10)] text-primary">
            <IconSparkles className="size-4" stroke={2} />
          </span>
          <span className="text-sm font-bold text-neutral-800">AI 검색</span>
        </div>

        <div className={`space-y-4 px-4 py-5 md:px-6 md:py-6 ${fill ? "flex flex-1 flex-col justify-center" : ""}`}>
          {/* 손님 질문 (오른쪽) */}
          <div className="flex justify-end">
            <p className="m-0! max-w-[85%] rounded-[18px] rounded-br-[6px] bg-primary px-4 py-2.5 text-[15px] font-medium leading-relaxed text-white md:text-base">
              {fields.question}
            </p>
          </div>

          {/* AI 답변 (왼쪽) + 출처 카드 */}
          <div className="flex gap-2.5">
            <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-[0_2px_8px_0_var(--brand-primary-10)]">
              <IconSparkles className="size-4" stroke={2} />
            </span>
            <div className="min-w-0 max-w-[88%] rounded-[18px] rounded-tl-[6px] border border-neutral-200 bg-white px-4 py-3 md:px-5 md:py-4">
              <p className="m-0! whitespace-pre-line text-[15px] leading-[1.75] text-neutral-800 md:text-base">{fields.answer}</p>
              {fields.sourceTitle && (
                <div className="mt-3 flex items-center gap-3 rounded-[11px] border border-[var(--brand-primary-20)] bg-[var(--brand-primary-5)] px-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white text-primary">
                    <IconFileText className="size-4.5" stroke={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold text-primary">출처</span>
                    <span className="block truncate text-sm font-bold text-neutral-900">{fields.sourceTitle}</span>
                    <span className="block truncate text-xs text-neutral-500">{fields.sourceSite || "우리 회사 웹블로그"}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <figcaption className={`mt-2 text-center text-xs text-neutral-400 md:text-sm ${floatingCaption ? "absolute inset-x-0 top-full" : ""}`}>이해를 돕기 위한 예시 화면입니다.</figcaption>
    </figure>
  );
}
