// /privacy — 개인정보처리방침.
// 상담·예약 폼과 메타 리드 광고(인스턴트 양식)가 이 페이지 주소를 요구한다.
// 내용은 사이트가 실제로 수집하는 항목(이름·연락처·문의 내용·방문 기록)만 다룬다.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 · WEFLOW",
  description: "WEFLOW의 개인정보 수집·이용에 관한 안내입니다.",
  alternates: { canonical: "/privacy" },
  robots: { index: false }, // 정책 문서는 검색 결과에 띄울 이유가 없다
};

/** 조항 한 덩어리 — 제목과 문단·목록을 같은 서식으로 반복한다 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2 className="headline emphasized" style={{ margin: "0 0 0.6rem" }}>
        {title}
      </h2>
      <div className="callout c-secondary" style={{ lineHeight: 1.8, wordBreak: "keep-all" }}>
        {children}
      </div>
    </section>
  );
}

const ul: React.CSSProperties = { margin: "0.4rem 0 0", paddingLeft: "1.2rem" };

export default function PrivacyPage() {
  return (
    // 메인과 같은 흰 바탕 — .theme-light 가 색 변수를 밝은 값으로 바꾼다 (styles/globals.css)
    <div className="theme-light" style={{ background: "var(--section-a)" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "clamp(3rem, 6vw, 4.5rem) 1.5rem" }}>
        <h1 className="title-1" style={{ margin: "0 0 0.75rem" }}>개인정보처리방침</h1>
        <p className="callout c-muted" style={{ margin: "0 0 2.5rem" }}>
          위플로우(WEFLOW)는 개인정보보호법에 따라 이용자의 개인정보를 보호하며, 아래와 같이 처리 방침을 안내합니다.
        </p>

        <Section title="1. 수집하는 개인정보와 수집 방법">
          <p style={{ margin: 0 }}>
            홈페이지의 맞춤 견적 신청·상담 예약 폼, 그리고 SNS 광고의 신청 양식을 통해 이용자가 직접 입력한 정보를 수집합니다.
          </p>
          <ul style={ul}>
            <li>필수: 이름, 연락처</li>
            <li>폼에 따라: 지출 예산, 진행 방식, 참고 사이트 주소, 제작 종류, 업종, 문의 내용</li>
          </ul>
          <p style={{ margin: "0.6rem 0 0" }}>
            서비스 개선을 위해 방문 기록(접속 페이지, 유입 경로, 기기 종류)이 자동으로 수집될 수 있습니다. 이 기록은 특정 개인을 식별하지 않습니다.
          </p>
        </Section>

        <Section title="2. 수집 목적">
          <ul style={{ ...ul, marginTop: 0 }}>
            <li>견적·상담 요청에 대한 연락과 안내</li>
            <li>서비스 이용 통계 분석과 품질 개선</li>
          </ul>
        </Section>

        <Section title="3. 보유 및 이용 기간">
          <p style={{ margin: 0 }}>
            상담 목적이 달성된 후 지체 없이 파기하며, 늦어도 수집일로부터 1년을 넘기지 않습니다. 이용자가 삭제를 요청하면 즉시 파기합니다.
          </p>
        </Section>

        <Section title="4. 제3자 제공">
          <p style={{ margin: 0 }}>
            수집한 개인정보를 외부에 판매하거나 제공하지 않습니다. 법령에 근거한 요청이 있는 경우에만 예외로 합니다.
          </p>
        </Section>

        <Section title="5. 처리 위탁">
          <p style={{ margin: 0 }}>
            서비스 운영을 위해 아래 업체에 데이터 보관을 위탁합니다. 위탁받은 업체는 보관 외의 목적으로 정보를 사용하지 않습니다.
          </p>
          <ul style={ul}>
            <li>Vercel Inc. — 웹사이트 호스팅</li>
            <li>Neon Inc. — 문의·예약 데이터 보관</li>
          </ul>
        </Section>

        <Section title="6. 이용자의 권리">
          <p style={{ margin: 0 }}>
            이용자는 언제든지 본인 정보의 열람·정정·삭제를 요청할 수 있습니다. 아래 연락처로 요청하시면 지체 없이 처리합니다.
          </p>
        </Section>

        <Section title="7. 개인정보 보호책임자">
          <ul style={{ ...ul, marginTop: 0 }}>
            <li>책임자: 신서준 (대표)</li>
            <li>이메일: contact@weflowlab.kr</li>
            <li>전화: 010-2971-7280</li>
          </ul>
        </Section>

        <p className="footnote c-muted" style={{ margin: 0 }}>
          본 방침은 2026년 8월 3일부터 적용됩니다.
        </p>
      </div>
    </div>
  );
}