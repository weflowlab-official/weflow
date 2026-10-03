"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

// 상단 메뉴 목록 (데스크탑 가로 메뉴 / 모바일 드로어가 같이 쓴다).
// 헤더는 이정표라 짧게 — 자세한 이름은 푸터에 그대로 남겨뒀다.
const NAV_LINKS: { href: string; label: string; gold?: boolean }[] = [
  { href: "/about", label: "회사소개" },
  { href: "/service", label: "서비스" },
  { href: "/pricing", label: "가격 안내" },
  { href: "/difference", label: "왜 WEFLOW?" },
  { href: "/benefits", label: "WEFLOW 혜택" },
  { href: "/cases", label: "제작 사례" },
  { href: "/guide", label: "제작 라인업" },
  // 예약 신청(/booking)은 메뉴에서 내리고 그 자리에 사이트 점검을 뒀다 — 페이지 자체는 남아 있다
  // gold: 다른 메뉴보다 눈에 띄게 굵은 금색으로 그린다 (PC·모바일 공통)
  { href: "/check", label: "사이트 점검", gold: true },
];

// 강조 메뉴 색 — 흰 헤더·드로어 위에서 읽히는 중간 톤 금색 (상담 버튼 글씨와 같은 계열)
const NAV_GOLD = "#ad8640";

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
    // 처음 한 번 — 스크롤된 채로 새로고침했을 때도 선이 바로 맞게 보이도록 다음 프레임에 맞춘다
    const raf = requestAnimationFrame(() => setAtTop(window.scrollY <= 2));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
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

  const close = () => setOpen(false);

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
            maxWidth: "1200px",
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

          {/* 데스크탑 가로 메뉴 — 현재 페이지는 강조색 굵게 */}
          <nav
            className="hide-mobile"
            style={{
              display: "flex",
              gap: "0.25rem",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={handleClick(l.href)}
                className="subhead"
                style={{
                  padding: "0.4rem 0.6rem",
                  borderRadius: "6px",
                  fontWeight: pathname === l.href || l.gold ? 700 : 500,
                  color: l.gold
                    ? NAV_GOLD
                    : pathname === l.href
                      ? "#111"
                      : "#555",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* 데스크탑 상담 CTA — 문구가 위로 흐르는 마퀴 + 금색 광택 */}
          <Link
            href="/diagnosis"
            aria-label="지금 바로 무료 상담 받기"
            className="btn-primary cta-marquee cta-gradient cta-header hide-mobile"
            style={{
              width: "132px",
              height: "40px",
              fontSize: "0.95rem",
              flexShrink: 0,
            }}
          >
            <span className="cta-marquee-track">
              {["지금 바로 무료 상담 받기", "지금 바로 무료 상담 받기", "지금 바로 무료 상담 받기", "지금 바로 무료 상담 받기"].map((t, i) => (
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
          {NAV_LINKS.map((l) => (
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
                padding: "0.9rem 1.5rem",
                color: l.gold ? NAV_GOLD : "#111",
                textDecoration: "none",
                fontWeight: pathname === l.href || l.gold ? 700 : 500,
                borderLeft:
                  pathname === l.href
                    ? "3px solid #111"
                    : "3px solid transparent",
                background:
                  pathname === l.href ? "rgba(17,17,17,0.05)" : "transparent",
                transition: "background 0.15s",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* 하단 CTA */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid rgba(17,17,17,0.08)",
          }}
        >
          <Link
            href="/diagnosis"
            className="btn-primary cta-gradient cta-header"
            style={{ justifyContent: "center", width: "100%" }}
            onClick={close}
          >
            <span className="cta-label">무료 상담 신청</span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .show-mobile-flex { display: flex !important; } }
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
