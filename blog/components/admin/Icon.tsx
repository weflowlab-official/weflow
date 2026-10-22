// 관리자 상단 바 로고: W 심볼 + "WEFLOW 웹블로그". 스타일은 app/(payload)/custom.scss 의 .blog-logo
export const Icon = () => (
  <span className="blog-logo blog-logo--nav">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo-navy.png" alt="" width={32} height={32} />
    <span>
      WEFLOW<span>웹블로그</span>
    </span>
  </span>
);
