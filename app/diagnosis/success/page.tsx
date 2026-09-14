// /diagnosis/success — 무료 상담 신청 완료 화면.
//
// 예전에는 /diagnosis 안에서 상태만 바꿔 같은 주소에 완료 문구를 띄웠다.
// 주소를 따로 두면 뒤로가기·새로고침이 자연스럽게 동작하고,
// 광고·분석 도구에서 "완료까지 간 사람"을 주소 하나로 셀 수 있다.
//
// 신청하지 않고 주소로 바로 들어와도 깨지지 않는다 — 고정된 안내 문구뿐이다.
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Phone } from 'lucide-react'
import NaverLeadConversion from '@/components/NaverLeadConversion'

export const metadata: Metadata = {
  title: '무료 상담 신청 완료 · WEFLOW',
  description: '무료 상담 신청이 접수되었습니다. 담당자가 24시간 이내에 연락드립니다.',
  // 검색에 뜰 이유가 없는 페이지다. 신청서(/diagnosis)가 대신 잡혀야 한다
  robots: { index: false, follow: false },
}

export default function DiagnosisSuccessPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* 네이버 전환(lead) — 이 주소에 도달한 것 자체가 신청 완료 신호다 */}
      <NaverLeadConversion />
      <style>{`
        @keyframes done-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .done-panel { animation: none !important; }
        }
      `}</style>
      <div className="done-panel" style={{ textAlign: 'center', maxWidth: '420px', animation: 'done-in 0.45s ease-out both' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#dcfce7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem',
        }}>
          <Check size={34} color="#16a34a" strokeWidth={2.5} />
        </div>
        <h1 className="title-1 emphasized" style={{ marginBottom: '1rem' }}>
          무료 상담 신청 완료!
        </h1>
        <p className="c-muted" style={{ lineHeight: 1.8, marginBottom: '1.75rem', fontSize: '1.1rem' }}>
          담당자가 확인 후 <strong style={{ color: 'var(--text)' }}>24시간 내</strong>에 연락드리겠습니다.<br />
          연중무휴 상담 가능합니다.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:010-2971-7280" style={{
            flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            background: 'var(--accent)', color: 'var(--on-accent)', border: '1.5px solid var(--accent)',
            padding: '0.8rem 1.5rem', borderRadius: '8px', fontSize: '1rem',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }} className="emphasized">
            <Phone size={16} strokeWidth={2.5} /> 바로 전화하기
          </a>
          <Link href="/diagnosis" className="semibold"
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface)', border: '1.5px solid var(--accent)', color: 'var(--accent)',
              borderRadius: '8px', padding: '0.8rem 1.5rem', fontSize: '1rem',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
            다시 신청하기
          </Link>
        </div>
      </div>
    </div>
  )
}
