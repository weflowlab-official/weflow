// 메인 페이지 병의원 전용 섹션 (업종 카드 바로 아래).
// 병의원은 따로 만든 홍보 페이지(weflowlab.kr/clinic-blog)가 있어서, 여기서는 핵심만 보여 주고 그 페이지로 보낸다.
// 왼쪽: "글 하나로 SEO·AEO·GEO 까지" 안내 + 장점 3개 + 버튼(병의원 웹블로그 자세히 보기 / 병의원 글 둘러보기) + 진료과 칩.
// 오른쪽: '우리병원.com/blog' 예시 화면 — 진료과목 탭과 글 목록 (clinic-blog 의 예시 글과 같은 글).
import Link from "next/link";
import { IconArrowRight, IconArticle, IconCalendarEvent, IconCheck, IconStethoscope } from "@tabler/icons-react";
import { subIndustriesOf } from "@/blog/lib/industries";
import { Reveal } from "@/blog/components/ui/Reveal";
import { InView } from "@/blog/components/ui/InView";

// 예시 화면 안 요소의 등장 효과 (InView 가 화면에 들어오면 켠다)
const APPEAR =
  "opacity-0 translate-y-2 transition-[opacity,translate] duration-500 ease-out group-data-[in=true]/inview:opacity-100 group-data-[in=true]/inview:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none";

const POINTS = ["진료과목별로 정리되는 카테고리", "글을 읽다가 바로 병원 홈페이지·예약으로", "병원 홈페이지와 한 디자인, 한 관리자 화면"];

// 예시 화면 글 목록 (weflowlab.kr/clinic-blog 의 예시와 같은 글)
const TABS = ["임플란트", "교정", "잇몸"];
const POSTS = [
  { title: "임플란트 수술 후 일주일, 이것만 지켜 주세요", meta: "2026.10.12 · 조회 1,284" },
  { title: "임플란트 수명은 얼마나 될까요?", meta: "2026.09.30 · 조회 945" },
  { title: "뼈이식이 필요한 경우", meta: "2026.09.18 · 조회 611" },
];

