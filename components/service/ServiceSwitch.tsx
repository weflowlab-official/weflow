import Image from "next/image";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";

/**
 * "타 서비스에서 전환하신다면?" 섹션 — 다른 업체에서 만든 사이트를
 * WEFLOW로 갈아타도록 문의를 유도한다. (동작하는 토글 스위치가 아니라 안내용 섹션이다)
 * (서비스 안내 탭에 있던 섹션 — 그 탭을 혜택 탭으로 합치면서 /benefits 에서 쓴다)
 * 머리말 모양은 혜택 탭 공용 스타일(.svc-*, app/benefits/page.tsx)을 쓴다.
 */
export default function ServiceSwitch() {
  return (
    <section className="svc-section">
      <div className="svc-inner">
        <header className="svc-head">
          <Reveal variant="up">
            <p className="svc-eyebrow">ONE MORE THING</p>
          </Reveal>
          <SplitText
            as="h2"
            className="svc-title svc-switch-title"
            step={0.024}
            segments={[
              { text: "타 서비스에서 전환하신다면?\n" },
              { text: "고민 전 " },
              { text: "문의 요망!", className: "svc-hl" },
            ]}
          />
        </header>

        {/* 이미지 박스 2개 */}
        <Reveal as="div" stagger className="svc-switch-boxes">
          {[0, 1].map((i) => (
            <div key={i} className="svc-switch-img">
              <Image
                src={`/images/service/service${i + 16}.webp`}
                alt="타 서비스 전환"
                fill
                sizes="(max-width: 760px) 100vw, 420px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </Reveal>
      </div>

      <style>{`
        .svc-switch-boxes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(0.85rem, 1.8vw, 1.4rem);
          max-width: 860px;
          margin: 0 auto;
        }
        .svc-switch-img {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: clamp(18px, 2.2vw, 28px);
          background: #e9ebee;
        }
        @media (max-width: 760px) {
          .svc-switch-boxes { grid-template-columns: 1fr; max-width: 420px; }
        }
        @media (max-width: 600px) {
          /* "타 서비스에서 전환하신다면?" 을 한 줄에 —
             SplitText 가 공백을 줄바꿈 없는 공백으로 바꿔 통째로 한 덩어리라,
             폭이 모자라면 글자 중간에서 잘린다. 폭에 맞춰 글씨를 줄여 막는다 */
          .svc-switch-title { font-size: min(1.75rem, 6.4vw); }
        }
      `}</style>
    </section>
  );
}
