import {
  BadgePercent,
  Clock,
  MessageCircle,
  Users,
  Wrench,
  MonitorSmartphone,
  LayoutDashboard,
  Link2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";

// 강점 카드 8장을 채우는 데이터
// img: 사진 번호는 카드마다 정해져 있다 — 맨 앞에 있던 '제휴 마케팅 연결'(service1)을 빼서 2번부터 시작한다
const FEATURES: {
  Icon: LucideIcon;
  title: string;
  desc: string;
  img: string;
}[] = [
  {
    Icon: Users,
    title: "1:1 맞춤 시스템",
    desc: "전담 담당자가 고객 한 분을 1:1로 전담 케어합니다.",
    img: "/images/service/service2.webp",
  },
  {
    Icon: LayoutDashboard,
    title: "관리자 페이지 제공 (선택형)",
    desc: "통계를 통해 문의·예약을 관리하고 관리자 DB를 확보합니다.",
    img: "/images/service/service3.webp",
  },
  {
    Icon: MonitorSmartphone,
    title: "반응형 디자인 (PC/MO)",
    desc: "PC·모바일 등 모든 기기에서 최적화된 화면을 보여줍니다.",
    img: "/images/service/service4.webp",
  },
  {
    Icon: Link2,
    title: "SNS 연동",
    desc: "카카오톡, 인스타그램 등 원하는 플랫폼을 자유롭게 연동합니다.",
    img: "/images/service/service5.webp",
  },
  {
    Icon: MessageCircle,
    title: "고객의 소리",
    desc: "충분한 소통으로 고객이 진짜 원하는 것을 먼저 반영합니다.",
    img: "/images/service/service6.webp",
  },
  {
    Icon: Wrench,
    title: "각 상품별 전용 유지보수",
    desc: "도메인·수정·운영까지 상품에 맞춘 유지보수를 제공합니다.",
    img: "/images/service/service7.webp",
  },
  {
    Icon: BadgePercent,
    title: "합리적 가성비",
    desc: "필요한 기능만 구성해 부담 없는 합리적인 비용으로 시작합니다.",
    img: "/images/service/service8.webp",
  },
  {
    Icon: Clock,
    title: "24시간 상담 대기",
    desc: "연중무휴 24시간, 언제 문의하셔도 빠르게 응답합니다.",
    img: "/images/service/service9.webp",
  },
];

/**
 * "WEFLOW만의 강점" 섹션 — 강점 8가지를 4열 × 2줄 사진 카드로 보여준다.
 * (서비스 안내 탭에 있던 섹션 — 그 탭을 혜택 탭으로 합치면서 /benefits 에서 쓴다)
 * 머리말·카드 모양은 혜택 탭 공용 스타일(.svc-*, app/benefits/page.tsx)을 쓴다.
 */
export default function ServiceFeatures() {
  return (
    <section className="svc-section">
      <div className="svc-inner">
        <header className="svc-head">
          <Reveal variant="up">
            <p className="svc-eyebrow">OUR STRENGTHS</p>
          </Reveal>
          <SplitText
            as="h2"
            className="svc-title"
            segments={[
              { text: "WEFLOW만의 " },
              { text: "강점", className: "svc-hl" },
              { text: "을\n지금 바로 경험하세요" },
            ]}
          />
        </header>

        {/* 카드 그리드 — 사진이 위를 채우고, 아이콘 타일이 사진 아랫변에 반쯤 걸친다 */}
        <Reveal as="div" stagger className="svc-feat-grid">
          {FEATURES.map(({ Icon, title, desc, img }) => (
            <div key={title} className="svc-card">
              <div className="svc-card__photo">
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 280px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="svc-card__icon">
                <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="svc-card__body">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <style>{`
        .svc-feat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
        }
        @media (max-width: 1000px) {
          .svc-feat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .svc-feat-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
