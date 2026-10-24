import type { Metadata } from 'next'
import NotFound from '../not-found'
import ClinicHeader from './ClinicHeader'
import ClinicFooter from './ClinicFooter'
import { CLINIC_BASE_CSS } from './base-css'

/**
 * 병의원 웹블로그(/clinic-blog/...) 아래 없는 주소의 404.
 * 사이트 공통 404 화면을 그대로 쓰되, 위아래에 이 페이지 헤더·푸터를 붙여 광고로 들어온 사람이 이 페이지 안에 머물게 한다.
 * 버튼은 NotFoundActions 가 주소를 보고 이 페이지 맨 위·상담 폼으로 돌린다.
 */
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 | WEFLOW 병의원 웹블로그',
  robots: { index: false, follow: false },
}

export default function ClinicBlogNotFound() {
  return (
    <div className="cb cb-404">
      <ClinicHeader base="/clinic-blog" />
      <main className="cb-404-main">
        <NotFound />
      </main>
      <ClinicFooter bar={false} />
      <style>{CLINIC_BASE_CSS + `
        /* 헤더가 위에 떠 있으니 그만큼 내리고, 내용이 짧아도 푸터는 화면 맨 아래에 붙인다 */
        .cb-404 { display: flex; flex-direction: column; }
        .cb-404-main { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 76px; }
      `}</style>
    </div>
  )
}
