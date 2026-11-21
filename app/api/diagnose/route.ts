import { NextResponse } from 'next/server'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'

/**
 * 자동 진단 API — 방문자가 넣은 사이트 주소를 서버에서 직접 받아
 * 로딩 속도 · 검색엔진 노출 구조 · 모바일 대응 · 문의 동선을 분석한다.
 *
 * mode: 'clinic' — 병의원 진단(/clinic-blog/check)이 쓴다. 위 네 가지에 더해
 * 제작 기술·보안(그누보드·PHP 같은 옛 방식인지)과 AI 검색 준비도를 함께 보고, 종합 점수도 여섯 가지로 낸다.
 * 메인 사이트 점검(/check)은 mode 없이 불러 예전과 같은 네 가지 결과를 받는다.
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

/** robots.txt 본문 — AI 크롤러를 막고 있는지 보려고 읽는다. 없거나 HTML 안내 페이지면 빈 문자열 */
async function fetchText(url: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), AUX_TIMEOUT)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'WeflowCheck/1.0' },
    })
    if (!res.ok) return ''
    const text = (await res.text()).slice(0, 20000)
    return /^\s*<(!doctype|html)/i.test(text) ? '' : text
  } catch {
    return ''
  } finally {
    clearTimeout(timer)
  }
}

