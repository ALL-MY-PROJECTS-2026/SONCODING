export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Dictionary: every UI string lives here so the site stays fully bilingual.
// ---------------------------------------------------------------------------
const dictionaries = {
  ko: {
    nav: {
      home: "홈",
      about: "회사소개",
      education: "IT 교육",
      services: "개발 외주",
      portfolio: "포트폴리오",
      contact: "문의하기",
    },
    common: {
      contactCta: "문의하기",
      learnMore: "자세히 보기",
      viewAll: "전체 보기",
      getQuote: "견적 문의",
      applyCourse: "수강 문의",
      backToList: "목록으로",
    },
    home: {
      badge: "IT 교육 · 소프트웨어 개발",
      heroTitle: "실무를 가르치고,\n제품을 만듭니다",
      heroDesc:
        "SONCODING은 현장에서 통하는 IT 교육과 신뢰할 수 있는 소프트웨어 개발 외주를 함께 제공합니다. 배우는 곳이자, 만드는 곳입니다.",
      heroPrimary: "무료 상담 신청",
      heroSecondary: "서비스 둘러보기",
      statsTitle: "숫자로 보는 SONCODING",
      stats: [
        { value: "500+", label: "교육 수료생" },
        { value: "50+", label: "개발 프로젝트" },
        { value: "10+", label: "년 현장 경력" },
        { value: "98%", label: "고객 만족도" },
      ],
      pillarsTitle: "두 개의 축, 하나의 팀",
      pillarsDesc: "가르치는 사람이 곧 만드는 사람입니다. 현업 개발자가 직접 교육하고 개발합니다.",
      eduCardTitle: "IT 교육",
      eduCardDesc:
        "웹·앱 개발, 데이터, AI까지 실무 중심 커리큘럼. 프로젝트로 배우고 포트폴리오로 남깁니다.",
      devCardTitle: "개발 외주",
      devCardDesc:
        "웹사이트부터 업무 자동화, 맞춤형 솔루션까지. 기획-개발-운영을 함께합니다.",
      whyTitle: "왜 SONCODING인가",
      why: [
        {
          title: "현업 개발자가 직접",
          desc: "이론만 아는 강사가 아니라, 실제 제품을 만드는 개발자가 가르치고 개발합니다.",
        },
        {
          title: "프로젝트 중심",
          desc: "강의를 듣는 데서 끝나지 않고, 실제로 동작하는 결과물을 만듭니다.",
        },
        {
          title: "끝까지 함께",
          desc: "교육 수료 후 취업·실무까지, 개발 프로젝트는 출시 후 운영까지 지원합니다.",
        },
      ],
      ctaTitle: "무엇을 만들고 싶으신가요?",
      ctaDesc: "교육 문의든 개발 의뢰든, 편하게 남겨주세요. 영업일 기준 1일 내 회신드립니다.",
    },
    about: {
      title: "회사소개",
      subtitle: "가르치는 사람이 만드는 사람입니다",
      lead: "SONCODING은 IT 교육과 소프트웨어 개발을 함께하는 팀입니다. 우리는 배움과 실전이 분리되어서는 안 된다고 믿습니다.",
      missionTitle: "우리의 미션",
      missionDesc:
        "누구나 기술로 문제를 해결할 수 있도록 돕습니다. 배우려는 사람에게는 실무 역량을, 만들려는 사람에게는 신뢰할 수 있는 파트너를 제공합니다.",
      valuesTitle: "우리가 일하는 방식",
      values: [
        { title: "정직함", desc: "할 수 있는 것과 없는 것을 분명히 말합니다." },
        { title: "실용성", desc: "멋진 이론보다 실제로 동작하는 결과를 우선합니다." },
        { title: "함께 성장", desc: "고객과 수강생의 성장이 곧 우리의 성장입니다." },
      ],
      historyTitle: "걸어온 길",
      history: [
        { year: "2024", text: "IT 교육 사업 시작, 첫 부트캠프 개설" },
        { year: "2025", text: "소프트웨어 개발 외주 사업 본격화" },
        { year: "2026", text: "누적 수료생 500명, 개발 프로젝트 50건 돌파" },
      ],
    },
    education: {
      title: "IT 교육",
      subtitle: "실무로 배우는 IT 커리큘럼",
      lead: "현업 개발자가 설계한 프로젝트 중심 과정. 배운 것이 곧 포트폴리오가 됩니다.",
      curriculumTitle: "커리큘럼",
      targetTitle: "이런 분께 추천합니다",
      durationLabel: "교육 기간",
      levelLabel: "난이도",
      formatLabel: "진행 방식",
      coursesTitle: "교육 과정",
      features: [
        { title: "현업 개발자 강사", desc: "이론만 아는 강사가 아니라, 실제로 제품을 만드는 개발자가 가르칩니다." },
        { title: "프로젝트 중심", desc: "모든 과정이 강의로 끝나지 않고 동작하는 결과물로 마무리됩니다." },
        { title: "취업·실무 연계", desc: "수료 후 포트폴리오 정리부터 커리어까지 이어서 지원합니다." },
      ],
    },
    services: {
      title: "개발 외주",
      subtitle: "아이디어를 제품으로",
      lead: "웹·앱·자동화·맞춤형 솔루션까지. 기획부터 개발, 운영까지 한 팀이 함께합니다.",
      offerTitle: "제공 서비스",
      stackTitle: "기술 스택",
      stackLead: "검증된 기술로 안정적이고 유지보수하기 좋게 만듭니다.",
      processTitle: "진행 프로세스",
      process: [
        { step: "01", title: "상담·기획", desc: "요구사항을 함께 정리하고 범위와 일정을 확정합니다." },
        { step: "02", title: "설계·견적", desc: "구조를 설계하고 투명한 견적을 제시합니다." },
        { step: "03", title: "개발·소통", desc: "정기적으로 진행 상황을 공유하며 개발합니다." },
        { step: "04", title: "출시·운영", desc: "배포 후 유지보수와 개선을 함께합니다." },
      ],
    },
    portfolio: {
      title: "포트폴리오",
      subtitle: "우리가 만든 것들",
      lead: "교육과 개발 현장에서 실제로 완성한 프로젝트들입니다.",
    },
    contact: {
      title: "문의하기",
      subtitle: "무엇이든 편하게 물어보세요",
      lead: "교육 수강, 개발 외주, 그 밖의 어떤 문의든 좋습니다. 영업일 기준 1일 내 회신드립니다.",
      infoTitle: "연락처",
      emailLabel: "이메일",
      phoneLabel: "전화",
      addressLabel: "주소",
      hoursLabel: "운영시간",
      faqTitle: "자주 묻는 질문",
      faq: [
        {
          q: "비전공자도 수강할 수 있나요?",
          a: "네. 입문 과정은 비전공자 기준으로 설계되어 있어, 개발이 처음이어도 따라올 수 있습니다.",
        },
        {
          q: "교육은 온라인인가요, 오프라인인가요?",
          a: "과정마다 다릅니다. 온·오프라인 병행 또는 온라인 전용으로 진행되며, 각 과정 상세 페이지에서 확인할 수 있어요.",
        },
        {
          q: "개발 외주 견적은 어떻게 산정되나요?",
          a: "요구사항·범위·일정을 함께 정리한 뒤 투명하게 산정합니다. 문의 폼으로 남겨주시면 상담 후 안내드립니다.",
        },
        {
          q: "프로젝트 기간은 얼마나 걸리나요?",
          a: "규모에 따라 다르지만, 상담 시 예상 일정을 구체적으로 안내드립니다.",
        },
        {
          q: "수료 후 취업 지원이 있나요?",
          a: "포트폴리오 정리부터 커리어 관련 부분까지 이어서 지원합니다.",
        },
      ],
      form: {
        name: "이름",
        email: "이메일",
        phone: "연락처 (선택)",
        type: "문의 유형",
        typeOptions: ["교육 수강 문의", "개발 외주 문의", "제휴·기타"],
        message: "문의 내용",
        messagePlaceholder: "필요하신 내용을 자유롭게 적어주세요.",
        submit: "문의 보내기",
        submitting: "전송 중...",
        successTitle: "문의가 접수되었습니다",
        successDesc: "빠르게 확인 후 회신드리겠습니다. 감사합니다.",
        errorTitle: "전송에 실패했습니다",
        errorDesc: "잠시 후 다시 시도하시거나 이메일로 연락 주세요.",
        required: "필수 항목을 입력해주세요.",
      },
    },
    footer: {
      rights: "All rights reserved.",
      quickLinks: "바로가기",
      contact: "연락처",
      description: "IT 교육과 소프트웨어 개발을 함께하는 팀입니다.",
    },
  },

  en: {
    nav: {
      home: "Home",
      about: "About",
      education: "Education",
      services: "Services",
      portfolio: "Portfolio",
      contact: "Contact",
    },
    common: {
      contactCta: "Contact us",
      learnMore: "Learn more",
      viewAll: "View all",
      getQuote: "Request a quote",
      applyCourse: "Ask about this course",
      backToList: "Back to list",
    },
    home: {
      badge: "IT Education · Software Development",
      heroTitle: "We teach the craft,\nand build the product",
      heroDesc:
        "SONCODING pairs practical IT education with dependable software development. A place to learn — and a place to build.",
      heroPrimary: "Book a free consult",
      heroSecondary: "Explore services",
      statsTitle: "SONCODING in numbers",
      stats: [
        { value: "500+", label: "Graduates" },
        { value: "50+", label: "Projects delivered" },
        { value: "10+", label: "Years in the field" },
        { value: "98%", label: "Client satisfaction" },
      ],
      pillarsTitle: "Two pillars, one team",
      pillarsDesc: "The people who teach are the people who build. Working developers run every class and every project.",
      eduCardTitle: "IT Education",
      eduCardDesc:
        "Web & app development, data, and AI — a hands-on curriculum. Learn by building, leave with a portfolio.",
      devCardTitle: "Software Development",
      devCardDesc:
        "From websites to workflow automation and custom solutions — planning, building, and running it with you.",
      whyTitle: "Why SONCODING",
      why: [
        {
          title: "Taught by real developers",
          desc: "Not lecturers who only know theory — developers who ship real products teach and build.",
        },
        {
          title: "Project-driven",
          desc: "It doesn't end with a lecture. You build something that actually works.",
        },
        {
          title: "With you to the end",
          desc: "We support careers after courses, and operations after launch.",
        },
      ],
      ctaTitle: "What would you like to build?",
      ctaDesc: "Whether it's a course or a project, just drop us a line. We reply within one business day.",
    },
    about: {
      title: "About",
      subtitle: "The people who teach are the people who build",
      lead: "SONCODING is a team that does both IT education and software development. We believe learning and real work should never be separate.",
      missionTitle: "Our mission",
      missionDesc:
        "We help anyone solve problems with technology — giving learners real skills, and builders a partner they can trust.",
      valuesTitle: "How we work",
      values: [
        { title: "Honesty", desc: "We're clear about what we can and cannot do." },
        { title: "Pragmatism", desc: "Working results over impressive theory." },
        { title: "Grow together", desc: "Our clients' and students' growth is ours." },
      ],
      historyTitle: "Our story",
      history: [
        { year: "2024", text: "Launched IT education, opened our first bootcamp" },
        { year: "2025", text: "Scaled up the software development business" },
        { year: "2026", text: "Passed 500 graduates and 50 delivered projects" },
      ],
    },
    education: {
      title: "IT Education",
      subtitle: "Learn IT by doing",
      lead: "Project-driven courses designed by working developers. What you learn becomes your portfolio.",
      curriculumTitle: "Curriculum",
      targetTitle: "Who it's for",
      durationLabel: "Duration",
      levelLabel: "Level",
      formatLabel: "Format",
      coursesTitle: "Courses",
      features: [
        { title: "Taught by real developers", desc: "Not lecturers who only know theory — developers who ship real products." },
        { title: "Project-driven", desc: "Every course ends with something that actually works, not just lectures." },
        { title: "Careers & real work", desc: "After finishing, we help with your portfolio and your career." },
      ],
    },
    services: {
      title: "Software Development",
      subtitle: "From idea to product",
      lead: "Web, apps, automation, and custom solutions — one team from planning to development to operations.",
      offerTitle: "What we offer",
      stackTitle: "Tech stack",
      stackLead: "We build on proven technologies that stay stable and maintainable.",
      processTitle: "How we work",
      process: [
        { step: "01", title: "Consult & plan", desc: "We shape requirements together and lock scope and timeline." },
        { step: "02", title: "Design & quote", desc: "We design the architecture and give a transparent quote." },
        { step: "03", title: "Build & communicate", desc: "We build while sharing progress on a regular cadence." },
        { step: "04", title: "Launch & operate", desc: "After launch we handle maintenance and improvements." },
      ],
    },
    portfolio: {
      title: "Portfolio",
      subtitle: "Things we've built",
      lead: "Real projects completed across our education and development work.",
    },
    contact: {
      title: "Contact",
      subtitle: "Ask us anything",
      lead: "Courses, development projects, or anything else — we reply within one business day.",
      infoTitle: "Get in touch",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      hoursLabel: "Hours",
      faqTitle: "Frequently asked questions",
      faq: [
        {
          q: "Can I take a course without a CS background?",
          a: "Yes. Beginner courses are designed for non-majors, so you can follow along even if it's your first time coding.",
        },
        {
          q: "Are courses online or offline?",
          a: "It depends on the course — some run online + offline, some online only. Each course page lists its format.",
        },
        {
          q: "How is a development quote calculated?",
          a: "We shape requirements, scope, and timeline together, then quote transparently. Send us a message and we'll follow up.",
        },
        {
          q: "How long does a project take?",
          a: "It varies by scope, but we give a concrete timeline estimate during the consultation.",
        },
        {
          q: "Is there career support after finishing a course?",
          a: "Yes — from portfolio polishing to career guidance, we keep supporting you.",
        },
      ],
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone (optional)",
        type: "Inquiry type",
        typeOptions: ["Course inquiry", "Development project", "Partnership / other"],
        message: "Message",
        messagePlaceholder: "Tell us what you need.",
        submit: "Send message",
        submitting: "Sending...",
        successTitle: "Your message was received",
        successDesc: "We'll review it and get back to you shortly. Thank you.",
        errorTitle: "Failed to send",
        errorDesc: "Please try again in a moment, or email us directly.",
        required: "Please fill in the required fields.",
      },
    },
    footer: {
      rights: "All rights reserved.",
      quickLinks: "Quick links",
      contact: "Contact",
      description: "A team doing both IT education and software development.",
    },
  },
};

export type Dictionary = (typeof dictionaries)["ko"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
