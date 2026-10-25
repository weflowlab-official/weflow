// 메인 페이지 "플랫폼 블로그의 한계" 섹션 — AI 검색 장면 바로 뒤.
// 메인 사이트 /webblog 의 WHY NOW 02(블로그 방문자 그래프가 뚝 떨어지고 직원·대표 대화가 이어지는 장면)를 그대로 쓴다.
// 부품은 app/(site)/clinic-blog/Scenes 의 PlatformDropScene, 바탕 CSS 는 siteSceneCss.
// 제목 줄(아이브로우·h2)과 위아래 여백만 웹블로그 메인의 다른 섹션에 맞춘다.
import { PlatformDropScene, type Line } from "@/app/(site)/clinic-blog/Scenes";
import { SITE_SCENE_CSS } from "./siteSceneCss";

const BOSS = { who: "boss", name: "대표님", short: "대표" } as const;
const STAFF = { who: "staff", name: "직원", short: "직원" } as const;

// 방문자 그래프가 뚝 떨어진 뒤
const DROP_LINES: Line[] = [
  { ...STAFF, text: "대표님, 블로그 노출이 갑자기 다 빠졌어요." },
  { ...BOSS, text: "3년 동안 쓴 글인데요?" },
  { ...STAFF, text: "플랫폼 쪽 문제라 저희가 할 수 있는 게 없대요." },
];

export function PlatformDropSection() {
  return (
    <div className="site-scene pds">
      <PlatformDropScene
        chapter="PLATFORM BLOG"
        title={<>그렇다고 <span className="cb-hl">블로그에만</span> 쌓으면,{"\n"}그 글은 우리 것이 아닙니다</>}
        body={<>
          블로그 검색 노출은 갈수록 줄고, <br className="cb-mo" />플랫폼 정책은 언제든 바뀝니다.<br />
          몇 년 동안 쌓은 글이 한순간에 힘을 잃어도<br />
          <span className="cb-hl">우리가 손쓸 수 있는 게 없습니다.</span>
        </>}
        lines={DROP_LINES}
      />
      <style>{SITE_SCENE_CSS + `
        /* 웹블로그 메인의 다른 섹션(py-16 md:py-24, 아이브로우 text-sm/base semibold)과 같은 결로 */
        .pds .cb-scene { padding: 64px 0; }
        @media (min-width: 768px) { .pds .cb-scene { padding: 96px 0; } }
        .pds .cb-wrap { max-width: 1080px; }
        .pds .cb-chapter { margin: 0 0 4px; font-size: .875rem; font-weight: 600; letter-spacing: 0; color: var(--color-primary); }
        @media (min-width: 768px) { .pds .cb-chapter { font-size: 1rem; } }
      `}</style>
    </div>
  );
}
