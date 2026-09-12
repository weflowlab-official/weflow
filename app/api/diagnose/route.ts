import { NextResponse } from 'next/server'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

/**
 * 자동 진단 API — 방문자가 넣은 사이트 주소를 서버에서 직접 받아
 * 로딩 속도 · 검색엔진 노출 구조 · 모바일 대응 · 문의 동선을 분석한다.
 *
 * 외부 서비스 없이 자체 측정한다:
 * 1) HTML 을 받으며 응답 속도와 무게를 재고
 * 2) 받은 HTML 을 파싱해 구조 항목을 점검한다
 * 계정·키가 필요 없고 3~5초 안에 결과가 나온다.
 */

// 느린 사이트도 있으니 본문은 6초, robots/sitemap 확인은 3초까지 기다린다
const FETCH_TIMEOUT = 6000
const AUX_TIMEOUT = 3000
// HTML 은 1.5MB 까지만 읽는다 — 그 이상이면 그 자체가 문제라 더 읽을 필요가 없다
const MAX_HTML = 1_500_000

export const maxDuration = 30

/** 진단 항목 하나 — value 는 측정값, advice 는 개선 제안 */
export interface CheckItem {
  label: string
  status: 'good' | 'warn' | 'bad'
  value: string
  advice: string
}

export interface Category {
  score: number
  items: CheckItem[]
}

/**
 * 주소를 정리하고 내부망 주소를 거른다.
 * 서버가 대신 접속하는 구조라, 사설 IP·localhost 로는 절대 나가면 안 된다.
 */
function normalizeUrl(input: string): URL | null {
  const raw = input.trim()
  if (!raw || raw.length > 300) return null
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  const host = url.hostname.toLowerCase()
  // 도메인이 아닌 것(내부 호스트명)과 IP 직접 입력을 거른다
  if (!host.includes('.')) return null
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return null
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const [a, b] = host.split('.').map(Number)
    const isPrivate =
      a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
    if (isPrivate) return null
  }
  if (host.includes(':')) return null // IPv6 리터럴
  return url
}

/** 응답 속도(TTFB)와 전체 수신 시간을 재면서 HTML 을 받아온다 */
async function timedFetch(url: URL) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  const started = Date.now()
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        // 일부 사이트는 UA 없는 요청을 막는다 — 일반 브라우저처럼 보낸다
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 WeflowCheck/1.0',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    const ttfbMs = Date.now() - started

    let html = ''
    let bytes = 0
    const reader = res.body?.getReader()
    if (reader) {
      const decoder = new TextDecoder()
      while (bytes < MAX_HTML) {
        const { done, value } = await reader.read()
        if (done) break
        bytes += value.byteLength
        html += decoder.decode(value, { stream: true })
      }
      reader.cancel().catch(() => {})
    }
    const totalMs = Date.now() - started
    return { res, html, bytes, ttfbMs, totalMs }
  } finally {
    clearTimeout(timer)
  }
}

/** robots.txt · sitemap.xml 존재 확인 — 실패해도 진단은 계속된다 */
async function exists(url: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), AUX_TIMEOUT)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'WeflowCheck/1.0' },
    })
    if (!res.ok) return false
    const text = (await res.text()).slice(0, 2000)
    // 없는 주소인데 200 으로 안내 페이지를 주는 서버가 많다 — HTML 이 돌아오면 없는 것으로 본다
    return text.trim().length > 0 && !/^\s*<(!doctype|html)/i.test(text)
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/** 항목들의 가중 평균으로 카테고리 점수를 낸다 (good 1 · warn 0.5 · bad 0) */
function score(items: { item: CheckItem; weight: number }[]): Category {
  const total = items.reduce((s, x) => s + x.weight, 0)
  const got = items.reduce(
    (s, x) => s + x.weight * (x.item.status === 'good' ? 1 : x.item.status === 'warn' ? 0.5 : 0),
    0,
  )
  return { score: Math.round((got / total) * 100), items: items.map(x => x.item) }
}

const pick = (ok: boolean, warn?: boolean): CheckItem['status'] =>
  ok ? 'good' : warn ? 'warn' : 'bad'

