// Centralized brand / company info. Change values here to rebrand the whole site.
export const site = {
  name: "SONCODING",
  // Short tagline shown near the logo / in metadata
  tagline: {
    ko: "IT 교육과 소프트웨어 개발을 한 곳에서",
    en: "IT Education & Software Development, in one place",
  },
  email: "contact@soncoding.com",
  phone: "02-0000-0000",
  // Contact form endpoint. Sign up at https://formspree.io, create a form,
  // and paste its endpoint here (looks like https://formspree.io/f/abcdwxyz).
  formspreeEndpoint: "https://formspree.io/f/your_form_id",
  address: {
    ko: "서울특별시 ○○구 ○○로 00, 0층",
    en: "0F, 00 ○○-ro, ○○-gu, Seoul, Korea",
  },
  // Business hours
  hours: {
    ko: "평일 09:00 – 18:00 (주말·공휴일 휴무)",
    en: "Weekdays 09:00 – 18:00 (KST)",
  },
  social: {
    github: "",
    instagram: "",
    linkedin: "",
  },
} as const;