export function ClinicFocusSection() {
  const specialties = subIndustriesOf("clinic");

  return (
    <section aria-labelledby="home-clinic-title" className="bg-[var(--brand-primary-5)] py-16 md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 overflow-hidden rounded-[24px] bg-linear-to-br from-primary to-[#0d2858] p-6 text-white md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14 lg:p-14">
          {/* 왼쪽: 안내 */}
          <div>
            {/* 모바일: 아이브로우·제목만 가운데 정렬 (아래 설명·목록·버튼은 왼쪽 그대로) */}
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white/70 md:justify-start md:text-base">
              <IconStethoscope className="size-4" />
              FOR CLINICS
            </p>
            <Reveal variant="up">
              <h2 id="home-clinic-title" className="mt-4 text-center text-2xl font-bold leading-tight md:text-left md:text-3xl lg:text-4xl">
                {/* 모바일: 네 줄로 끊는 자리를 정해 둔다 (그냥 두면 '뿐인데,'·'챙겨진다면?'이 홀로 떨어졌다). 데스크톱: 두 줄 */}
                병의원 웹블로그에
                <br className="md:hidden" /> 글 하나 올렸을 뿐인데,
                <br />
                <span className="text-[#9fbdf5]">SEO·AEO·GEO</span>까지
                <br className="md:hidden" /> 한 번에 챙겨진다면?
              </h2>
            </Reveal>
            {/* 넓은 화면에서 "만들어져," 뒤로 두 줄 — 한 줄이 칸을 넘지 않게 글씨를 조금 줄였다 */}
            <p className="mt-6 text-sm leading-relaxed text-white/75 md:text-[15px] lg:text-sm xl:text-[15px]">
              글을 올리면 사이트맵·핵심 요약·자주 묻는 질문·구조화 데이터가 함께 만들어져,
              <br className="hidden md:block" /> 네이버·구글 검색과 AI 답변까지 대비합니다. 병의원 전용 페이지에서 자세히 안내해 드립니다.
            </p>
            <ul className="mt-6 space-y-2.5">
              {POINTS.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[15px] font-semibold md:text-base">
                  <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <IconCheck className="size-3.5" stroke={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              {/* 사이트 쪽 페이지(루트 레이아웃이 다름) — Link 여도 페이지를 새로 불러온다 */}
              <Link
                href="/clinic-blog"
                className="group inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-white px-6 text-base font-bold text-primary transition-colors hover:bg-neutral-100"
              >
                <IconStethoscope className="size-5" />
                병의원 웹블로그 자세히 보기
                <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/blog/clinic"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-white/40 px-6 text-base font-bold text-white transition-colors hover:bg-white/10"
              >
                <IconArticle className="size-5" />
                병의원 글 둘러보기
              </Link>
            </div>

            {/* 진료과 칩 → 그 진료과 글 목록 */}
            {specialties.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {specialties.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/blog/clinic?sub=${s.slug}`}
                    className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/85 transition-colors hover:bg-white hover:text-primary"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽: 우리병원.com/blog 예시 화면. 화면에 들어오면 글 목록이 차례로 올라오고,
              첫 글이 '읽는 중'처럼 표시된 뒤 아래 예약 띠가 나타나 버튼이 깜빡인다 (clinic-blog 대화 장면과 같은 방식) */}
          <Reveal variant="fade-up" delay={0.15}>
            <figure aria-label="병의원 웹블로그 예시 화면">
              <InView className="overflow-hidden rounded-[16px] bg-white text-foreground shadow-[0_24px_60px_0_rgba(0,0,0,0.35)]">
                {/* 브라우저 주소창 */}
                <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
                  <span className="flex gap-1.5" aria-hidden>
                    <i className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <i className="size-2.5 rounded-full bg-[#febc2e]" />
                    <i className="size-2.5 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="ml-2 flex-1 truncate rounded-full bg-white px-3 py-1 text-xs text-neutral-500 ring-1 ring-neutral-200">우리병원.com/blog</span>
                </div>
                <div className="px-5 py-5 md:px-6">
                  <p className="text-base font-bold">우리병원치과 블로그</p>
                  <div className="mt-3 flex gap-4 border-b border-neutral-200 text-sm">
                    {TABS.map((t, i) => (
                      <span key={t} className={`-mb-px border-b-2 pb-2 ${i === 0 ? "border-primary font-bold text-primary" : "border-transparent text-neutral-500"}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-2 divide-y divide-neutral-100">
                    {POSTS.map((p, i) => (
                      <li key={p.title} className={`py-1 ${APPEAR}`} style={{ transitionDelay: `${0.3 + 0.3 * i}s` }}>
                        {/* 첫 글: 글이 다 올라온 뒤 '지금 읽는 글'처럼 옅게 칠해진다 */}
                        <div
                          className={`-mx-2 rounded-[10px] px-2 py-2 transition-colors duration-500 ${i === 0 ? "group-data-[in=true]/inview:bg-[var(--brand-primary-5)]" : ""}`}
                          style={i === 0 ? { transitionDelay: "1.4s" } : undefined}
                        >
                          <p className="truncate text-[15px] font-semibold">{p.title}</p>
                          <p className="mt-0.5 text-xs text-neutral-400">{p.meta}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`mt-3 flex items-center justify-between rounded-[12px] bg-[var(--brand-primary-5)] px-4 py-3 ${APPEAR}`}
                    style={{ transitionDelay: "1.9s" }}
                  >
                    <span className="text-sm font-semibold text-neutral-700">글을 읽고 바로 예약까지</span>
                    <span className="relative inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">
                      {/* 예약 버튼 둘레가 천천히 퍼지며 눈길을 끈다 */}
                      <span aria-hidden className="absolute -inset-1 hidden rounded-full border-2 border-primary group-data-[in=true]/inview:block group-data-[in=true]/inview:animate-pulse-ring motion-reduce:hidden!" />
                      <IconCalendarEvent className="size-3.5" />
                      진료 예약
                    </span>
                  </div>
                </div>
              </InView>
              <figcaption className="mt-2.5 text-center text-xs text-white/50">이해를 돕기 위한 예시 화면입니다.</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
