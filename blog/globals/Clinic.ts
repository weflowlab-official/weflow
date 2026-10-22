// 회사 정보 글로벌. 푸터, 퀵메뉴, 글 하단 장점·상담 블록, 구조화 데이터(JSON-LD) 에 쓰인다. 사이트에 하나만 존재.
// slug(clinic)·필드 이름은 모두의안과 웹블로그에서 가져온 그대로 둔다 (DB 테이블 이름 유지). 화면 라벨만 회사 기준으로 바꿨다.
// 필드 구성은 lib/types.ts 의 ClinicInfo 와 1:1 로 맞춘다.
import type { GlobalConfig } from "payload";
import { revalidate } from "../lib/revalidate";
import { clinic as mockClinic } from "../lib/mock";
import * as defaults from "../lib/clinicDefaults";

// {label, href} 링크 배열 필드
const links = (name: string, label: string) => ({
  name,
  label,
  type: "array" as const,
  labels: { singular: "링크", plural: "링크" },
  fields: [
    { name: "label", label: "이름", type: "text" as const, required: true },
    { name: "href", label: "주소", type: "text" as const, required: true },
  ],
});

// 문자열 배열 필드
const values = (name: string, label: string, itemLabel = "내용") => ({
  name,
  label,
  type: "array" as const,
  labels: { singular: "항목", plural: "항목" },
  fields: [{ name: "value", label: itemLabel, type: "text" as const, required: true }],
});

export const Clinic: GlobalConfig = {
  slug: "clinic",
  label: "회사 정보",
  access: { read: () => true },
  admin: { group: "설정" },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "기본 정보",
          fields: [
            { name: "name", label: "회사명", type: "text", required: true },
            { name: "nameEn", label: "영문 회사명", type: "text" },
            { name: "homepageUrl", label: "홈페이지 주소", type: "text", required: true },
            { name: "address", label: "주소 (비우면 푸터에 표시하지 않음)", type: "text" },
            { name: "phone", label: "대표전화", type: "text", required: true },
            { name: "fax", label: "이메일", type: "text" },
            { name: "businessNumber", label: "사업자등록번호", type: "text" },
            values("representatives", "대표자", "이름"),
            {
              name: "stats",
              label: "실적 (메인 페이지 표시, 비우면 숨김)",
              type: "array",
              labels: { singular: "실적", plural: "실적" },
              fields: [
                { name: "label", label: "항목 (예: 제작 사이트)", type: "text", required: true },
                { name: "value", label: "수치 (예: 100곳 이상)", type: "text", required: true },
              ],
            },
            { name: "statsNote", label: "실적 기준 시점 (예: 2026년 10월 기준)", type: "text" },
          ],
        },
        {
          label: "상담 시간·위치",
          fields: [
            {
              name: "hours",
              label: "상담 시간 (푸터)",
              type: "array",
              labels: { singular: "행", plural: "행" },
              fields: [
                { name: "label", label: "구분 (예: 운영시간)", type: "text", required: true },
                { name: "value", label: "시간", type: "text", required: true },
              ],
            },
            { name: "directions", label: "대중교통 안내", type: "textarea" },
            values("parking", "주차 안내"),
            links("mapLinks", "지도 링크"),
          ],
        },
        {
          label: "글 하단 문구",
          fields: [
            // 기본 문구는 lib/clinicDefaults.ts. defaultValue 는 반드시 함수로 (globals/HomePage.ts 주석 참고)
            {
              name: "disclaimerText",
              label: "안내 문구 (사용 안 함)",
              type: "textarea",
              // 모두의안과의 의료광고 면책 상자 자리. WEFLOW 블로그는 면책 상자를 쓰지 않아 관리자 화면에서 숨긴다
              admin: { hidden: true },
            },
            { name: "benefitsTitle", label: "장점 블록 제목", type: "text", defaultValue: () => defaults.BENEFITS_TITLE },
            {
              name: "benefits",
              label: "장점 (모든 글 끝에 자동으로 붙음)",
              type: "array",
              labels: { singular: "장점", plural: "장점" },
              defaultValue: () => defaults.BENEFITS,
              fields: [
                { name: "title", label: "제목", type: "text", required: true },
                { name: "text", label: "설명", type: "textarea", required: true },
              ],
            },
            {
              name: "commonFaq",
              label: "공통 자주 묻는 질문 (모든 글의 FAQ 끝에 자동으로 붙음)",
              type: "array",
              labels: { singular: "질문", plural: "질문" },
              defaultValue: () => defaults.COMMON_FAQ,
              admin: { description: "글마다 중복돼도 괜찮습니다. 어느 글로 들어와도 검색엔진·AI 가 핵심 답을 같이 읽습니다. 글 자체 FAQ 에 같은 질문이 있으면 글 쪽이 보입니다." },
              fields: [
                { name: "question", label: "질문", type: "text", required: true },
                { name: "answer", label: "답변", type: "textarea", required: true },
              ],
            },
            { name: "ctaTitle", label: "상담 문구 제목", type: "text", defaultValue: () => defaults.CTA_TITLE },
            {
              name: "ctaText",
              label: "상담 문구",
              type: "textarea",
              defaultValue: () => defaults.ctaText(mockClinic.name),
              admin: { description: '"|" 는 모바일에서만 줄바꿈, Enter 는 모든 화면에서 줄바꿈' },
            },
          ],
        },
        {
          label: "채널·링크",
          fields: [
            { name: "consultUrl", label: "상담 버튼 연결 주소 (무료 견적 신청)", type: "text", required: true, admin: { description: "기본은 블로그 메인 맨 아래 신청 폼(/blog#contact)" } },
            { name: "kakaoChannelUrl", label: "카카오톡 채널 주소 (퀵메뉴·상담 버튼)", type: "text" },
            links("sns", "채널 링크 (푸터)"),
            links("legalLinks", "하단 법적 링크 (개인정보처리방침 등)"),
            links("homepageMenu", "홈페이지 메뉴 (사용 안 함)"),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await revalidate(["/"], true);
      },
    ],
  },
};
