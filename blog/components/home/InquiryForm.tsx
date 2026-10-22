"use client";
// 웹블로그 무료 견적 신청 폼 — weflowlab.kr/clinic-blog 하단 폼(app/(site)/clinic-blog/InquiryForm.tsx)을 업종 공통으로 옮긴 것.
// 사이트의 다른 문의와 같은 /api/inquiries 로 보내고, 관리자(/admin) 문의 목록에서 구분되도록 type '웹블로그', source 'blog' 로 남긴다.
// 진료과목 선택 대신 업종을 직접 입력한다(industry 칸). 문의 유형·예산·참고 사이트는 메모에 한 줄씩 들어간다.
import { useState, type FormEvent } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import HoneypotField from "@/components/HoneypotField";
import { HONEYPOT_FIELD, wasSaved } from "@/lib/leadInput";
import { attributionLine } from "@/lib/attribution";
import { trackNaverLead } from "@/lib/naverConversion";
import { formatPhone, isValidPhone } from "@/lib/phone";

const PLANS = ["웹블로그 + 홈페이지", "웹블로그만", "홈페이지만", "상담 후 결정"];

/** 지출 예산 — 선택 칸. 고른 값은 메모에 '예산: …' 한 줄로 남는다 (clinic-blog 폼과 같은 구간) */
const BUDGETS = ["0~200만원", "200~400만원", "400~600만원", "600만원 이상"];

const label = "mb-1.5 block text-sm font-semibold text-neutral-800";
const input =
  "h-12 w-full rounded-[10px] border border-neutral-300 bg-white px-3.5 text-base text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-primary aria-invalid:border-destructive";
const errText = "mt-1.5 text-[13px] font-medium text-destructive";

