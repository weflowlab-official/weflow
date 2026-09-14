// /sitemap.xml 을 만들어 주는 파일 (빌드 시 생성).
// 검색엔진에 공개 페이지 목록과 각 페이지의 중요도·갱신 주기를 넘긴다.
import type { MetadataRoute } from 'next'
import { portfolios } from '@/data/cases'

const BASE = 'https://weflowlab.kr'

/** 사례 상세 페이지들의 갱신일 — 사례 내용을 고쳤을 때 이 날짜만 올리면 된다 */
const CASES_UPDATED = '2026-09-09'

/**
 * updated 는 그 페이지 내용을 실제로 고친 날짜다 (YYYY-MM-DD).
 *
 * 배포 시각을 그대로 쓰면 한 페이지만 고쳐도 열 페이지가 전부 "방금 바뀜"으로 나가고,
 * 그런 사이트맵을 몇 번 보면 검색엔진이 lastmod 자체를 믿지 않는다.
 * 그러니 페이지 내용을 의미 있게 고쳤을 때만 그 줄의 날짜를 손으로 올린다.
 * (오타 수정·색상 변경처럼 내용이 그대로면 굳이 안 올려도 된다)
 */
const paths: {
  path: string
  updated: string
  priority: number
  freq: MetadataRoute.Sitemap[number]['changeFrequency']
}[] = [
  // 09-13: 제목을 브랜드 앞세운 형태로 교체, 설명도 제작 방식·1:1 전담 중심으로 다시 씀
  { path: '', updated: '2026-09-13', priority: 1.0, freq: 'weekly' },
  //
  // 09-14: 아래 아홉 줄이 한꺼번에 올라간 건 배포 시각을 찍어서가 아니다.
  // 이날 검색 결과에 나가는 그림을 전 페이지에 새로 달았다 —
  //  - /service·/difference·/benefits 는 페이지 전용 캐러셀 카드 다섯 장씩
  //  - 나머지 여섯 페이지는 페이지별 og 이미지 (그전에는 og:image 가 아예 없었다)
  // 검색 결과에 보이는 것이 실제로 바뀐 페이지들이라 날짜를 올린다.
  //
  { path: '/service', updated: '2026-09-14', priority: 0.9, freq: 'weekly' },
  { path: '/difference', updated: '2026-09-14', priority: 0.8, freq: 'monthly' },
  { path: '/guide', updated: '2026-09-14', priority: 0.8, freq: 'monthly' },
  { path: '/pricing', updated: '2026-09-14', priority: 0.9, freq: 'weekly' },
  { path: '/cases', updated: '2026-09-14', priority: 0.8, freq: 'weekly' },
  { path: '/about', updated: '2026-09-14', priority: 0.7, freq: 'monthly' },
  { path: '/benefits', updated: '2026-09-14', priority: 0.7, freq: 'monthly' },
  { path: '/diagnosis', updated: '2026-09-14', priority: 0.8, freq: 'monthly' },
  { path: '/check', updated: '2026-09-14', priority: 0.8, freq: 'monthly' },
  // /booking 은 메뉴에서 내리면서 검색 노출도 뺐다 — 페이지는 주소로만 접근 가능
]

/**
 * 제작 사례 상세(/cases/[slug]) — 내용이 채워진 사례만 자동으로 붙는다.
 * 사례를 추가하면 사이트맵에도 따라 들어오므로 이 파일을 손댈 필요가 없다.
 */
const casePaths = portfolios
  .filter(p => p.detail)
  .map(p => ({
    path: `/cases/${p.slug}`,
    updated: CASES_UPDATED,
    priority: 0.7,
    freq: 'monthly' as const,
  }))

// 위 목록을 sitemap 항목으로 변환한다 (관리자 /admin 은 애초에 넣지 않는다)
export default function sitemap(): MetadataRoute.Sitemap {
  return [...paths, ...casePaths].map(({ path, updated, priority, freq }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(`${updated}T00:00:00Z`),
    changeFrequency: freq,
    priority,
  }))
}