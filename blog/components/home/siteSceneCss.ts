// 메인 사이트(app/(site)/clinic-blog) 장면 부품을 웹블로그 메인에서 쓸 때 필요한 바탕 CSS.
// 부품들은 .cb 안의 --cb-* 색 변수를 쓰는데, 웹블로그에는 .cb(최소 높이 100vh 등)를 통째로 씌우지 않고
// 감싸는 요소(.site-scene)에 변수만 넣는다. 모양(SCENE_CSS)·폭(.cb-wrap)은 메인 사이트 것을 그대로.
import { CLINIC_BASE_CSS, SCENE_CSS } from "@/app/(site)/clinic-blog/base-css";

export const SITE_SCENE_CSS = `
  .site-scene {
    --cb-text: #111418; --cb-sub: #4b5360; --cb-muted: #8a919c; --cb-line: #e9ebef; --cb-soft: #f7f8fa;
    --cb-accent: #1f63d6; --cb-bubble-me: #1f63d6; --cb-bubble-you: #f1f3f6;
    color: var(--cb-text);
  }
  ${CLINIC_BASE_CSS}
  ${SCENE_CSS}
`;
