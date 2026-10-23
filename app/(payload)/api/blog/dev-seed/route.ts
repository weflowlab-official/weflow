// 개발 전용 시드: 회사 정보·메인 페이지 기본 문구, 카테고리(큰 업종)·작성자(lib/mock.ts), 시험 글(lib/articles.ts), 첫 관리자 계정.
// 사용: 개발 서버 실행 중 GET /api/blog/dev-seed. 여러 번 실행해도 안전하다:
//   - 카테고리·작성자는 slug 로 찾아 이름·설명만 맞추고, 글은 slug 로 찾아 본문·FAQ·출처를 덮어쓴다 (사진·조회수·발행일 유지).
//   - 회사 기본 정보는 lib/mock.ts 값으로 맞추고, 글 하단 문구·메인 페이지 문구는 비어 있을 때만 채운다.
// 운영 DB 에는 절대 실행하지 않는다 (NODE_ENV=production 이면 404).
import { getPayload } from "payload";
import config from "@payload-config";
import type { Payload } from "payload";
import path from "path";
import fs from "fs/promises";
import { clinic, categories, doctors, popularKeywords } from "@/blog/lib/mock";
import { articles } from "@/blog/lib/articles";
import * as homeDefaults from "@/blog/lib/homeDefaults";
import * as clinicDefaults from "@/blog/lib/clinicDefaults";

const MIME: Record<string, string> = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

// 프로젝트 안의 이미지 파일을 미디어로 올린다. 같은 alt 의 미디어가 이미 있으면 그걸 쓴다 (업로드 파일명은 바뀔 수 있어 alt 로 찾는다)
async function uploadImage(payload: Payload, context: Record<string, unknown>, file: string, alt: string): Promise<number | undefined> {
  const found = await payload.find({ collection: "media", where: { alt: { equals: alt } }, limit: 1, depth: 0 });
  if (found.docs[0]) return found.docs[0].id;
  try {
    const data = await fs.readFile(path.resolve(process.cwd(), file));
    const name = path.basename(file);
    // 주의: context 객체는 호출마다 새로 만든다. Blob 플러그인이 업로드 뒤 req.context 에 skipCloudStorage 표시를 남겨,
    // 같은 객체를 돌려쓰면 두 번째 장부터 업로드를 건너뛴다 (문서만 생기고 파일은 없음).
    const doc = await payload.create({
      collection: "media",
      context: { ...context },
      file: { data, name, mimetype: MIME[path.extname(name).toLowerCase()] ?? "application/octet-stream", size: data.byteLength },
      data: { alt },
    });
    return doc.id;
  } catch (e) {
    payload.logger.warn(`이미지 올리기 실패: ${file} — ${(e as Error).message}`);
    return undefined;
  }
}

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@weflowlab.kr";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "weflow1234!";

