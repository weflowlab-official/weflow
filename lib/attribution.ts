/**
 * 유입 경로 캡처 — 어떤 광고·검색·링크로 들어온 방문자가 문의까지 왔는지 잇는다.
 *
 * 랜딩 때 URL 파라미터(네이버 파워링크 n_*, UTM, gclid, fbclid)와 리퍼러를 저장해 두고,
 * 문의 제출 시 사람이 읽는 한 줄("네이버 광고 · 키워드: 거실커튼")로 만들어 메모에 붙인다.
 *
 * 저장 규칙 — "들어온 그 방문"만 본다
 * - sessionStorage 에만 둔다. 탭을 닫으면 사라진다.
 * - 사이트에 새로 들어올 때(전체 페이지 로드)마다 그 진입 기준으로 다시 정한다:
 *   · 광고 파라미터가 있으면 → 광고로 덮어쓴다.
 *   · 리퍼러가 우리 사이트면 → 내부 이동(새로고침·일반 링크)이라 기존 값을 둔다.
 *   · 그 외(주소 직접 입력·외부 링크) → 이 진입의 리퍼러/직접 유입으로 덮어쓴다.
 *     → 광고로 왔다가 나갔다가 직접 들어오면 광고가 아니라 직접 유입이 된다.
 * - 사이트 안에서 페이지를 옮겨 다니는 동안(클라이언트 이동)은 값을 건드리지 않는다.
 * - 히어로 문구용 키워드도 같은 탭 안에서만 쓴다.
 * (예전엔 localStorage 30일 보관 + 파라미터 없으면 유지였는데, 직접 유입까지 광고로 잡혀서 걷어냈다)
 */

const ATTR_KEYS = [
  // 네이버 검색광고 자동 추적 URL 파라미터
  'n_media', 'n_query', 'n_rank', 'n_ad', 'n_keyword', 'n_keyword_id',
  'n_campaign_type', 'n_ad_group', 'n_ad_group_type', 'n_match', 'n_network',
  // 공통 UTM / 광고 클릭 ID / 커스텀
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'kw', 'gclid', 'fbclid',
] as const

export type Attribution = Partial<Record<(typeof ATTR_KEYS)[number], string>> & {
  landing?: string
  referrer?: string
  ts?: number
}

const STORAGE_KEY = 'weflow_attr'
const SESSION_KW_KEY = 'weflow_attr_kw'

/** URL 에서 광고·UTM 파라미터만 추려낸다 (없으면 빈 객체) */
function readParams(): Attribution {
  const sp = new URLSearchParams(window.location.search)
  const attr: Attribution = {}
  ATTR_KEYS.forEach(k => {
    const v = sp.get(k)
    if (v) attr[k] = v
  })
  return attr
}

function pickKeyword(a: Attribution): string {
  // n_query(사용자가 실제 친 검색어)를 우선 — n_keyword 는 캠페인에 따라 숫자 ID 로만 온다
  return a.n_query || a.n_keyword || a.utm_term || a.kw || ''
}

// 이 페이지 로드에서 진입 판정을 이미 했는지 — 모듈은 전체 로드마다 새로 실행되므로
// 첫 호출 = 사이트 진입, 그 뒤 호출 = 사이트 안 이동이다
let entryHandled = false

/** 리퍼러가 우리 사이트인지 (새로고침·일반 링크 이동) */
function isInternalReferrer(referrer: string): boolean {
  if (!referrer) return false
  try {
    return new URL(referrer).hostname === window.location.hostname
  } catch {
    return false
  }
}

