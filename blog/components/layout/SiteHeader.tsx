"use client";
// 사이트 헤더. sticky 남색 띠 하나: 로고, 홈페이지 바로가기, 메뉴(큰 업종 + 세부업종 드롭다운, xl 이상), 검색, 햄버거(xl 미만).
// (레퍼런스는 위에 남색 브랜드 띠가 하나 더 있었지만 단순화를 위해 제거)
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { IconArrowRight, IconChevronDown, IconMenu2, IconSearch, IconX } from "@tabler/icons-react";
import { useSite } from "@/blog/components/SiteProvider";
import { Container } from "@/blog/components/ui/Container";
import { SearchBox } from "@/blog/components/layout/SearchBox";
import { FullMenuSheet, type NavItem } from "@/blog/components/layout/MobileMenu";
import { BlogLogo, homepageLinkProps } from "@/blog/components/layout/BlogLogo";

export function SiteHeader() {
  const { clinic, categories } = useSite();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 전체 메뉴 (햄버거)
  // 클라이언트 마운트 여부 (포털용). 서버 스냅샷은 false
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // 메뉴 목록: 큰 업종(카테고리). 세부업종은 드롭다운으로 (lib/industries.ts). '전체 글'은 전체 메뉴(햄버거)에만 둔다
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const nav: NavItem[] = categories.map((c) => ({
    id: c.slug,
    href: `/blog/${c.slug}`,
    label: c.name,
    active: isActive(`/blog/${c.slug}`),
    subs: c.subs.map((s) => ({ href: `/blog/${c.slug}?sub=${s.slug}`, label: s.name })),
  }));

  // 경로가 바뀌면 열려 있던 패널 모두 닫기 (렌더 중 파생 상태 갱신)
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  // 전체 메뉴가 열리면 body 를 고정(스크롤 잠금), 닫히면 원래 위치로 복귀
  useEffect(() => {
    if (!menuOpen) return;
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [menuOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // 검색과 메뉴는 동시에 열리지 않는다
  const toggleSearch = () => {
    setMenuOpen(false);
    setSearchOpen((v) => !v);
  };
  const toggleMenu = () => {
    setSearchOpen(false);
    setMenuOpen((v) => !v);
  };

  return (
    <>
      {/* sticky 흰 띠. 레퍼런스: sticky top-0 z-30, h-16 lg:h-20, border-b */}
      <header className="sticky top-0 z-30 relative">
        {/* 남색 띠 + 흰 글씨 */}
        <div className="bg-primary text-white">
          <Container size="4xl" className="flex h-16 items-center justify-between gap-3 md:gap-8 lg:h-20">
            {/* 왼쪽: 블로그 로고 + 홈페이지 바로가기 */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-6">
              <Link href="/blog" aria-label="웹블로그 홈으로 이동" className="flex shrink-0 items-center">
                {/* 남색 띠용 흰 심볼 + 글자 */}
                <BlogLogo tone="light" />
              </Link>
              <a
                {...homepageLinkProps(clinic.homepageUrl)}
                aria-label="홈페이지 바로가기"
                className="hidden min-w-0 items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-primary sm:flex lg:gap-2 lg:px-5 lg:py-2 lg:text-sm xl:px-6 xl:py-2.5 xl:text-base xl:tracking-[-0.18px]"
              >
                <span className="min-w-0 truncate">홈페이지 바로가기</span>
                <IconArrowRight className="size-2.5 shrink-0 lg:size-[15px]" stroke={2.5} />
              </a>
            </div>

            {/* 오른쪽: 업종 메뉴(xl 이상 — 업종이 8개라 그보다 좁으면 햄버거로) + 검색 + 전체 메뉴 햄버거 */}
            <div className="flex h-full min-w-0 flex-1 items-center justify-end gap-2 md:gap-6 lg:gap-6">
              <nav className="hidden h-full min-w-0 flex-1 items-center justify-end gap-5 xl:flex 2xl:gap-7">
                {nav.map((item) => (
                  // 업종 하나 = 링크 + (세부업종이 있으면) 마우스를 올리거나 탭으로 들어오면 펼쳐지는 드롭다운
                  <div key={item.id} className="group/nav relative flex h-full min-w-0 shrink items-center">
                    <Link
                      href={item.href}
                      className={`group relative flex min-w-0 items-center gap-0.5 py-1 text-[15px] font-semibold transition-colors xl:text-base ${item.active ? "text-white" : "text-white/90 hover:text-white"}`}
                    >
                      <span className="block min-w-0 truncate">{item.label}</span>
                      {item.subs.length > 0 && <IconChevronDown className="size-3.5 shrink-0 opacity-70 transition-transform group-hover/nav:rotate-180" stroke={2.5} />}
                      {/* hover 시 가운데서 퍼지는 밑줄 */}
                      <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-white transition-all duration-300 group-hover:w-full" />
                      {/* 활성 밑줄 */}
                      {item.active && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-white" />}
                    </Link>
                    {item.subs.length > 0 && (
                      <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-1 opacity-0 transition-opacity duration-150 group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:opacity-100">
                        <ul className="min-w-44 rounded-[14px] border border-neutral-200 bg-white p-2 shadow-[0_12px_32px_0_rgba(0,0,0,0.12)]">
                          {item.subs.map((s) => (
                            <li key={s.href}>
                              <Link href={s.href} className="block whitespace-nowrap rounded-[9px] px-3 py-2 text-[15px] font-medium text-neutral-700 transition-colors hover:bg-[var(--brand-primary-5)] hover:text-primary">
                                {s.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="flex shrink-0 items-center gap-1 md:gap-2">
                <button
                  type="button"
                  onClick={toggleSearch}
                  aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
                  aria-expanded={searchOpen}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/15"
                >
                  <IconSearch className="size-6 lg:size-7" />
                </button>
                {/* 햄버거는 xl 미만에서만. 넓은 화면은 메뉴가 헤더에 다 있어 불필요 */}
                <button
                  type="button"
                  data-sheet-toggle
                  onClick={toggleMenu}
                  aria-label={menuOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
                  aria-expanded={menuOpen}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/15 xl:hidden"
                >
                  {menuOpen ? <IconX className="size-7 lg:size-8" /> : <IconMenu2 className="size-7 lg:size-8" />}
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* 검색 패널: 헤더 아래에 덮어서 펼쳐짐(페이지를 밀지 않음) + 뒤쪽 어두운 배경(바깥 클릭 닫기) */}
        {searchOpen && (
          <>
            {mounted &&
              createPortal(
                <div onClick={closeSearch} aria-hidden className="fixed inset-0 z-20 bg-black/40" />,
                document.body,
              )}
            <SearchBox variant="header" showKeywords autoFocus onClose={closeSearch} />
          </>
        )}
      </header>

      {/* 전체 메뉴 (헤더 아래 전체 화면): 블로그 카테고리 + 홈페이지 사이트맵 + 상담 채널 + 안내 */}
      <FullMenuSheet open={menuOpen} onClose={closeMenu} />
    </>
  );
}
