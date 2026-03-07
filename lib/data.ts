export const resume = {
  basics: {
    name: "임채승",
    label: "Frontend Developer",
    email: "cotmd6203@naver.com",
    phone: "010-2752-6203",
    url: "https://blog.ll3.kr",
    github: "https://github.com/loopy-lim",
    shortSummary: "데이터로 병목을 찾고, 프론트엔드로 성과를 만든 개발자",
    summary:
      '"왜 여기서 이탈하는가?"를 지표로 찾고, 프론트엔드로 해결합니다. 문제를 재현하고 전/후 수치로 검증하는 사이클을 반복하며, 스펙을 먼저 정리해 리워크를 줄이는 방식으로 일합니다.',
    about: [
      "프론트엔드 개발자로서 제 역할은 사용자 경험을 개선하는 것이라고 믿습니다. 하지만 어떤 문제를 풀어야 할지, 그 문제가 정말 중요한지 알기 위해서는 데이터가 필요했습니다. 그래서 저는 사용자 행동을 추적하는 이벤트 트래킹 시스템을 구축하고, Amplitude를 통해 병목 지점을 찾아 개선해 왔습니다.",
      "세븐픽쳐스에서는 온보딩 퍼널의 전환율이 10% 미만인 문제를 발견하고, 전체 흐름을 재설계해 20% 이상으로 개선했습니다. 또한 화상 인터뷰 시스템을 7일 만에 0에서 1까지 설계·개발·배포해 실제 서비스에 적용했습니다.",
      "Flutter 앱에서는 이미지 로딩으로 인한 OOM 문제를 해결하기 위해 다운샘플링과 LRU 캐시 전략을 적용해 메모리 사용량을 53% 줄였고(1.5GB → 700MB), 저사양 기기에서도 크래시 없이 안정적으로 동작하도록 만들었습니다.",
      "기술적 성과뿐만 아니라 개발 문화 개선에도 관심이 많습니다. Node.js에서 Bun으로 전환해 CI/CD 시간을 49% 단축했고, Bloc 패턴에서 CachedQuery로 아키텍처를 전환해 상태 관리 복잡도를 낮췄습니다. 앞으로도 데이터 기반으로 문제를 정의하고, 프론트엔드 기술로 실질적인 비즈니스 임팩트를 만드는 개발자로 성장하고 싶습니다.",
    ],
  },
  skills: {
    main: [
      "React (useSyncExternalStore, 커스텀 훅 설계, 렌더링 최적화)",
      "TypeScript (Generic/Interface 활용, any 지양)",
      "Next.js (App Router)",
      "TanStack Query",
      "Zustand",
      "Tailwind CSS",
    ],
    experienced: ["Flutter/Dart", "WebRTC", "Yjs (CRDT)", "Socket.io"],
    tooling: ["Amplitude", "Lighthouse", "DevTools/Crashlytics"],
    deploy: ["Docker", "Nginx", "AWS EC2", "GitHub Actions"],
  },
  keyAchievements: [
    {
      title: "온보딩 퍼널 재설계",
      before: "10% 미만",
      after: "20% 이상",
      metric: "전환율 2배+",
      tool: "Amplitude",
      description: "퍼널 데이터에서 드롭오프 구간을 식별하고, 흐름의 순서를 재설계",
    },
    {
      title: "신입모집 시스템 SSR 전환",
      before: "SEO 62, LCP 3.2s",
      after: "SEO 95, LCP 1.4s",
      metric: "56%↓",
      tool: "Lighthouse",
      description: "CSR → SSR/SSG 전환으로 검색 노출과 초기 로딩 개선",
    },
    {
      title: "Flutter OOM 해결",
      before: "1.5GB",
      after: "700MB",
      metric: "53%↓",
      tool: "DevTools/Crashlytics",
      description: "다운샘플링 + LRU 캐시 정책으로 저사양 기기 크래시 해결",
    },
  ],
  experience: [
    {
      company: "세븐픽쳐스 (Seven Pictures)",
      position: "Software Engineer",
      period: "2025.08 - 2026.03",
      description:
        "커뮤니티 매칭 서비스 '동행'의 모바일 앱(Flutter) · 웹 어드민 개발 및 성능/지표 개선 담당",
      highlights: [
        "**온보딩 퍼널 구조 재설계**: Amplitude 퍼널로 최대 이탈 구간(프로필 작성)을 특정하고, 가설별 순차 실험(입력 축소 → 퍼널 순서 재설계)을 거쳐 간이 프로필 → 예약 흐름으로 재구성 + 비슷한 프로필/위치 기반 추천을 추가 → 전환율 10% 미만 → 20%+ 개선",
        "**화상 인터뷰 시스템 0→1 설계·개발·배포**: 스펙(UI·API·에러케이스)을 먼저 문서화하고, Server Actions + Result 패턴으로 성공/실패 흐름을 일원화해 14일 만에 런칭, 운영 중인 외부 화상툴 대비 피드백 연동 효율성 대폭 개선",
        "**Flutter OOM 해결**: Crashlytics/DevTools로 원인을 특정(원본 해상도 캐시 누적)하고, 다운샘플링 + LRU 캐시 정책 + 임계치 기반 정리를 적용 → 메모리 1.5GB → 700MB (53%↓), 저사양 기기 OOM 해결",
        "**Amplitude 이벤트 트래킹 체계 설계**: 발제/투표·결제·리드소스·앱 설치 등 전사 데이터 계측 커버리지 확장 → 온보딩 퍼널 분석 등 데이터 기반 의사결정의 기반 마련",
        "**Node → Bun 프로젝트메니져 전환**: backend·어드민 등 다수 프로젝트를 Bun으로 전환하여 CI/CD 49% 단축(13분 → 4분대), 호환성 검증·API 정합성 테스트·pre-merge 파이프라인 구축으로 배포 후 장애 0건 유지",
        "**Bloc → CachedQuery 아키텍처 전환**: Bloc의 이벤트·상태·리포지토리 3계층 구조가 기능 추가마다 보일러플레이트를 증가시키는 문제 식별 → React Query의 선언적 패턴을 Flutter에 도입, 캐시 키 기반 구조로 단순화 + staleTime/캐시 무효화 전략 설계로 불필요한 API 호출 감소 → 36개 전체 전환 완료",
        "**협업/문화**: PR 리뷰·코드 컨벤션 공유로 팀 코드 품질 유지, 운영팀과 주간 데모 기반 피드백 루프 운영, RemoteConfig 기반 실험 인프라를 구축해 데이터 드리븐 의사결정 문화 기여",
      ],
    },
    {
      company: "버즈빌 (Buzzvil)",
      position: "Frontend Intern",
      period: "2025.01 - 2025.04",
      description:
        "네이티브 앱 전용 광고 SDK의 웹 환경 확장 담당 — 신규 매체 유형(웹) 지원으로 제품 커버리지 확대",
      highlights: [
        "**[문제] iOS 13 Safari에서 SDK 로드 실패**: ES6+ 문법이 구형 WebKit 엔진에서 미지원",
        "**[탐색] 실기기 디버깅으로 문법 호환성 원인 특정**: Polyfill 범위·Babel 타겟 조합별 번들 사이즈/호환성 트레이드오프 비교",
        "**[해결] Polyfill + Babel 타겟 정밀 조정**: 구형 Safari 정상 로드 확보, 번들 사이즈 영향 최소화",
        "**[문제] Next.js 15 Turbopack 도입 시 번들 실패**: 배포 파이프라인 차단",
        "**[해결] GitHub Issue 추적으로 원인 확인**: Webpack 폴백 구성으로 빌드·배포 안정화, 팀 내 대응 가이드 공유",
      ],
    },
  ],
  caseStudies: [
    // Seven Pictures
    {
      company: "세븐픽쳐스",
      name: "온보딩 퍼널 재설계",
      summary: "신규 사용자 전환율 10% 미만 → 20% 이상",
      period: "2025.08 - 2026.03",
      role: "Software Engineer",
      tech: ["Flutter", "Dart", "Amplitude"],
      problem: "신규 가입 후 첫 동행 예약까지의 전환율이 10% 미만으로, 대다수 사용자가 중간에 이탈",
      approach: [
        "Amplitude 퍼널 분석으로 가입→프로필→인터뷰→예약 각 단계별 이탈률을 정량 확인 → 프로필 작성 단계가 최대 드롭오프 구간",
        "사용자 입장에서 '아직 서비스 가치를 체감하기 전에 정보 입력을 과도하게 요구'하는 구조가 문제",
        "가설 검증: 입력 필드 축소만 적용(미미한 개선) → 퍼널 순서 자체를 재설계하여 '가치 체감 → 정보 입력' 흐름으로 전환",
      ],
      solution: [
        "퍼널 순서 재설계: 간이 프로필(최소 정보)만 먼저 받고, 상세 프로필은 서비스 경험 이후로 이동",
        "비슷한 프로필 보여주기: 가입 직후 '나와 비슷한 사람들'을 노출해 서비스 가치를 먼저 체감하도록 유도",
        "현재 위치 기반 추천: 첫 화면에서 근처 동행을 보여줘 탐색 허들을 최소화",
      ],
      results: [
        { label: "전환율", before: "10% 미만", after: "20% 이상" },
      ],
      learnings: "기능 추가보다 '흐름의 순서'를 바꾸는 것이 전환율에 더 큰 영향을 줄 수 있다",
    },
    {
      company: "세븐픽쳐스",
      name: "화상 인터뷰 시스템",
      summary: "14일 런칭",
      period: "2025.08 - 2026.03",
      role: "Software Engineer",
      tech: ["Next.js", "Server Actions", "TypeScript", "PM2"],
      problem: "외부 화상툴(Zoom/Meet) 기반 운영에서 피드백 연동이 번거로워 내재화 필요",
      approach: [
        "인터뷰 1회가 끝날 때마다 발생하는 운영 플로우와 예외 케이스를 모두 나열",
        "업무가 '툴 바깥'에서 수동으로 반복되는 구조 → 누락/지연/오류가 발생",
      ],
      solution: [
        "Next.js Server Actions: 별도 백엔드 서버 없이 빠르게 구현하고 타입 안정성 확보",
        "Result(성공/실패) 기반으로 서버 처리 흐름을 명시해 에러 처리를 일원화",
        "스펙 주도 개발: 페이지별 스펙 문서(UI 컴포넌트 구조, API, 에러 케이스)를 먼저 작성",
      ],
      results: [
        { label: "런칭 기간", value: "14일" },
      ],
      learnings: "'스펙을 촘촘히' 잡으면 속도와 안정성을 동시에 얻는다(누락·리팩토링 감소)",
    },
    {
      company: "세븐픽쳐스",
      name: "Flutter OOM 해결",
      summary: "메모리 1.5GB → 700MB (53%↓)",
      period: "2025.08 - 2026.03",
      role: "Software Engineer",
      tech: ["Flutter", "Dart", "Crashlytics", "DevTools"],
      problem: "저사양 모바일 기기에서 채팅방 진입 시 앱 크래시(OOM)",
      approach: [
        "Crashlytics로 OOM 확인 → DevTools 메모리 프로파일링 수행",
        "동일 기기/동일 시나리오(채팅방 진입→스크롤)에서 크래시를 반복 재현",
        "DevTools Memory Profiler로 힙 스냅샷 비교 → 원본 해상도 이미지가 캐시에서 해제되지 않고 스크롤 시 누적",
      ],
      solution: [
        "이미지 다운샘플링: 화면 표시 크기에 맞춰 리사이즈 후 캐싱",
        "LRU 캐시 정책: 최대 캐시 크기 제한, 오래된 이미지 자동 해제",
        "임계치 모니터링: 메모리 부족 시 캐시 선제적 정리",
      ],
      results: [
        { label: "메모리", before: "1.5GB", after: "700MB" },
        { label: "개선율", value: "53%↓" },
      ],
      learnings: "메모리 문제는 재현→원인→검증 사이클로 접근해야 근본적으로 해결된다",
      links: {
        blog: "https://blog.ll3.kr/blog/",
      },
    },
    {
      company: "세븐픽쳐스",
      name: "Bloc → CachedQuery 아키텍처 전환",
      summary: "보일러플레이트 3계층을 선언형 캐시 구조로 단순화",
      period: "2025.08 - 2026.03",
      role: "Software Engineer",
      tech: ["Flutter", "Dart", "CachedQuery"],
      problem: "Bloc의 이벤트·상태·리포지토리 3계층 구조가 기능 추가마다 보일러플레이트를 증가시키고, 캐시 전략 부재로 불필요한 API 호출 발생",
      approach: [
        "기능 하나 추가 시 최소 4개 파일(Event/State/Bloc/Repository) 필요 → 개발 속도 저하 + 코드 가독성 하락",
        "React Query의 캐시 키 기반 선언적 패턴이 같은 문제를 효과적으로 해결한 사례 참고",
        "점진적 전환: Big-bang 리팩토링 대신 기능 단위로 점진 전환",
      ],
      solution: [
        "staleTime/캐시 무효화 전략 설계: 데이터 특성별 캐시 정책 분리로 불필요한 API 재요청 감소",
        "점진적 마이그레이션: 기능 단위 전환으로 운영 리스크 최소화",
        "Optimistic Update 패턴 도입: 사용자 인터랙션 즉시 반영 후 서버 동기화로 체감 속도 개선",
      ],
      results: [
        { label: "전환 완료", value: "36개" },
      ],
      learnings: "다른 생태계(React)의 검증된 패턴을 현재 스택(Flutter)에 맞게 차용하는 것이 효과적",
    },
    // Buzzvil
    {
      company: "버즈빌",
      name: "Web SDK 확장 & 호환성/빌드 안정화",
      summary: "네이티브 앱 전용 광고 SDK를 웹으로 확장",
      period: "2025.01 - 2025.04",
      role: "Frontend Intern",
      tech: ["Next.js 15", "TypeScript", "Webpack", "Babel"],
      problem: "네이티브 앱 전용 광고 SDK를 웹 환경으로 확장해 제품 커버리지 확대 필요",
      approach: [
        "iOS 13 실기기에서 재현 → Safari 개발자 도구로 실패 지점 특정",
        "GitHub Issue 추적으로 알려진 이슈 확인, 자체 우회 방안 탐색",
      ],
      solution: [
        "iOS 13 Safari 호환성: Polyfill + Babel 타겟 정밀 조정으로 구형 Safari 정상 로드 확보",
        "Next.js 15 Turbopack 이슈: Webpack 폴백 빌드 구성으로 안정화 + 팀 내 Turbopack 도입 가이드 공유",
      ],
      results: [
        { label: "iOS 13 Safari", value: "정상 로드" },
        { label: "빌드/배포", value: "안정화" },
      ],
      learnings: "레거시 환경 호환은 '어디까지 지원할 것인가'의 트레이드오프 의사결정이 핵심",
    },
    // Personal Projects
    {
      name: "CodeSync",
      summary: "실시간 동시편집 코드리뷰",
      period: "2024.10 - 2024.11",
      role: "FE & Team Lead",
      tech: ["React", "TypeScript", "Yjs", "WebRTC", "Socket.io", "Nginx"],
      problem: "리뷰 과정에서 '설명/맥락 공유' 비용을 줄이기 위해, 동시편집+화상+채팅을 한 화면으로 통합 필요",
      approach: [
        "Yjs CRDT 변경이 React 렌더 사이클과 동기화되지 않아 UI 지연/불일치 발생",
        "useEffect 기반 구독 시도 → 렌더 타이밍 불안정 확인 → React 18의 외부 스토어 동기화 API 적용 결정",
      ],
      solution: [
        "useSyncExternalStore로 Yjs 문서를 외부 스토어로 구독 → tearing 없이 상태 일관성 확보",
        "SocketManager 싱글턴으로 전체 실시간 채널의 연결/해제/재연결/에러 흐름을 중앙화",
        "TURN(Coturn)으로 NAT 환경에서도 ICE candidate 릴레이 연결을 안정화",
      ],
      results: [
        { label: "동시편집", value: "상태 일관성 확보" },
        { label: "NAT 환경", value: "연결 안정화" },
      ],
      links: {
        demo: "https://jungle.krafton.com/news/59",
      },
    },
    {
      name: "전남대 주차권 자동화 서비스",
      summary: "오류 90%+↓ / 1년+ 운영",
      period: "2023.10 - 2025.01",
      role: "FE Developer",
      tech: ["Next.js", "TypeScript", "Nx Monorepo"],
      problem: "신청 오픈/마감 수동 운영, 신청자 몰림으로 데이터 오류·중복 신청·잘못된 입력 예외 처리 어려움",
      approach: [
        "신청 오픈 시 트래픽 몰림으로 중복 요청·입력 오류·만료 등 운영 리스크 발생",
      ],
      solution: [
        "요청 상태(pending/success/fail) 기반 중복 차단",
        "오류 유형별 UX 표준화",
        "Nx 모노레포로 학생/관리자 앱 분리 + 공통 UI 라이브러리 구축",
      ],
      results: [
        { label: "신청 오류", value: "90%+↓" },
        { label: "결과 발표", value: "15분 단축" },
        { label: "운영 기간", value: "1년+" },
      ],
      learnings: "'운영'은 기능 개발보다 예외 처리·상태 제어·협업 리듬이 품질을 만든다",
    },
    {
      name: "Econovation Recruit",
      summary: "SEO 62→95, LCP 3.2s→1.4s (56%↓)",
      period: "2022.10 - 2025.01",
      role: "FE Lead",
      tech: ["Next.js (App Router)", "TypeScript", "TanStack Query", "Vite"],
      problem: "CSR 구조로 SEO/초기 로딩 지연 + Google Forms/Trello 중심 운영 파편화",
      approach: [
        "Lighthouse 측정으로 SEO 62점, LCP 3.2s 확인",
        "페이지별 렌더링 전략 분리 필요성 파악 → 지원서(SSR), 소개/FAQ(SSG), 칸반(CSR+Optimistic) 전략 수립",
      ],
      solution: [
        "SSR/SSG 전환 + Hydration 불일치 해결",
        "TanStack Query staleTime/gcTime 최적화로 불필요한 재요청 감소",
        "칸반 보드에 Optimistic Update 적용으로 조작 즉시성 확보",
        "PM2 Cluster + 2대 On-Premise로 무중단 배포/가용성 확보",
      ],
      results: [
        { label: "SEO", before: "62", after: "95" },
        { label: "LCP", before: "3.2s", after: "1.4s" },
        { label: "운영 규모", value: "학기당 지원자 100명+" },
      ],
      links: {
        demo: "https://recruit.econovation.kr",
      },
    },
  ],
  education: [
    {
      school: "전남대학교",
      degree: "소프트웨어공학과 / 공과대학",
      period: "2018.03 - 2024.08",
    },
    {
      school: "크래프톤 정글 6기",
      degree: "CS 심화 학습 (Pintos/CSAPP 기반 OS/시스템 기초)",
      period: "2024.07 - 2024.11",
    },
  ],
  activities: [
    {
      name: "Econovation (IT 개발 동아리)",
      period: "2021.07 - 2024.08",
      description:
        "신입모집/홈페이지 개발 및 운영 프로세스 개선, JS/TS/CSS 스터디 운영(20명+): 커리큘럼/과제/리뷰 진행",
    },
    {
      name: "기술 블로그 운영",
      period: "Present",
      description:
        "blog.ll3.kr — 실무에서 겪은 문제 해결 과정을 기술 블로그에 정리하며 학습을 체계화, 최신 기술 트렌드(Bun, React Native, Shorebird 등) 지속 탐구 및 실서비스 적용",
    },
  ],
  awards: [
    {
      title: "제 3회 오아시스 해커톤 최우수상",
      date: "2022",
    },
    {
      title: "제 2회 SW 중심사업단 SW경진대회 금상",
      date: "2022",
    },
    {
      title: "제 3회 SW 중심사업단 SW경진대회 은상",
      date: "2022",
    },
    {
      title: "제 1회 AICOSS 사업단 AI경진대회 동상",
      date: "2022",
    },
    {
      title: "2022년 2학기 전남대학교 자유학기제 성과보고회 우수상",
      date: "2022",
    },
    {
      title: "제 1회 SW중심사업단 SW경진대회 장려상",
      date: "2021",
    },
  ],
  openSource: [
    {
      project: "vercel/next.js",
      description: "Document PR 기여",
      url: "https://github.com/vercel/next.js/pull/74820",
    },
  ],
  certifications: [
    {
      name: "OPIc IM2",
      date: "",
    },
  ],
  military: {
    service: "공군 806기 병장 만기전역",
    role: "인터넷/인트라넷 개발병",
  },
};
