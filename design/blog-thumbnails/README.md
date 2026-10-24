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
