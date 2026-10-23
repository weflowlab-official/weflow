// 사이트 푸터 (자체 구성). 연한 회색 배경 3열: 로고 + 사업자 정보 / 상담 시간·채널 / 상담 문의(무료 견적 · 카카오톡 · 전화).
// 하단 바: 법적 링크 + 저작권. 데이터는 Payload 회사 정보(getClinic). 사업자 정보는 weflowlab.kr 푸터와 같은 값.
import Link from "next/link";
import { IconClipboardList, IconPhone } from "@tabler/icons-react";
import { KakaoIcon } from "@/blog/components/ui/KakaoIcon";
import { getClinic } from "@/blog/lib/payload";
import { Container } from "@/blog/components/ui/Container";
import { BlogLogo } from "@/blog/components/layout/BlogLogo";

export async function SiteFooter() {
  const clinic = await getClinic();
  const tel = `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`;
  // 사업자 정보 줄. 항목마다 p 로 두어야 검색엔진이 글자를 뽑을 때 항목이 붙지 않는다
  const businessLines = [
    clinic.representatives.length > 0 && `대표 : ${clinic.representatives.join(", ")}`,
    clinic.businessNumber && `사업자등록번호 : ${clinic.businessNumber}`,
    clinic.fax && `이메일 : ${clinic.fax}`,
    clinic.address && `주소 : ${clinic.address}`,
  ].filter(Boolean) as string[];

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-700">
      <Container size="4xl" className="grid gap-10 py-14 md:py-16 lg:grid-cols-3 lg:pl-16 lg:pr-8 xl:pl-28 xl:pr-16">
        {/* 1열: 로고 + 한 줄 소개 + 사업자 정보 */}
        <div className="lg:w-80 lg:justify-self-start">
          <Link href="/blog" aria-label="웹블로그 홈으로 이동" className="inline-block">
            <BlogLogo />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            검색에 등록되고 AI가 읽는 웹블로그,
            <br />
            업종에 맞게 설계합니다.
          </p>
          <div className="mt-4 space-y-1 text-sm text-neutral-500">
            {businessLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        {/* 2열: 상담 시간 + 채널 */}
        <div className="lg:justify-self-center">
          <h2 className="flex h-9 items-center text-sm font-bold text-neutral-900 md:text-base">상담 시간</h2>
          <ul className="mt-4 space-y-1.5 text-sm md:text-base">
            {clinic.hours.map((h) => (
              <li key={h.label} className="flex gap-4">
                <span className="w-20 shrink-0 text-neutral-500">{h.label}</span>
                <span className="font-medium text-neutral-800">{h.value}</span>
              </li>
            ))}
          </ul>
          {clinic.sns.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
              {clinic.sns.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3열: 상담 문의 */}
        <div className="lg:w-80 lg:justify-self-end">
          <h2 className="flex h-9 items-center text-sm font-bold text-neutral-900 md:text-base">상담 문의</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={clinic.consultUrl}
              className="inline-flex h-11 items-center gap-2 rounded-[11px] bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary md:text-base"
            >
              <IconClipboardList className="size-5" />
              무료 견적 신청
            </Link>
            {clinic.kakaoChannelUrl && (
              <a
                href={clinic.kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[11px] bg-[#fee500] px-4 text-sm font-semibold text-[#191919] transition-colors hover:bg-[#f5dc00] md:text-base"
              >
                <KakaoIcon className="size-5" />
                카카오톡
              </a>
            )}
          </div>
          <a href={tel} className="mt-3 flex items-center gap-2 text-lg font-bold text-neutral-900 hover:text-primary md:text-xl">
            <IconPhone className="size-5 text-primary" />
            {clinic.phone}
          </a>
        </div>
      </Container>

      {/* 하단 바: 법적 링크 + 저작권 */}
      <div className="border-t border-neutral-200">
        <Container size="4xl" className="flex flex-col items-center gap-3 py-5 text-sm text-neutral-500 md:flex-row md:justify-between">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {clinic.legalLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-primary">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p>© 2026 {clinic.name}. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}
