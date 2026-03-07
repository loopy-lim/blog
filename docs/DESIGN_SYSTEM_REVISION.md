# Design System Revision (March 7, 2026)

이 문서는 2026년 3월 7일 세션에서 수행된 디자인 전면 개편 사항을 기록합니다. 주요 목표는 과도한 장식을 덜어내고, 그레이스케일 기반의 프리미엄 무드를 조성하며, 사용자의 시그니처 컬러인 `#0048F4`를 전략적으로 배치하는 것입니다.

## 1. Core Principles (핵심 원칙)

- **Minimalism & Precision**: 과도한 라운딩과 그림자를 제거하고 정갈한 기하학적 레이아웃을 지향합니다.
- **Grayscale First**: 전반적인 색조를 무채색(Stone 50~950)으로 구성하여 깊이감을 줍니다.
- **Signature Accent**: 사용자의 시그니처 블루(`#0048F4`)는 제목 밑줄, 포인트 텍스트, 활성 상태 등에만 제한적으로 사용하여 정체성을 강조합니다.
- **Typography Focus**: 아이콘 대신 타이포그래피의 위계와 여백으로 정보를 전달합니다. `word-break: keep-all` (break-keep)을 사용하여 한글 가독성을 최적화합니다.

## 2. Visual Elements (시각적 요소)

### Colors
- **Background**: `#fafaf9` (Stone 50) - 깨끗한 오프화이트.
- **Foreground**: `#1c1917` (Stone 900) - 깊은 챠콜.
- **Accent**: `#0048F4` (Signature Blue) - 포인트 및 액센트.
- **Border**: `rgba(0, 0, 0, 0.05)` - 아주 얇고 투명한 경계.

### UI Components
- **Radius**: `3xl`(2.5rem) 같은 과한 값을 지양하고, `xl`(0.5rem), `2xl`(0.75rem) 위주로 사용하여 정갈한 느낌을 줍니다.
- **Glassmorphism**: `glass-panel`은 더 투명하게(`white/40`) 조정하고, 그림자를 제거하여 맑은 유리 질감을 구현했습니다.
- **Background Noise**: `bg-grain` 필터를 무채색으로 변경하고 투명도를 `0.015`~`0.02`로 대폭 낮추어 고급스러운 필름 그레인 효과를 주었습니다.

## 3. Section Changes (주요 섹션 변경사항)

### Blog (List & Detail)
- **Card**: `PostCard`의 부피를 줄이고 밀도를 높였습니다. 커버 이미지와 텍스트의 조화를 위해 여백을 정교하게 다듬었습니다.
- **Detail Page**: 본문을 깨끗한 '아티클 카드' 안에 담아 정체성을 유지했습니다. 거대한 헤더 이미지를 제거하고 타이포그래피 중심의 슬림한 헤더로 변경했습니다.
- **RelatedPosts**: 슬림한 가로형 그리드 레이아웃으로 변경하여 읽기 흐름을 방해하지 않으면서 정보를 제공합니다.

### About (Experience, Projects, Skills)
- **Layout**: `About` 소개글을 2컬럼 레이아웃으로 변경하여 가독 문폭을 최적화했습니다.
- **Experience**: 타임라인 포인트를 시그니처 블루로 강조하고, 장식용 아이콘을 제거했습니다.
- **Projects**: 도록(Catalogue) 같은 정갈한 흑백 레이아웃에 프로젝트 제목만 블루로 포인트를 주었습니다.
- **Skills**: 아이콘을 제거하고 사전(Dictionary) 인덱스 스타일의 미니멀한 텍스트 리스트로 변경했습니다.

## 4. Interaction (인터랙션)

- **No Color Hover**: 마우스 호버 시 색상이 변하는 효과를 모두 제거했습니다.
- **Subtle Feedback**: 색상 대신 미세한 불투명도 변화(`opacity-80`), 밝기 변화(`brightness-110`), 또는 미세한 스케일 조절(`active:scale-[0.98]`)만 사용하여 차분한 사용성을 제공합니다.

---
이 가이드는 향후 추가되는 모든 페이지와 컴포넌트의 디자인 기준으로 사용됩니다.
