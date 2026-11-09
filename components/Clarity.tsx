import Script from "next/script";

/**
 * Microsoft Clarity — 방문자가 어디를 누르고 어디까지 내렸는지 기록한다 (메인 사이트·병의원·웹블로그 공통, 한 프로젝트).
 * 사이트 레이아웃(app/(site)/layout.tsx)과 웹블로그 레이아웃(app/(blog)/layout.tsx)에 넣는다. 블로그 관리자(/blogadmin)는 별도 레이아웃이라 빠진다.
 * 실제 도메인(weflowlab.kr)에서만 켜고, 로컬·vercel.app 미리보기, 관리자 화면(/admin), 본인 브라우저(?notrack=1 로 opt-out, PageTracker 와 같은 표시)는 뺀다.
 */
const CLARITY_ID = "z9uxwu1vno";

export default function Clarity() {
  return (
    <Script id="clarity" strategy="afterInteractive">
      {`
        (function () {
          if (location.hostname !== "weflowlab.kr" && location.hostname !== "www.weflowlab.kr") return;
          if (location.pathname === "/admin" || location.pathname.indexOf("/admin/") === 0) return;
          try { if (localStorage.getItem("weflow_notrack") === "1") return; } catch (e) {}
          (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        })();
      `}
    </Script>
  );
}