export function InquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [budget, setBudget] = useState("");
  const [ref, setRef] = useState("");
  const [plan, setPlan] = useState("");
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(""); // 서버·네트워크 오류 — 버튼 위에 한 줄
  // 칸별 안내 — 비어 있는 필수 칸 바로 아래에 띄운다. 그 칸을 다시 고치면 지운다
  const [errs, setErrs] = useState<{ name?: string; phone?: string; agree?: string }>({});
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errs = {};
    if (!name.trim()) next.name = "이름을 입력해 주세요";
    if (!phone.trim()) next.phone = "연락처를 입력해 주세요";
    else if (!isValidPhone(phone)) next.phone = "연락처를 다시 확인해 주세요";
    if (!agree) next.agree = "개인정보 수집에 동의해 주세요";
    setErrs(next);
    if (Object.keys(next).length) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          type: "웹블로그",
          industry: industry.trim(),
          note: [
            plan && `문의 유형: ${plan}`,
            budget && `예산: ${budget}`,
            ref.trim() && `참고 사이트: ${ref.trim()}`,
            note.trim(),
            attributionLine() && `유입: ${attributionLine()}`,
          ]
            .filter(Boolean)
            .join("\n"),
          agree: true,
          source: "blog",
          [HONEYPOT_FIELD]: honeypot,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "접수 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      // 허니팟에 걸린 요청도 성공으로 답하므로, 실제 저장된 응답에만 전환을 쏜다 (lib/leadInput.ts 참고)
      if (wasSaved(await res.json().catch(() => null))) trackNaverLead();
      setDone(true);
    } catch {
      setError("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-[20px] border border-neutral-200 bg-white px-6 py-12 text-center shadow-[0_12px_40px_0_var(--brand-primary-10)] md:px-10 md:py-16">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-white">
          <IconCheck className="size-8" stroke={3} />
        </span>
        <h3 className="mt-5 text-xl font-bold text-foreground md:text-2xl">{name.trim()}님, 신청이 접수됐어요</h3>
        <p className="mt-2 text-base leading-relaxed text-neutral-600">
          남겨 주신 연락처로
          <br />
          담당자가 확인 후 직접 연락드릴게요.
        </p>
        {/* 지금 어디쯤인지 — 신청은 끝났고, 다음은 담당자 연락 */}
        <ol className="mx-auto mt-8 flex max-w-sm justify-between text-sm">
          {["신청 완료", "담당자 연락", "맞춤 구성 안내"].map((t, i) => (
            <li key={t} className={`flex flex-col items-center gap-1.5 ${i === 0 ? "text-primary" : i === 1 ? "font-semibold text-foreground" : "text-neutral-400"}`}>
              <b className={`flex size-8 items-center justify-center rounded-full text-sm ${i === 0 ? "bg-primary text-white" : i === 1 ? "border-2 border-primary text-primary" : "border border-neutral-300"}`}>
                {i === 0 ? "✓" : i + 1}
              </b>
              {t}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative grid gap-4 rounded-[20px] border border-neutral-200 bg-white p-5 shadow-[0_12px_40px_0_var(--brand-primary-10)] sm:grid-cols-2 md:p-8"
    >
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <strong className="text-xl font-bold text-foreground sm:col-span-2 md:text-2xl">무료 견적 신청</strong>

      {/* 문의 유형 — 넷 중 하나를 고르는 칩. 선택 칸이라 안 골라도 신청된다 */}
      <div className="sm:col-span-2" role="radiogroup" aria-label="문의 유형">
        <span className={label}>문의 유형</span>
        <div className="flex flex-wrap gap-2">
          {PLANS.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={plan === p}
              onClick={() => setPlan(plan === p ? "" : p)}
              className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                plan === p ? "border-primary bg-primary text-white" : "border-neutral-300 bg-white text-neutral-700 hover:border-primary hover:text-primary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="bl-name" className={label}>
          성함<i className="not-italic text-destructive">*</i>
        </label>
        <input
          id="bl-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errs.name) setErrs((v) => ({ ...v, name: undefined }));
          }}
          autoComplete="name"
          maxLength={40}
          aria-invalid={!!errs.name}
          aria-describedby={errs.name ? "bl-name-err" : undefined}
          className={input}
        />
        {errs.name && <p id="bl-name-err" className={errText}>* {errs.name}</p>}
      </div>
      <div>
        <label htmlFor="bl-phone" className={label}>
          연락처<i className="not-italic text-destructive">*</i>
        </label>
        <input
          id="bl-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(e) => {
            setPhone(formatPhone(e.target.value));
            if (errs.phone) setErrs((v) => ({ ...v, phone: undefined }));
          }}
          placeholder="010-0000-0000"
          aria-invalid={!!errs.phone}
          aria-describedby={errs.phone ? "bl-phone-err" : undefined}
          className={input}
        />
        {errs.phone && <p id="bl-phone-err" className={errText}>* {errs.phone}</p>}
      </div>

      <div>
        <label htmlFor="bl-industry" className={label}>
          업종
        </label>
        <input
          id="bl-industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          maxLength={40}
          placeholder="예: 타이어 매장, 치과, 세무사무소"
          className={input}
        />
      </div>
      <div>
        <label htmlFor="bl-budget" className={label}>
          지출 예산
        </label>
        {/* 아직 안 고른 상태를 흐린 글자로 — 이 칸은 선택이라 제출 검사는 하지 않는다 (noValidate) */}
        <div className="relative">
          <select
            id="bl-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`${input} appearance-none pr-10 ${budget ? "" : "text-neutral-400"}`}
          >
            <option value="" disabled>
              선택해 주세요
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="text-foreground">
                {b}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-500" stroke={2.5} />
        </div>
      </div>

      {/* 참고 사이트 — 선택. type="url" 은 쓰지 않는다 ('naver.com' 처럼 앞머리 없이 적으면 브라우저가 제출을 막는다) */}
      <div className="sm:col-span-2">
        <label htmlFor="bl-ref" className={label}>
          참고 사이트 주소 <span className="font-normal text-neutral-400">(선택)</span>
        </label>
        <input
          id="bl-ref"
          type="text"
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={300}
          placeholder="참고하고 싶은 사이트나 지금 운영 중인 블로그 주소"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          className={input}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="bl-note" className={label}>
          문의 내용
        </label>
        <textarea
          id="bl-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="궁금한 점을 편하게 적어 주세요 (선택)"
          maxLength={1500}
          rows={4}
          className={`${input} h-auto resize-y py-3`}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              if (errs.agree) setErrs((v) => ({ ...v, agree: undefined }));
            }}
            aria-invalid={!!errs.agree}
            aria-describedby={errs.agree ? "bl-agree-err" : undefined}
            className="mt-0.5 size-4.5 shrink-0 accent-[var(--brand-primary)]"
          />
          <span>
            [필수] 개인정보 수집·이용에 동의합니다.<i className="not-italic text-destructive">*</i>{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-neutral-500 underline">
              보기
            </a>
          </span>
        </label>
        {errs.agree && <p id="bl-agree-err" className={errText}>* {errs.agree}</p>}
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive sm:col-span-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="h-14 rounded-[12px] bg-primary text-lg font-bold text-white transition-colors hover:bg-brand-secondary disabled:opacity-60 sm:col-span-2"
      >
        {submitting ? "접수 중…" : "무료 견적 신청하기"}
      </button>
    </form>
  );
}
