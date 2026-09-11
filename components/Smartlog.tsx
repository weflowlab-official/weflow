'use client'
import Script from 'next/script'
import {
  SMARTLOG_ACCOUNT,
  SMARTLOG_SERVER,
  SMARTLOG_SRC,
  SMARTLOG_NOSCRIPT_SRC,
} from '@/lib/smartlog'

/**
 * 스마트로그 메인 스크립트 — </body> 직전(레이아웃 맨 아래)에 싣는다.
 *
 * hpt_info 를 먼저 심고 그다음에 smart.js 를 붙여야 한다. Script 두 개로 나누면
 * 실행 순서가 로딩에 따라 뒤집힐 수 있어, 한 스크립트 안에서 선언 → 주입까지 끝낸다.
 *
 * 로컬(localhost)·미리보기(*.vercel.app) 방문은 세지 않는다 —
 * components/PageTracker.tsx 의 제외 규칙과 같은 기준이다. 개발하며 새로고침한 것까지
 * 방문으로 잡히면 통계를 못 믿게 된다.
 */
export default function Smartlog() {
  return (
    <>
      <Script id="smartlog" strategy="afterInteractive">
        {`
          (function () {
            var h = location.hostname;
            if (h === 'localhost' || h === '127.0.0.1') return;
            if (h.endsWith('.local') || h.endsWith('.vercel.app')) return;
            window.hpt_info = { _account: '${SMARTLOG_ACCOUNT}', _server: '${SMARTLOG_SERVER}' };
            var s = document.createElement('script');
            s.src = '${SMARTLOG_SRC}';
            s.charset = 'utf-8';
            document.body.appendChild(s);
          })();
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SMARTLOG_NOSCRIPT_SRC}
          alt=""
          style={{ display: 'none', width: 0, height: 0 }}
          width={0}
          height={0}
        />
      </noscript>
    </>
  )
}
