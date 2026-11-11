// 방문 통계 조회 엔드포인트 — /api/analytics
// GET only, 관리자 인증 필요. 관리자 통계 화면이 원본 방문 기록을 받아 직접 집계한다.

import { NextResponse } from 'next/server'
import { pageViewStore } from '@/lib/store'
import { isAdmin } from '@/lib/adminAuth'

// ?days=N (1~3650, 기본 30) → 최근 N일 방문 기록 전체를 반환
// 관리자 유입 관리는 '지난달'·'전체' 기간도 고를 수 있어 전체 기간을 받아 간다 (예전엔 90일 상한이라 30일 이전이 0으로 보였다)
export async function GET(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const days = Math.min(Math.max(Number(searchParams.get('days')) || 30, 1), 3650)
  const rows = await pageViewStore.getRecent(days)
  return NextResponse.json(rows)
}
