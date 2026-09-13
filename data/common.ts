/**
 * 여러 화면이 함께 쓰는 공용 상수.
 * projectTypes는 상담 예약(/booking)·무료 진단(/diagnosis)의 "제작 종류"
 * 셀렉트 박스를 채우고, 관리자 페이지(/admin)에서는 종류별 집계 기준이 된다.
 * 폼에 저장되는 값이 곧 이 문자열이므로 문구를 바꾸면 기존 데이터와 어긋난다.
 */

/** 카카오톡 채널 주소 — 플로팅 버튼과 상담 폼의 카톡 상담이 같은 채널을 가리킨다 */
export const KAKAO_URL = 'http://pf.kakao.com/_xntCbX'

/**
 * 공식 채널 주소 — 푸터 링크와 사업자 구조화 데이터(sameAs)가 같은 값을 쓴다.
 *
 * sameAs 는 "이 채널들의 주인이 weflowlab.kr 이다" 를 검색엔진에 알려 주는 자리다.
 * 브랜드명을 검색하면 카카오채널·기업정보·채용 사이트가 제각각 잡히는데,
 * 이걸 넣어야 그것들이 한 회사의 것으로 묶여 읽힌다.
 * 채널이 늘거나 주소가 바뀌면 여기만 고치면 양쪽이 같이 따라온다.
 */
export const OFFICIAL_CHANNELS = {
  kakao: KAKAO_URL,
  // sameAs 에는 모바일(m.)이 아닌 대표 주소를 쓴다 — 기기에 따라 네이버가 알아서 보낸다
  blog: 'https://blog.naver.com/weflowlab',
  instagram: 'https://www.instagram.com/weflowlab.kr',
  youtube: 'https://www.youtube.com/channel/UCc3SKVxpHSLeIoZJ5IE6fcA',
} as const

/** 제작 종류 선택지 — 배열 순서가 곧 셀렉트·집계 목록 순서 */
export const projectTypes = [
  '신규 제작',
  '리뉴얼',
  '기타 (관리자 페이지)',
]
