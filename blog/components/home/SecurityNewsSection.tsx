// 메인 페이지 보안 섹션 (히어로 바로 아래, 어두운 바탕).
// 위: 2026년 10월 PHP 보안 취약점 보도 4건 — 기사 화면에서 제목·부제만 잘라 썼다 (머니투데이는 구글 추가 버튼 줄도 뺐다) (기사 사진·기자 사진은 빼고, 언론사·날짜를 함께 밝힌다).
// 아래: 옛 방식(PHP 서버) vs WEFLOW(Next.js) 비교.
// 문구 기준: "Next.js 는 절대 안전" 같은 말은 쓰지 않는다. 어떤 기술이든 취약점은 나오므로, 업데이트가 계속 챙겨지는 구조라는 점을 내세운다.
// 기사 이미지: public/images/blog/news-php-0N.webp (원본은 바탕화면 스크린샷, 2026-10-23)
import Image from "next/image";
import { IconAlertTriangle, IconCheck, IconShieldCheck, IconX } from "@tabler/icons-react";
import { Reveal } from "@/blog/components/ui/Reveal";

const NEWS = [
  { src: "/images/blog/news-php-01.webp", w: 900, h: 411, source: "연합뉴스", date: "2026.10.22", title: "PHP 보안 취약점에 해킹 비상…국내 IT·보안업계 긴급 대응" },
  { src: "/images/blog/news-php-03.webp", w: 900, h: 402, source: "뉴스1", date: "2026.10.22", title: "국가안보실, 민관군 사이버안보 긴급 대책회의…\"PHP 취약점 신속 대응\"" },
  { src: "/images/blog/news-php-02.webp", w: 900, h: 411, source: "머니투데이", date: "2026.10.22", title: "'해킹 구멍' PHP…국내 서버 10대 중 9대, '업데이트 불가'" },
  { src: "/images/blog/news-php-04.webp", w: 900, h: 420, source: "연합뉴스", date: "2026.10.23", title: "'PHP 취약' 공개 나흘전부터 공격 포착…\"해킹 시도 수백만건\"" },
];

const OLD = [
  "서버에서 PHP 프로그램이 늘 돌아가며 요청을 처리합니다",
  "보안 업데이트를 사이트마다 따로 챙겨야 합니다",
  "오래된 버전은 업데이트 자체가 어려운 경우가 많습니다",
  "관리자 화면·플러그인이 공격 통로가 되기도 합니다",
];

const NEW = [
  "대기업 서비스에도 쓰이는 React·Next.js로 만듭니다",
  "페이지를 미리 만들어 두고 전 세계 서버망(CDN)에서 내보냅니다",
  "모든 페이지가 보안 연결(HTTPS)로 열립니다",
  "서버·보안 업데이트는 WEFLOW 월 운영관리에서 계속 챙깁니다",
];

