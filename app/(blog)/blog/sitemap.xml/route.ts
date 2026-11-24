// 사이트맵 (/blog/sitemap.xml). 발행된 글·카테고리 페이지를 검색엔진에 알린다.
//
// 예전에는 Next 의 사이트맵 규격 파일(sitemap.ts)이었는데, 그 방식은 빌드 때 한 번 만들어진 뒤 바뀌지 않았다 —
// "1분마다 다시 생성" 설정을 줘도, 글 저장 때 직접 갱신을 걸어도 새 글이 다음 배포 때까지 들어오지 않았다 (2026-11-24 확인).
// 같은 글 목록을 쓰는 RSS(rss.xml/route.ts)와 llms.txt 는 제때 바뀌어서, 사이트맵도 그쪽과 같은 방식(글자를 직접 만드는 라우트)으로 옮겼다.
// 글을 발행·수정·삭제하면 저장 훅(blog/lib/revalidate.ts)이 이 주소를 바로 갱신하고, revalidate 는 그 훅이 못 돈 경우의 대비다.
import { getAllPosts, getCategories } from "@/blog/lib/payload";

const SITE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/blog`;

export const revalidate = 60;

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Entry = { url: string; lastModified?: string; changeFrequency: string; priority: number };

export async function GET(): Promise<Response> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);
  const entries: Entry[] = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/posts`, changeFrequency: "daily", priority: 0.7 },
    ...categories.map((c) => ({ url: `${SITE_URL}/${c.slug}`, changeFrequency: "weekly", priority: 0.7 })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/${p.category}/${encodeURIComponent(p.slug)}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
  const body = entries
    .map(
      (e) =>
        `<url>\n<loc>${escape(e.url)}</loc>\n${e.lastModified ? `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>\n` : ""}<changefreq>${e.changeFrequency}</changefreq>\n<priority>${e.priority}</priority>\n</url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
