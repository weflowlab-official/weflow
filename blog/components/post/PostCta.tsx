// 글 하단 장점·상담 블록. 모든 글 끝에 자동으로 붙는다 (해시태그 아래).
// 위: WEFLOW 웹블로그 장점 (2열 목록) / 아래: 상담 문구 + 버튼 3개(무료 견적 신청 / 카카오톡 / 전화).
// 문구는 관리자 '회사 정보 → 글 하단 문구' 에서 바꿀 수 있고, 비어 있으면 기본 문구(lib/clinicDefaults.ts).
// 장점을 글마다 따로 쓰지 않으려고 만든 블록이다 — 고치면 모든 글이 같이 바뀐다.
import Link from "next/link";
import {
  IconArchive,
  IconCategory,
  IconClipboardList,
  IconPencil,
  IconPhone,
  IconPointer,
  IconSitemap,
  IconSparkles,
  IconBuildingStore,
  IconWorldSearch,
  type Icon,
} from "@tabler/icons-react";
import { KakaoIcon } from "@/blog/components/ui/KakaoIcon";
import { getClinic } from "@/blog/lib/payload";
import { MobileBreaks } from "@/blog/components/ui/MobileBreaks";
import { BENEFITS, BENEFITS_TITLE, CTA_TITLE as DEFAULT_TITLE, ctaText as defaultText } from "@/blog/lib/clinicDefaults";

export const CTA_SECTION_ID = "cta";

// 장점 순서대로 붙는 아이콘 (기본 장점 8개 순서와 맞춤)
const ICONS: Icon[] = [IconWorldSearch, IconSparkles, IconSitemap, IconBuildingStore, IconArchive, IconPointer, IconPencil, IconCategory];

type Props = { className?: string };

export async function PostCta({ className = "" }: Props) {
  const clinic = await getClinic();
  const benefitsTitle = clinic.benefitsTitle || BENEFITS_TITLE;
  const benefits = clinic.benefits.length ? clinic.benefits : BENEFITS;
  const title = clinic.ctaTitle || DEFAULT_TITLE;
  const text = clinic.ctaText || defaultText(clinic.name);
  const tel = `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section className={`mt-10 overflow-hidden rounded-[16px] border border-[var(--brand-primary-20)] ${className}`}>
      {/* 장점 */}
      <div className="bg-white px-5 py-7 md:px-8 md:py-9">
        <p className="m-0! text-sm font-semibold text-primary">WHY WEFLOW</p>
        <h2 className="m-0! mt-1! text-xl font-bold leading-snug text-foreground md:text-2xl">{benefitsTitle}</h2>
        <ul className="m-0! mt-6! grid list-none! gap-x-6 gap-y-5 p-0! sm:grid-cols-2">
          {benefits.map((b, i) => {
            const BenefitIcon = ICONS[i % ICONS.length];
            return (
              <li key={b.title} className="m-0! flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-10)] text-primary">
                  <BenefitIcon className="size-5" stroke={1.75} />
                </span>
                <span className="min-w-0">
                  <strong className="block text-[15.5px] font-bold text-foreground">{b.title}</strong>
                  <span className="mt-0.5 block text-sm leading-relaxed text-neutral-600">{b.text}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 상담 */}
      <div className="bg-[var(--brand-primary-5)] px-5 py-8 text-center md:px-8 md:py-10">
        <h2 id={CTA_SECTION_ID} className="m-0! text-xl font-bold leading-snug text-foreground md:text-2xl">
          <MobileBreaks text={title} />
        </h2>
        <p className="m-0! mt-3! whitespace-pre-line text-[15px] leading-relaxed text-neutral-600 md:text-base">
          <MobileBreaks text={text} />
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
          <Link
            href={clinic.consultUrl}
            className="inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] bg-primary px-6 text-base font-semibold text-white no-underline! transition-colors hover:bg-brand-secondary"
          >
            <IconClipboardList className="size-5" />
            무료 견적 신청
          </Link>
          {clinic.kakaoChannelUrl && (
            <a
              href={clinic.kakaoChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] bg-[#fee500] px-6 text-base font-semibold text-[#191919] no-underline! transition-colors hover:bg-[#f5dc00]"
            >
              <KakaoIcon className="size-5" />
              카카오톡 상담
            </a>
          )}
          <a
            href={tel}
            className="inline-flex h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] border border-primary bg-white px-6 text-base font-semibold text-primary no-underline! transition-colors hover:bg-primary hover:text-white"
          >
            <IconPhone className="size-5" />
            바로 전화
          </a>
        </div>
      </div>
    </section>
  );
}
