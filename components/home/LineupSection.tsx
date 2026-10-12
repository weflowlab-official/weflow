'use client'
import { useState } from 'react'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

/**
 * 제작 라인업 — 가로로 늘어선 얇은 패널을 마우스로 짚으면 그 칸만 넓어진다.
 * 누르면 /guide 의 해당 섹션으로 바로 내려간다 (각 섹션에 같은 id 가 붙어 있다).
 */
// 사진이 도착하기 전 자리를 채울 흐린 미리보기 (10x5 로 줄인 것). 
// 없으면 로딩 동안 칸이 새까맣게 비어 보인다.
const BLUR: Record<string, string> = {
  '01': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmIJI0mzLCJRtwAxwAfWnvcW5ckWaKCeAGPFFFAH//2Q==',
  '02': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDE1U2n7jybNIvk+Yhidx9azDtyflooprYGf//Z',
  '03': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDm7Ao1/GJEDrzlT34qG52i5lCqAN5wB25oopgf/9k=',
  '04': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmLi7t5oUSOzSJhyZNxJPFU8+1FFAH/9k=',
  '05': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDlo5UjmDSQrMuPusSBn3xSvc25ckWaqCeAJG4oopgf/9k=',
  '06': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAFAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBnijSLG2sLJ7e3WJ5PvMucn5Qa5UxqCetFFWloJn//2Q==',
}

// cardLines — 좁은 화면 카드에서만 쓰는 줄 나눔.
// 카드 폭이 좁아 긴 이름이 아무 데서나 끊기므로, 여기 적힌 대로 줄을 나눈다.
// (데스크탑 가로 패널은 name 을 그대로 한 줄로 쓴다)
const ITEMS: {
  no: string; name: string; tag: string; img: string; anchor: string
  cardLines?: string[]
}[] = [
  { no: '01', name: '홈페이지',        tag: 'WHAT IS A HOMEPAGE',   img: '/images/main/main-guide-01.webp',    anchor: 'homepage'  },
  { no: '02', name: '홈페이지가 필요한 이유',      tag: 'WHY YOU NEED ONE',     img: '/images/main/main-guide-02.webp',         anchor: 'why-homepage'  },
  { no: '03', name: '랜딩형 홈페이지',   tag: 'LANDING HOMEPAGE',     img: '/images/main/main-guide-03.webp', anchor: 'landing-home'  },
  { no: '04', name: '랜딩페이지',       tag: 'LANDING PAGE',         img: '/images/main/main-guide-04.webp',     anchor: 'landing'  },
  { no: '05', name: '관리자 페이지',     tag: 'ADMIN PAGE',           img: '/images/main/main-guide-05.webp',       anchor: 'admin'  },
  { no: '06', name: '관리자 페이지가 필요한 이유', tag: 'WHY ADMIN MATTERS',  img: '/images/main/main-guide-06.webp',    anchor: 'why-admin', cardLines: ['관리자 페이지가', '필요한 이유'] },
]

