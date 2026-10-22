// 메인 페이지 "웹블로그란?". 흰 배경: 아이브로우 + 제목 + 요약 문단(관리자 '메인 페이지 → 소개·요약'), 그 아래 홈페이지 vs 웹블로그 비교.
// 비교는 weflowlab.kr/clinic-blog 의 '홈페이지와 웹블로그, 뭐가 다른가요?' 를 업종 공통 문구로 옮긴 것.
// 글자로 정리된 소개라 AI 검색·검색엔진이 요약을 인용하기 쉽다 (AEO 목적도 겸함).
import { IconBrowser, IconNotebook, IconPlus } from "@tabler/icons-react";
import { Reveal } from "@/blog/components/ui/Reveal";
import { TypingText } from "@/blog/components/ui/TypingText";
import { MobileBreaks } from "@/blog/components/ui/MobileBreaks";
import { getClinic } from "@/blog/lib/payload";
import * as defaults from "@/blog/lib/homeDefaults"; // Payload 'home' 글로벌 값이 비어 있을 때의 기본 문구

type Props = {
  title?: string; // HomeContent.summaryTitle
  text?: string; // HomeContent.summaryText
};

// 비교 행: [항목, 홈페이지, 웹블로그]
const ROWS: [string, string, string][] = [
  ["주소", "우리회사.com", "우리회사.com/blog"],
  ["역할", "회사를 소개하고 믿음을 줍니다", "검색에서 새 고객을 데려옵니다"],
  ["담는 내용", "회사 소개 · 서비스 · 오시는 길", "고객이 묻는 질문에 답하는 글"],
  ["바뀌는 주기", "한 번 만들고 필요할 때 고칩니다", "글이 꾸준히 쌓입니다"],
];

export async function SummarySection({ title, text }: Props) {
  const clinic = await getClinic();
  const summaryTitle = title || defaults.SUMMARY_TITLE;
  const summaryText = text || defaults.summaryText(clinic);

  return (
    <section aria-labelledby="home-summary-title" className="py-16 md:py-24">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        {/* 소개: 가운데 정렬 (아이브로우 → 제목 → 문단) */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary md:text-base">WHAT IS WEB BLOG</p>
          {/* 제목은 타이핑되듯 한 글자씩 (커서 없음), 문단은 살짝 늦게 떠오른다 */}
          <h2 id="home-summary-title" className="mt-1 whitespace-pre-line text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            <TypingText text={summaryTitle} />
          </h2>
          <Reveal variant="fade-up" delay={0.15}>
            <p className="mt-5 whitespace-pre-line text-base font-medium leading-relaxed text-neutral-700 md:text-lg">
              <MobileBreaks text={summaryText} />
            </p>
          </Reveal>
        </div>

        {/* 홈페이지 vs 웹블로그: 두 카드 + 가운데 "+" */}
        <Reveal variant="fade-up" delay={0.2}>
          <div className="mx-auto mt-10 grid max-w-4xl items-stretch gap-3 md:mt-14 md:grid-cols-[1fr_auto_1fr] md:gap-4">
            <CompareCard label="홈페이지" sub="회사의 얼굴" Icon={IconBrowser} col={1} />
            <div className="flex items-center justify-center text-neutral-400" aria-hidden>
              <span className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
                <IconPlus className="size-5" />
              </span>
            </div>
            <CompareCard label="웹블로그" sub="고객을 데려오는 길" Icon={IconNotebook} col={2} highlight />
          </div>
          <p className="mt-6 text-center text-base font-semibold text-foreground md:text-lg">
            둘이 함께면, <span className="text-primary">검색에서 상담까지 한 사이트 안에서</span> 이어집니다.
          </p>
        </Reveal>

        {/* 실적: 회사 정보에 실적이 있을 때만 */}
        {clinic.stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-4 md:mt-14 lg:grid-cols-4 lg:gap-6">
            {clinic.stats.map((s) => (
              <div key={s.label} className="rounded-[11px] border border-neutral-200 bg-neutral-50 px-5 py-6 text-center md:px-6 md:py-8">
                <dd className="whitespace-nowrap text-xl font-bold text-primary md:text-3xl">{s.value}</dd>
                <dt className="mt-2 text-sm text-neutral-600 md:text-base">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

function CompareCard({ label, sub, Icon, col, highlight = false }: { label: string; sub: string; Icon: typeof IconBrowser; col: 1 | 2; highlight?: boolean }) {
  return (
    <div className={`rounded-[16px] border p-5 md:p-6 ${highlight ? "border-[var(--brand-primary-20)] bg-[var(--brand-primary-5)]" : "border-neutral-200 bg-white"}`}>
      <div className="flex items-center gap-3">
        <span className={`flex size-11 items-center justify-center rounded-[12px] ${highlight ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"}`}>
          <Icon className="size-6" stroke={1.75} />
        </span>
        <span>
          <strong className="block text-lg font-bold text-foreground md:text-xl">{label}</strong>
          <span className="block text-sm text-neutral-500">{sub}</span>
        </span>
      </div>
      <dl className="mt-5 space-y-3">
        {ROWS.map((r) => (
          <div key={r[0]} className="flex gap-3 border-t border-neutral-200/70 pt-3 text-sm md:text-[15px]">
            <dt className="w-20 shrink-0 text-neutral-500">{r[0]}</dt>
            <dd className={`font-medium ${highlight ? "text-foreground" : "text-neutral-700"}`}>{r[col]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
