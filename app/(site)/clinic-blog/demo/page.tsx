import type { Metadata } from 'next'
import { CLINIC_BASE_CSS, SCENE_CSS } from '../base-css'
import DemoClient from './DemoClient'

/**
 * 글쓰기 데모 — /clinic-blog/demo
 *
 * 병의원 랜딩(/clinic-blog)의 히어로 오른쪽 버튼 · '누구나 쓸 수 있습니다' 띠 · 메뉴 '무료 체험'에서 새 탭으로 열린다.
 * 실제 웹블로그 관리자의 글쓰기 화면(제목 + 카테고리·요약·본문·FAQ·태그 탭, 오른쪽 미리보기)을 그대로 본뜬 체험판이다.
 * 서버에는 아무것도 보내지 않는다 — 입력한 내용은 이 탭의 화면 상태로만 있고, 새로고침하면 예시 글로 돌아간다.
 * 체험용 화면이라 검색에는 올리지 않는다 (noindex).
 */

export const metadata: Metadata = {
  title: '웹블로그 글쓰기 체험 · WEFLOW',
  description: '병원 웹블로그 관리자의 글쓰기 화면을 직접 써 보세요. 제목·요약·본문·자주 묻는 질문을 채우고 발행하면 어떻게 올라가는지 바로 볼 수 있습니다.',
  alternates: { canonical: '/clinic-blog/demo' },
  robots: { index: false, follow: true },
}

export default function ClinicDemoPage() {
  return (
    <div className="cb">
      <DemoClient />
      <style>{CLINIC_BASE_CSS + SCENE_CSS}</style>
    </div>
  )
}
