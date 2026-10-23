// 글 하단 작성자 프로필 카드. 장점·상담 블록 아래에 배치.
// 작성자 별도 페이지는 두지 않으므로(고객 요청) 링크 없이 정보만 보여준다. 전문 분야 배지 + 한 줄 소개.
// 레퍼런스: 정사각 사진(216px) + "이름 직함 프로필 소개" + 한 줄 소개, 모바일 세로 / md 이상 가로.
import type { Doctor } from "@/blog/lib/types";
import { Placeholder } from "@/blog/components/ui/Placeholder";
import { MediaImage } from "@/blog/components/ui/MediaImage";
import { Badge } from "@/blog/components/ui/Badge";

type Props = { doctor: Doctor; className?: string };

export function AuthorCard({ doctor, className = "" }: Props) {
  return (
    <section
      aria-label="작성자 소개"
      className={`mt-7 flex flex-col gap-5 rounded-[12px] border border-neutral-200 bg-background p-5 sm:flex-row sm:items-center md:gap-6 md:p-6 ${className}`}
    >
      {/* 정사각 사진. 작게(모바일 128px, 데스크톱 176px) 두고 옆 소개 글과 세로 가운데로 */}
      <div className="relative w-32 shrink-0 md:w-44">
        {doctor.photo ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-neutral-300">
            {/* 세로 프로필 사진을 정사각으로 자를 때 얼굴이 있는 위쪽을 남긴다 */}
            <MediaImage image={doctor.photo} sizes="(min-width: 768px) 176px, 128px" className="object-top" />
          </div>
        ) : (
          <Placeholder label={`${doctor.name} 프로필`} className="aspect-square w-full rounded-[10px] bg-neutral-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">이 글을 쓴 사람</p>
        <p className="mt-1 text-xl font-bold text-foreground">
          {doctor.name} {doctor.title}
        </p>
        {/* 전문 분야 배지 */}
        {doctor.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.specialties.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        )}
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{doctor.bio}</p>
        {/* 약력: 관리자 '작성자 → 약력' 목록. 비어 있으면 표시하지 않는다 */}
        {doctor.career.length > 0 && (
          <ul className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm leading-relaxed text-neutral-600">
            {doctor.career.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