export function SecurityNewsSection() {
  return (
    <section aria-labelledby="home-security-title" className="overflow-hidden bg-[#0e1117] py-16 text-white md:py-24">
      <div className="mx-auto w-full max-w-site-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#7fa6ef] md:text-base">
            <IconAlertTriangle className="size-4" />
            SECURITY
          </p>
          <Reveal variant="up">
            <h2 id="home-security-title" className="mt-2 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
              {/* "이번 주" 같은 말은 시간이 지나면 틀린 말이 되므로 시점 없이 쓴다.
                  "PHP 는 계속 뚫린다" 같은 단정 대신, 아래 기사들이 보여 주는 사실(뉴스가 반복된다)만 말한다 */}
              &lsquo;PHP 보안 취약점&rsquo;
              <br className="md:hidden" /> 뉴스는 끊이지 않습니다
            </h2>
          </Reveal>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            국내 PHP 서버 상당수가 업데이트되지 않은<br className="md:hidden" /> 옛 버전이라는 보도가 잇따랐습니다.
            <br /> 오래된 기술 위에 만든 홈페이지는<br className="md:hidden" /> 보안 업데이트를 놓치는 순간 위험해집니다.
          </p>
        </div>

        {/* 기사 4건: 모바일은 옆으로 넘기는 카드, md 이상은 2열 (높이가 달라 위쪽 정렬) */}
        <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:items-start md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {NEWS.map((n, i) => (
            <Reveal key={n.src} variant="fade-up" delay={0.08 * i} className="w-[85%] shrink-0 snap-center md:w-auto">
              {/* 오른쪽 열은 통째로 40px 내린다 (자리는 그대로 두고 그림만 옮긴다).
                  두 열의 기사 높이 합이 같아야 위·아래 엇갈림이 같다 — 그래서 머니투데이는 구글 버튼 줄을 잘라 왼쪽 합을 맞췄다 */}
              <figure className={i % 2 === 1 ? "md:translate-y-10" : ""}>
                <div className="overflow-hidden rounded-[12px] border border-white/10 bg-white shadow-[0_16px_40px_0_rgba(0,0,0,0.45)]">
                  <Image src={n.src} alt={`${n.source} 기사: ${n.title}`} width={n.w} height={n.h} sizes="(min-width: 768px) 560px, 85vw" className="h-auto w-full" />
                </div>
                <figcaption className="mt-2.5 text-xs text-white/50 md:text-sm">
                  {n.source} · {n.date}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-white/35 md:mt-16">기사 화면 일부를 갈무리했습니다.<br className="md:hidden" /> 내용은 각 언론사 보도를 확인해 주세요.</p>

        {/* 옛 방식 vs WEFLOW */}
        <div className="mt-14 md:mt-20">
          <Reveal variant="up">
            <h3 className="text-center text-xl font-bold leading-snug md:text-3xl">
              {/* "보안 문제 없음" 이 아니라 "PHP 취약점 걱정 없음" 까지만 말한다 — Next.js 사이트는 서버에서 PHP 를 쓰지 않으므로 사실 그대로다 */}
              하지만 WEFLOW는
              <br />
              처음부터 <span className="text-[#7fa6ef]">최신 기술(Next.js)</span>로 만들어
              <br className="md:hidden" /> PHP 취약점 걱정이 없습니다
            </h3>
            <p className="mt-4 text-center text-base text-white/70 md:text-lg">
              WEFLOW 홈페이지와 웹블로그는<br className="md:hidden" />{" "}
              <strong className="font-bold text-white underline decoration-[#7fa6ef] decoration-2 underline-offset-4">
                PHP를 쓰지 않습니다.
              </strong>
            </p>
          </Reveal>
          {/* 두 박스를 합쳐 1000px, 같은 폭으로 가운데 */}
          <div className="mx-auto mt-8 grid max-w-[1000px] gap-3 md:mt-10 md:grid-cols-2 md:gap-4">
            <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
              <p className="text-sm font-semibold text-white/50">옛 방식</p>
              <p className="mt-1 text-lg font-bold md:text-xl">PHP 서버 위의 홈페이지</p>
              <ul className="mt-5 space-y-3">
                {OLD.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-white/70 md:text-[15px]">
                    <IconX className="mt-0.5 size-4 shrink-0 text-[#f87171]" stroke={2.5} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[16px] border border-[#7fa6ef]/40 bg-linear-to-br from-primary/40 to-primary/10 p-5 shadow-[0_0_0_1px_rgba(127,166,239,0.15),0_20px_50px_0_rgba(27,78,167,0.35)] md:p-7">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-[#9fbdf5]">
                <IconShieldCheck className="size-4" />
                WEFLOW
              </p>
              <p className="mt-1 text-lg font-bold md:text-xl">Next.js로 만든 홈페이지·웹블로그</p>
              <ul className="mt-5 space-y-3">
                {NEW.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-white/90 md:text-[15px]">
                    <IconCheck className="mt-0.5 size-4 shrink-0 text-[#7fa6ef]" stroke={2.5} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-white/40 md:text-sm">
            어떤 기술도 &lsquo;절대 안전&rsquo;하지는 않습니다.<br className="md:hidden" /> 중요한 건 업데이트가 계속 챙겨지는 구조입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
