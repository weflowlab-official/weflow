"use client";
// 헤더 햄버거로 여는 전체 메뉴 (xl 미만): 오른쪽에서 밀려 나오는 드로어, 뒤는 어둡게.
// 로고 + 닫기 → 블로그 메뉴(전체 글 · 큰 업종 · 검색) → 맨 아래 홈페이지·바로 전화·무료 견적 신청 버튼.
// 큰 업종은 누르면 세부업종이 아래로 펼쳐지는 드롭다운(한 번에 하나만).
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowRight, IconArrowUpRight, IconChevronDown, IconClipboardList, IconPhone, IconSearch, IconX } from "@tabler/icons-react";
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

  // 세부업종 드롭다운: 한 번에 하나만 펼친다. 처음에는 지금 보고 있는 업종이 펼쳐져 있다
  const activeGroup = blogLinks.find((l) => l.subs.length > 0 && isActive(l.href))?.href ?? null;
  const [expanded, setExpanded] = useState<string | null>(activeGroup);
  const toggle = (href: string) => setExpanded((cur) => (cur === href ? null : href));
  // 메뉴를 새로 열 때마다 지금 보고 있는 업종만 펼친 상태로 시작 (렌더 중 파생 상태 갱신)
  // 보고 있는 세부업종(?sub=) — 메뉴를 열 때 주소에서 읽는다.
  // useSearchParams 는 정적 페이지에서 Suspense 경계를 요구해, 열리는 순간 주소를 직접 읽는다 (열림은 항상 브라우저에서 일어난다)
  const [currentSub, setCurrentSub] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setExpanded(activeGroup);
      setCurrentSub(new URLSearchParams(window.location.search).get("sub"));
    }
  }
  // 펼친 목록 안에서 지금 보고 있는 항목: 업종 페이지에서 ?sub 가 있으면 그 세부업종, 없으면 "전체 보기"
  const isCurrent = (groupHref: string, itemHref: string) => {
    if (pathname !== groupHref) return false;
    const sub = new URLSearchParams(itemHref.split("?")[1] ?? "").get("sub");
    return sub === currentSub;
  };
  const subItemCls = (current: boolean, base: string) =>
    `flex items-center gap-2 rounded-lg py-2 pl-6 pr-3 text-[15px] ${
      current ? "font-bold text-primary" : `${base} hover:bg-neutral-50 hover:text-primary`
    }`;

  const menuList = (
    <ul className="divide-y divide-neutral-100">
      {blogLinks.map(({ href, label, Icon, subs }) => {
        // 세부업종이 없는 메뉴(전체 글·검색·웹블로그 가이드)는 바로 이동하는 링크
        if (subs.length === 0) {
          return (
            <li key={href} className="py-0.5">
              <Link href={href} onClick={onClose} className={itemCls(isActive(href))}>
                <span className="flex items-center gap-2">
                  {Icon && <Icon className="size-5" />}
                  {label}
                </span>
                <IconArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          );
        }
        // 세부업종이 있는 업종: 누르면 아래로 펼쳐진다 (업종 전체 보기 + 세부업종 목록)
        const isOpen = expanded === href;
        const panelId = `menu-${href.replace(/\W+/g, "-")}`;
        return (
          <li key={href} className="py-0.5">
            <button type="button" onClick={() => toggle(href)} aria-expanded={isOpen} aria-controls={panelId} className={`${itemCls(isActive(href))} w-full text-left`}>
              <span>{label}</span>
              <IconChevronDown className={`size-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} stroke={2.5} />
            </button>
            {/* 펼침: 높이를 grid 로 0 ↔ 내용 높이 사이에서 부드럽게 */}
            <div id={panelId} className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <ul className="overflow-hidden" inert={!isOpen}>
                <li>
                  <Link href={href} onClick={onClose} aria-current={isCurrent(href, href) ? "page" : undefined} className={subItemCls(isCurrent(href, href), "font-semibold text-neutral-800")}>
                    {isCurrent(href, href) && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />}
                    {label} 전체 보기
                  </Link>
                </li>
                {subs.map((sub) => (
                  <li key={sub.href}>
                    <Link href={sub.href} onClick={onClose} aria-current={isCurrent(href, sub.href) ? "page" : undefined} className={subItemCls(isCurrent(href, sub.href), "font-medium text-neutral-600")}>
                      {isCurrent(href, sub.href) && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />}
                      {sub.label}
                    </Link>
                  </li>
                ))}
                <li aria-hidden className="h-2" />
              </ul>
            </div>
          </li>
        );
      })}
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

      {/* 하단: 홈페이지 · 바로 전화 · 무료 견적 신청 */}
      <div className="shrink-0 space-y-2 border-t border-neutral-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <a
          {...homepageLinkProps(clinic.homepageUrl)}
          className="flex h-12 items-center justify-center gap-1.5 rounded-[11px] border border-primary bg-white text-base font-semibold text-primary"
        >
          WEFLOW 홈페이지
          <IconArrowUpRight className="size-4" />
        </a>
        {/* 글 끝 상담 블록과 같은 두 버튼 (같은 폭) */}
        <div className="grid grid-cols-2 gap-2">
          {/* 바로 전화 — 위 'WEFLOW 홈페이지'(파란 테두리)와 구분되게 초록 테두리·아이콘 (PC 플로팅 전화와 같은 색) */}
          <a href={tel} className="flex h-12 items-center justify-center gap-1.5 rounded-[11px] border border-[#16a34a] bg-white text-base font-semibold text-neutral-900">
            <IconPhone className="size-5 text-[#16a34a]" />
            바로 전화
          </a>
          <Link href={clinic.consultUrl} onClick={onClose} className="flex h-12 items-center justify-center gap-1.5 rounded-[11px] bg-primary text-base font-semibold text-white">
            <IconClipboardList className="size-5" />
            무료 견적 신청
          </Link>
        </div>
      </div>
    </Sheet>
  );
}
