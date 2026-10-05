"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X, CalendarCheck } from "lucide-react";

type NavLink = { href: string; label: string; gold?: boolean };
type NavGroup = { label: string; children: NavLink[] };

// 상단 메뉴 목록 (데스크탑 가로 메뉴 / 모바일 드로어가 같이 쓴다).
// 헤더에는 네 개만 보이고, 묶음(children)은 데스크탑에서 드롭다운으로 펼쳐진다 — 페이지와 주소는 그대로다.
const NAV_ITEMS: (NavLink | NavGroup)[] = [
  { href: "/about", label: "회사소개" },
  {
    // 묶음 이름을 누르면 맨 위 항목(왜 WEFLOW?)으로 간다 — 그래서 왜 WEFLOW? 를 첫째에 둔다
    label: "Why?",
    children: [
      { href: "/difference", label: "왜 WEFLOW?" },
      // 서비스 안내는 혜택 안내로 합쳤다
      { href: "/benefits", label: "혜택 안내" },
      { href: "/pricing", label: "가격 안내" },
    ],
  },
  {
    label: "포트폴리오",
    children: [
      { href: "/cases", label: "제작 사례" },
      { href: "/guide", label: "제작 라인업" },
    ],
  },
  // 예약 신청(/booking)은 메뉴에서 내리고 그 자리에 사이트 점검을 뒀다 — 페이지 자체는 남아 있다
  // gold: 다른 메뉴보다 눈에 띄게 굵은 금색으로 그린다 (PC·모바일 공통)
  { href: "/check", label: "사이트 점검", gold: true },
];

// 강조 메뉴 색 — 흰 헤더·드로어 위에서 읽히는 중간 톤 금색 (상담 버튼 글씨와 같은 계열)
const NAV_GOLD = "#ad8640";

// 헤더 글씨 크기 — 메뉴·대표 번호는 16px, 드롭다운 항목은 15px.
// 글씨 클래스(.headline 17px · .body 16px)의 기본값보다 한 단계씩 작게 잡는다
const NAV_FONT = "1rem";
const NAV_SUB_FONT = "0.9375rem";

// 상담 버튼 옆에 같이 보여 주는 대표 번호
const TEL = "010-2971-7280";

// 같은 페이지에서 다시 눌렀을 때 폼을 새로 시작해야 하는 경로
const RESETTABLE = new Set(["/booking", "/diagnosis", "/check"]);

