export const resume = {
  basics: {
    name: "임채승",
    label: "Software Engineer",
    email: "cotmd6203@naver.com",
    phone: "010-2752-6203",
    url: "https://blog.ll3.kr",
    github: "https://github.com/loopy-lim",
    shortSummary: "Next.js와 TypeScript로 성능과 사용자 경험을 모두 잡는 프론트엔드 엔지니어입니다.",
    summary:
      "사용자의 불편함을 해결하고, 팀의 생산성을 높이며, 비즈니스 가치를 창출하는 소프트웨어를 만드는 것—어린 시절 게임을 만들며 느꼈던 그 즐거움을, 이제는 더 나은 세상을 만드는 데 쏟고자 합니다.",
    about: [
      "어릴 적부터 컴퓨터는 제 가장 좋은 친구였습니다. 중학생 때 부족한 사양의 컴퓨터로 게임을 만들며 '창작의 즐거움'을 느꼈고, 고등학교 때는 직접 개발 동아리를 만들어 아두이노 프로젝트를 발표하며 '함께 만드는 기쁨'을 알게 되었습니다.",
      "개발자로서의 확신을 얻고자 지원한 공군 개발병 시절, React, Spring, Node.js 등 다양한 기술을 활용해 인트라넷의 문제들을 해결했습니다. 소프트웨어가 세상의 비효율을 개선하는 강력한 도구라는 것을 체감하며, **진짜 문제를 해결하는 개발**에 대한 갈증이 생겼습니다.",
      "그 갈증을 해소할 수 있었던 곳은 전역 후 합류한 프로젝트 동아리 'Econovation'이었습니다. 여기서 저는 실제 사용자의 문제를 발견하고, 동료들과 함께 해결책을 만들어가는 경험을 했습니다. 3년간 5개의 프로젝트와 여러 해커톤을 거치며 '코드는 비판의 대상이 될 수 있지만, 동료는 존중의 대상'이라는 말을 체화했습니다.",
      "특히 뜻이 맞는 동료들과 창업팀 '서피져스'를 꾸려 개발 리더로 활동하며, '전남대 주차권 서비스'처럼 학우들의 실제 불편함을 해결하는 프로젝트를 성공시켰습니다. 기술은 사용자의 문제를 해결할 때 비로소 가치가 있다는 것을, 그리고 **'함께'할 때 더 큰 임팩트를 만들 수 있다는 것**을 배웠습니다.",
      "2025년, 저는 단순히 기능을 구현하는 것을 넘어 **데이터 기반으로 문제를 정의하고, 측정 가능한 성과를 만들어내는 엔지니어**가 되고자 합니다. 사용자의 불편함을 해결하고, 팀의 생산성을 높이며, 비즈니스 가치를 창출하는 소프트웨어를 만드는 것—어린 시절 게임을 만들며 느꼈던 그 즐거움을, 이제는 더 나은 세상을 만드는 데 쏟고자 합니다.",
    ],
  },
  skills: {
    frontend: [
      "React",
      "TypeScript",
      "Next.js",
      "TanStack Query",
      "Zustand",
      "Jotai",
      "Tailwind CSS",
    ],
    backend: ["Node.js", "Express", "NestJS", "PostgreSQL", "SQLite"],
    devops: ["AWS EC2", "Nginx", "Docker", "Jenkins", "GitHub Actions", "PM2"],
    mobile: ["Flutter"],
    tools: ["Git", "GitHub", "Figma", "Yjs", "Socket.io", "WebRTC"],
  },
  experience: [
    {
      company: "세븐픽쳐스 (Seven Pictures)",
      position: "Software Engineer",
      period: "2025.08 - Present",
      description: "내부 1:1 화상 인터뷰 시스템 개발 및 Flutter 앱 성능 최적화",
      highlights: [
        "**내부 1:1 화상 인터뷰 시스템 단독 개발 (7일)**: SDD(스펙 주도 개발) 도입, Next.js Server Actions 및 ROP 패턴 적용으로 안정적인 시스템 구축.",
        "**Flutter 앱 성능 최적화 (OOM 문제 해결)**: 이미지 캐싱 전략 개선(다운샘플링, LRU 캐시)으로 런타임 메모리 사용량 53% 절감 (1.5GB → 700MB) 및 저사양 기기 크래시 해결.",
        "**운영 비효율 개선**: 녹화 파일 변환, 피드백 전송 등 반복 업무 자동화로 운영팀 주당 15시간 업무 시간 절감.",
      ],
    },
    {
      company: "버즈빌 (Buzzvil)",
      position: "Frontend Developer Intern (Supply Product팀)",
      period: "2025.01 - 2025.04",
      description: "Web SDK 기능 확장 및 안정성 강화",
      highlights: [
        "**Web SDK 기능 확장**: 네이티브 앱 전용 SDK를 웹으로 이식하여 제품 커버리지 확대.",
        "**구형 브라우저 호환성 해결**: iOS 13 이하 Safari 지원을 위한 Polyfill 및 Babel 설정 조정.",
        "**Turbopack 빌드 버그 해결**: Next.js 15 Turbopack 번들링 실패 이슈 추적 및 Webpack 폴백 전략 적용.",
      ],
    },
  ],
  projects: [
    {
      name: "CodeSync",
      description: "실시간 동시 편집 코드 리뷰 도구",
      period: "2024.10 - 2024.11",
      role: "Frontend Engineer & Team Leader",
      tech: ["React", "TypeScript", "Yjs", "Socket.io", "Zustand", "WebRTC"],
      links: {
        github: "https://github.com/jungle-6-3/code-sync-fe",
        demo: "https://jungle.krafton.com/news/59",
      },
      highlights: [
        "**실시간 협업 환경 구축**: CRDT(Yjs)와 Socket.io를 활용한 충돌 없는 동시 편집 및 커서 공유 구현.",
        "**데이터 정합성 확보**: Yjs 데이터와 React 상태 간 불일치 문제를 Zustand와 useSyncExternalStore로 해결.",
        "**팀 생산성 향상**: '사수제' 멘토링 도입으로 신규 팀원 적응 가속화, 팀 평균 작업 속도 70% 향상.",
      ],
    },
    {
      name: "Econovation 신입 모집 통합 시스템",
      description: "동아리 신입 모집을 위한 통합 웹 시스템",
      period: "2023.02 - 2025.01",
      role: "Lead Developer",
      tech: [
        "Next.js",
        "TypeScript",
        "TanStack Query",
        "Jotai",
        "SQLite",
        "PM2",
      ],
      links: {
        github: "https://github.com/JNU-econovation/econo-recruit-fe",
        demo: "https://recruit.econovation.kr",
      },
      highlights: [
        "**운영 효율 77% 개선**: 파편화된 프로세스 통합으로 운영 인력 13명 → 3명 감축.",
        "**SEO 및 성능 개선**: Vite(CSR)에서 Next.js(SSR)로 마이그레이션하여 SEO 점수 62→95점, LCP 3.2s→1.4s 개선.",
        "**UX 최적화**: Optimistic Update 적용으로 서버 응답 대기 없는 즉각적인 UI 피드백 제공.",
      ],
    },
    {
      name: "전남대 주차권 서비스",
      description: "대학생 주차권 신청 자동화 서비스",
      period: "2023.10 - 2025.01",
      role: "FE Lead",
      tech: ["React", "TypeScript", "Nx", "Jotai", "TanStack Query"],
      links: {
        github: "https://github.com/JNU-Parking-Ticket-Project/Parking-Ticket-FE",
        demo: "https://apply.jnu-parking.com",
      },
      highlights: [
        "**대규모 트래픽 운영**: 수천 명의 재학생이 사용하는 서비스 1년 이상 안정적 운영.",
        "**신청 오류 90% 감소**: 수작업 프로세스 자동화 및 중복 요청 방지 로직 적용.",
        "**Nx 모노레포 도입**: 학생용/관리자용 앱 간 공통 컴포넌트 재사용으로 개발 효율 증대.",
      ],
    },
    {
      name: "Edurom 장애 복구 시스템",
      description: "시스템 장애 자동 감지 및 복구 파이프라인",
      period: "2024.01 - 2024.06",
      role: "DevOps & Backend Engineer",
      tech: ["Jenkins", "Grafana", "Nginx", "Node.js"],
      highlights: [
        "**자동 복구 파이프라인**: Grafana Alert와 Jenkins 연동으로 장애 발생 시 자동 스크립트 실행.",
        "**가용성 확보**: 다운타임 발생 시 3초 이내 자동 복구, 월평균 장애 시간 96% 감소 (2시간 → 5분).",
      ],
    },
  ],
  education: [
    {
      school: "전남대학교",
      degree: "소프트웨어공학과 학사 졸업",
      period: "2018.03 - 2024.08",
    },
    {
      school: "크래프톤 정글 (Krafton Jungle) 6기",
      degree: "CS 심화 학습 (PintOS, 알고리즘)",
      period: "2024.04 - 2024.09",
    },
  ],
};
