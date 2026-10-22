// 글 본문 에디터에서 끼워 넣는 블록 정의 (Payload Lexical BlocksFeature).
// 관리자는 본문 쓰다가 "+" → 블록 선택 → 칸만 채우면 되고, 프론트는 components/post/blocks/* 가 디자인을 입혀 그린다.
// 레퍼런스(blog.kimsretina.com) 본문 부품: 강조 박스, 단계별 안내, 체크리스트, 흐름도. + WEFLOW 추가: AI 검색 대화.
// 블록을 추가/변경하면 dev 서버 띄운 뒤 `npm run payload:generate` 로 타입을 다시 만든다.
import type { Block } from "payload";

// ── 프론트 렌더용 타입 (Lexical 블록 노드의 fields 모양) ──
export type CalloutFields = {
  blockType: "callout";
  variant: "tip" | "caution" | "summary";
  title?: string | null;
  text: string;
};
export type StepsFields = {
  blockType: "steps";
  title?: string | null;
  items: { title: string; text?: string | null; id?: string }[];
};
export type ChecklistFields = {
  blockType: "checklist";
  title?: string | null;
  items: { text: string; id?: string }[];
};
export type FlowFields = {
  blockType: "flow";
  items: { label: string; text?: string | null; id?: string }[];
};
export type AiChatFields = {
  blockType: "aiChat";
  question: string;
  answer: string;
  sourceTitle?: string | null;
  sourceSite?: string | null;
};
export type PostBlockFields = CalloutFields | StepsFields | ChecklistFields | FlowFields | AiChatFields;

const BREAK_HINT = "Enter 로 줄바꿈";

// 강조 박스: 팁 / 주의 / 요약 인용
export const CalloutBlock: Block = {
  slug: "callout",
  labels: { singular: "강조 박스", plural: "강조 박스" },
  fields: [
    {
      name: "variant",
      label: "종류",
      type: "select",
      required: true,
      defaultValue: "tip",
      options: [
        { label: "참고·팁 (남색)", value: "tip" },
        { label: "주의 (노란색)", value: "caution" },
        { label: "요약 인용 (회색, 왼쪽 강조선)", value: "summary" },
      ],
    },
    { name: "title", label: "제목 (굵은 한 줄)", type: "text" },
    { name: "text", label: "내용", type: "textarea", required: true, admin: { description: BREAK_HINT } },
  ],
};

// 단계별 안내: 큰 번호 + 소제목 + 설명
export const StepsBlock: Block = {
  slug: "steps",
  labels: { singular: "단계별 안내", plural: "단계별 안내" },
  fields: [
    { name: "title", label: "묶음 제목 (선택)", type: "text", admin: { description: "예: 검사부터 치료까지 4단계" } },
    {
      name: "items",
      label: "단계",
      type: "array",
      required: true,
      minRows: 2,
      maxRows: 8,
      labels: { singular: "단계", plural: "단계" },
      fields: [
        { name: "title", label: "단계 제목", type: "text", required: true },
        { name: "text", label: "설명", type: "textarea", admin: { description: BREAK_HINT } },
      ],
    },
  ],
};

// 체크리스트: 체크 아이콘 달린 증상·대상 목록
export const ChecklistBlock: Block = {
  slug: "checklist",
  labels: { singular: "체크리스트", plural: "체크리스트" },
  fields: [
    { name: "title", label: "제목 (선택)", type: "text", admin: { description: "예: 이런 증상이 있다면 검사를 받아 보세요" } },
    {
      name: "items",
      label: "항목",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "항목", plural: "항목" },
      fields: [{ name: "text", label: "내용", type: "text", required: true }],
    },
  ],
};

// 흐름도: 카드 → 카드 → 카드 (진행 단계, 원인→결과 등)
export const FlowBlock: Block = {
  slug: "flow",
  labels: { singular: "흐름도 (A → B → C)", plural: "흐름도" },
  fields: [
    {
      name: "items",
      label: "카드",
      type: "array",
      required: true,
      minRows: 2,
      maxRows: 5,
      labels: { singular: "카드", plural: "카드" },
      fields: [
        { name: "label", label: "카드 제목", type: "text", required: true },
        { name: "text", label: "짧은 설명 (선택)", type: "text" },
      ],
    },
  ],
};

// AI 검색 대화: 손님이 AI 에 묻고, AI 가 블로그 글을 출처로 들어 답하는 장면 (weflowlab.kr/clinic-blog 의 AI 검색 장면을 글용으로 줄인 것).
// 캡처 이미지 대신 글자로 넣어 검색엔진·AI 도 내용을 읽는다. 실제 화면으로 오해하지 않게 "예시 화면" 문구가 자동으로 붙는다.
// 글 하나에 한 번, 본문 흐름 중간에 장면을 보여 주는 용도로 쓴다.
export const AiChatBlock: Block = {
  slug: "aiChat",
  labels: { singular: "AI 검색 대화 (예시)", plural: "AI 검색 대화" },
  fields: [
    { name: "question", label: "손님 질문", type: "text", required: true, admin: { description: "예: 타이어 교체 주기 얼마나 돼?" } },
    { name: "answer", label: "AI 답변 (2~3줄)", type: "textarea", required: true, admin: { description: BREAK_HINT } },
    { name: "sourceTitle", label: "출처로 인용된 글 제목 (선택)", type: "text", admin: { description: "비우면 출처 카드를 숨깁니다" } },
    { name: "sourceSite", label: "출처 사이트 표시 (선택)", type: "text", admin: { description: "예: 우리타이어.com/blog. 비우면 '우리 회사 웹블로그'" } },
  ],
};

export const postBlocks: Block[] = [CalloutBlock, StepsBlock, ChecklistBlock, FlowBlock, AiChatBlock];