/**
 * 모든 페이지 상단의 헤더 — 로고 · 메뉴 · 상담 CTA.
 * 모바일에선 메뉴가 햄버거 버튼 → 왼쪽 드로어로 바뀐다.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // 스크롤을 내리면 헤더를 위로 숨기고, 올리면 다시 내린다
  const [hidden, setHidden] = useState(false);
  // 페이지 맨 위에서는 헤더 아래 선을 감춘다
  const [atTop, setAtTop] = useState(true);
  // 데스크탑에서 펼쳐져 있는 드롭다운 (묶음 이름) — 없으면 null
  const [menu, setMenu] = useState<string | null>(null);
  // 모바일 메뉴에서 손으로 펼치거나 접은 묶음 (묶음 이름 → 펼침 여부). 손대지 않은 묶음은 여기 없다 —
  // 그때는 지금 페이지가 그 묶음에 들어 있는지로 정한다
  const [drawerGroups, setDrawerGroups] = useState<Record<string, boolean>>({});
  const navRef = useRef<HTMLElement>(null);

  // 드롭다운이 열려 있을 때 — 메뉴 바깥을 누르거나 Esc를 누르면 닫는다 (터치 기기는 마우스가 벗어나는 일이 없다)
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y <= 2);
      // 맨 위 근처에서는 항상 보이게, 그 외엔 6px 넘게 움직였을 때만 방향을 따른다 (미세한 떨림 무시)
      if (y <= 64) setHidden(false);
      else if (y - lastY > 6) setHidden(true);
      else if (lastY - y > 6) setHidden(false);
      else return;
      lastY = y;
    };
    // 숨겨져 있을 때 마우스를 화면 맨 위(헤더가 있던 자리)로 올리면 다시 내려온다.
    // 그 뒤 다시 아래로 스크롤하면 위 규칙대로 숨는다
    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 72) setHidden(false);
    };
    // 처음 한 번 — 스크롤된 채로 새로고침했을 때도 선이 바로 맞게 보이도록 다음 프레임에 맞춘다
    const raf = requestAnimationFrame(() => setAtTop(window.scrollY <= 2));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);


  // 예약·상담 메뉴를 이미 그 페이지에서 다시 누르면 통째로 새로고침 — 입력 중이던 폼이 초기화된다
  const handleClick =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === href && RESETTABLE.has(href)) {
        e.preventDefault();
        window.location.href = href;
      }
    };

  // 메뉴를 닫을 때 손으로 펼치거나 접은 묶음 기록도 지운다 — 다음에 열면 지금 페이지가 든 묶음만 펼쳐져 있다
  // (지우지 않으면 한 번 펼쳐 본 묶음이 다른 페이지로 간 뒤에도 계속 열려 있다)
  const close = () => {
    setOpen(false);
    setDrawerGroups({});
  };

  // 현재 페이지인지 — 사례 상세(/cases/…)처럼 하위 경로도 같은 메뉴로 친다
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // 드로어 메뉴 한 줄 — sub: 묶음 아래에 들어가는 줄 (조금 낮게)
  const drawerLink = (l: NavLink, sub = false) => (
    <Link
      key={l.href}
      href={l.href}
      onClick={(e) => {
        close();
        handleClick(l.href)(e);
      }}
      className="callout"
      style={{
        display: "block",
        // 묶음 안의 줄은 한 단 들여 쓴다
        padding: sub ? "0.7rem 1.5rem 0.7rem 2.4rem" : "0.9rem 1.5rem",
        color: l.gold ? NAV_GOLD : "#111",
        textDecoration: "none",
        fontWeight: isActive(l.href) || l.gold ? 700 : 500,
        borderLeft: isActive(l.href)
          ? "3px solid #111"
          : "3px solid transparent",
        background: isActive(l.href) ? "rgba(17,17,17,0.05)" : "transparent",
        transition: "background 0.15s",
      }}
    >
      {l.label}
    </Link>
  );

  // 홈에서 로고 클릭 시 이동 대신 맨 위로 부드럽게 스크롤
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 201,
          background: "#fff",
          borderBottom: `1px solid ${atTop ? "transparent" : "rgba(17,17,17,0.08)"}`,
          // 드로어가 열려 있는 동안에는 숨기지 않는다
          transform: hidden && !open ? "translateY(-100%)" : "none",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), border-color 0.2s",
        }}
      >
        <div
          style={{
            // 본문(1200px)보다 넓게 — 로고와 번호·버튼을 화면 양끝 쪽으로 더 보낸다
            maxWidth: "1320px",
            margin: "0 auto",
            // 위 4px — 내용을 2px 내린다. 헤더 아래 흰 여백과 한글 글꼴 특성 때문에
            // 정확한 가운데는 눈에 살짝 위로 치우쳐 보인다
            padding: "4px 1.5rem 0",
            boxSizing: "border-box",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* 왼쪽(로고)·오른쪽(번호·버튼)이 같은 폭을 나눠 가져, 가운데 메뉴가 화면 정중앙에 온다 */}
          <div style={{ flex: "1 1 0", display: "flex" }}>
            <Link
              href="/"
              onClick={handleLogoClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <Image
                src="/logo.png"
                alt="WEFLOW"
                width={27}
                height={27}
                // 로고 원본이 흰색이라 흰 헤더에서는 검정으로 뒤집는다
                style={{ width: 27, height: 27, objectFit: "contain", filter: "brightness(0)" }}
              />
              <span
                className="title-3 emphasized"
                style={{ color: "#111", letterSpacing: "-0.02em" }}
              >
                WEFLOW
              </span>
            </Link>
          </div>

          {/* 데스크탑 가로 메뉴 — 현재 페이지는 강조색 굵게. 묶음은 올리거나 누르면 아래로 펼쳐진다 */}
          <nav
            ref={navRef}
            className="hide-mobile"
            style={{
              display: "flex",
              gap: "1rem",
              flexShrink: 0,
            }}
          >
            {NAV_ITEMS.map((item) => {
              if (!("children" in item)) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClick(item.href)}
                    className="headline"
                    style={{
                      padding: "0.4rem 0.7rem",
                      borderRadius: "6px",
                      fontSize: NAV_FONT,
                      fontWeight: isActive(item.href) || item.gold ? 700 : 500,
                      color: item.gold
                        ? NAV_GOLD
                        : isActive(item.href)
                          ? "#111"
                          : "#555",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "color 0.15s",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              }

              const shown = menu === item.label;
              const groupActive = item.children.some((c) => isActive(c.href));
              return (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setMenu(item.label)}
                  onMouseLeave={() => setMenu(null)}
                  // 탭 키로 묶음을 빠져나가면 닫는다
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setMenu(null);
                  }}
                >
                  {/* 묶음 이름 — 올리면 목록이 펼쳐지고, 누르면 목록의 첫 페이지로 간다
                      (Why? → 왜 WEFLOW?, 포트폴리오 → 제작 사례). 탭 키로 들어와도 목록이 펼쳐진다 */}
                  <Link
                    href={item.children[0].href}
                    aria-haspopup="true"
                    aria-expanded={shown}
                    onFocus={() => setMenu(item.label)}
                    onClick={(e) => {
                      setMenu(null);
                      handleClick(item.children[0].href)(e);
                    }}
                    className="headline"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                      padding: "0.4rem 0.7rem",
                      borderRadius: "6px",
                      fontSize: NAV_FONT,
                      fontWeight: groupActive ? 700 : 500,
                      color: groupActive || shown ? "#111" : "#555",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "color 0.15s",
                    }}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      style={{
                        transform: shown ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </Link>

                  {/* 위 여백(paddingTop)까지가 hover 영역 — 버튼에서 목록으로 내려가는 사이에 닫히지 않는다 */}
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      paddingTop: "10px",
                      transform: `translateX(-50%) translateY(${shown ? 0 : -4}px)`,
                      opacity: shown ? 1 : 0,
                      visibility: shown ? "visible" : "hidden",
                      transition: "opacity 0.18s, transform 0.18s, visibility 0.18s",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "168px",
                        padding: "6px",
                        background: "#fff",
                        border: "1px solid rgba(17,17,17,0.08)",
                        borderRadius: "12px",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                      }}
                    >
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={(e) => {
                            setMenu(null);
                            handleClick(c.href)(e);
                          }}
                          className="body nav-sub-link"
                          style={{
                            display: "block",
                            padding: "0.6rem 0.9rem",
                            borderRadius: "8px",
                            fontSize: NAV_SUB_FONT,
                            fontWeight: isActive(c.href) ? 700 : 500,
                            color: isActive(c.href) ? "#111" : undefined,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div
            style={{
              flex: "1 1 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* 대표 번호 — 누르면 바로 전화. 폭이 좁은 화면(태블릿)에서는 메뉴 자리를 위해 숨긴다 */}
            <a
              href={`tel:${TEL}`}
              className="headline nav-tel hide-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                marginRight: "1rem",
                color: "#111",
                fontSize: NAV_FONT,
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Phone size={16} />
              {TEL}
            </a>

            {/* 데스크탑 상담 CTA — 문구가 위로 흐르는 마퀴 + 금색 광택 */}
            <Link
              href="/diagnosis"
              aria-label="지금 바로 맞춤 견적 받기"
              className="btn-primary cta-marquee cta-gradient cta-header hide-mobile"
              style={{
                width: "132px",
                height: "40px",
                fontSize: "0.95rem",
                flexShrink: 0,
              }}
            >
              <span className="cta-marquee-track">
                {["지금 바로 맞춤 견적 받기", "지금 바로 맞춤 견적 받기", "지금 바로 맞춤 견적 받기", "지금 바로 맞춤 견적 받기"].map((t, i) => (
                  <span key={i} className="cta-marquee-item">
                    {t}
                  </span>
                ))}
              </span>
            </Link>

            {/* 모바일 햄버거 — 드로어를 연다 */}
            <button
              onClick={() => setOpen(true)}
              className="show-mobile-flex"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                color: "#111",
                display: "none",
              }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* 오버레이 */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 202,
          background: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s ease",
        }}
      />

      {/* 왼쪽 드로어 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 203,
          width: "min(280px, 80vw)",
          background: "#fff",
          boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* 드로어 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.25rem",
            height: "64px",
            borderBottom: "1px solid rgba(17,17,17,0.08)",
          }}
        >
          <Link
            href="/"
            onClick={(e) => {
              close();
              handleLogoClick(e);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              textDecoration: "none",
            }}
          >
            <Image
              src="/logo.png"
              alt="WEFLOW"
              width={22}
              height={22}
              style={{ width: 22, height: 22, objectFit: "contain", filter: "brightness(0)" }}
            />
            <span
              className="headline emphasized"
              style={{ color: "#111", letterSpacing: "-0.02em" }}
            >
              WEFLOW
            </span>
          </Link>
          <button
            onClick={close}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#555",
              padding: "0.4rem",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 메뉴 링크 */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
          {/* 묶음은 PC 드롭다운처럼 접어 둔다 — 묶음 이름(▾)을 누르면 아래로 펼쳐진다.
              지금 보고 있는 페이지가 든 묶음은 처음부터 펼쳐 둔다 */}
          {NAV_ITEMS.map((item) => {
            if (!("children" in item)) return drawerLink(item);
            const groupActive = item.children.some((c) => isActive(c.href));
            const shown = drawerGroups[item.label] ?? groupActive;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  aria-expanded={shown}
                  onClick={() =>
                    setDrawerGroups((g) => ({ ...g, [item.label]: !shown }))
                  }
                  className="callout"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.9rem 1.5rem",
                    background: "none",
                    border: "none",
                    borderLeft: "3px solid transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: groupActive ? 700 : 500,
                    color: "#111",
                    textAlign: "left",
                  }}
                >
                  {item.label}
                  <ChevronDown
                    size={18}
                    style={{
                      color: "#888",
                      transform: shown ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {/* grid-rows 0fr ↔ 1fr 로 높이가 부드럽게 열리고 닫힌다. 접힌 동안에는 탭 키로도 안 잡히게 감춘다 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: shown ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      overflow: "hidden",
                      visibility: shown ? "visible" : "hidden",
                      transition: "visibility 0.25s",
                    }}
                  >
                    {item.children.map((c) => drawerLink(c, true))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* 하단 CTA */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid rgba(17,17,17,0.08)",
          }}
        >
          {/* 바로 전화 — 아래 견적 버튼과 같은 금색 테두리 버튼. 번호는 읽어 주는 기기에만 알린다 */}
          <a
            href={`tel:${TEL}`}
            aria-label={`바로 전화 ${TEL}`}
            className="btn-primary cta-gradient cta-header"
            style={{ justifyContent: "center", width: "100%", marginBottom: "0.6rem" }}
          >
            <Phone size={16} strokeWidth={2.2} color={NAV_GOLD} />
            <span className="cta-label">바로 전화</span>
          </a>
          <Link
            href="/diagnosis"
            className="btn-primary cta-gradient cta-header"
            style={{ justifyContent: "center", width: "100%" }}
            onClick={close}
          >
            {/* 아이콘은 하단 고정 바의 같은 버튼과 맞춘다 */}
            <CalendarCheck size={16} strokeWidth={2.2} color={NAV_GOLD} />
            <span className="cta-label">맞춤 견적 받기</span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .show-mobile-flex { display: flex !important; } }
        /* 태블릿 폭에서는 메뉴·상담 버튼만 남기고 번호는 숨긴다 */
        @media (max-width: 1024px) { .nav-tel { display: none !important; } }
        /* 드롭다운 안의 줄 — 올리면 옅은 회색 바탕 */
        .nav-sub-link { color: #555; transition: background 0.15s, color 0.15s; }
        .nav-sub-link:hover { background: rgba(17, 17, 17, 0.05); color: #111; }
        /* 흰 헤더·드로어 위 CTA — 바탕 없이 금색 테두리·금색 글씨만 남긴다 */
        .cta-gradient.cta-header {
          background: transparent !important;
          border-color: #b8914e !important;
          box-shadow: 0 0 14px rgba(184, 145, 78, 0.18) !important;
        }
        /* 글씨 — 어두운 바탕용 밝은 금색은 흰 헤더에서 안 읽혀, 중간 톤 금색 사이에서 광택이 흐르게 한다 */
        .cta-gradient.cta-header .cta-marquee-item,
        .cta-gradient.cta-header .cta-label {
          background-image: linear-gradient(115deg, #a8823e 0%, #b8914e 38%, #dcbc7c 50%, #b8914e 62%, #a8823e 100%);
        }
        .cta-gradient.cta-header:hover { background: rgba(227, 201, 158, 0.14) !important; }

        /* 금색 CTA — 바탕은 어둡게, 밝은 금색 테두리, 글씨는 금장 광택(c-gold 계열).
           금색을 면으로 채우면 어두운 UI 위에서 탁해 보여 글씨·테두리에만 쓴다.
           헤더 상담 버튼과 모바일 드로어의 상담 버튼이 같이 쓴다. */
        .cta-gradient {
          position: relative;
          overflow: hidden;
          background: rgba(227, 201, 158, 0.14) !important;
          border: 1.5px solid rgba(240, 220, 174, 0.95) !important;
          color: #f0dcae !important;
          box-shadow: 0 0 20px rgba(227, 201, 158, 0.28) !important;
        }
        .cta-gradient:hover { background: rgba(227, 201, 158, 0.22) !important; }
        /* 글씨 — 어두운 끝색 없이 밝은 금(#d9bc88~#fff8e6) 사이에서만 광택이 흐른다 */
        .cta-gradient .cta-marquee-item,
        .cta-gradient .cta-label {
          display: inline-block;
          background: linear-gradient(115deg, #d9bc88 0%, #e9d3a6 38%, #fff8e6 50%, #e9d3a6 62%, #d9bc88 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: cGoldSheen 2.8s linear infinite;
        }
        /* 은은한 금빛 스윕이 버튼을 지나간다 */
        .cta-gradient::after {
          content: '';
          position: absolute;
          top: 0;
          left: -70%;
          width: 48%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,246,218,0.22), transparent);
          transform: skewX(-20deg);
          animation: cta-shine 2.4s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes cta-shine {
          0% { left: -70%; }
          55% { left: 130%; }
          100% { left: 130%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-gradient::after, .cta-gradient .cta-marquee-item, .cta-gradient .cta-label { animation: none; }
        }
      `}</style>
    </>
  );
}