/** 경로가 바뀔 때마다 호출 — 사이트 진입 때만 유입을 다시 정하고, 안에서 옮겨 다닐 땐 광고 파라미터가 있을 때만 덮어쓴다 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return
  try {
    // 예전 30일 보관분이 남아 있으면 지운다 — 남겨 두면 직접 유입이 광고로 잡힌다
    localStorage.removeItem(STORAGE_KEY)

    const params = readParams()
    const hasAd = Object.keys(params).length > 0
    const existing = getAttribution()
    const isEntry = !entryHandled
    entryHandled = true

    // 사이트 안 이동: 광고 파라미터가 새로 붙은 게 아니면 그대로 둔다
    if (!isEntry && !hasAd) return
    // 진입인데 광고 파라미터 없음: 내부 리퍼러(새로고침·링크)면 유지, 아니면 이 진입 기준으로 새로 정한다
    if (isEntry && !hasAd && existing && isInternalReferrer(document.referrer)) return

    const attr: Attribution = {
      ...params,
      landing: window.location.pathname,
      referrer: document.referrer || undefined,
      ts: Date.now(),
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr))

    // 히어로 문구용 키워드도 같이 — 광고 없는 진입이면 지워서 옛 키워드 문구가 안 나오게
    const kw = pickKeyword(params)
    if (kw) sessionStorage.setItem(SESSION_KW_KEY, kw)
    else sessionStorage.removeItem(SESSION_KW_KEY)
  } catch {
    /* 프라이빗 모드 등 접근 불가면 그냥 넘어간다 */
  }
}

/** 이 탭에서 저장된 유입 정보 — 탭을 닫으면 없어진다 */
export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}

/**
 * 유입 키워드(히어로 문구·폼 프리필용) — 현재 URL 의 파워링크 n_keyword → n_query → utm_term → kw,
 * 없으면 같은 탭에서 랜딩 때 저장한 값. 탭이 바뀌면 비어 있다.
 */
export function getEntryKeyword(): string {
  if (typeof window === 'undefined') return ''
  const fromUrl = pickKeyword(readParams())
  if (fromUrl) return fromUrl
  try {
    return sessionStorage.getItem(SESSION_KW_KEY) || ''
  } catch {
    return ''
  }
}

/** 리퍼러 호스트를 아는 채널 이름으로 */
function referrerChannel(referrer: string): string {
  let host = ''
  try {
    host = new URL(referrer).hostname
  } catch {
    return ''
  }
  if (host.includes('blog.naver')) return '네이버 블로그'
  if (host.includes('naver')) return '네이버 검색'
  if (host.includes('google')) return '구글 검색'
  if (host.includes('instagram')) return '인스타그램'
  if (host.includes('facebook')) return '페이스북'
  if (host.includes('youtube')) return '유튜브'
  if (host.includes('kakao')) return '카카오'
  if (host.includes('daum')) return '다음'
  if (host.includes('daangn') || host.includes('karrot')) return '당근'
  return host
}

/**
 * 저장된 유입 정보를 사람이 읽는 한 줄로.
 * 예: "네이버 광고 · 키워드: 거실커튼" / "네이버 검색" / "직접 유입"
 */
export function attributionLine(): string {
  const a = getAttribution()
  if (!a) return ''
  const keyword = pickKeyword(a)

  let channel = ''
  if (a.n_media || a.n_keyword || a.n_query || a.n_ad) channel = '네이버 광고'
  else if (a.gclid) channel = '구글 광고'
  else if (a.fbclid) channel = '메타 광고'
  else if (a.utm_source) {
    const KO: Record<string, string> = {
      naver: '네이버', google: '구글', instagram: '인스타그램', facebook: '페이스북',
      meta: '메타', youtube: '유튜브', kakao: '카카오', band: '밴드', daangn: '당근',
    }
    const name = KO[a.utm_source.toLowerCase()] || a.utm_source
    channel = a.utm_medium === 'cpc' || a.utm_medium === 'paid' ? `${name} 광고` : name
  } else if (a.referrer) channel = referrerChannel(a.referrer)
  else channel = '직접 유입'

  if (!channel) channel = '직접 유입'
  return keyword ? `${channel} · 키워드: ${keyword}` : channel
}
