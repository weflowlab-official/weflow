// 요청 횟수 제한 — 같은 방문자(IP)가 정해진 시간 안에 몇 번까지 부를 수 있는지 센다.
//
// 왜 메모리가 아니라 DB 인가:
// 서버리스는 요청이 몰리면 인스턴스를 여러 개 띄운다. 메모리에 세면 그 카운터가
// 인스턴스마다 따로 놀아서, 동시에 퍼붓는 공격은 그대로 통과한다. 막으려는 게 바로
// 그 상황이라 의미가 없다. 이미 쓰고 있는 Neon 에 기록해 모든 인스턴스가 같은 수를 본다.
//
// 붙어 있는 곳: /api/diagnose (사이트 점검).
// 점검 1회가 남의 사이트를 대신 받아오느라 5~10초씩 함수 시간을 쓰기 때문에,
// 제한이 없으면 누구나 우리 계정의 실행 시간을 무제한으로 태울 수 있다.

import { getSql } from './db'

/** 막았을 때 돌려줄 것 — retryAfterSec 은 "몇 초 뒤에 다시" 안내용 */
export interface RateLimitResult {
  ok: boolean
  retryAfterSec: number
}

/**
 * 요청을 보낸 IP — Vercel 은 원래 주소를 헤더로 넘겨준다.
 * x-forwarded-for 는 프록시를 거칠 때마다 뒤로 붙으므로 맨 앞(=실제 방문자)만 쓴다.
 * 못 찾으면 'unknown' 으로 묶는다 — 한 덩어리로 세어도 안 세는 것보단 낫다.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim().slice(0, 64)
  return (req.headers.get('x-real-ip') || 'unknown').slice(0, 64)
}

// 테이블 생성은 인스턴스당 한 번만 시도한다 (매 요청마다 DDL 을 던지지 않도록)
let tableReady: Promise<void> | null = null

function ensureTable(): Promise<void> {
  if (tableReady) return tableReady
  const sql = getSql()
  tableReady = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS rate_hits (
        id         bigserial PRIMARY KEY,
        bucket     text        NOT NULL,
        ip         text        NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`
    // 조회는 항상 (bucket, ip, 최근 시간) 조합이라 그 순서로 인덱스를 건다
    await sql`
      CREATE INDEX IF NOT EXISTS rate_hits_lookup
      ON rate_hits (bucket, ip, created_at DESC)`
  })().catch(err => {
    // 실패하면 다음 요청에서 다시 시도할 수 있게 캐시를 비운다
    tableReady = null
    throw err
  })
  return tableReady
}

/**
 * 두 창을 한 번에 본다 — 짧은 폭주(1분)와 하루치 누적(1시간)을 같이 막아야 한다.
 * 둘 중 하나만 있으면 "1분에 3번씩 한 시간 내내" 같은 패턴이 그대로 새어 나간다.
 *
 * 통과하면 이번 요청을 기록하고 ok 를 돌려준다.
 *
 * DB 가 흔들릴 때는 통과시킨다(fail-open). 횟수 제한은 어디까지나 남용 방지장치라,
 * 이것 때문에 정상 방문자의 점검이 막히면 손해가 더 크다.
 */
export async function checkRateLimit(
  bucket: string,
  ip: string,
  opts: { perMinute: number; perHour: number },
): Promise<RateLimitResult> {
  try {
    await ensureTable()
    const sql = getSql()

    const rows = await sql`
      SELECT
        count(*) FILTER (WHERE created_at > now() - interval '1 minute') AS burst,
        count(*) AS hourly
      FROM rate_hits
      WHERE bucket = ${bucket}
        AND ip = ${ip}
        AND created_at > now() - interval '1 hour'`

    const burst = Number(rows[0]?.burst ?? 0)
    const hourly = Number(rows[0]?.hourly ?? 0)

    if (burst >= opts.perMinute) return { ok: false, retryAfterSec: 60 }
    if (hourly >= opts.perHour) return { ok: false, retryAfterSec: 3600 }

    await sql`INSERT INTO rate_hits (bucket, ip) VALUES (${bucket}, ${ip})`

    // 청소 — 창(1시간)을 넘긴 기록은 쓸모가 없다. 매번 지우면 그것대로 비용이라
    // 가끔씩만 훑는다. 요청이 쌓이는 만큼 자연히 실행되므로 크론이 필요 없다.
    if (Math.random() < 0.02) {
      await sql`DELETE FROM rate_hits WHERE created_at < now() - interval '1 hour'`
    }

    return { ok: true, retryAfterSec: 0 }
  } catch {
    return { ok: true, retryAfterSec: 0 }
  }
}
