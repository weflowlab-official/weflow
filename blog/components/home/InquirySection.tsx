// 메인 페이지 맨 아래(푸터 바로 위) 무료 견적 신청 섹션 — weflowlab.kr/clinic-blog 하단 '상담 신청'을 업종 공통으로 옮긴 것.
// 왼쪽: 안내 + 상담에서 받아 가는 것 + 전화 / 오른쪽: 신청 폼(InquiryForm).
// 블로그 곳곳의 '무료 견적' 버튼(회사 정보 → 상담 버튼 연결 주소, 기본 /blog#contact)이 여기로 온다.
import { IconCheck, IconPhone } from "@tabler/icons-react";
import { getClinic } from "@/blog/lib/payload";
import { InquiryForm } from "./InquiryForm";

// 상담에서 받아 가는 것 — 신청하면 무엇을 얻는지 미리 보여 준다
const GETS = ["업종에 맞춘 카테고리 구성안", "기존 홈페이지와 연결하는 방식", "예상 일정과 견적"];

export async function InquirySection() {
  const clinic = await getClinic();
  const tel = `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section id="contact" aria-labelledby="home-contact-title" className="scroll-mt-20 bg-linear-to-b from-[var(--brand-primary-5)] to-white py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-site-4xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28">
          <p className="text-sm font-semibold text-primary md:text-base">CONTACT</p>
          <h2 id="home-contact-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
            우리 업종에 맞는 구성부터
            <br />
            받아 보세요
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            비용은 카테고리 수, 디자인 범위, 홈페이지 연동 방식에 따라 달라집니다. 상담을 통해 우리 업종에 맞는 구성과 견적을 함께 안내해 드립니다.
          </p>
          <ul className="mt-6 space-y-2.5">
            {GETS.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <IconCheck className="size-3.5" stroke={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <a
              href={tel}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-primary bg-white px-5 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <IconPhone className="size-5" />
              전화 상담하기
            </a>
          </div>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
