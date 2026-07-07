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
  {
    slug: "network-systems",
    title: { ko: "네트워크 시스템", en: "Network Systems" },
    summary: {
      ko: "TCP/IP부터 라우팅·스위칭, 방화벽, 클라우드 네트워크까지 인프라의 뼈대를 다집니다.",
      en: "From TCP/IP to routing, switching, firewalls, and cloud networking — the backbone of infrastructure.",
    },
    duration: { ko: "10주 (주 2회)", en: "10 weeks (2×/week)" },
    level: { ko: "입문 ~ 중급", en: "Beginner to Intermediate" },
    format: { ko: "온·오프라인 병행", en: "Online + offline" },
    tags: ["TCP/IP", "Routing", "Security", "Cloud"],
    curriculum: {
      ko: [
        "네트워크 기본 개념과 OSI 7계층",
        "IP 주소 체계와 서브네팅",
        "라우팅과 스위칭의 원리",
        "방화벽·VPN과 네트워크 보안",
        "클라우드 네트워킹 (VPC·로드밸런싱)",
        "실습: 소규모 네트워크 설계·구축",
      ],
      en: [
        "Networking fundamentals and the OSI model",
        "IP addressing and subnetting",
        "How routing and switching work",
        "Firewalls, VPNs, and network security",
        "Cloud networking (VPC, load balancing)",
        "Hands-on: design and build a small network",
      ],
    },
    audience: {
      ko: ["인프라·네트워크 엔지니어 지망생", "서버·클라우드 운영 담당자", "정보처리·네트워크 자격증 준비생"],
      en: ["Aspiring infra/network engineers", "Server & cloud operators", "Certification candidates"],
    },
  },
  {
    slug: "cloud-devops",
    title: { ko: "클라우드 · DevOps", en: "Cloud & DevOps" },
    summary: {
      ko: "AWS·Docker·쿠버네티스·CI/CD로 배포와 운영을 자동화합니다.",
      en: "Automate deployment and operations with AWS, Docker, Kubernetes, and CI/CD.",
    },
    duration: { ko: "12주 (주 2회)", en: "12 weeks (2×/week)" },
    level: { ko: "중급", en: "Intermediate" },
    format: { ko: "온라인", en: "Online" },
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    curriculum: {
      ko: [
        "클라우드 기초와 AWS 핵심 서비스",
        "리눅스·셸과 인프라 자동화",
        "컨테이너: Docker 이미지·네트워크·볼륨",
        "쿠버네티스로 배포·스케일링",
        "CI/CD 파이프라인 구축",
        "모니터링·로깅과 운영",
      ],
      en: [
        "Cloud basics and core AWS services",
        "Linux, shell, and infrastructure automation",
        "Containers: Docker images, networking, volumes",
        "Deployment and scaling with Kubernetes",
        "Building CI/CD pipelines",
        "Monitoring, logging, and operations",
      ],
    },
    audience: {
      ko: ["서버 개발자에서 DevOps로 전환하려는 분", "배포·운영 자동화가 필요한 팀", "클라우드 자격증 준비생"],
      en: ["Developers moving into DevOps", "Teams needing deploy/ops automation", "Cloud certification candidates"],
    },
  },
  {
    slug: "security",
    title: { ko: "정보보안 입문", en: "Information Security Foundations" },
    summary: {
      ko: "웹·시스템 취약점, 암호화, 모의해킹 기초까지 방어의 관점에서 배웁니다.",
      en: "Web/system vulnerabilities, cryptography, and pentesting basics — from a defender's view.",
    },
    duration: { ko: "10주 (주 2회)", en: "10 weeks (2×/week)" },
    level: { ko: "입문", en: "Beginner" },
    format: { ko: "온·오프라인 병행", en: "Online + offline" },
    tags: ["Security", "OWASP", "Crypto", "Pentest"],
    curriculum: {
      ko: [
        "정보보안 개요와 위협 모델",
        "웹 취약점 (OWASP Top 10)",
        "네트워크·시스템 보안 기초",
        "암호화와 인증의 원리",
        "모의해킹·취약점 진단 실습",
        "보안 운영과 사고 대응",
      ],
      en: [
        "Security overview and threat modeling",
        "Web vulnerabilities (OWASP Top 10)",
        "Network and system security basics",
        "Cryptography and authentication",
        "Hands-on pentesting and vulnerability scanning",
        "Security operations and incident response",
      ],
    },
    audience: {
      ko: ["보안 직무로 전환하려는 분", "보안 역량을 키우려는 개발자", "보안 자격증 준비생"],
      en: ["Career switchers into security", "Developers strengthening security skills", "Security certification candidates"],
    },
  },
  {
    slug: "backend",
    title: { ko: "백엔드 개발 심화", en: "Backend Engineering" },
    summary: {
      ko: "API 설계, 데이터베이스, 인증, 대용량 처리까지 서버 개발의 핵심을 다집니다.",
      en: "API design, databases, auth, and scale — the core of server engineering.",
    },
    duration: { ko: "12주 (주 2회)", en: "12 weeks (2×/week)" },
    level: { ko: "중급", en: "Intermediate" },
    format: { ko: "온·오프라인 병행", en: "Online + offline" },
    tags: ["Node.js", "SQL", "Redis", "API"],
    curriculum: {
      ko: [
        "백엔드 아키텍처와 REST/GraphQL",
        "데이터베이스 설계와 쿼리 최적화",
        "인증·인가와 보안",
        "캐싱과 메시지 큐",
        "테스트와 배포 파이프라인",
        "실전: 확장 가능한 API 서버 구축",
      ],
      en: [
        "Backend architecture and REST/GraphQL",
        "Database design and query optimization",
        "Authentication, authorization, and security",
        "Caching and message queues",
        "Testing and deployment pipelines",
        "Hands-on: build a scalable API server",
      ],
    },
    audience: {
      ko: ["프론트엔드에서 풀스택으로 확장하려는 분", "서버 개발 역량을 키우려는 개발자", "백엔드 취업 준비생"],
      en: ["Frontend devs expanding to full-stack", "Developers deepening backend skills", "Backend job seekers"],
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

// --- Testimonials ---------------------------------------------------------
export interface Testimonial {
  quote: L10n;
  author: L10n;
  role: L10n;
}

export const testimonials: Testimonial[] = [
  {
    quote: {
      ko: "비전공자였는데 프로젝트 중심 수업 덕분에 첫 개발자 취업에 성공했어요.",
      en: "I had no CS background, but the project-driven course landed me my first developer job.",
    },
    author: { ko: "김○○", en: "Ms. Kim" },
    role: { ko: "웹 풀스택 수료생", en: "Full-Stack graduate" },
  },
  {
    quote: {
      ko: "요구사항을 정확히 이해하고 일정 안에 안정적으로 만들어줬습니다.",
      en: "They understood our requirements precisely and delivered reliably, on schedule.",
    },
    author: { ko: "박○○", en: "Mr. Park" },
    role: { ko: "스타트업 대표", en: "Startup founder" },
  },
  {
    quote: {
      ko: "현업 개발자에게 배우니 실무 감각이 확실히 다릅니다.",
      en: "Learning from working developers made a real difference in practical skills.",
    },
    author: { ko: "이○○", en: "Ms. Lee" },
    role: { ko: "데이터 분석 수료생", en: "Data Analysis graduate" },
  },
];

// --- Tech stack -----------------------------------------------------------
export interface TechGroup {
  label: L10n;
  items: string[];
}

export const techStack: TechGroup[] = [
  { label: { ko: "프론트엔드", en: "Frontend" }, items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { label: { ko: "백엔드", en: "Backend" }, items: ["Node.js", "Python", "PostgreSQL", "Redis"] },
  { label: { ko: "모바일", en: "Mobile" }, items: ["React Native", "Expo"] },
  { label: { ko: "인프라 · DevOps", en: "Infra & DevOps" }, items: ["AWS", "Docker", "Kubernetes", "GitHub Actions"] },
  { label: { ko: "AI · 데이터", en: "AI & Data" }, items: ["Python", "Pandas", "LLM / RAG"] },
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
  {
    title: { ko: "사내 네트워크 · 보안 구축", en: "Corporate Network & Security" },
    category: { ko: "인프라", en: "Infrastructure" },
    desc: {
      ko: "지사 간 네트워크를 재설계하고 방화벽·VPN으로 보안을 강화했습니다.",
      en: "Redesigned inter-office networking and hardened security with firewalls and VPNs.",
    },
    tags: ["Network", "Firewall", "VPN"],
  },
  {
    title: { ko: "클라우드 마이그레이션", en: "Cloud Migration" },
    category: { ko: "클라우드 · DevOps", en: "Cloud & DevOps" },
    desc: {
      ko: "온프레미스 서비스를 AWS로 이전하고 CI/CD·오토스케일링을 도입했습니다.",
      en: "Migrated on-prem services to AWS with CI/CD and autoscaling.",
    },
    tags: ["AWS", "Docker", "CI/CD"],
  },
  {
    title: { ko: "AI 상담 챗봇", en: "AI Support Chatbot" },
    category: { ko: "AI", en: "AI" },
    desc: {
      ko: "사내 문서를 학습한 LLM 챗봇으로 고객 문의 응대를 자동화했습니다.",
      en: "Automated customer support with an LLM chatbot trained on internal docs.",
    },
    tags: ["LLM", "RAG", "Next.js"],
  },
];
