import { notFound } from 'next/navigation'

// /clinic-blog 아래 없는 주소 — 사이트 공통 404 대신 이 페이지 헤더·푸터가 붙은 404(../not-found.tsx)를 보여 준다.
// 없는 주소는 원래 루트 404 로 가서, 여기서 notFound() 를 불러 가까운 404 로 돌린다.
export default function ClinicBlogNotFoundRoute() {
  notFound()
}
