import Image from 'next/image'
import { AlertTriangle, Check, ShieldCheck, X } from 'lucide-react'
import InView from './InView'

/**
 * 보안 — WHY NOW 03 "그럼 병원 홈페이지는 괜찮을까요? PHP 보안 취약점 뉴스는 끊이지 않습니다" (네이버 위험 다음, 세 번째 이유).
 * 웹블로그 메인(/blog)의 보안 섹션(blog/components/home/SecurityNewsSection.tsx)과 같은 내용을 이 페이지 디자인으로 옮긴 것.
 * 기사 4장은 같은 이미지(public/images/blog/news-php-0N.webp)를 쓴다 — 제목·부제만 잘랐고 기사 사진·기자 사진은 뺐다.
 * 문구 기준: "Next.js 는 절대 안전" 이라고 하지 않는다. "PHP 를 쓰지 않으니 PHP 취약점 걱정은 없다" 까지만 말한다.
 * who: 누구의 홈페이지인지 — 병의원 페이지는 '병원', 메인 '웹블로그란?' 은 '우리 회사'.
 * 두 열의 기사 높이 합이 같아(411+411 = 402+420) 오른쪽 열을 내린 만큼 위·아래 엇갈림이 같다.
 */

const NEWS = [
  { src: '/images/blog/news-php-01.webp', w: 900, h: 411, source: '연합뉴스', date: '2026.10.22', title: 'PHP 보안 취약점에 해킹 비상…국내 IT·보안업계 긴급 대응' },
  { src: '/images/blog/news-php-03.webp', w: 900, h: 402, source: '뉴스1', date: '2026.10.22', title: '국가안보실, 민관군 사이버안보 긴급 대책회의…"PHP 취약점 신속 대응"' },
  { src: '/images/blog/news-php-02.webp', w: 900, h: 411, source: '머니투데이', date: '2026.10.22', title: "'해킹 구멍' PHP…국내 서버 10대 중 9대, '업데이트 불가'" },
  { src: '/images/blog/news-php-04.webp', w: 900, h: 420, source: '연합뉴스', date: '2026.10.23', title: "'PHP 취약' 공개 나흘전부터 공격 포착…\"해킹 시도 수백만건\"" },
]

const OLD = [
  '서버에서 PHP 프로그램이 늘 돌아가며 요청을 처리합니다',
  '보안 업데이트를 사이트마다 따로 챙겨야 합니다',
  '오래된 버전은 업데이트 자체가 어려운 경우가 많습니다',
  '관리자 화면·플러그인이 공격 통로가 되기도 합니다',
]

const NEW = [
  '대기업 서비스에도 쓰이는 React·Next.js로 만듭니다',
  '페이지를 미리 만들어 두고 전 세계 서버망(CDN)에서 내보냅니다',
  '모든 페이지가 보안 연결(HTTPS)로 열립니다',
  '서버·보안 업데이트는 WEFLOW 월 운영관리에서 계속 챙깁니다',
]

