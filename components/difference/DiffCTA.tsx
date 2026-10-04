import ServiceCTA from "@/components/service/ServiceCTA";

/** 차별점 페이지 맨 아래 — "그 밖의 차이점이 궁금하다면" 지금 바로 상담으로 보낸다 (가격·혜택 탭과 같은 ServiceCTA 에 문구만 바꿔 넘긴다) */
export default function DiffCTA() {
  return (
    <ServiceCTA
      title={
        <>
          그 밖의 차이점이 <br className="svc-cta__br" />
          궁금하시다면?
        </>
      }
      sub={
        <>
          우리 업종에서는 어떤 기능까지 가능한지,
          <br className="svc-cta__br" /> 상담에서 바로 정리해 드립니다.
        </>
      }
      solidLabel="지금 바로 상담받기"
    />
  );
}