export async function GET(): Promise<Response> {
  if (process.env.NODE_ENV === "production") return new Response("Not available", { status: 404 });
  const payload = await getPayload({ config });
  const context = { disableRevalidate: true, seed: true }; // 페이지 재생성 폭주 방지 + 발행일 과거 검증 건너뛰기
  const log: string[] = [];

  // 1) 첫 관리자 계정
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.totalDocs === 0) {
    await payload.create({ collection: "users", data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "관리자" } });
    log.push(`관리자 계정 생성: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  // 2) 회사 정보 글로벌: 기본 정보는 lib/mock.ts 로 맞추고, 글 하단 문구는 비어 있을 때만 기본 문구로 채운다
  const saved = await payload.findGlobal({ slug: "clinic", depth: 0 });
  await payload.updateGlobal({
    slug: "clinic",
    context,
    data: {
      benefitsTitle: saved.benefitsTitle || clinicDefaults.BENEFITS_TITLE,
      benefits: saved.benefits?.length ? saved.benefits : clinicDefaults.BENEFITS,
      ctaTitle: saved.ctaTitle || clinicDefaults.CTA_TITLE,
      ctaText: saved.ctaText || clinicDefaults.ctaText(clinic.name),
      name: clinic.name,
      nameEn: clinic.nameEn,
      homepageUrl: clinic.homepageUrl,
      address: clinic.address,
      phone: clinic.phone,
      fax: clinic.fax,
      businessNumber: clinic.businessNumber,
      representatives: clinic.representatives.map((value) => ({ value })),
      stats: clinic.stats,
      statsNote: clinic.statsNote,
      hours: clinic.hours,
      directions: clinic.directions,
      parking: clinic.parking.map((value) => ({ value })),
      mapLinks: clinic.mapLinks,
      consultUrl: clinic.consultUrl,
      kakaoChannelUrl: clinic.kakaoChannelUrl,
      sns: clinic.sns,
      legalLinks: clinic.legalLinks,
      homepageMenu: clinic.homepageMenu,
    },
  });
  log.push("회사 정보 저장");

  // 3) 메인 페이지 글로벌: 비어 있는 문구만 기본 문구(lib/homeDefaults.ts)로 채운다 (관리자가 고친 값과 배너 이미지는 그대로)
  const home = await payload.findGlobal({ slug: "home", depth: 0 });
  const banners = (home.banners?.length ? home.banners : homeDefaults.BANNERS.map((b) => ({ ...b, image: null, mobileImage: null }))).map((b, i) => {
    const d = homeDefaults.BANNERS[i % homeDefaults.BANNERS.length];
    return { ...b, label: b.label || d.label, text: b.text || d.text };
  });
  await payload.updateGlobal({
    slug: "home",
    context,
    draft: false,
    data: {
      _status: "published",
      heroTitle: home.heroTitle || homeDefaults.heroTitle(clinic),
      heroText: home.heroText || homeDefaults.HERO_TEXT,
      searchPlaceholder: home.searchPlaceholder || homeDefaults.SEARCH_PLACEHOLDER,
      popularKeywords: home.popularKeywords?.length ? home.popularKeywords : popularKeywords.map((value) => ({ value })),
      banners,
      summaryTitle: home.summaryTitle || homeDefaults.SUMMARY_TITLE,
      summaryText: home.summaryText || homeDefaults.summaryText(clinic),
      keyPoints: home.keyPoints?.length ? home.keyPoints : homeDefaults.KEY_POINTS.map(({ title, text }) => ({ title, value: text })),
      faq: home.faq?.length ? home.faq : homeDefaults.faq(clinic),
    },
  });
  log.push("메인 페이지 저장 (비어 있던 문구를 기본 문구로 채움)");

  // 4) 카테고리(큰 업종): slug 로 찾아 이름·설명·순서를 lib/industries.ts 에 맞춘다
  const categoryIds = new Map<string, number>();
  for (const [i, c] of categories.entries()) {
    const data = { name: c.name, slug: c.slug, description: c.description, order: i };
    const found = (await payload.find({ collection: "categories", where: { slug: { equals: c.slug } }, limit: 1, depth: 0 })).docs[0];
    const id = found
      ? (await payload.update({ collection: "categories", id: found.id, context, data })).id
      : (await payload.create({ collection: "categories", context, data })).id;
    categoryIds.set(c.slug, id);
  }
  log.push(`카테고리 ${categories.length}개`);

  // 5) 작성자: 없을 때만 만든다 (관리자가 고친 내용은 보존). 사진은 남색 바탕 WEFLOW 로고 (public/images/blog/weflow-author.webp)
  const authorPhoto = await uploadImage(payload, context, "public/images/blog/weflow-author.webp", "WEFLOW 로고 (작성자 사진)");
  const doctorIds = new Map<string, number>();
  for (const [i, d] of doctors.entries()) {
    const found = (await payload.find({ collection: "doctors", where: { slug: { equals: d.slug } }, limit: 1, depth: 0 })).docs[0];
    const id =
      found?.id ??
      (
        await payload.create({
          collection: "doctors",
          context,
          data: {
            name: d.name,
            slug: d.slug,
            title: d.title,
            bio: d.bio,
            photo: authorPhoto,
            specialties: d.specialties.map((value) => ({ value })),
            career: d.career.map((value) => ({ value })),
            order: i,
          },
        })
      ).id;
    doctorIds.set(d.slug, id);
  }
  log.push(`작성자 ${doctors.length}명`);

  // 6) 시험 글: slug 로 찾아 내용을 덮어쓴다 (썸네일·조회수·발행일 유지). 없으면 새로 만든다.
  //    관련 글(related)은 자기 자신을 제외하는 filterOptions 때문에 모든 글의 id 가 확정된 뒤 2차로 넣는다.
  const postIds = new Map<string, number>();
  let created = 0;
  for (const [i, a] of articles.entries()) {
    const existing = (await payload.find({ collection: "posts", where: { slug: { equals: a.slug } }, limit: 1, depth: 0 })).docs[0];
    const data = {
      _status: "published" as const,
      title: a.title,
      slug: a.slug,
      category: categoryIds.get(a.categorySlug)!,
      subIndustry: (a.subIndustry ?? null) as never,
      author: doctorIds.get(a.authorSlug)!,
      summary: a.summary,
      keyPoints: a.keyPoints.map((text) => ({ text })),
      content: a.content as never,
      faq: a.faq,
      sources: a.sources,
      tags: a.tags.map((tag) => ({ tag })),
    };
    const thumbnail = a.thumbnail ? await uploadImage(payload, context, a.thumbnail.path, a.thumbnail.alt) : undefined;
    if (existing) {
      await payload.update({
        collection: "posts",
        id: existing.id,
        context,
        draft: false,
        data: { ...data, ...(existing.thumbnail || !thumbnail ? {} : { thumbnail }) },
      });
      postIds.set(a.slug, existing.id);
    } else {
      const publishedAt = new Date(Date.now() - (i + 1) * 3600000).toISOString(); // 한 시간씩 간격을 둔 발행일
      const doc = await payload.create({ collection: "posts", context, draft: false, data: { ...data, publishedAt, views: a.views, thumbnail } });
      postIds.set(a.slug, doc.id);
      created++;
    }
  }
  log.push(`글 ${articles.length}편 저장 (새로 만든 것 ${created}, 나머지는 내용만 갱신)`);

  // 7) 관련 글 연결 (2차)
  for (const a of articles) {
    const related = a.related.map((s) => postIds.get(s)).filter((id): id is number => id !== undefined);
    await payload.update({ collection: "posts", id: postIds.get(a.slug)!, context, draft: false, data: { related } });
  }
  log.push("관련 글 연결");

  return new Response(log.join("\n"));
}
