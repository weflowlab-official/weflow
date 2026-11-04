// 이미 올라간 글의 내용을 blog/lib/articles.ts 기준으로 고친다 — Payload REST API(/api/blog), 관리자 계정으로 로그인해서.
// 제목·요약·핵심 요약·태그·출처·FAQ·본문만 바꾼다. 썸네일·발행일·관련 글은 그대로 둔다.
// 조회수는 지금 값을 함께 보낸다 — 방문 때 본문 표만 올리고 저장본(version)은 안 올려서, 안 보내면 저장본의 옛 값으로 되돌아간다.
// VIEWS=숫자 를 주면 그 값으로 맞춘다 (되돌아간 조회수 복구용).
//
// 실행: 뒤에 고칠 글의 slug 를 붙인다.
//   BLOG_URL=https://weflowlab.kr BLOG_EMAIL=... BLOG_PASSWORD='...' npx tsx design/blog-thumbnails/update-post.ts naver-blog-vs-web-blog
import { articles } from "../../blog/lib/articles";

const API = `${(process.env.BLOG_URL || "http://localhost:3000").replace(/\/$/, "")}/api/blog`;
const slugs = process.argv.slice(2);

async function api(method: string, url: string, body?: unknown, token?: string) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

(async () => {
  if (!slugs.length) throw new Error("고칠 글의 slug 를 뒤에 붙여 주세요");
  if (!process.env.BLOG_EMAIL || !process.env.BLOG_PASSWORD) throw new Error("BLOG_EMAIL · BLOG_PASSWORD 가 필요합니다 (웹블로그 관리자 계정)");
  const { token } = await api("POST", "/users/login", { email: process.env.BLOG_EMAIL, password: process.env.BLOG_PASSWORD });

  for (const slug of slugs) {
    const a = articles.find((x) => x.slug === slug);
    if (!a) throw new Error(`articles.ts 에 없는 글: ${slug}`);
    const post = (await api("GET", `/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`, undefined, token)).docs?.[0];
    if (!post) throw new Error(`사이트에 없는 글: ${slug}`);
    await api("PATCH", `/posts/${post.id}`, {
      _status: "published",
      title: a.title,
      summary: a.summary,
      keyPoints: a.keyPoints.map((text) => ({ text })),
      tags: a.tags.map((tag) => ({ tag })),
      sources: a.sources,
      faq: a.faq,
      content: a.content,
      views: process.env.VIEWS ? Number(process.env.VIEWS) : post.views,
    }, token);
    console.log(`✓ 고침: ${slug} (id ${post.id})`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
