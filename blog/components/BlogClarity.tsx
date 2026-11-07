import Script from "next/script";

/**
 * Microsoft Clarity — 웹블로그(/blog)에서만 방문자가 어디를 누르고 어디까지 내렸는지 기록한다.
 * 웹블로그 레이아웃에만 넣으므로 메인 사이트·병의원 페이지·관리자(/blogadmin)는 기록하지 않는다.
 * 실제 도메인(weflowlab.kr)에서만 켜고, 로컬·vercel.app 미리보기와 본인 브라우저(?notrack=1 로 opt-out, PageTracker 와 같은 표시)는 뺀다.
 */
const CLARITY_ID = "z9uxwu1vno";

export function BlogClarity() {
  return (
    <Script id="blog-clarity" strategy="afterInteractive">
      {`
        (function () {
          if (location.hostname !== "weflowlab.kr" && location.hostname !== "www.weflowlab.kr") return;
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
