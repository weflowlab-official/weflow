// 세부업종 글 18편(blog/lib/subIndustryArticles.ts)을 웹블로그에 새 글로 만든다 — Payload REST API(/api/blog), 관리자 계정으로 로그인해서.
// 시드(/api/blog/dev-seed)는 운영에서 막혀 있어, 운영에는 이 스크립트로 넣는다. DB 에 직접 붙지 않고 배포된 사이트(또는 로컬 dev 서버)의 API 를 거친다.
//  · 같은 slug 의 글이 이미 있으면 건너뛴다 (여러 번 돌려도 안전하다. 이미 있는 글의 내용은 고치지 않는다)
//  · 카테고리·작성자·관련 글은 slug 로 그 사이트의 id 를 찾아 넣는다
//  · 발행일은 지금부터 10초씩 간격 (목록 첫 글이 가장 최근). 지난 시각은 5분 안쪽만 받아 주므로(Posts 의 발행일 검사) 간격을 짧게 둔다
//  · 관련 글은 비어 있는 글에만 넣는다 — 중간에 멈췄다 다시 돌려도 이어서 채운다. 썸네일은 나중에 upload.mjs 로 붙인다
//
// 실행 (로컬에서 먼저 확인 → 운영):
//   BLOG_URL=http://localhost:3000 BLOG_EMAIL=... BLOG_PASSWORD=... npx tsx design/blog-thumbnails/create-posts.ts
//   BLOG_URL=https://weflowlab.kr  BLOG_EMAIL=... BLOG_PASSWORD=... npx tsx design/blog-thumbnails/create-posts.ts
// 일부 글만: 뒤에 slug 를 붙인다. DRY=1 이면 무엇을 할지 출력만 하고 만들지 않는다.
import { subIndustryArticles } from "../../blog/lib/subIndustryArticles";

const BASE = (process.env.BLOG_URL || "http://localhost:3000").replace(/\/$/, "");
const API = `${BASE}/api/blog`;
const DRY = process.env.DRY === "1";
const only = process.argv.slice(2);
const targets = subIndustryArticles.filter((a) => !only.length || only.includes(a.slug));

let token = "";
async function api(method: string, url: string, body?: unknown) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

// slug 로 문서 찾기 (없으면 undefined)
async function bySlug(collection: string, slug: string): Promise<{ id: number; related?: unknown[] } | undefined> {
  const r = await api("GET", `/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`);
  return r.docs?.[0];
}
const idBySlug = async (collection: string, slug: string) => (await bySlug(collection, slug))?.id;

(async () => {
  if (!DRY) {
    if (!process.env.BLOG_EMAIL || !process.env.BLOG_PASSWORD) throw new Error("BLOG_EMAIL · BLOG_PASSWORD 가 필요합니다 (웹블로그 관리자 계정)");
    token = (await api("POST", "/users/login", { email: process.env.BLOG_EMAIL, password: process.env.BLOG_PASSWORD })).token;
  }

  const author = await idBySlug("doctors", "weflow");
  if (!author) throw new Error("작성자(weflow)를 찾지 못했습니다");
  const categories = new Map<string, number>();
  for (const slug of new Set(targets.map((a) => a.categorySlug))) {
    const id = await idBySlug("categories", slug);
    if (!id) throw new Error(`카테고리(${slug})를 찾지 못했습니다`);
    categories.set(slug, id);
  }

  // 1) 글 만들기
  let created = 0;
  for (const [i, a] of targets.entries()) {
    if (await idBySlug("posts", a.slug)) {
      console.log(`- 이미 있음, 건너뜀: ${a.slug}`);
      continue;
    }
    if (DRY) {
      console.log(`+ 만들 글: ${a.slug} (${a.title})`);
      continue;
    }
    const doc = await api("POST", "/posts", {
      _status: "published",
      title: a.title,
      slug: a.slug,
      category: categories.get(a.categorySlug),
      subIndustry: a.subIndustry,
      author,
      summary: a.summary,
      keyPoints: a.keyPoints.map((text) => ({ text })),
      content: a.content,
      faq: a.faq,
      sources: a.sources,
      tags: a.tags.map((tag) => ({ tag })),
      publishedAt: new Date(Date.now() - i * 10000).toISOString(),
      views: a.views,
    });
    created++;
    console.log(`✓ 만듦: ${a.slug} (id ${doc.doc.id})`);
  }

  // 2) 관련 글 연결 — 모든 글이 만들어진 뒤에 (관련 글 칸이 자기 자신을 고를 수 없게 막혀 있어 id 가 확정된 다음에 넣는다)
  if (!DRY) {
    for (const a of targets) {
      const post = await bySlug("posts", a.slug);
      if (!post || post.related?.length) continue;
      const related = (await Promise.all(a.related.map((s) => idBySlug("posts", s)))).filter((id): id is number => id !== undefined);
      await api("PATCH", `/posts/${post.id}`, { related, _status: "published" });
    }
  }

  console.log(`\n${BASE}: 새 글 ${created}편${DRY ? " (DRY — 아무것도 만들지 않음)" : ""}`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
