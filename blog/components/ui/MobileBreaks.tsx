// 문구 안의 "|" 를 모바일(md 미만)에서는 줄바꿈, 데스크톱에서는 띄어쓰기 한 칸으로 바꿔 준다.
// 실제 줄바꿈(\n)은 모든 화면에서 유지(whitespace-pre-line).
// 예: "웹블로그는|우리 홈페이지 안의 블로그입니다" → 모바일 두 줄, 데스크톱 "웹블로그는 우리 홈페이지 안의 블로그입니다"
// "|" 는 띄어쓰기 자리에 쓴다 (앞뒤에 따로 빈칸을 두지 않는다).
// 예외: 가운뎃점(·) 바로 뒤의 "|" 는 데스크톱에서 빈칸 없이 붙인다 ("(AEO)·|AI 답변" → 데스크톱 "(AEO)·AI 답변").
import { Fragment } from "react";

export function MobileBreaks({ text }: { text: string }) {
  const parts = text.split("|");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && (
            <>
              {!p.endsWith("·") && <span className="hidden md:inline"> </span>}
              <br className="md:hidden" />
            </>
          )}
        </Fragment>
      ))}
    </>
  );
}

// 문자열에서 모바일 줄바꿈 표시("|")를 띄어쓰기로 바꾼다 (화면 낭독기용 라벨 등 순수 문자열이 필요할 때)
export const stripMobileBreaks = (text: string) => text.replace(/·\|/g, "·").replace(/\|/g, " ");
