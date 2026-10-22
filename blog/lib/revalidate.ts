// Payload 저장 훅에서 Next 페이지 캐시를 갱신한다.
// next/cache 를 최상위에서 import 하면 Payload CLI(generate:types 등)가 Next 런타임까지 로드해 깨지므로 지연 import.
// 훅은 블로그 기준 경로("/", "/posts", "/카테고리/글")를 넘기고, 여기서 실제 주소(/blog 아래)로 바꾼다.
export async function revalidate(paths: string[], layout = false) {
  const { revalidatePath } = await import("next/cache");
  for (const p of paths) {
    const full = p === "/" ? "/blog" : `/blog${p}`;
    if (layout) revalidatePath(full, "layout");
    else revalidatePath(full);
  }
}
