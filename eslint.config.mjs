import next from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    // Next 16 / eslint-config-next 16 추가 규칙. 기존 코드의 hydration 플래그·
    // 데이터 로딩·파생 상태 동기화 패턴을 에러로 막지 않도록 경고로 완화(추후 정리 대상).
    // files 는 eslint-config-next 가 react-hooks 플러그인을 거는 범위와 같게 — 없으면 .cjs 파일(design/ 의 이미지 스크립트)에서
    // "react-hooks 플러그인을 찾을 수 없다"며 lint 전체가 멈춘다
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default eslintConfig
