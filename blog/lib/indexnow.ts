// IndexNow — 글을 발행·수정·삭제하면 "이 주소가 바뀌었다"고 검색엔진에 바로 알린다 (2026-11-21).
// 받는 곳: 빙(ChatGPT 검색이 빙 결과를 쓴다)·네이버·얀덱스 등. 구글과 다음은 받지 않는다 — 그쪽은 사이트맵·수집 요청으로 챙긴다.
//
// 열쇠: 아래 KEY 와 같은 글자가 적힌 파일이 사이트 맨 위(public/<KEY>.txt → https://weflowlab.kr/<KEY>.txt)에 있어야 한다.
//       "이 신호는 사이트 주인이 보냈다"는 증명이라 숨길 값이 아니다 (누구나 그 주소로 열어 볼 수 있다). 바꾸려면 파일 이름·내용과 KEY 를 같이 바꾼다.
// 보내는 곳: 공통 주소(api.indexnow.org — 참여 검색엔진끼리 나눠 갖는다)와 네이버 주소 두 곳. 네이버가 주력이라 직접 한 번 더 보낸다.
// 운영 사이트에서만 보낸다 — 로컬·미리보기 배포에서 글을 저장할 때는 신호를 보내지 않는다.
// 실패해도 글 저장은 그대로 되어야 하므로 오류는 삼키고, 4초 안에 답이 없으면 끊는다.
const HOST = "weflowlab.kr";
const KEY = "53c299883cd98967346562d2e3d7a079";
const ENDPOINTS = ["https://api.indexnow.org/indexnow", "https://searchadvisor.naver.com/indexnow"];

// 같은 주소는 10분 안에 한 번만 보낸다 — 글 여러 편을 연달아 올리면 목록 주소(/blog · /blog/posts · 카테고리)가 글마다 다시 나가기 때문.
// 서버가 켜져 있는 동안만 기억하는 표라(서버가 새로 뜨면 비워진다) 완벽하지는 않지만, 연달아 올리는 경우는 대부분 걸러진다
const SENT = new Map<string, number>();
const THROTTLE_MS = 10 * 60 * 1000;

/** paths: 블로그 기준 경로("/", "/posts", "/카테고리/글") — revalidate 에 넘기는 것과 같은 목록을 그대로 준다 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== "production") return;
  const now = Date.now();
  const urlList = [...new Set(paths)]
    .map((p) => `https://${HOST}/blog${p === "/" ? "" : encodeURI(p)}`)
    .filter((u) => now - (SENT.get(u) ?? 0) > THROTTLE_MS);
  if (!urlList.length) return;
  for (const u of urlList) SENT.set(u, now);
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList });
  await Promise.allSettled(
    ENDPOINTS.map((url) =>
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body, signal: AbortSignal.timeout(4000) }),
    ),
  );
}
