// 어디에도 없는 주소의 404 페이지.
// 사이트·웹블로그·블로그 관리자가 각자 루트 레이아웃을 가져 공통 레이아웃이 없으므로,
// 사이트 레이아웃(app/(site)/layout.tsx)의 뼈대만 옮겨 와 기존 404 화면을 그대로 그린다.
import type { Metadata } from 'next'
import '../styles/globals.css'
import ClientLayout from '@/components/ClientLayout'
import FontLoader from '@/components/FontLoader'
import NotFound from './(site)/not-found'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 | WEFLOW',
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body>
        <FontLoader />
        <ClientLayout>
          <NotFound />
        </ClientLayout>
      </body>
    </html>
  )
}
