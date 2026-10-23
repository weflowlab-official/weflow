// 블로그 로고: WEFLOW 심볼(W) + "WEFLOW 웹블로그·홈페이지" 글자. 헤더·전체 메뉴·푸터가 같이 쓴다.
// tone="light": 진한 배경(헤더)용 흰 심볼 / tone="dark": 흰 배경(푸터·메뉴)용 남색 심볼.
import Image from "next/image";

type Props = { tone?: "light" | "dark"; className?: string };

export function BlogLogo({ tone = "dark", className = "" }: Props) {
  const light = tone === "light";
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <Image
        src={light ? "/logo.png" : "/logo-navy.png"}
        alt=""
        width={40}
        height={40}
        loading="eager"
        className="size-7 object-contain lg:size-8"
      />
      <span className={`whitespace-nowrap text-lg font-extrabold tracking-[-0.02em] lg:text-xl ${light ? "text-white" : "text-neutral-900"}`}>
        WEFLOW
        {/* 좁은 휴대폰에서 헤더 버튼과 겹치지 않게 뒷부분 글씨를 한 단계 작게 */}
        <span className={`relative -top-px ml-1.5 text-[13px] font-semibold sm:text-sm lg:text-base ${light ? "text-white/75" : "text-neutral-500"}`}>웹블로그·홈페이지</span>
      </span>
    </span>
  );
}

// 홈페이지 주소가 외부 주소(http)면 새 창, 같은 사이트("/")면 같은 창
export const homepageLinkProps = (url: string) =>
  /^https?:\/\//.test(url) ? { href: url, target: "_blank", rel: "noopener noreferrer" } : { href: url };