export async function POST(req: Request) {
  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '요청 형식이 잘못되었습니다.' }, { status: 400 })
  }
  const target = normalizeUrl(body.url || '')
  if (!target) {
    return NextResponse.json({ error: '올바른 사이트 주소를 입력해 주세요. (예: example.co.kr)' }, { status: 400 })
  }

  // 횟수 제한 — 주소 검사까지 끝난 뒤, 남의 사이트를 받아오기 직전에 본다.
  // 이 아래부터가 돈이 드는 구간이다(사이트 1곳당 5~10초의 함수 실행 시간).
  //
  // 한 방문자가 자기 사이트를 보고 고친 뒤 다시 확인하는 흐름까지는 넉넉히 열어 둔다 —
  // 1분 3회·1시간 10회면 실제 사용자는 걸릴 일이 없고, 자동 반복만 막힌다.
  const limited = await checkRateLimit('diagnose', clientIp(req), { perMinute: 3, perHour: 10 })
  if (!limited.ok) {
    return NextResponse.json(
      { error: '점검 요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    )
  }

  let fetched: Awaited<ReturnType<typeof timedFetch>>
  try {
    fetched = await timedFetch(target)
  } catch {
    return NextResponse.json(
      { error: '사이트에 접속하지 못했습니다. 주소를 다시 확인해 주세요.' },
      { status: 422 },
    )
  }
  const { res, html, bytes, ttfbMs, totalMs } = fetched
  if (!res.ok || !html) {
    return NextResponse.json(
      { error: `사이트가 정상 응답하지 않았습니다. (응답 코드 ${res.status})` },
      { status: 422 },
    )
  }

  const finalUrl = new URL(res.url || target.toString())
  const lower = html.toLowerCase()

  // robots.txt · sitemap.xml 은 본문과 별개로 병렬 확인
  const [robotsOk, sitemapOk] = await Promise.all([
    exists(`${finalUrl.origin}/robots.txt`),
    exists(`${finalUrl.origin}/sitemap.xml`),
  ])

  /* ── 1. 로딩 속도 ── */
  const htmlKb = Math.round(bytes / 1024)
  const imgCount = (lower.match(/<img[\s>]/g) || []).length
  const scriptCount = (lower.match(/<script[\s>]/g) || []).length
  const nextGenImgs = /\.(webp|avif)/.test(lower)

  const speed = score([
    {
      weight: 3,
      item: {
        label: '서버 응답 속도',
        status: pick(ttfbMs <= 800, ttfbMs <= 1500),
        value: `${(ttfbMs / 1000).toFixed(1)}초`,
        advice:
          ttfbMs <= 800
            ? '서버가 빠르게 응답하고 있습니다.'
            : '첫 응답까지 오래 걸립니다. 방문자는 3초를 넘기면 절반이 떠납니다. 서버 환경 개선이 필요합니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '첫 화면 수신 시간',
        status: pick(totalMs <= 2000, totalMs <= 4000),
        value: `${(totalMs / 1000).toFixed(1)}초`,
        advice:
          totalMs <= 2000
            ? '첫 화면이 빠르게 도착합니다.'
            : '화면이 도착하는 데 시간이 걸립니다. 불필요한 코드와 이미지를 줄이면 빨라집니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '페이지 무게',
        status: pick(htmlKb <= 300, htmlKb <= 800),
        value: bytes >= MAX_HTML ? `${htmlKb}KB 이상` : `${htmlKb}KB`,
        advice:
          htmlKb <= 300
            ? '페이지가 가볍습니다.'
            : '페이지가 무겁습니다. 무거운 페이지는 모바일 환경에서 특히 느려집니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '이미지 최적화',
        status: pick(imgCount === 0 || nextGenImgs, imgCount <= 15),
        value: nextGenImgs ? '차세대 형식 사용 중' : `이미지 ${imgCount}개 · 구형 형식`,
        advice: nextGenImgs
          ? 'WebP 등 최적화된 이미지 형식을 쓰고 있습니다.'
          : 'JPG·PNG 대신 WebP 형식을 쓰면 같은 화질에서 용량이 크게 줄어듭니다.',
      },
    },
    {
      weight: 1,
      item: {
        // 요즘 사이트는 코드를 여러 조각으로 나눠 보내는 게 정상이라(그게 더 빠르다)
        // 개수 자체는 넉넉히 보고, 과도하게 많은 경우만 짚는다
        label: '스크립트 개수',
        status: pick(scriptCount <= 25, scriptCount <= 45),
        value: `${scriptCount}개`,
        advice:
          scriptCount <= 25
            ? '스크립트가 절제되어 있습니다.'
            : '스크립트가 많습니다. 하나하나가 화면 표시를 늦추는 요인입니다.',
      },
    },
  ])

  /* ── 2. 검색엔진 노출 구조 ── */
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : ''
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)
  const desc = descMatch ? descMatch[1].trim() : ''
  const hasOg = /property=["']og:title["']/i.test(html)
  const h1Count = (lower.match(/<h1[\s>]/g) || []).length
  const isHttps = finalUrl.protocol === 'https:'

  const seo = score([
    {
      weight: 2,
      item: {
        label: '보안 연결(HTTPS)',
        status: pick(isHttps),
        value: isHttps ? '적용됨' : '미적용',
        advice: isHttps
          ? '보안 연결이 적용되어 있습니다.'
          : '주소창에 "안전하지 않음"이 표시되는 상태입니다. 검색 순위에도 불리하게 작용합니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '페이지 제목(title)',
        status: pick(title.length >= 10 && title.length <= 60, title.length > 0),
        value: title ? `"${title.slice(0, 40)}${title.length > 40 ? '…' : ''}"` : '없음',
        advice:
          title.length >= 10 && title.length <= 60
            ? '검색 결과에 잘 나올 길이의 제목입니다.'
            : title
              ? '제목이 너무 짧거나 깁니다. 10~60자 사이가 검색 결과에 온전히 보입니다.'
              : '페이지 제목이 없습니다. 검색 결과에 주소만 표시됩니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '페이지 설명(description)',
        status: pick(desc.length >= 50 && desc.length <= 160, desc.length > 0),
        value: desc ? `${desc.length}자` : '없음',
        advice:
          desc.length >= 50 && desc.length <= 160
            ? '검색 결과 요약문이 잘 준비되어 있습니다.'
            : desc
              ? '설명이 너무 짧거나 깁니다. 50~160자가 검색 결과에 온전히 보입니다.'
              : '페이지 설명이 없습니다. 검색엔진이 본문에서 아무 문장이나 잘라 보여줍니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '본문 제목 구조(H1)',
        status: pick(h1Count === 1, h1Count > 1),
        value: h1Count === 0 ? '없음' : `${h1Count}개`,
        advice:
          h1Count === 1
            ? '대표 제목이 하나로 명확합니다.'
            : h1Count === 0
              ? '대표 제목(H1)이 없어 검색엔진이 페이지 주제를 파악하기 어렵습니다.'
              : '대표 제목(H1)이 여러 개라 페이지 주제가 분산됩니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: 'SNS 공유 설정(OG 태그)',
        status: pick(hasOg),
        value: hasOg ? '있음' : '없음',
        advice: hasOg
          ? '카톡·SNS 공유 시 미리보기가 제대로 나옵니다.'
          : '카톡으로 공유하면 제목·이미지 없이 링크만 보입니다. 공유 유입을 놓치게 됩니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '검색엔진 안내 파일',
        status: pick(robotsOk && sitemapOk, robotsOk || sitemapOk),
        value:
          robotsOk && sitemapOk ? 'robots · sitemap 있음' : robotsOk ? 'sitemap 없음' : sitemapOk ? 'robots 없음' : '둘 다 없음',
        advice:
          robotsOk && sitemapOk
            ? '검색엔진이 사이트를 수집할 안내가 갖춰져 있습니다.'
            : 'robots.txt·sitemap.xml 이 없으면 검색엔진이 페이지를 빠짐없이 수집하지 못합니다.',
      },
    },
  ])

  /* ── 3. 모바일 화면 대응 ── */
  const hasViewport = /<meta[^>]+name=["']viewport["'][^>]*content=["'][^"']*width\s*=\s*device-width/i.test(html)
  const hasSrcset = /srcset=/i.test(lower)
  const hasMediaQuery = /@media[^{]*\(\s*(max|min)-width/i.test(html)

  const mobile = score([
    {
      weight: 3,
      item: {
        label: '모바일 화면 설정(viewport)',
        status: pick(hasViewport),
        value: hasViewport ? '적용됨' : '미적용',
        advice: hasViewport
          ? '모바일 기기에 맞춰 화면이 조정됩니다.'
          : '모바일에서 PC 화면이 축소되어 보이는 상태입니다. 글씨가 작아 읽기 어렵고 방문자가 바로 나갑니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '기기별 이미지 제공',
        status: pick(hasSrcset, imgCount <= 5),
        value: hasSrcset ? '적용됨' : '미적용',
        advice: hasSrcset
          ? '기기 크기에 맞는 이미지를 골라 보냅니다.'
          : '모바일에도 PC용 큰 이미지를 그대로 보내고 있어 데이터가 낭비되고 느려집니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '화면 크기별 스타일',
        status: pick(hasMediaQuery, true),
        value: hasMediaQuery ? '감지됨' : '페이지 안에서 미감지',
        advice: hasMediaQuery
          ? '화면 크기에 따라 배치가 조정되도록 만들어져 있습니다.'
          : '화면 크기별 스타일이 본문에서 확인되지 않습니다. 외부 파일에 있을 수 있어 직접 확인이 필요합니다.',
      },
    },
  ])

  /* ── 4. 문의 동선 ── */
  const hasTel = /href=["']tel:/i.test(lower)
  const hasKakao = /(pf\.kakao\.com|open\.kakao\.com|kakao\.com\/channel)/i.test(lower)
  const hasForm = /<form[\s>]/i.test(lower)
  const hasContactWord = /(문의|상담|견적|예약|contact)/i.test(html)
  // 첫 화면엔 양식 대신 문의 페이지로 보내는 버튼만 두는 사이트가 많다 — 그 동선도 창구로 인정
  const hasContactLink =
    /<a[^>]+href=["'][^"']*(contact|inquir|diagnos|consult|estimate|booking|apply)[^"']*["']/i.test(html) ||
    /<a[^>]*>[^<]{0,30}(문의|상담|견적|신청)[^<]{0,30}<\/a>/i.test(html)

  const contact = score([
    {
      weight: 2,
      item: {
        label: '전화 연결 버튼',
        status: pick(hasTel),
        value: hasTel ? '있음' : '없음',
        advice: hasTel
          ? '모바일에서 탭 한 번으로 전화가 걸립니다.'
          : '전화 연결(tel:) 버튼이 없습니다. 모바일 방문자는 번호를 외워서 걸어야 하고, 대부분 걸지 않습니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '문의 접수 창구',
        status: pick(hasForm || hasContactLink, hasContactWord),
        value: hasForm ? '접수 양식 있음' : hasContactLink ? '문의 페이지 연결' : '없음',
        advice:
          hasForm || hasContactLink
            ? '방문자가 문의를 남길 길이 마련되어 있습니다.'
            : '문의를 남길 창구가 없습니다. 영업시간 밖의 방문자는 연락할 방법이 없어 그대로 떠납니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '카카오톡 상담 연결',
        status: pick(hasKakao, true),
        value: hasKakao ? '있음' : '없음',
        advice: hasKakao
          ? '전화가 부담스러운 방문자를 위한 길이 있습니다.'
          : '카카오톡 채널 연결이 없습니다. 전화가 부담스러운 방문자를 위한 가벼운 선택지가 되어 줍니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '문의 관련 안내 문구',
        status: pick(hasContactWord),
        value: hasContactWord ? '있음' : '없음',
        advice: hasContactWord
          ? '문의를 안내하는 문구가 있습니다.'
          : '문의·상담을 안내하는 문구가 보이지 않습니다. 방문자에게 다음 행동을 알려줘야 합니다.',
      },
    },
  ])

  const overall = Math.round(
    speed.score * 0.3 + seo.score * 0.3 + mobile.score * 0.2 + contact.score * 0.2,
  )

  return NextResponse.json({
    finalUrl: finalUrl.toString(),
    overall,
    categories: { speed, seo, mobile, contact },
  })
}
