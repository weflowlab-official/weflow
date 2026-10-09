// 새 문의 알림 메일 — 문의가 저장되면 운영 메일함으로 한 통 보낸다.
//
// Gmail 계정의 '앱 비밀번호'로 SMTP 발송한다 (2단계 인증을 켠 계정에서 만들 수 있다).
// 환경변수가 비어 있으면 보내지 않고 넘어간다 — 로컬 개발이나 키를 아직 안 넣은 배포에서
// 문의 접수까지 막히면 안 되기 때문이다.
//
//   GMAIL_USER          보내는 Gmail 주소
//   GMAIL_APP_PASSWORD  그 계정의 앱 비밀번호 (16자리)
//   NOTIFY_TO           받는 주소 (없으면 contact@weflowlab.kr)

import nodemailer from 'nodemailer'
import type { Inquiry } from '@/lib/store'
import { SITE_LABEL } from '@/lib/site'

const ADMIN_URL = 'https://weflowlab.kr/admin'

// 문의 내용은 방문자가 쓴 글이라 HTML 로 넣기 전에 꺾쇠 등을 바꿔 둔다
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 문의 한 건을 메일로 알린다. 실패해도 던지지 않는다 —
 * 호출하는 쪽은 이미 문의를 저장하고 응답까지 보낸 뒤라, 여기서 할 수 있는 건 기록뿐이다.
 */
export async function notifyInquiry(item: Inquiry): Promise<void> {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return

  // 관리자 화면과 같은 기준 — type 이 '사이트 점검'이면 사이트 점검 탭, 나머지는 문의 관리 탭
  const kind = item.type === '사이트 점검' ? '사이트 점검' : '문의'
  // 받침에 따라 조사를 맞춘다 — '문의가', '사이트 점검이'
  const josa = kind === '사이트 점검' ? '이' : '가'
  const site = item.site && item.site !== 'weflow' ? ` · ${SITE_LABEL[item.site] ?? item.site}` : ''

  const rows: [string, string][] = [
    ['이름', item.name],
    ['연락처', item.phone],
    ['진행 방식', item.type],
    ['업종', item.industry],
    ['접수 시각', new Date(item.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })],
  ].filter((r): r is [string, string] => Boolean(r[1]))

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    item.note,
    '',
    `관리자 페이지에서 확인하기: ${ADMIN_URL}`,
  ].join('\n')

  const html = `
    <div style="font-family:-apple-system,'Apple SD Gothic Neo',sans-serif;font-size:14px;color:#1a1a1a;line-height:1.6">
      <h2 style="font-size:17px;margin:0 0 14px">새 ${kind}${josa} 들어왔습니다${esc(site)}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 14px 4px 0;color:#6b7280;white-space:nowrap">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
          )
          .join('')}
      </table>
      ${item.note ? `<pre style="margin:16px 0;padding:12px 14px;background:#f5f6f8;border-radius:8px;white-space:pre-wrap;font-family:inherit">${esc(item.note)}</pre>` : ''}
      <a href="${ADMIN_URL}" style="display:inline-block;margin-top:6px;padding:9px 16px;background:#2f6fd6;color:#fff;border-radius:8px;text-decoration:none">관리자 페이지에서 확인하기</a>
    </div>`

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })
    await transporter.sendMail({
      from: `"WEFLOW 알림" <${user}>`,
      to: process.env.NOTIFY_TO || 'contact@weflowlab.kr',
      subject: `[${kind}] ${item.name}님${site}`,
      text,
      html,
    })
  } catch (err) {
    console.error('[notify] 문의 알림 메일 발송 실패', err)
  }
}
