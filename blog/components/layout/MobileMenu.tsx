"use client";
// 헤더 햄버거로 여는 전체 메뉴 (xl 미만): 오른쪽에서 밀려 나오는 드로어, 뒤는 어둡게.
// 로고 + 닫기 → 블로그 메뉴(전체 글 · 큰 업종과 그 아래 세부업종 · 검색) → 맨 아래 홈페이지·전화·카카오톡 버튼.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowRight, IconArrowUpRight, IconBrandKakaoTalk, IconPhone, IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/blog/components/SiteProvider";
import { Sheet } from "@/blog/components/ui/Sheet";
import { BlogLogo, homepageLinkProps } from "@/blog/components/layout/BlogLogo";

export type NavItem = { id: string; href: string; label: string; active: boolean; subs: { href: string; label: string }[] };

type FullProps = { open: boolean; onClose: () => void };

export function FullMenuSheet({ open, onClose }: FullProps) {
  const { clinic, categories } = useSite();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const tel = `tel:${clinic.phone.replace(/[^0-9+]/g, "")}`;

  // 블로그 메뉴: 전체 글 + 큰 업종(아래에 세부업종) + 검색
  const blogLinks = [
    { href: "/blog/posts", label: "전체 글", Icon: null, subs: [] as { href: string; label: string }[] },
    ...categories.map((c) => ({
      href: `/blog/${c.slug}`,
      label: c.name,
      Icon: null,
      subs: c.subs.map((s) => ({ href: `/blog/${c.slug}?sub=${s.slug}`, label: s.name })),
    })),
    { href: "/blog/search", label: "업종·주제 검색", Icon: IconSearch, subs: [] },
  ];

  const itemCls = (active: boolean) =>
    `group flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold transition-colors md:text-lg ${
      active ? "bg-[var(--brand-primary-10)] text-primary" : "text-neutral-800 hover:bg-neutral-50 hover:text-primary"
    }`;

  const menuList = (
    <ul className="divide-y divide-neutral-100">
      {blogLinks.map(({ href, label, Icon, subs }) => (
        <li key={href} className="py-0.5">
          <Link href={href} onClick={onClose} className={itemCls(isActive(href))}>
            <span className="flex items-center gap-2">
              {Icon && <Icon className="size-5" />}
              {label}
            </span>
            <IconArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          {/* 세부업종: 작은 칩으로 줄지어 */}
          {subs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-3">
              {subs.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={onClose}
                  className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[13px] font-medium text-neutral-600 hover:border-primary hover:text-primary"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Sheet open={open} onClose={onClose} side="right" modal title="전체 메뉴" className="h-full w-[85vw] max-w-[400px] p-0">
      {/* 상단: 로고 + 닫기 */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5">
        <Link href="/blog" onClick={onClose} aria-label="웹블로그 홈으로 이동">
          <BlogLogo />
        </Link>
        <button type="button" onClick={onClose} aria-label="메뉴 닫기" className="-mr-2 rounded-full p-2 text-neutral-700 hover:bg-neutral-100">
          <IconX className="size-6" />
        </button>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 text-xs font-semibold text-primary">BLOG</p>
        <div className="mt-1">{menuList}</div>
      </div>

      {/* 하단: 홈페이지 · 전화 · 카카오톡 */}
      <div className="shrink-0 space-y-2 border-t border-neutral-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <a
          {...homepageLinkProps(clinic.homepageUrl)}
          className="flex h-12 items-center justify-center gap-1.5 rounded-[11px] border border-primary bg-white text-base font-semibold text-primary"
        >
          WEFLOW 홈페이지
          <IconArrowUpRight className="size-4" />
        </a>
        <div className="grid grid-cols-2 gap-2">
          <a href={tel} className="flex h-12 items-center justify-center gap-2 rounded-[11px] bg-primary text-base font-semibold text-white">
            <IconPhone className="size-5" />
            바로 전화
          </a>
          <a
            href={clinic.kakaoChannelUrl || clinic.consultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-[11px] bg-[#fee500] text-base font-semibold text-[#191919]"
          >
            <IconBrandKakaoTalk className="size-5" />
            카카오톡
          </a>
        </div>
      </div>
    </Sheet>
  );
}