export default function LineupSection() {
  // 마우스를 올린 칸 — CSS :hover 만으로도 되지만, 접힌 이름을 감추는 타이밍을 맞추려고 상태로 둔다
  const [active, setActive] = useState<number | null>(null)

  return (
    <section style={{ background: 'var(--section-b)', padding: 'clamp(3rem, 7vw, 5rem) 0' }}>
      {/* 머리말 */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem' }}>
        <Reveal variant="up" style={{ marginBottom: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          <p
            className="caption-2 emphasized c-accent"
            style={{ letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 0.6rem' }}
          >
            PRODUCT LINEUP
          </p>
          <h2 className="title-1" style={{ margin: 0, wordBreak: 'keep-all' }}>
            제작 라인업
          </h2>
          <p className="body c-muted" style={{ margin: '0.9rem 0 0', maxWidth: '560px', wordBreak: 'keep-all' }}>
            WEFLOW의 제작 라인업,<br />클릭하여 자세한 설명을 확인하세요.
          </p>
        </Reveal>
      </div>

      {/* 넓은 화면 — 얇은 패널 6개, 짚으면 그 칸만 넓어진다 */}
      <div className="lineup-row">
        {ITEMS.map((it, i) => (
          <Link
            key={it.anchor}
            href={`/guide#${it.anchor}`}
            className={`lineup-panel${active === i ? ' is-active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            aria-label={`${it.name} 설명 보기`}
          >
            {/* Vercel 이미지 최적화를 꺼 둔 상태라(한도 초과 방지) next/image 는 srcset 을 못 만든다.
                미리 만들어 둔 720px 판을 수동 srcset 으로 걸어 모바일은 작은 쪽을 받게 한다 */}
            <img
              src={it.img}
              srcSet={`${it.img.replace('.webp', '-720.webp')} 720w, ${it.img} 1588w`}
              sizes="(max-width: 1024px) 50vw, 60vw"
              alt={it.name}
              loading="lazy"
              decoding="async"
              className="lineup-img"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                backgroundImage: `url(${BLUR[it.no]})`, backgroundSize: 'cover',
              }}
            />
            <span className="lineup-veil" aria-hidden="true" />

            {/* 접혔을 때 — 세로로 세운 이름 */}
            <span className="lineup-vname">{it.name}</span>

            {/* 펼쳐졌을 때 — 번호·이름·영문 라벨 */}
            <span className="lineup-caption">
              <span className="lineup-no">{it.no}</span>
              <span className="lineup-name">{it.name}</span>
              <span className="lineup-tag">{it.tag}</span>
              <span className="lineup-more">자세히 보기 →</span>
            </span>
          </Link>
        ))}
      </div>

      {/* 좁은 화면 — 2열 카드 */}
      <div className="lineup-grid">
        {ITEMS.map(it => (
          <Link key={it.anchor} href={`/guide#${it.anchor}`} className="lineup-card">
            <img
              src={it.img}
              srcSet={`${it.img.replace('.webp', '-720.webp')} 720w, ${it.img} 1588w`}
              sizes="50vw"
              alt={it.name}
              loading="lazy"
              decoding="async"
              className="lineup-img"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                backgroundImage: `url(${BLUR[it.no]})`, backgroundSize: 'cover',
              }}
            />
            <span className="lineup-veil" aria-hidden="true" />
            <span className="lineup-card-text">
              <span className="lineup-card-tag">{it.no} · {it.tag}</span>
              <span className="lineup-card-name">
                {it.cardLines
                  ? it.cardLines.map((line, k) => (
                      <span key={k} style={{ display: 'block' }}>{line}</span>
                    ))
                  : it.name}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        /* 높이를 화면 폭에 맞춘다 — 펼친 칸이 화면의 약 절반이라
           높이를 그 절반(24vw)으로 두면 2:1 사진이 잘리지 않고 딱 들어간다 */
        .lineup-row {
          display: flex;
          gap: 6px;
          height: clamp(260px, 24vw, 470px);
          padding: 0 6px;
        }
        .lineup-panel {
          position: relative;
          background: var(--surface);
          flex: 1;
          min-width: 0;
          overflow: hidden;
          border-radius: var(--radius-2xl);
          text-decoration: none;
          /* 짚은 칸이 넓어지고 나머지가 줄어든다 */
          transition: flex-grow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* 사진 여섯 장이 모두 같은 비율(1.88)이라 한 값으로 충분하다 —
           이 값이면 펼친 칸이 사진 폭과 딱 맞아 여백도 잘림도 없다 */
        .lineup-panel.is-active { flex-grow: 4.12; }
        /* 접히든 펼치든 사진 왼쪽을 기준으로 보여준다.
           펼친 칸이 사진 비율(1.88)보다 아주 조금 좁아 몇 px 잘리는데,
           가운데 기준이면 그만큼 왼쪽 여백이 줄어 사진마다 시작선이 달라 보인다.
           왼쪽 고정이면 여섯 장 모두 여백이 똑같고, 펼칠 때 그림이 밀리지도 않는다. */
        .lineup-img {
          object-position: left center;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* 사진 위 어두운 막 — 글씨가 어떤 사진에서도 읽히게 */
        .lineup-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,8,10,0.88) 0%, rgba(8,8,10,0.3) 45%, rgba(8,8,10,0.12) 100%);
        }
        /* 접힌 상태 — 우측 하단에 가로로 눕힌 이름.
           칸이 좁아 긴 이름은 여러 줄로 접히므로 오른쪽 끝을 기준으로 맞춘다 */
        .lineup-vname {
          position: absolute;
          left: 0.9rem;
          right: 0.9rem;
          bottom: 0.9rem;
          text-align: right;
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: 0.01em;
          word-break: keep-all;
          color: rgba(255,255,255,0.85);
          transition: opacity 0.3s;
        }
        .lineup-panel.is-active .lineup-vname { opacity: 0; }
        /* 펼친 상태 — 가로 캡션 */
        .lineup-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          width: max-content;
          padding: clamp(1.25rem, 2.5vw, 2rem);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transition: opacity 0.5s 0.1s;
        }
        .lineup-panel.is-active .lineup-caption { opacity: 1; }
        .lineup-no {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }
        .lineup-name {
          margin-top: 0.4rem;
          font-size: clamp(1.35rem, 2.6vw, 1.9rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          white-space: nowrap;
          color: #fff;
        }
        .lineup-tag {
          margin-top: 0.25rem;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.6);
        }
        .lineup-more {
          margin-top: 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent);
        }

        /* 좁은 화면 카드 */
        .lineup-grid { display: none; }
        .lineup-card {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: var(--radius-2xl);
          text-decoration: none;
        }
        .lineup-card-text {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 0.9rem;
          display: flex;
          flex-direction: column;
        }
        .lineup-card-tag {
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          color: rgba(255,255,255,0.65);
        }
        .lineup-card-name {
          margin-top: 0.2rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          word-break: keep-all;
        }

        @media (max-width: 1024px) {
          .lineup-row { display: none; }
          .lineup-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.7rem;
            padding: 0 1.25rem;
          }
        }
        /* 움직임을 줄여달라고 한 사용자에게는 확대·전환을 끈다 */
        @media (prefers-reduced-motion: reduce) {
          .lineup-panel, .lineup-img, .lineup-caption, .lineup-vname { transition: none; }
        }
      `}</style>
    </section>
  )
}
