'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowRight } from 'lucide-react'

/**
 * 404 페이지 버튼 두 개 — 어느 주소에서 길을 잃었는지에 따라 돌려보낼 곳이 다르다.
 * 병·의원 웹블로그(/clinic-blog/...)는 광고로 들어온 단독 페이지라 메인 사이트로 내보내지 않고,
 * 그 페이지 맨 위와 상담 폼으로 되돌린다. 나머지는 메인·맞춤 견적으로.
 */
export default function NotFoundActions() {
  const pathname = usePathname() ?? ''
  const clinic = pathname.startsWith('/clinic-blog')

  return (
    <>
      <Link href={clinic ? '/clinic-blog' : '/'} className="btn-primary nf-btn">
        <Home size={18} strokeWidth={2.2} /> 메인으로 가기
      </Link>
      <Link href={clinic ? '/clinic-blog#contact-form' : '/diagnosis'} className="btn-primary nf-btn nf-btn--ghost">
        {clinic ? '무료 견적 신청' : '맞춤 견적 받기'} <ArrowRight size={18} strokeWidth={2.5} />
      </Link>
    </>
  )
}
