// 메인 페이지 "자주 묻는 질문" 섹션 (푸터 바로 위). 왼쪽 아이브로우 + 제목 + 안내, 오른쪽 아코디언.
import { MobileBreaks } from "@/blog/components/ui/MobileBreaks";
import { FaqAccordion } from "@/blog/components/ui/FaqAccordion";
import { getClinic } from "@/blog/lib/payload";
import { faq as defaultFaq } from "@/blog/lib/homeDefaults"; // 글로벌의 FAQ 가 비어 있을 때의 기본값
import type { FaqItem } from "@/blog/lib/types";

type Props = { items?: FaqItem[] }; // HomeContent.faq

export async function FaqSection({ items }: Props) {
  const clinic = await getClinic();
  const faqItems = items && items.length > 0 ? items : defaultFaq(clinic);
  // 검색엔진·AI 답변엔진이 질문·답을 그대로 읽어 가도록 FAQ 구조화 데이터 (글 페이지의 FAQ 와 같은 형식)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section aria-labelledby="home-faq-title" className="bg-neutral-50 py-16 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-site-4xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          {/* 왼쪽: 아이브로우 + 제목 + 안내 */}
          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-primary md:text-base">FAQ</p>
            <h2 id="home-faq-title" className="mt-1 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              자주 묻는 질문
            </h2>
            <p className="mt-3 whitespace-pre-line text-base text-neutral-600 md:text-lg">
              <MobileBreaks text={"웹블로그를 처음 알아보실 때|자주 묻는 내용을 모았습니다.\n더 궁금한 점은 오른쪽 아래 버튼으로 문의해 주세요."} />
            </p>
          </div>
          {/* 오른쪽: 아코디언 */}
          <div className="lg:col-span-8">
            <FaqAccordion items={faqItems} className="divide-y divide-neutral-200 border-y border-neutral-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
