# 웹블로그 글 이미지 3장 세트

글마다 3장 — ① 사진 썸네일 ② 핵심 4가지 카드 ③ 상담 안내 카드(전 글 공통).

- ① 사진은 **GPT 로 사진만** 뽑는다 (글자 없이). 파일 이름은 표의 `slug` 그대로 → `photos/<slug>.png`
- ②·③ 배경은 **모든 글이 같은 사진 한 장** → `photos/common.png` (아래 공통 배경 프롬프트)
- 글자·카드는 코드로 그려 PNG 로 뽑는다 (한글이 정확하고 17장 디자인이 같게 나온다)
- 카드 색: 웹블로그 파랑(#1b4ea7 · #1f63d6)을 **연하게** — 바탕 #eef4ff, 띠·Point 알약 #5b8fdc ~ #a9c6f2
- 사진 색: 글마다 다른 **파스텔 톤** (아래 표의 '사진 톤')

---

## 사진 프롬프트 (GPT) — 글마다 전문

그대로 복사해서 붙여 넣는다. 뽑은 사진은 `photos/<slug>.png` 로 저장.
1~13(업종 글)은 사람이 있는 사진, 14~17(가이드 글)은 사람 없이 물건만 있는 사진.

### 1. 병의원 웹블로그 — `why-web-blog-for-clinic.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a doctor in a white coat at a desk in a bright clinic office, thinking with a hand on the chin.
Color mood: soft pastel mint green tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 2. 치과 웹블로그 — `why-web-blog-for-dental-clinic.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a dentist in scrubs standing in a clean dental treatment room, looking thoughtful.
Color mood: soft pastel sky blue tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 3. 차량 업종 웹블로그 — `why-web-blog-for-car-business.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a car service owner in a work jacket standing beside a car in a tidy garage, arms crossed, thinking.
Color mood: soft pastel pale peach tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 4. 타이어 매장 웹블로그 — `why-web-blog-for-tire-shop.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a tire shop worker checking a tire on a rack in a clean tire store.
Color mood: soft pastel butter yellow tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 5. 캠핑장 웹블로그 — `why-web-blog-for-campsite.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a campsite owner standing near tents in a green forest campsite, looking at a tablet.
Color mood: soft pastel sage green tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 6. 금융·전문직 웹블로그 — `why-web-blog-for-finance-professionals.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a professional in a suit sitting at an office desk with documents, thinking.
Color mood: soft pastel lavender tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 7. 보험설계사 웹블로그 — `why-web-blog-for-insurance-planner.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: an insurance planner in business attire at a cafe table with a notebook, looking thoughtful.
Color mood: soft pastel dusty pink tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 8. 기업·제조 웹블로그 — `why-web-blog-for-business.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a factory manager in a safety vest standing in a clean, bright factory floor.
Color mood: soft pastel light gray-blue tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 9. 기업 홈페이지 웹블로그 — `why-web-blog-for-corporate-website.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a company manager in a modern office meeting room looking at a laptop, thinking.
Color mood: soft pastel pale aqua tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 10. 생활·서비스 웹블로그 — `why-web-blog-for-local-service.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a small business owner in an apron standing in a bright local shop, thinking.
Color mood: soft pastel soft coral tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 11. 인테리어 웹블로그 — `why-web-blog-for-interior-business.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: an interior designer holding color swatches in a bright, newly renovated living room.
Color mood: soft pastel warm beige tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 12. 뷰티·헬스 웹블로그 — `why-web-blog-for-beauty-fitness.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a beauty salon owner standing in a bright, minimal salon, thinking.
Color mood: soft pastel blush pink tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 13. 교육·외식·숙박 웹블로그 — `why-web-blog-for-academy-restaurant-stay.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a small restaurant owner in an apron at the counter of a cozy, bright restaurant, thinking.
Color mood: soft pastel apricot tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 14. 웹블로그 — `how-web-blog-gets-indexed-on-naver-google.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial product-photo style, natural light.
Scene: a smartphone lying on a clean desk with a blank, softly glowing screen, next to a small potted plant and a closed notebook.
Color mood: soft pastel pale lilac tones overall — background and props in gentle pastel colors, low contrast, airy and calm.
Composition: the objects are on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
No people, no faces, no hands.
No text, no letters, no logos, no watermarks, no screens showing readable text.
```

### 15. SEO·AEO·GEO — `seo-aeo-geo-for-web-blog.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial product-photo style, natural light.
Scene: a laptop on a clean desk with three small floating glossy glass objects above it — a magnifying glass, a speech bubble and a four-pointed sparkle.
Color mood: soft pastel powder blue tones overall — background and props in gentle pastel colors, low contrast, airy and calm.
Composition: the objects are on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
No people, no faces, no hands.
No text, no letters, no logos, no watermarks, no screens showing readable text.
```

### 16. 한눈에 비교 — `naver-blog-vs-web-blog.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial product-photo style, natural light.
Scene: two smartphones standing side by side on small stands on a clean desk, both with blank glowing screens, one slightly brighter than the other.
Color mood: soft pastel mint tones overall — background and props in gentle pastel colors, low contrast, airy and calm.
Composition: the objects are on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
No people, no faces, no hands.
No text, no letters, no logos, no watermarks, no screens showing readable text.
```

### 17. AI 답변 속 내 글 — `how-ai-reads-your-web-blog.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial product-photo style, natural light.
Scene: a smartphone on a small stand with a glowing glossy speech bubble and a four-pointed sparkle floating above it.
Color mood: soft pastel soft yellow tones overall — background and props in gentle pastel colors, low contrast, airy and calm.
Composition: the objects are on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
No people, no faces, no hands.
No text, no letters, no logos, no watermarks, no screens showing readable text.
```

---

## ②·③ 공통 배경 사진 (GPT) — 한 장만, `photos/common.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a clean, minimal modern office desk by a large window — a closed laptop, a small potted plant, a ceramic mug and a notebook, no people.
Color mood: soft pastel sky blue and white tones overall, with a hint of mint — low contrast, airy and calm, gentle morning light.
Composition: objects are small and placed near the bottom right; most of the frame is calm, softly blurred wall and window light (text panels will be placed on top later).
No people, no faces, no hands.
No text, no letters, no logos, no watermarks, no screens showing readable text.
```

---

## 글별 문구 · 사진

| # | slug | ① 라벨 | ① 작은 제목 (2줄) | ① 강조 글씨 | ① 영문 | 사진 장면 | 사진 톤 |
|---|---|---|---|---|---|---|---|
| 1 | why-web-blog-for-clinic | 병의원 홍보, 고민이라면? | 검색에서 환자를 / 데려오는 방법 | 병의원 웹블로그 | web blog for clinics | a doctor in a white coat at a desk in a bright clinic office, thinking with a hand on the chin | mint green |
| 2 | why-web-blog-for-dental-clinic | 치과 홍보, 고민이라면? | 검색에서 환자를 / 데려오는 방법 | 치과 웹블로그 | web blog for dental clinics | a dentist in scrubs standing in a clean dental treatment room, looking thoughtful | sky blue |
| 3 | why-web-blog-for-car-business | 차량 업종 홍보, 고민이라면? | 검색에서 손님을 / 데려오는 방법 | 차량 업종 웹블로그 | web blog for car business | a car service owner in a work jacket standing beside a car in a tidy garage, arms crossed, thinking | pale peach |
| 4 | why-web-blog-for-tire-shop | 타이어 매장 홍보, 고민이라면? | 검색에서 손님을 / 데려오는 방법 | 타이어 매장 웹블로그 | web blog for tire shops | a tire shop worker checking a tire on a rack in a clean tire store | butter yellow |
| 5 | why-web-blog-for-campsite | 캠핑장 홍보, 고민이라면? | 검색에서 손님을 / 데려오는 방법 | 캠핑장 웹블로그 | web blog for campsites | a campsite owner standing near tents in a green forest campsite, looking at a tablet | sage green |
| 6 | why-web-blog-for-finance-professionals | 금융·전문직 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 금융·전문직 웹블로그 | web blog for professionals | a professional in a suit sitting at an office desk with documents, thinking | lavender |
| 7 | why-web-blog-for-insurance-planner | 보험 설계 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 보험설계사 웹블로그 | web blog for insurance planners | an insurance planner in business attire at a cafe table with a notebook, looking thoughtful | dusty pink |
| 8 | why-web-blog-for-business | 기업 홍보, 고민이라면? | 검색에서 거래처를 / 데려오는 방법 | 기업·제조 웹블로그 | web blog for manufacturers | a factory manager in a safety vest standing in a clean, bright factory floor | light gray-blue |
| 9 | why-web-blog-for-corporate-website | 회사 홈페이지, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 기업 홈페이지 웹블로그 | web blog for companies | a company manager in a modern office meeting room looking at a laptop, thinking | pale aqua |
| 10 | why-web-blog-for-local-service | 동네 서비스 홍보, 고민이라면? | 검색에서 손님을 / 데려오는 방법 | 생활·서비스 웹블로그 | web blog for local services | a small business owner in an apron standing in a bright local shop, thinking | soft coral |
| 11 | why-web-blog-for-interior-business | 인테리어 홍보, 고민이라면? | 검색에서 손님을 / 데려오는 방법 | 인테리어 웹블로그 | web blog for interior design | an interior designer holding color swatches in a bright, newly renovated living room | warm beige |
| 12 | why-web-blog-for-beauty-fitness | 뷰티·헬스 홍보, 고민이라면? | 검색에서 손님을 / 데려오는 방법 | 뷰티·헬스 웹블로그 | web blog for beauty & fitness | a beauty salon owner standing in a bright, minimal salon, thinking | blush pink |
| 13 | why-web-blog-for-academy-restaurant-stay | 학원·외식·숙박 홍보, 고민이라면? | 검색에서 손님을 / 데려오는 방법 | 교육·외식·숙박 웹블로그 | web blog for local business | a small restaurant owner in an apron at the counter of a cozy, bright restaurant, thinking | apricot |
| 14 | how-web-blog-gets-indexed-on-naver-google | 네이버 블로그만 하고 있다면? | 요즘 떠오르는 / 또 다른 방법 | 웹블로그 | another way beyond blogs | a smartphone lying on a clean desk with a blank, softly glowing screen, next to a small potted plant and a closed notebook | pale lilac |
| 15 | seo-aeo-geo-for-web-blog | AI는 어떤 글을 고를까? | 검색과 AI 답변을 / 한 번에 정리 | SEO·AEO·GEO | search, answer, generative | a laptop on a clean desk with three small floating glossy glass objects above it — a magnifying glass, a speech bubble and a four-pointed sparkle | powder blue |
| 16 | naver-blog-vs-web-blog | 무엇이 다를까? | 네이버 블로그와 / 웹블로그 비교 | 한눈에 비교 | blog vs web blog | two smartphones standing side by side on small stands on a clean desk, both with blank glowing screens, one slightly brighter than the other | mint |
| 17 | how-ai-reads-your-web-blog | AI에게 우리 업종을 물었더니? | 내 글이 나와서 / 내 업장이 홍보된다면 | AI 답변 속 내 글 | when AI quotes your blog | a smartphone on a small stand with a glowing glossy speech bubble and a four-pointed sparkle floating above it | soft yellow |

---

## ② 핵심 4가지 카드

제목: **"(업종)에 웹블로그가 / 필요한 이유"** (14~17은 아래 따로) · 영문: WEFLOW WEB BLOG
원 4개는 사진 대신 아이콘 (검색 · AI 반짝이 · 방패 · 말풍선)

공통 4가지 — 업종 말만 바꾼다:

| Point | 제목 | 한 줄 |
|---|---|---|
| 01 | SEO 검색 노출 | (손님)이 검색하는 말로 글을 씁니다 |
| 02 | AI 답변 인용 | AI가 답할 때 우리 글을 출처로 |
| 03 | 최신 기술 · 보안 연결 | PHP 없이 Next.js로, 모든 페이지 HTTPS |
| 04 | 바로 상담 연결 | 글을 읽다가 바로 (예약·견적·상담) |

업종별 바뀌는 말 (03은 모든 글이 같다):

| # | (손님) | 01 검색 예시 | 04 연결 |
|---|---|---|---|
| 1 병의원 | 환자 | "백내장 수술 후 관리" | 예약 상담 |
| 2 치과 | 환자 | "임플란트 붓기" | 예약 상담 |
| 3 차량 | 손님 | "엔진오일 교체 주기" | 견적 문의 |
| 4 타이어 | 손님 | "타이어 교체 시기" | 견적 문의 |
| 5 캠핑장 | 손님 | "가족 캠핑장 추천" | 예약 문의 |
| 6 금융·전문직 | 고객 | "상속세 신고 방법" | 상담 신청 |
| 7 보험설계사 | 고객 | "실비보험 청구 방법" | 상담 신청 |
| 8 기업·제조 | 거래처 | "(제품명) 제작 업체" | 견적 문의 |
| 9 기업 홈페이지 | 고객 | "(서비스명) 도입 비용" | 도입 문의 |
| 10 생활·서비스 | 손님 | "입주 청소 비용" | 견적 문의 |
| 11 인테리어 | 손님 | "욕실 리모델링 기간" | 견적 문의 |
| 12 뷰티·헬스 | 손님 | "PT 처음 받는 법" | 예약 문의 |
| 13 학원·외식·숙박 | 손님 | "중학생 수학 학원" | 상담·예약 |

가이드 글(14~17)은 업종 대신 주제로:

| # | 제목 | Point 01 | Point 02 | Point 03 | Point 04 |
|---|---|---|---|---|---|
| 14 | 네이버 블로그 / 다음 방법 | 노출이 줄어드는 블로그 | 우리 사이트 안의 블로그 | 네이버·구글 동시 등록 | 글이 우리 자산으로 |
| 15 | SEO·AEO·GEO / 쉽게 정리 | SEO 검색 노출 | AEO 답변 노출 | GEO AI 인용 | 글 하나로 셋 다 |
| 16 | 네이버 블로그 vs / 웹블로그 | 주소: 빌린 곳 vs 우리 것 | 노출: 네이버 vs 네이버·구글·AI | 연결: 밖으로 vs 홈페이지로 | 소유: 플랫폼 vs 우리 회사 |
| 17 | AI가 우리 글을 / 인용한다면 | 핵심 요약이 맨 위에 | 자주 묻는 질문 | 구조화 데이터 | AI가 읽기 좋은 구조 |

---

## ③ 상담 안내 카드 (전 글 공통 1장)

- 제목: **웹블로그 상담 / 안내** · 영문: WEFLOW WEB BLOG
- 주소 자리: weflowlab.kr/blog
- **Tel. 010-2971-7280**
- 표:
  - 상담 — 24시간 문의 가능
  - 견적 — 맞춤 견적 무료
  - 구성 — 웹블로그만 · 홈페이지만 · 함께
  - 설계 — SEO·AEO·GEO 구조
- 하단 띠: WEFLOW 웹블로그

---

## 세부 업종 글 18개 (18~35) — 사진 프롬프트 (GPT)

위 1~13 과 같은 형식. 뽑은 사진은 `photos/<slug>.png` 로 저장. 사진 톤은 앞 글들과 겹치지 않게 골랐다.
slug 는 `why-web-blog-for-<세부업종 slug>` (blog/lib/industries.ts) — 글을 만들 때도 같은 slug 를 쓴다.

### 18. 피부과·성형외과 웹블로그 — `why-web-blog-for-dermatology.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a dermatologist in a white coat in a bright, minimal skin clinic consultation room, looking thoughtful.
Color mood: soft pastel pale rose tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 19. 한의원 웹블로그 — `why-web-blog-for-korean-medicine.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a Korean medicine doctor in a white coat in a calm, bright clinic with plain wooden herbal drawers in the background.
Color mood: soft pastel pale celadon tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 20. 정형외과·통증의학과 웹블로그 — `why-web-blog-for-orthopedics.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a doctor standing beside a treatment bed in a bright rehabilitation room, thinking.
Color mood: soft pastel pale cornflower blue tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 21. 안과 웹블로그 — `why-web-blog-for-ophthalmology.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: an eye doctor in a white coat beside an eye examination device in a bright clinic room.
Color mood: soft pastel pale periwinkle tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 22. 내과·소아청소년과 웹블로그 — `why-web-blog-for-internal-pediatrics.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a friendly doctor with a stethoscope in a bright family clinic room with a few soft toys on a shelf.
Color mood: soft pastel pale lemon tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 23. 법률·세무 웹블로그 — `why-web-blog-for-law-tax.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a lawyer in a blazer at a tidy office desk with paper files and a calculator, thinking.
Color mood: soft pastel pale taupe tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 24. 부동산 웹블로그 — `why-web-blog-for-real-estate.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a real estate agent holding a folder in a bright, empty new apartment living room.
Color mood: soft pastel soft cream tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 25. 제조·공장 웹블로그 — `why-web-blog-for-manufacturing.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a production manager in a work uniform checking parts at a clean workbench in a bright factory.
Color mood: soft pastel pale silver gray tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 26. 쇼핑몰 웹블로그 — `why-web-blog-for-shopping-mall.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: an online shop owner packing products into plain boxes at a bright home office desk with a laptop.
Color mood: soft pastel light orchid tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 27. 청소·이사 웹블로그 — `why-web-blog-for-cleaning-moving.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a moving and cleaning company worker carrying a plain cardboard box in a bright, empty apartment.
Color mood: soft pastel pale seafoam tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 28. 반려동물 웹블로그 — `why-web-blog-for-pet.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a pet groomer gently holding a small fluffy dog in a bright grooming shop.
Color mood: soft pastel soft honey tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 29. 웨딩·스튜디오 웹블로그 — `why-web-blog-for-wedding-studio.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a wedding photographer holding a camera in a bright, airy photo studio with a plain white backdrop.
Color mood: soft pastel pale champagne tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 30. 이벤트·행사 웹블로그 — `why-web-blog-for-event.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: an event planner arranging pastel balloons and table decorations in a bright event hall.
Color mood: soft pastel pale tangerine tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 31. 뷰티·미용 웹블로그 — `why-web-blog-for-beauty.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a hair stylist holding a comb in a bright, minimal hair salon, thinking.
Color mood: soft pastel soft mauve tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 32. 헬스·피트니스 웹블로그 — `why-web-blog-for-fitness.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a personal trainer in sportswear standing in a bright, clean gym.
Color mood: soft pastel pale lime tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 33. 학원 웹블로그 — `why-web-blog-for-academy.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a teacher standing beside a blank whiteboard in a bright small classroom.
Color mood: soft pastel pale turquoise tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 34. 음식점·카페 웹블로그 — `why-web-blog-for-restaurant-cafe.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a cafe owner in an apron behind the counter of a bright cafe, holding a cup.
Color mood: soft pastel soft caramel tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 35. 펜션·숙박 웹블로그 — `why-web-blog-for-pension-stay.png`

```
A soft, bright square photo (1:1, 2000x2000px), editorial stock-photo style, natural light.
Scene: a guesthouse owner standing on the wooden deck of a bright countryside pension.
Color mood: soft pastel soft pistachio tones overall — background, clothing and props in gentle pastel colors, low contrast, airy and calm.
Composition: the person is on the RIGHT half of the frame; the LEFT half is a clean, softly blurred, plain background area (text will be placed there later).
Korean / East Asian person, natural expression, realistic, not overly posed.
No text, no letters, no logos, no watermarks, no signs with writing, no screens showing readable text.
```

### 18~35 글별 문구 · 사진

| # | slug | ① 라벨 | ① 작은 제목 (2줄) | ① 강조 글씨 | ① 영문 | 사진 장면 | 사진 톤 |
|---|---|---|---|---|---|---|---|
| 18 | why-web-blog-for-dermatology | 피부과 홍보, 고민이라면? | 검색에서 환자를 / 데려오는 방법 | 피부과·성형외과 웹블로그 | web blog for skin clinics | a dermatologist in a white coat in a bright, minimal skin clinic consultation room, looking thoughtful | pale rose |
| 19 | why-web-blog-for-korean-medicine | 한의원 홍보, 고민이라면? | 검색에서 환자를 / 데려오는 방법 | 한의원 웹블로그 | web blog for korean medicine | a Korean medicine doctor in a white coat in a calm, bright clinic with plain wooden herbal drawers in the background | pale celadon |
| 20 | why-web-blog-for-orthopedics | 정형외과 홍보, 고민이라면? | 검색에서 환자를 / 데려오는 방법 | 정형외과·통증의학과 웹블로그 | web blog for orthopedics | a doctor standing beside a treatment bed in a bright rehabilitation room, thinking | pale cornflower blue |
| 21 | why-web-blog-for-ophthalmology | 안과 홍보, 고민이라면? | 검색에서 환자를 / 데려오는 방법 | 안과 웹블로그 | web blog for eye clinics | an eye doctor in a white coat beside an eye examination device in a bright clinic room | pale periwinkle |
| 22 | why-web-blog-for-internal-pediatrics | 내과 홍보, 고민이라면? | 검색에서 환자를 / 데려오는 방법 | 내과·소아청소년과 웹블로그 | web blog for family clinics | a friendly doctor with a stethoscope in a bright family clinic room with a few soft toys on a shelf | pale lemon |
| 23 | why-web-blog-for-law-tax | 법률·세무 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 법률·세무 웹블로그 | web blog for law & tax | a lawyer in a blazer at a tidy office desk with paper files and a calculator, thinking | pale taupe |
| 24 | why-web-blog-for-real-estate | 부동산 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 부동산 웹블로그 | web blog for real estate | a real estate agent holding a folder in a bright, empty new apartment living room | soft cream |
| 25 | why-web-blog-for-manufacturing | 제조·공장 홍보, 고민이라면? | 검색에서 거래처를 / 데려오는 방법 | 제조·공장 웹블로그 | web blog for manufacturers | a production manager in a work uniform checking parts at a clean workbench in a bright factory | pale silver gray |
| 26 | why-web-blog-for-shopping-mall | 쇼핑몰 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 쇼핑몰 웹블로그 | web blog for online shops | an online shop owner packing products into plain boxes at a bright home office desk with a laptop | light orchid |
| 27 | why-web-blog-for-cleaning-moving | 청소·이사 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 청소·이사 웹블로그 | web blog for cleaning & moving | a moving and cleaning company worker carrying a plain cardboard box in a bright, empty apartment | pale seafoam |
| 28 | why-web-blog-for-pet | 반려동물 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 반려동물 웹블로그 | web blog for pet business | a pet groomer gently holding a small fluffy dog in a bright grooming shop | soft honey |
| 29 | why-web-blog-for-wedding-studio | 웨딩·스튜디오 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 웨딩·스튜디오 웹블로그 | web blog for wedding studios | a wedding photographer holding a camera in a bright, airy photo studio with a plain white backdrop | pale champagne |
| 30 | why-web-blog-for-event | 이벤트·행사 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 이벤트·행사 웹블로그 | web blog for event planners | an event planner arranging pastel balloons and table decorations in a bright event hall | pale tangerine |
| 31 | why-web-blog-for-beauty | 뷰티·미용 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 뷰티·미용 웹블로그 | web blog for beauty salons | a hair stylist holding a comb in a bright, minimal hair salon, thinking | soft mauve |
| 32 | why-web-blog-for-fitness | 헬스·피트니스 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 헬스·피트니스 웹블로그 | web blog for fitness | a personal trainer in sportswear standing in a bright, clean gym | pale lime |
| 33 | why-web-blog-for-academy | 학원 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 학원 웹블로그 | web blog for academies | a teacher standing beside a blank whiteboard in a bright small classroom | pale turquoise |
| 34 | why-web-blog-for-restaurant-cafe | 음식점·카페 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 음식점·카페 웹블로그 | web blog for restaurants & cafes | a cafe owner in an apron behind the counter of a bright cafe, holding a cup | soft caramel |
| 35 | why-web-blog-for-pension-stay | 펜션·숙박 홍보, 고민이라면? | 검색에서 고객을 / 데려오는 방법 | 펜션·숙박 웹블로그 | web blog for stays | a guesthouse owner standing on the wooden deck of a bright countryside pension | soft pistachio |

### 18~35 ② 핵심 4가지 카드 — 업종별 바뀌는 말 (03은 모든 글이 같다)

| # | (고객) | 01 검색 예시 | 04 연결 |
|---|---|---|---|
| 18 피부과·성형외과 | 환자 | "여드름 흉터 치료 기간" | 예약 상담 |
| 19 한의원 | 환자 | "교통사고 한의원 치료" | 예약 상담 |
| 20 정형외과·통증의학과 | 환자 | "어깨 통증 원인" | 예약 상담 |
| 21 안과 | 환자 | "백내장 수술 후 관리" | 예약 상담 |
| 22 내과·소아청소년과 | 환자 | "아이 열 날 때 병원 가는 기준" | 예약 상담 |
| 23 법률·세무 | 고객 | "종합소득세 신고 방법" | 상담 신청 |
| 24 부동산 | 고객 | "전세 계약 시 확인할 것" | 상담 신청 |
| 25 제조·공장 | 거래처 | "(제품명) 제작 업체" | 견적 문의 |
| 26 쇼핑몰 | 고객 | "(제품) 고르는 법" | 구매 문의 |
| 27 청소·이사 | 고객 | "입주 청소 비용" | 견적 문의 |
| 28 반려동물 | 고객 | "강아지 미용 주기" | 예약 문의 |
| 29 웨딩·스튜디오 | 고객 | "웨딩 촬영 준비물" | 상담 예약 |
| 30 이벤트·행사 | 고객 | "돌잔치 장소 고르는 법" | 견적 문의 |
| 31 뷰티·미용 | 고객 | "손상모 펌 주기" | 예약 문의 |
| 32 헬스·피트니스 | 고객 | "PT 처음 받는 법" | 상담 예약 |
| 33 학원 | 고객 | "중학생 수학 선행" | 상담 신청 |
| 34 음식점·카페 | 고객 | "단체 모임 식당" | 예약 문의 |
| 35 펜션·숙박 | 고객 | "가족 펜션 추천" | 예약 문의 |