export default function SecurityNews({ who = '병원' }: { who?: string }) {
  return (
    <section id="security" className="cbs" aria-labelledby="cbs-title">
      <div className="cb-wrap">
        <p className="cbs-chapter"><AlertTriangle size={15} /> WHY NOW 03</p>
        <p className="cbs-lead">그럼 {who} 홈페이지는 괜찮을까요?</p>
        <h2 id="cbs-title" className="cbs-h2">&lsquo;PHP 보안 취약점&rsquo;<br />뉴스는 끊이지 않습니다</h2>
        <p className="cbs-body">
          국내 PHP 서버 상당수가 업데이트되지 않은<br className="cb-mo" /> 옛 버전이라는 보도가 잇따랐습니다.<br />
          오래된 기술로 만든 {who} 홈페이지는<br className="cb-mo" /> 보안 업데이트를 놓치는 순간 위험해집니다.
        </p>

        {/* 기사 4장 — 넓은 화면은 2열(오른쪽 열을 내려 엇갈리게), 휴대폰은 옆으로 넘기는 카드 */}
        <InView className="cbs-news">
          {NEWS.map((n, i) => (
            <figure key={n.src} className="cbs-card" style={{ '--i': i } as React.CSSProperties}>
              <div className="cbs-shot">
                <Image src={n.src} alt={`${n.source} 기사: ${n.title}`} width={n.w} height={n.h} sizes="(min-width: 768px) 520px, 85vw" />
              </div>
              <figcaption>{n.source} · {n.date}</figcaption>
            </figure>
          ))}
        </InView>
        <p className="cbs-note">기사 화면 일부를 갈무리했습니다.<br className="cb-mo" /> 내용은 각 언론사 보도를 확인해 주세요.</p>

        {/* 옛 방식 vs WEFLOW */}
        <h3 className="cbs-h3">
          하지만 WEFLOW는<br />
          처음부터 <span className="cbs-accent">최신 기술(Next.js)</span>로 만들어<br className="cb-mo" /> PHP 취약점 걱정이 없습니다
        </h3>
        <p className="cbs-sub">WEFLOW 웹블로그와 홈페이지는<br className="cb-mo" /> <strong>PHP를 쓰지 않습니다.</strong></p>
        <div className="cbs-compare">
          <div className="cbs-box">
            <p className="cbs-box-tag">옛 방식</p>
            <p className="cbs-box-title">PHP 서버 위의 홈페이지</p>
            <ul>
              {OLD.map(t => <li key={t}><X size={16} className="cbs-x" />{t}</li>)}
            </ul>
          </div>
          <div className="cbs-box cbs-box--we">
            <p className="cbs-box-tag"><ShieldCheck size={15} /> WEFLOW</p>
            <p className="cbs-box-title">Next.js로 만든 웹블로그·홈페이지</p>
            <ul>
              {NEW.map(t => <li key={t}><Check size={16} className="cbs-v" />{t}</li>)}
            </ul>
          </div>
        </div>
        <p className="cbs-foot">어떤 기술도 &lsquo;절대 안전&rsquo;하지는 않습니다.<br className="cb-mo" /> 중요한 건 업데이트가 계속 챙겨지는 구조입니다.</p>
      </div>

      <style>{`
        .cbs { background: #0e1117; color: #fff; padding: 96px 0; overflow: hidden; text-align: center; }
        @media (min-width: 960px) { .cbs { padding: 140px 0; } }
        .cbs-chapter { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: .85rem; letter-spacing: .22em; color: #7fa6ef; margin: 0 0 16px; }
        .cbs-lead { margin: 0 0 10px; font-size: clamp(1.05rem, 2vw, 1.3rem); font-weight: 700; color: rgba(255,255,255,.6); }
        .cbs-h2 { font-size: clamp(1.7rem, 3.8vw, 2.5rem); line-height: 1.32; font-weight: 800; letter-spacing: -0.035em; margin: 0; }
        .cbs-body { color: rgba(255,255,255,.7); font-size: 1.15rem; line-height: 1.8; margin: 20px 0 0; }

        /* 기사 카드 — 화면에 들어오면 차례로 올라온다 (InView 가 is-in 을 붙인다) */
        .cbs-news { display: flex; gap: 12px; margin: 48px -20px 0; padding: 0 20px 8px; overflow-x: auto; overflow-y: hidden; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scrollbar-width: none; text-align: left; }
        .cbs-news::-webkit-scrollbar { display: none; }
        .cbs-card { flex: 0 0 85%; margin: 0; scroll-snap-align: center; opacity: 0; transform: translateY(18px); transition: opacity .5s ease, transform .5s ease; transition-delay: calc(var(--i) * .12s); }
        .cbs-news.is-in .cbs-card { opacity: 1; transform: none; }
        .cbs-shot { overflow: hidden; border-radius: 12px; border: 1px solid rgba(255,255,255,.1); background: #fff; box-shadow: 0 16px 40px rgba(0,0,0,.45); }
        .cbs-shot img { display: block; width: 100%; height: auto; }
        .cbs-card figcaption { margin-top: 10px; font-size: .85rem; color: rgba(255,255,255,.5); }
        @media (min-width: 768px) {
          .cbs-news { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 64px 0 0; padding: 0; overflow: visible; align-items: start; }
          /* 오른쪽 열을 통째로 40px 내린다 (자리는 그대로 두고 그림만 옮긴다) */
          .cbs-card:nth-child(even) { translate: 0 40px; }
        }
        .cbs-note { margin: 14px 0 0; font-size: .78rem; color: rgba(255,255,255,.35); }
        @media (min-width: 768px) { .cbs-note { margin-top: 64px; } }

        .cbs-h3 { margin: 72px 0 0; font-size: clamp(1.3rem, 3vw, 2rem); line-height: 1.4; font-weight: 800; letter-spacing: -0.03em; }
        @media (min-width: 960px) { .cbs-h3 { margin-top: 96px; } }
        .cbs-accent { color: #7fa6ef; }
        .cbs-sub { margin: 16px 0 0; font-size: 1.1rem; color: rgba(255,255,255,.7); }
        .cbs-sub strong { color: #fff; font-weight: 800; text-decoration: underline; text-decoration-color: #7fa6ef; text-decoration-thickness: 2px; text-underline-offset: 5px; }

        .cbs-compare { display: grid; gap: 12px; max-width: 1000px; margin: 40px auto 0; text-align: left; }
        @media (min-width: 768px) { .cbs-compare { grid-template-columns: 1fr 1fr; gap: 16px; } }
        .cbs-box { border-radius: 16px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.03); padding: 24px 22px; }
        @media (min-width: 768px) { .cbs-box { padding: 28px; } }
        .cbs-box--we { border-color: rgba(127,166,239,.4); background: linear-gradient(135deg, rgba(31,99,214,.4), rgba(31,99,214,.1)); box-shadow: 0 20px 50px rgba(27,78,167,.35); }
        .cbs-box-tag { display: inline-flex; align-items: center; gap: 6px; margin: 0; font-size: .85rem; font-weight: 700; color: rgba(255,255,255,.5); }
        .cbs-box--we .cbs-box-tag { color: #9fbdf5; }
        .cbs-box-title { margin: 4px 0 0; font-size: 1.2rem; font-weight: 800; }
        .cbs-box ul { list-style: none; margin: 20px 0 0; padding: 0; display: grid; gap: 12px; }
        .cbs-box li { display: flex; gap: 10px; font-size: .95rem; line-height: 1.6; color: rgba(255,255,255,.72); }
        .cbs-box--we li { color: rgba(255,255,255,.92); }
        .cbs-box li svg { flex: none; margin-top: 3px; }
        .cbs-x { color: #f87171; }
        .cbs-v { color: #7fa6ef; }
        .cbs-foot { margin: 20px 0 0; font-size: .85rem; color: rgba(255,255,255,.4); }
        @media (prefers-reduced-motion: reduce) { .cbs-card { opacity: 1; transform: none; transition: none; } }
      `}</style>
    </section>
  )
}
