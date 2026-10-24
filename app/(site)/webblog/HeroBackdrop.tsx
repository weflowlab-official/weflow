import { IconCar, IconStethoscope, IconScale, IconHome, IconSchool, IconToolsKitchen2 } from '@tabler/icons-react'
import { HeroPixelTrail } from '@/blog/components/home/HeroPixelTrail'

/**
 * '웹블로그란?' 히어로 배경 — 웹블로그 메인(/blog, blog/components/home/HeroSection.tsx)의 배경을 그대로 옮긴 것.
 * 가운데만 보이는 격자 + 좌상·우하 연한 파란 번짐 + 마우스를 따라 켜지는 픽셀(HeroPixelTrail, 같은 부품을 그대로 쓴다)
 * + 천천히 도는 궤도 셋과 궤도 위 업종 아이콘(궤도는 돌고 아이콘은 반대로 돌아 늘 똑바로 선다).
 * 웹블로그 쪽은 Tailwind v4 클래스로 그렸는데 이 사이트(v3)에는 그 클래스가 없어, 같은 값을 아래 CSS 로 옮겼다.
 * 히어로 <section> 안에 넣는다 — 픽셀은 가장 가까운 section 의 마우스 움직임을 듣는다.
 */
const ORBITS = [
  { cls: 'wbh-o1', icons: [{ Icon: IconCar, pos: 'wbh-top' }, { Icon: IconStethoscope, pos: 'wbh-bottom' }] },
  { cls: 'wbh-o2', icons: [{ Icon: IconScale, pos: 'wbh-top' }, { Icon: IconHome, pos: 'wbh-bottom' }] },
  { cls: 'wbh-o3', icons: [{ Icon: IconSchool, pos: 'wbh-left' }, { Icon: IconToolsKitchen2, pos: 'wbh-right' }] },
]

export default function HeroBackdrop() {
  return (
    <div className="wbh" aria-hidden="true">
      <div className="wbh-grid" />
      <div className="wbh-blobs"><i /><i /></div>
      <HeroPixelTrail />
      <div className="wbh-orbits">
        {ORBITS.map(o => (
          <div key={o.cls} className={`wbh-orbit ${o.cls}`}>
            <div className="wbh-ring">
              {o.icons.map(({ Icon, pos }) => (
                <div key={pos} className={`wbh-pin ${pos}`}>
                  <div className="wbh-center">
                    <div className="wbh-counter">
                      <div className="wbh-card"><Icon stroke={1.5} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .wbh { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .wbh-grid { position: absolute; inset: 0; background-image: linear-gradient(#cfd8e6 1px, transparent 1px), linear-gradient(90deg, #cfd8e6 1px, transparent 1px); background-size: 88px 88px; background-position: center;
          -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 75%); mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 75%); }
        .wbh-blobs { position: absolute; inset: 0; overflow: hidden; }
        .wbh-blobs i { position: absolute; border-radius: 50%; background: rgba(27,78,167,.1); filter: blur(64px); }
        .wbh-blobs i:first-child { left: -128px; top: -128px; width: 480px; height: 480px; }
        .wbh-blobs i:last-child { right: -96px; bottom: -160px; width: 520px; height: 520px; }
        /* HeroPixelTrail 의 캔버스 — 웹블로그 쪽 클래스(absolute inset-0 z-[5] size-full) 대신 */
        .wbh canvas { position: absolute; inset: 0; z-index: 5; width: 100%; height: 100%; pointer-events: none; }

        .wbh-orbits { position: absolute; left: 50%; top: 50%; z-index: 10; width: 0; height: 0; }
        @media (min-width: 768px) { .wbh-orbits { top: calc(50% - 20px); } }
        .wbh-orbit { position: absolute; left: 0; top: 0; transform: translate(-50%, -50%); }
        .wbh-o1 { width: min(560px, 78vw); height: min(560px, 78vw); }
        .wbh-o2 { width: min(860px, 120vw); height: min(860px, 120vw); }
        .wbh-o3 { width: min(1180px, 165vw); height: min(1180px, 165vw); }
        .wbh-ring { position: relative; width: 100%; height: 100%; border-radius: 50%; animation: wbhSpin linear infinite; }
        .wbh-counter { animation: wbhSpin linear infinite; }
        .wbh-o1 .wbh-ring { border: 1px solid #c5d1e4; animation-duration: 40s; }
        .wbh-o1 .wbh-counter { animation-duration: 40s; animation-direction: reverse; }
        .wbh-o2 .wbh-ring { border: 1px dashed #a9bfe0; animation-duration: 70s; animation-direction: reverse; }
        .wbh-o2 .wbh-counter { animation-duration: 70s; }
        .wbh-o3 .wbh-ring { border: 1px solid #d2dbe9; animation-duration: 110s; }
        .wbh-o3 .wbh-counter { animation-duration: 110s; animation-direction: reverse; }
        @keyframes wbhSpin { to { transform: rotate(360deg); } }

        .wbh-pin { position: absolute; width: 0; height: 0; }
        .wbh-top { left: 50%; top: 0; }
        .wbh-bottom { left: 50%; top: 100%; }
        .wbh-left { left: 0; top: 50%; }
        .wbh-right { left: 100%; top: 50%; }
        .wbh-center { width: fit-content; transform: translate(-50%, -50%); }
        /* 동그라미 — 웹블로그 쪽 rounded-2xl 이 그 테마에서 4rem 이라 아이콘 칸(최대 64px)이 원이 된다 */
        .wbh-card { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid #e3e9f2; background: #fff; color: #1b4ea7; box-shadow: 0 8px 24px 0 rgba(27,78,167,.1); }
        .wbh-card svg { width: 24px; height: 24px; }
        @media (min-width: 768px) { .wbh-card { width: 56px; height: 56px; } .wbh-card svg { width: 28px; height: 28px; } }
        @media (min-width: 1024px) { .wbh-card { width: 64px; height: 64px; } .wbh-card svg { width: 32px; height: 32px; } }
        @media (prefers-reduced-motion: reduce) { .wbh-ring, .wbh-counter { animation: none; } }
      `}</style>
    </div>
  )
}
