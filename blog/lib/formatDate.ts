// ISO 날짜 → "2026.10.17" (목록 카드·글 상세 공통)
// 늘 한국 시간(UTC+9) 기준으로 센다 — 기기 시간대를 쓰면 서버(Vercel, UTC)와 휴대폰(KST)이 밤 시간대 글의 날짜를
// 하루 다르게 그려, 클라이언트 컴포넌트(최신 글 슬라이더 등)에서 하이드레이션 오류가 났다
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.getUTCFullYear()}.${String(kst.getUTCMonth() + 1).padStart(2, "0")}.${String(kst.getUTCDate()).padStart(2, "0")}`;
}
