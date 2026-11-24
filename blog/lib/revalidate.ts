// Payload 저장 훅에서 Next 페이지 캐시를 갱신한다.
// next/cache 를 최상위에서 import 하면 Payload CLI(generate:types 등)가 Next 런타임까지 로드해 깨지므로 지연 import.
// 훅은 블로그 기준 경로("/", "/posts", "/카테고리/글")를 넘기고, 여기서 실제 주소(/blog 아래)로 바꾼다.
// layout=true(회사 정보·업종처럼 모든 글에 보이는 값)는 사이트 전체를 갱신한다.
// /blog 자리에 layout.tsx 가 없어(블로그 레이아웃은 app/(blog)/layout.tsx) revalidatePath("/blog", "layout") 은 글 페이지까지 닿지 않는다.
export async function revalidate(paths: string[], layout = false) {
  const { revalidatePath } = await import("next/cache");
  if (layout) {
    revalidatePath("/", "layout");
    return;
  }
  for (const p of paths) {
    revalidatePath(p === "/" ? "/blog" : `/blog${p}`);
  }
  // 검색엔진·AI 가 읽는 목록 파일도 같이 새로 만든다 — 글을 올려도 사이트맵과 llms.txt 에 새 글이 다음 배포 때까지 안 들어오던 문제가 있었다 (2026-11-24).
  // 파일마다 '몇 분마다 다시 생성' 설정이 있지만 그것만으로는 제때 바뀌지 않아, 글이 바뀔 때 직접 갱신한다
  revalidatePath("/blog/sitemap.xml");
  revalidatePath("/blog/rss.xml");
  revalidatePath("/llms.txt");
}