/** robots.txt 에서 주요 AI 크롤러가 사이트 전체(Disallow: /)를 막혔는지 — 막힌 크롤러 이름 목록 */
function blockedAiBots(robots: string): string[] {
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']
  const groups: { agents: string[]; disallowAll: boolean }[] = []
  let cur: { agents: string[]; disallowAll: boolean } | null = null
  let lastWasAgent = false
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim()
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i)
    if (!m) continue
    const key = m[1].toLowerCase()
    const val = m[2].trim()
    if (key === 'user-agent') {
      if (!lastWasAgent || !cur) groups.push((cur = { agents: [], disallowAll: false }))
      cur.agents.push(val.toLowerCase())
      lastWasAgent = true
    } else {
      lastWasAgent = false
      if (cur && key === 'disallow' && val === '/') cur.disallowAll = true
    }
  }
  return bots.filter(bot => {
    // 이름을 콕 집은 규칙이 있으면 그걸 따르고, 없으면 * 규칙을 따른다
    const own = groups.find(g => g.agents.includes(bot.toLowerCase()))
    const star = groups.find(g => g.agents.includes('*'))
    return (own ?? star)?.disallowAll === true
  })
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
  let body: { url?: string; mode?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '요청 형식이 잘못되었습니다.' }, { status: 400 })
  }
  const clinic = body.mode === 'clinic'
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
  const [robotsText, sitemapOk] = await Promise.all([
    fetchText(`${finalUrl.origin}/robots.txt`),
    exists(`${finalUrl.origin}/sitemap.xml`),
  ])
  const robotsOk = robotsText.trim().length > 0

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

  /* ── 5. AI 검색 준비도 ──
   * 챗GPT·네이버 AI 브리핑 같은 AI 답변이 이 페이지를 읽고 인용할 수 있는 상태인지.
   * 사장님이 읽는 화면이라 기술 용어 대신 "무엇이 안 되는지"로 말한다. */
  const visibleText = html
    .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const textLen = visibleText.length
  const ldTypes = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(m => [...m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)].map(t => t[1]))
    .join(' ')
  const hasLd = ldTypes.length > 0
  const hasOrgLd = /(Organization|LocalBusiness|Corporation|Clinic|Dentist|Physician|Medical|Hospital|Store|Restaurant|ProfessionalService|Lodging|Campground|AutoRepair)/.test(ldTypes)
  const hasFaqLd = /FAQPage/.test(ldTypes)
  const hasFaqText = /(자주\s*묻는|FAQ|Q&A|질문과\s*답)/i.test(visibleText)
  const h2Count = (lower.match(/<h2[\s>]/g) || []).length
  const hasNaverVerify = /<meta[^>]+name=["']naver-site-verification["']/i.test(html)
  const hasBizNo = /\d{3}-\d{2}-\d{5}/.test(visibleText)
  const hasAddress = /(시|군|구)\s?[가-힣0-9]+(로|길|동)\s?\d/.test(visibleText)
  const blocked = robotsOk ? blockedAiBots(robotsText) : []

  const ai = score([
    {
      weight: 3,
      item: {
        label: '본문이 글자로 읽히는지',
        status: pick(textLen >= 500, textLen >= 200),
        value: `글자 ${textLen.toLocaleString()}자`,
        advice:
          textLen >= 500
            ? 'AI와 검색엔진이 읽을 수 있는 글이 충분합니다.'
            : '읽을 수 있는 글이 거의 없습니다. 설명이 이미지 안에만 있거나 화면이 나중에 그려지는 구조라, AI는 빈 페이지로 봅니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '업체 정보 표시(구조화 데이터)',
        status: pick(hasOrgLd, hasLd),
        value: hasOrgLd ? '있음' : hasLd ? '일부만 있음' : '없음',
        advice: hasOrgLd
          ? '업체 이름·연락처를 AI가 정확히 알아볼 수 있게 표시되어 있습니다.'
          : 'AI가 업체 이름·주소·연락처를 확실히 알아볼 표시(구조화 데이터)가 없습니다. 답변에 다른 업체 정보가 섞일 수 있습니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '자주 묻는 질문(FAQ)',
        status: pick(hasFaqLd, hasFaqText),
        value: hasFaqLd ? 'AI용 표시까지 있음' : hasFaqText ? '화면에만 있음' : '없음',
        advice: hasFaqLd
          ? '질문과 답이 AI가 바로 가져갈 수 있는 형태로 준비되어 있습니다.'
          : hasFaqText
            ? 'FAQ는 있지만 AI용 표시가 없어 답변에 그대로 쓰이기 어렵습니다.'
            : '고객이 자주 묻는 질문과 답이 없습니다. AI 답변은 질문에 바로 답하는 글을 가장 많이 인용합니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '소제목으로 나뉜 글',
        status: pick(h2Count >= 2, h2Count === 1),
        value: h2Count === 0 ? '소제목 없음' : `소제목 ${h2Count}개`,
        advice:
          h2Count >= 2
            ? '글이 소제목으로 나뉘어 있어 필요한 부분만 골라 인용하기 좋습니다.'
            : '글이 소제목으로 나뉘어 있지 않아, AI가 어느 부분이 무슨 내용인지 구분하기 어렵습니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: 'AI 수집 허용',
        status: pick(blocked.length === 0),
        value: blocked.length === 0 ? '막힌 곳 없음' : `${blocked.length}곳 차단`,
        advice:
          blocked.length === 0
            ? '챗GPT·클로드 등 AI가 사이트를 읽을 수 있습니다.'
            : `사이트 설정(robots.txt)이 ${blocked.join(', ')}의 접근을 막고 있습니다. 막힌 AI의 답변에는 이 사이트가 나올 수 없습니다.`,
      },
    },
    {
      weight: 1,
      item: {
        // 네이버는 메타 태그 대신 HTML 파일 업로드로도 인증할 수 있어, 태그가 없다고 '나쁨'으로 단정하지 않는다
        label: '네이버 등록 표시',
        status: pick(hasNaverVerify, true),
        value: hasNaverVerify ? '확인됨' : '페이지에서 미확인',
        advice: hasNaverVerify
          ? '네이버 서치어드바이저에 등록된 사이트입니다.'
          : '네이버 서치어드바이저 등록 표시가 페이지에 없습니다. 파일로 등록했을 수 있으니, 등록하지 않았다면 네이버 검색·AI 브리핑을 위해 등록이 필요합니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '상호·주소 글자 표시',
        status: pick(hasBizNo || (hasAddress && hasTel), hasAddress || hasTel),
        value: hasBizNo ? '사업자 정보 있음' : hasAddress ? '주소 있음' : '확인 안 됨',
        advice:
          hasBizNo || (hasAddress && hasTel)
            ? '업체 정보가 글자로 적혀 있어 AI가 실제 업체로 확인하기 좋습니다.'
            : '사업자 정보나 주소가 글자로 보이지 않습니다. 이미지에만 있으면 AI가 실제 업체인지 확인하기 어렵습니다.',
      },
    },
  ])

  /* ── 6. 제작 기술·보안 (병의원 진단 전용) ──
   * 어떤 방식으로 만든 사이트인지, 서버가 무엇을 드러내고 있는지 — 응답 헤더와 HTML 흔적으로만 본다 (침투 검사가 아니다).
   * 감지는 흔적 기반이라 틀릴 수 있으니 단정하지 않고 "~로 보입니다"로 말한다. */
  const h = (name: string) => res.headers.get(name) || ''
  const cookies = h('set-cookie')
  const poweredBy = h('x-powered-by')
  const serverHeader = h('server')
  const generator = (html.match(/<meta[^>]+name=["']generator["'][^>]*content=["']([^"']*)["']/i) || [])[1] || ''
  // 그누보드 — 프로그램이 남기는 흔적(게시판 주소 · 자바스크립트 변수)만 본다. 'gnuboard' 라는 낱말만으로는 판단하지 않는다 —
  // 그누보드를 다루는 글의 주소(/blog/.../gnuboard-...)가 페이지에 걸려 있기만 해도 그누보드 사이트로 잘못 읽혔다 (우리 /blog 가 그랬다)
  const isGnuboard = /(\/bbs\/(board|login|register|write)\.php|[?&]bo_table=|\bg5_(url|bbs_url|is_member|bo_table)\b|\/gnuboard\d?\/|youngcart)/i.test(html)
  const isWordpress = /(wp-content\/|wp-includes\/)/i.test(html) || /wordpress/i.test(generator)
  const isXe = /(xpressengine|rhymix|\/modules\/board\/|xe\.min\.js)/i.test(html) || /(xpressengine|rhymix)/i.test(generator)
  const isCafe24 = /(cafe24|echosting)/i.test(html)
  const isImweb = /(imweb|vendor-cdn\.imweb)/i.test(html)
  const isPhp = /php/i.test(poweredBy) || /PHPSESSID/i.test(cookies) || /href=["'](?!https?:|\/\/)[^"']*\.php[?"']/i.test(html) // 같은 사이트 안의 .php 링크만 (밖으로 나가는 링크는 남의 사이트다)
  const isNext = /(\/_next\/static|__next_f|id=["']__next["'])/i.test(html)
  // Next.js 흔적이 있으면 PHP 계열로 보지 않는다 — 글 본문·링크에 남의 프로그램 이름이나 .php 주소가 섞여 있어도 사이트 자체는 Next.js 다
  const builder = isNext ? '' : isGnuboard ? '그누보드(PHP)' : isWordpress ? '워드프레스(PHP)' : isXe ? 'XE·라이믹스(PHP)' : isPhp ? 'PHP' : ''
  const phpVer = (poweredBy.match(/PHP\/(\d+)\.(\d+)/i) || []).slice(1).map(Number)
  // PHP 는 8.1 까지 공식 보안 지원이 끝났다 (8.1 은 2025-12-31 종료)
  const phpOld = phpVer.length === 2 && (phpVer[0] < 8 || (phpVer[0] === 8 && phpVer[1] <= 1))
  const leaksVersion = /\d+\.\d+/.test(poweredBy) || /\/\d+\.\d+/.test(serverHeader)
  const secHeaders = [
    h('strict-transport-security') && 'HSTS',
    h('x-content-type-options') && 'nosniff',
    (h('x-frame-options') || /frame-ancestors/i.test(h('content-security-policy'))) && '클릭재킹 방지',
  ].filter(Boolean) as string[]

  const tech = score([
    {
      weight: 3,
      item: {
        label: '제작 방식',
        status: builder ? 'bad' : isNext ? 'good' : 'warn',
        value: builder || (isNext ? 'Next.js' : isCafe24 ? '카페24' : isImweb ? '아임웹' : '확인 안 됨'),
        advice: builder
          ? `${builder} 기반으로 보입니다. 널리 쓰이는 만큼 취약점이 공개되면 자동 공격의 대상이 되기 쉽고, 서버와 프로그램 업데이트를 계속 직접 챙겨야 합니다.`
          : isNext
            ? '최신 방식(Next.js)으로 만들어져 있습니다. 관리할 PHP 서버·게시판 프로그램이 없는 구조입니다.'
            : '제작 방식이 밖에서 확인되지 않습니다. 오래된 PHP 기반인지 상담에서 함께 확인해 드립니다.',
      },
    },
    {
      weight: 2,
      item: {
        label: '서버 정보 노출',
        status: pick(!leaksVersion && !phpOld, !phpOld),
        value: phpOld ? `PHP ${phpVer.join('.')} (지원 종료)` : leaksVersion ? '버전 노출됨' : '노출 없음',
        advice: phpOld
          ? `보안 지원이 끝난 PHP ${phpVer.join('.')} 버전을 쓰고 있습니다. 새 취약점이 나와도 고쳐지지 않는 버전입니다.`
          : leaksVersion
            ? '서버 프로그램의 버전이 밖에 그대로 보입니다. 공격자가 그 버전의 알려진 취약점부터 찾아보게 됩니다.'
            : '서버 프로그램의 버전이 밖으로 드러나지 않습니다.',
      },
    },
    {
      weight: 1,
      item: {
        label: '보안 설정(헤더)',
        status: pick(secHeaders.length >= 2, secHeaders.length === 1),
        value: `3가지 중 ${secHeaders.length}가지`,
        advice:
          secHeaders.length >= 2
            ? '브라우저가 사이트를 안전하게 다루도록 하는 기본 보안 설정이 갖춰져 있습니다.'
            : '접속을 늘 보안 연결로 고정하거나, 다른 사이트에 몰래 끼워 넣지 못하게 하는 기본 보안 설정이 빠져 있습니다.',
      },
    },
  ])

  if (clinic) {
    const overall = Math.round(
      tech.score * 0.15 + ai.score * 0.2 + seo.score * 0.2 + speed.score * 0.2 + mobile.score * 0.1 + contact.score * 0.15,
    )
    return NextResponse.json({
      finalUrl: finalUrl.toString(),
      overall,
      categories: { tech, ai, seo, speed, mobile, contact },
    })
  }

  const overall = Math.round(
    speed.score * 0.3 + seo.score * 0.3 + mobile.score * 0.2 + contact.score * 0.2,
  )

  return NextResponse.json({
    finalUrl: finalUrl.toString(),
    overall,
    categories: { speed, seo, mobile, contact },
  })
}
