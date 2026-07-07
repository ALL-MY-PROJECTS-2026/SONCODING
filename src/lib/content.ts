import type { Locale } from "./i18n";

type L10n = Record<Locale, string>;
type L10nList = Record<Locale, string[]>;

export interface Course {
  slug: string;
  title: L10n;
  summary: L10n;
  duration: L10n;
  level: L10n;
  format: L10n;
  tags: string[];
  curriculum: L10nList;
  audience: L10nList;
}

// --- IT education courses -------------------------------------------------
export const courses: Course[] = [
  {
    slug: "web-fullstack",
    title: { ko: "웹 풀스택 개발", en: "Full-Stack Web Development" },
    summary: {
      ko: "HTML/CSS부터 React, Node.js, 데이터베이스까지. 하나의 실서비스를 처음부터 끝까지 완성합니다.",
      en: "From HTML/CSS to React, Node.js, and databases — build one real service end to end.",
    },
    duration: { ko: "16주 (주 3회)", en: "16 weeks (3×/week)" },
    level: { ko: "입문 ~ 중급", en: "Beginner to Intermediate" },
    format: { ko: "온·오프라인 병행", en: "Online + offline" },
    tags: ["React", "Node.js", "TypeScript", "SQL"],
    curriculum: {
      ko: [
        "웹의 동작 원리와 개발 환경 세팅",
        "HTML/CSS/JavaScript 기초와 반응형 UI",
        "React로 만드는 컴포넌트 기반 프론트엔드",
        "Node.js·Express로 REST API 개발",
        "데이터베이스 설계와 연동 (SQL)",
        "인증·배포와 팀 프로젝트로 서비스 완성",
      ],
      en: [
        "How the web works and dev-environment setup",
        "HTML/CSS/JavaScript foundations and responsive UI",
        "Component-based frontends with React",
        "Building REST APIs with Node.js and Express",
        "Database design and integration (SQL)",
        "Auth, deployment, and a team-project capstone",
      ],
    },
    audience: {
      ko: ["개발자로 커리어를 시작하려는 분", "웹 서비스를 직접 만들고 싶은 창업자", "비전공 취업 준비생"],
      en: ["Anyone starting a developer career", "Founders who want to build their own web service", "Non-major job seekers"],
    },
  },
  {
    slug: "data-ai",
    title: { ko: "데이터 분석 & AI 입문", en: "Data Analysis & AI Foundations" },
    summary: {
      ko: "파이썬으로 데이터를 다루고, 머신러닝과 생성형 AI 활용까지 실습으로 익힙니다.",
      en: "Handle data with Python and get hands-on with machine learning and generative AI.",
    },
    duration: { ko: "12주 (주 2회)", en: "12 weeks (2×/week)" },
    level: { ko: "입문", en: "Beginner" },
    format: { ko: "온라인", en: "Online" },
    tags: ["Python", "Pandas", "ML", "LLM"],
    curriculum: {
      ko: [
        "파이썬 기초와 데이터 다루기 (Pandas)",
        "데이터 시각화와 탐색적 분석",
        "머신러닝 핵심 개념과 모델링",
        "생성형 AI·LLM API 활용",
        "실전 데이터 프로젝트",
      ],
      en: [
        "Python basics and working with data (Pandas)",
        "Data visualization and exploratory analysis",
        "Core machine-learning concepts and modeling",
        "Using generative AI and LLM APIs",
        "A hands-on data project",
      ],
    },
    audience: {
      ko: ["데이터 직무로 전환하려는 직장인", "AI를 업무에 적용하고 싶은 분", "문과 출신 데이터 입문자"],
      en: ["Professionals moving into data roles", "Anyone applying AI to their work", "Newcomers to data"],
    },
  },
  {
    slug: "app-development",
    title: { ko: "모바일 앱 개발", en: "Mobile App Development" },
    summary: {
      ko: "React Native로 iOS·안드로이드 앱을 한 번에. 아이디어를 스토어에 올리는 것까지.",
      en: "Build iOS and Android apps at once with React Native — all the way to the store.",
    },
    duration: { ko: "10주 (주 2회)", en: "10 weeks (2×/week)" },
    level: { ko: "중급", en: "Intermediate" },
    format: { ko: "온·오프라인 병행", en: "Online + offline" },
    tags: ["React Native", "Expo", "Mobile"],
    curriculum: {
      ko: [
        "모바일 개발 환경과 React Native 기초",
        "화면 구성과 네비게이션",
        "상태 관리와 API 연동",
        "디바이스 기능·푸시 알림",
        "빌드와 스토어 배포",
      ],
      en: [
        "Mobile dev environment and React Native basics",
        "Building screens and navigation",
        "State management and API integration",
        "Device features and push notifications",
        "Builds and store deployment",
      ],
    },
    audience: {
      ko: ["앱을 직접 출시하고 싶은 분", "웹 개발 경험이 있는 개발자", "1인 개발을 준비하는 분"],
      en: ["Anyone who wants to ship an app", "Developers with web experience", "Aspiring solo developers"],
    },
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

// --- Development services --------------------------------------------------
export interface Service {
  title: L10n;
  desc: L10n;
  icon: "web" | "app" | "automation" | "custom";
}

export const services: Service[] = [
  {
    icon: "web",
    title: { ko: "웹사이트 · 웹서비스", en: "Websites & Web Apps" },
    desc: {
      ko: "회사 홈페이지부터 복잡한 웹 애플리케이션까지, 빠르고 안정적으로 만듭니다.",
      en: "From company sites to complex web applications — fast and reliable.",
    },
  },
  {
    icon: "app",
    title: { ko: "모바일 앱", en: "Mobile Apps" },
    desc: {
      ko: "iOS·안드로이드 앱을 효율적으로 개발하고 스토어 출시까지 지원합니다.",
      en: "Efficient iOS/Android development, with store launch support.",
    },
  },
  {
    icon: "automation",
    title: { ko: "업무 자동화", en: "Workflow Automation" },
    desc: {
      ko: "반복 업무를 자동화하고 데이터를 연결해 일하는 방식을 바꿉니다.",
      en: "Automate repetitive work and connect your data to change how you operate.",
    },
  },
  {
    icon: "custom",
    title: { ko: "맞춤형 솔루션", en: "Custom Solutions" },
    desc: {
      ko: "정해진 틀이 없는 문제도 요구사항에 맞춰 처음부터 설계합니다.",
      en: "For problems without a template — designed from scratch to fit you.",
    },
  },
];

// --- Portfolio ------------------------------------------------------------
export interface Project {
  title: L10n;
  category: L10n;
  desc: L10n;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: { ko: "온라인 교육 플랫폼", en: "Online Learning Platform" },
    category: { ko: "웹 서비스", en: "Web Service" },
    desc: {
      ko: "강의 수강·진도 관리·결제를 포함한 교육 플랫폼을 설계·구축했습니다.",
      en: "Designed and built a learning platform with courses, progress tracking, and payments.",
    },
    tags: ["Next.js", "PostgreSQL", "Stripe"],
  },
  {
    title: { ko: "소상공인 예약 앱", en: "Booking App for Small Business" },
    category: { ko: "모바일 앱", en: "Mobile App" },
    desc: {
      ko: "예약·알림·매출 관리를 하나로 묶은 모바일 앱을 출시했습니다.",
      en: "Shipped a mobile app unifying reservations, notifications, and sales.",
    },
    tags: ["React Native", "Firebase"],
  },
  {
    title: { ko: "업무 데이터 자동화", en: "Ops Data Automation" },
    category: { ko: "자동화", en: "Automation" },
    desc: {
      ko: "여러 시스템의 데이터를 자동 수집·정리해 리포트를 생성하는 파이프라인을 구축했습니다.",
      en: "Built a pipeline that auto-collects and organizes data across systems into reports.",
    },
    tags: ["Python", "ETL", "Dashboard"],
  },
  {
    title: { ko: "기업 홈페이지 리뉴얼", en: "Corporate Site Renewal" },
    category: { ko: "웹사이트", en: "Website" },
    desc: {
      ko: "노후된 홈페이지를 반응형·다국어로 새롭게 구축해 문의 전환율을 높였습니다.",
      en: "Rebuilt an aging site as responsive and multilingual, lifting inquiry conversion.",
    },
    tags: ["Next.js", "i18n", "SEO"],
  },
];
