/**
 * 병의원 웹블로그 페이지의 바탕 — 색 변수 · 본문 폭 · 줄바꿈 도우미.
 * 본 페이지(page.tsx)와 404(not-found.tsx)가 같이 쓴다.
 *
 * SCENE_CSS — 제목 강조·섹션 제목·대화 장면(AI 검색 휴대폰, 방문자 그래프)의 모양.
 * 병의원 페이지와 메인 사이트 '웹블로그란?'(app/(site)/webblog)이 같이 쓴다 (Scenes.tsx).
 */
export const CLINIC_BASE_CSS = `
        .cb {
          --cb-text: #111418;
          --cb-sub: #4b5360;
          --cb-muted: #8a919c;
          --cb-line: #e9ebef;
          --cb-soft: #f7f8fa;
          --cb-accent: #1f63d6;
          --cb-bubble-me: #1f63d6;
          --cb-bubble-you: #f1f3f6;
          background: #fff;
          color: var(--cb-text);
          min-height: 100vh;
        }
        .cb-wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
        .cb-pc { display: none; }
        @media (min-width: 768px) { .cb-pc { display: inline; } }
        /* 휴대폰에서만 줄을 바꾸는 자리 */
        @media (min-width: 768px) { .cb-mo { display: none; } }
`

export const SCENE_CSS = `
        /* 제목 강조 — 형광펜이 왼쪽에서 오른쪽으로 칠해진다 */
        .cb-mark { position: relative; z-index: 0; white-space: nowrap; }
        .cb-mark::after { content: ''; position: absolute; z-index: -1; left: -.08em; right: -.08em; bottom: .06em; height: .36em; border-radius: .1em; background: #cfe0fb; transform: scaleX(0); transform-origin: left; animation: cbMark .9s cubic-bezier(.65,0,.35,1) .5s forwards; }
        @keyframes cbMark { to { transform: scaleX(1); } }
        /* 본문 강조 — 섹션의 결론 문장에만 하나씩. 글자 아래쪽 절반에 연한 파랑을 깐다 */
        .cb-hl { color: var(--cb-text); font-weight: 700; background: linear-gradient(transparent 58%, #cfe0fb 58%); padding: 0 .1em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        /* 섹션 작은 제목 — 영어 대문자, 글자 사이를 벌린다 (히어로의 SCROLL 과 같은 결) */
        .cb-chapter { font-weight: 700; font-size: .85rem; letter-spacing: .22em; color: var(--cb-accent); margin: 0 0 16px; }
        .cb-h2 { font-size: clamp(1.7rem, 3.8vw, 2.5rem); line-height: 1.32; font-weight: 800; letter-spacing: -0.035em; margin: 0; white-space: pre-line; }
        .cb-body { color: var(--cb-sub); font-size: 1.05rem; line-height: 1.8; margin: 20px 0 0; }

        /* 장면 — 왼쪽 글, 오른쪽 대화창 */
        .cb-scene { padding: 96px 0; }
        .cb-scene-alt { background: var(--cb-soft); }
        /* STORY 01~03 의 설명 글 크기를 하나로 맞춘다 */
        .cb-scene .cb-body { font-size: 1.15rem; }
        @media (min-width: 960px) { .cb-scene { padding: 140px 0; } }
        .cb-scene-grid { display: grid; gap: 40px; align-items: center; }
        @media (min-width: 960px) { .cb-scene-grid { grid-template-columns: 1fr 1fr; gap: 80px; } }
        /* 글과 그림이 위아래로 쌓이는 화면 — STORY 01·02 처럼 글을 가운데로 */
        @media (max-width: 959px) { .cb-scene-text { text-align: center; } }

        .cb-chat { display: flex; flex-direction: column; gap: 14px; background: #fff; border: 1px solid var(--cb-line); border-radius: 24px; padding: 28px 20px; box-shadow: 0 20px 50px rgba(17,20,24,.06); }
        @media (min-width: 768px) { .cb-chat { padding: 36px 32px; } }
        .cb-line { display: flex; gap: 10px; align-items: flex-end; opacity: 0; transform: translateY(14px); transition: opacity .45s ease, transform .45s ease; transition-delay: calc(var(--i) * .55s); }
        .cb-chat.is-in .cb-line { opacity: 1; transform: none; }
        .cb-right { flex-direction: row-reverse; }
        .cb-avatar { flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: 800; background: #e8edf5; color: #44506a; }
        .cb-who-ai .cb-avatar { background: #111418; color: #fff; }
        .cb-who-director .cb-avatar, .cb-who-patient .cb-avatar { background: #e6eefc; color: var(--cb-accent); }
        .cb-bubble-wrap { display: flex; flex-direction: column; max-width: 78%; }
        .cb-right .cb-bubble-wrap { align-items: flex-end; }
        .cb-name { font-size: .75rem; color: var(--cb-muted); margin: 0 4px 4px; }
        .cb-bubble { margin: 0; padding: 12px 16px; border-radius: 18px; line-height: 1.55; font-size: .97rem; background: var(--cb-bubble-you); border-bottom-left-radius: 6px; }
        .cb-right .cb-bubble { background: var(--cb-bubble-me); color: #fff; border-bottom-left-radius: 18px; border-bottom-right-radius: 6px; }
        .cb-bubble-cta { margin-top: 8px; display: inline-block; background: #fff; color: var(--cb-accent); border: 1.5px solid var(--cb-accent); font-weight: 700; font-size: .88rem; padding: 8px 16px; border-radius: 999px; }

        /* 장면 2 — 상자 없이 가운데에서 큰 말풍선 */
        .cb-talk-scene { text-align: center; }
        .cb-talk-scene .cb-body { max-width: 600px; margin-left: auto; margin-right: auto; }
        .cb-talk { max-width: 720px; margin: 64px auto 0; background: none; border: 0; box-shadow: none; padding: 0; gap: 22px; text-align: left; }
        .cb-talk .cb-avatar { width: 44px; height: 44px; font-size: .8rem; }
        .cb-talk .cb-bubble { font-size: clamp(1.02rem, 1.8vw, 1.2rem); padding: 16px 22px; border-radius: 24px; }
        .cb-talk .cb-left .cb-bubble { border-bottom-left-radius: 8px; }
        .cb-talk .cb-right .cb-bubble { border-bottom-right-radius: 8px; }
        .cb-talk .cb-name { font-size: .85rem; font-weight: 700; }
        .cb-time { font-size: .75rem; color: var(--cb-muted); margin: 6px 6px 0; }
        /* 휴대폰 — 아바타·말풍선 여백을 줄여 말풍선 폭을 넓게 쓴다 */
        /* 휴대폰 — 아바타를 빼고(이름만 남김) 말풍선을 메신저처럼 작고 좁게. 좌우로 엇갈려 대화처럼 보이게 한다 */
        @media (max-width: 640px) {
          .cb-talk { margin-top: 40px; gap: 14px; }
          .cb-talk .cb-avatar { display: none; }
          .cb-talk .cb-bubble-wrap { max-width: 78%; }
          .cb-talk .cb-bubble { font-size: .95rem; padding: 11px 15px; border-radius: 18px; }
          .cb-talk .cb-left .cb-bubble { border-bottom-left-radius: 6px; }
          .cb-talk .cb-right .cb-bubble { border-bottom-right-radius: 6px; }
          .cb-talk .cb-name { font-size: .78rem; }
          .cb-time { font-size: .7rem; margin-top: 4px; }
        }

        /* 장면 3 — 방문자 그래프가 그려지다 뚝 떨어진다 */
        .cb-drop-col { display: grid; gap: 20px; }
        .cb-drop { position: relative; background: #fff; border: 1px solid var(--cb-line); border-radius: 24px; padding: 24px 24px 20px; box-shadow: 0 20px 50px rgba(17,20,24,.06); overflow: hidden; }
        .cb-drop-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
        .cb-drop-head span { font-weight: 800; }
        .cb-drop-head small { color: var(--cb-muted); font-size: .8rem; }
        .cb-drop-chart { display: block; width: 100%; height: 170px; overflow: visible; }
        .cb-drop-line { stroke-dasharray: 900; stroke-dashoffset: 900; }
        .cb-drop-area { opacity: 0; }
        .cb-drop-col.is-in .cb-drop-line { transition: stroke-dashoffset 2s cubic-bezier(.45,.05,.3,1); stroke-dashoffset: 0; }
        .cb-drop-col.is-in .cb-drop-area { transition: opacity .8s ease 1.2s; opacity: 1; }
        .cb-drop-mark { position: absolute; left: 78%; top: 76px; padding: 4px 10px; border-radius: 999px; background: #fdecec; color: #d64545; font-size: .78rem; font-weight: 800; opacity: 0; transform: translateY(6px); transition: opacity .4s ease, transform .4s ease; }
        .cb-drop-col.is-in .cb-drop-mark { opacity: 1; transform: none; transition-delay: 1.6s; }
        .cb-drop-toast { position: absolute; left: 16px; right: 16px; top: 14px; margin: 0; padding: 12px 16px; border-radius: 14px; background: #111418; color: #fff; font-size: .9rem; font-weight: 700; opacity: 0; transform: translateY(-120%); transition: opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1); }
        .cb-drop-col.is-in .cb-drop-toast { opacity: 1; transform: none; transition-delay: 2.1s; }
        /* 그래프가 다 떨어진 뒤에 대화가 시작된다 */
        /* 그래프와 대화는 한 묶음(.cb-drop-col)이 화면에 들어오는 순간 같이 시작해, 2.6초에 같이 끝난다.
           그래프: 선 0~2s, 노출 제한 표시 1.6~2.0s, 알림 2.1~2.6s
           대화: 세 줄이 0s · 1.075s · 2.15s 에 올라와 각각 .45s 걸린다 → 마지막이 2.6s 에 끝 */
        .cb-drop-col .cb-after-drop .cb-line { opacity: 0; transform: translateY(14px); transition-delay: calc(var(--i) * 1.075s); }
        .cb-drop-col.is-in .cb-after-drop .cb-line { opacity: 1; transform: none; }

        /* 출처 카드 — AI 답변이 인용한 글 */
        .cb-bubble.cb-src { background: #fff; border: 1.5px solid var(--cb-line); font-weight: 700; }
        .cb-src small { display: block; font-size: .75rem; font-weight: 700; color: #e05252; margin-bottom: 2px; }

        /* 장면 1 — 가운데 정렬, 휴대폰 화면 */
        .cb-phone-scene { text-align: center; }
        .cb-phone-scene .cb-body { max-width: 600px; margin-left: auto; margin-right: auto; }
        /* 넓은 화면: 둘째 줄("증상과 치료법을 검색하고 … 기억합니다.")이 한 줄에 들어가게 폭을 넓힌다 */
        @media (min-width: 768px) { .cb-phone-scene .cb-body { max-width: 860px; } }
        /* PC 검색 화면(SearchMock) + 휴대폰 — 넓은 화면에서 나란히, 위아래 가운데 맞춤 */
        .cb-ai-visual { margin-top: 56px; }
        @media (min-width: 960px) { .cb-ai-visual { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 48px; align-items: center; } }
        .cb-phone { width: min(340px, 100%); margin: 0 auto; padding: 11px; border-radius: 48px; background: #111418; box-shadow: 0 30px 80px rgba(17,20,24,.18); text-align: left; }
        .cb-phone-screen { background: #fff; border-radius: 38px; overflow: hidden; display: flex; flex-direction: column; min-height: 600px; }
        .cb-phone-status { height: 40px; display: flex; justify-content: center; align-items: center; }
        .cb-phone-status i { width: 90px; height: 24px; border-radius: 999px; background: #111418; }
        .cb-phone-head { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0; padding: 4px 0 12px; text-align: center; font-weight: 800; font-size: .95rem; border-bottom: 1px solid var(--cb-line); }
        .cb-phone .cb-chat { flex: 1; border: 0; border-radius: 0; box-shadow: none; padding: 20px 14px; gap: 10px; }
        .cb-phone .cb-avatar, .cb-phone .cb-name { display: none; }
        .cb-phone .cb-bubble-wrap { max-width: 86%; }
        .cb-phone .cb-bubble { font-size: .92rem; }
        .cb-phone-input { margin: 0 14px 18px; padding: 12px 18px; border-radius: 999px; background: var(--cb-soft); color: var(--cb-muted); font-size: .9rem; }
        .cb-phone-note { margin: 56px 0 0; /* 설명 두 줄 ↔ 그림 간격(.cb-ai-visual 의 56px)과 같게 */ font-size: 1.22rem; color: var(--cb-sub); }
        .cb-phone-note b { color: #e05252; }

        @media (prefers-reduced-motion: reduce) {
          .cb-line { opacity: 1; transform: none; transition: none; }
          .cb-mark::after { animation: none; transform: none; }
          .cb-drop-line { stroke-dashoffset: 0; }
          .cb-drop-area, .cb-drop-mark, .cb-drop-toast { opacity: 1; transform: none; }
        }
`
