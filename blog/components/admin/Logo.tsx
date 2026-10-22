// 로그인 화면 로고: W 심볼 + "WEFLOW 웹블로그". 스타일은 app/(payload)/custom.scss 의 .blog-logo
export const Logo = () => (
  <span className="blog-logo blog-logo--login">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo-navy.png" alt="" width={52} height={52} />
    <span>
      WEFLOW<span>웹블로그</span>
    </span>
  </span>
);
