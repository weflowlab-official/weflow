import { PenLine, UserRound, ClipboardPaste, Wand2 } from 'lucide-react'

/**
 * 누구나 쓸 수 있다 — HOW IT WORKS 바로 아래의 짧은 띠.
 * 원장님이 가장 먼저 떠올리는 '그럼 글은 누가 쓰나'에 답한다: 지금 블로그를 쓰는 사람이 그대로 쓰면 된다.
 * 글을 대신 써 준다고 읽히지 않게 한다 (WEFLOW 는 글쓰기 대행을 하지 않는다) — 말로 설득하기보다 글쓰기 데모(새 탭)로 직접 써 보게 한다.
 */

const POINTS = [
  { Icon: UserRound, title: '누구나 바로', text: '글쓰기 화면이 단순해서\n처음 보는 분도 금방 익힙니다.' },
  { Icon: ClipboardPaste, title: '쓰던 글도 그대로', text: '블로그에 써 둔 글을\n그대로 옮겨 올릴 수 있습니다.' },
  { Icon: Wand2, title: '칸만 채우면 끝', text: '내용만 넣으면 AI·검색엔진이\n읽는 구조는 함께 만들어집니다.' },
]

export default function EasyWrite() {
  return (
    <section className="ew" aria-labelledby="ew-title">
      <div className="cb-wrap ew-wrap">
        <div className="ew-text">
          <p className="cb-chapter">EASY TO WRITE</p>
          <h2 id="ew-title" className="cb-h2">블로그를 써 봤다면,{'\n'}<span className="cb-hl">누구나 쓸 수 있습니다</span></h2>
          <a href="/clinic-blog/demo" target="_blank" rel="noopener noreferrer" className="ew-btn">
            <PenLine size={18} /> 관리자페이지 체험하기
          </a>
        </div>
        <ul className="ew-points">
          {POINTS.map(({ Icon, title, text }) => (
            <li key={title}>
              <span><Icon size={20} /></span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        /* 위(HOW IT WORKS, 회색)와 아래(흰색) 사이에서 구분되게 연한 파랑 바탕 — 카드는 흰색으로 띄운다 */
        .ew { padding: 80px 0; background: linear-gradient(180deg, #eef4fd 0%, #f5f9ff 100%); }
        @media (min-width: 960px) { .ew { padding: 110px 0; } }
        .ew-wrap { display: grid; gap: 36px; }
        @media (min-width: 960px) { .ew-wrap { grid-template-columns: 1fr 1.05fr; gap: 72px; align-items: center; } }
        @media (max-width: 959px) { .ew-text { text-align: center; } }
        .ew-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 28px; padding: 15px 26px; border-radius: 999px; background: var(--cb-text); color: #fff; font-weight: 700; font-size: 1.02rem; text-decoration: none; transition: background .15s; }
        .ew-btn:hover { background: var(--cb-accent); }
        .ew-points { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
        .ew-points li { display: flex; gap: 16px; align-items: flex-start; padding: 20px 22px; border-radius: 18px; background: #fff; box-shadow: 0 8px 24px rgba(31,99,214,.06); }
        .ew-points span { flex: none; width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; background: #e8f0fc; color: var(--cb-accent); }
        .ew-points strong { display: block; font-size: 1.08rem; font-weight: 800; letter-spacing: -0.02em; }
        .ew-points p { margin: 4px 0 0; color: var(--cb-sub); font-size: .96rem; line-height: 1.65; white-space: pre-line; }
        @media (min-width: 480px) { .ew-points p { white-space: normal; } }
      `}</style>
    </section>
  )
}
