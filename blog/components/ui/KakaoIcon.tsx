// 카카오톡 버튼 아이콘: 갈색으로 채운 말풍선 하나 (노란 버튼 위에 쓴다).
// 테두리만 있는 Tabler 의 카카오 아이콘 대신, 카카오톡 버튼에서 흔히 보는 꽉 찬 말풍선 모양으로 그렸다.
import type { CSSProperties } from "react";

type Props = { className?: string; style?: CSSProperties };

export function KakaoIcon({ className = "size-5", style }: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} style={style}>
      <path
        fill="#3c1e1e"
        d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.32 4.66 6.74-.15.53-.97 3.4-1 3.62 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.83.57.08 1.15.12 1.73.12 5.52 0 10-3.58 10-8S17.52 3 12 3z"
      />
    </svg>
  );
}
