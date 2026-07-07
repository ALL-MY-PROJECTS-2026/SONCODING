# SONCODING (손코딩) — 회사 홈페이지

IT 과목 **교육**과 소프트웨어 **개발 외주**를 함께하는 회사 홈페이지.
한국어/영어 이중언어, Next.js 정적 사이트, GitHub Pages 배포.

- **라이브:** https://all-my-projects-2026.github.io/SONCODING/
- **저장소:** `ALL-MY-PROJECTS-2026/SONCODING` (public)

## 기술 스택

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **three.js** (히어로 파티클 배경) · **lucide-react** (아이콘)
- 정적 export (`output: "export"`) → **GitHub Pages** 배포 (GitHub Actions)
- 폰트: Geist Sans / Noto Sans KR / **JetBrains Mono**(로고)

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000 (→ /ko 로 리다이렉트)
npm run build    # 정적 export → out/
```

> Node 20+ 권장. 배포 산출물은 `out/` (정적 HTML).

## 디렉터리 구조

```
src/
  app/
    layout.tsx            루트 레이아웃(폰트·메타·OG)
    page.tsx              / → /ko 리다이렉트
    icon.svg              파비콘( >_ 터미널 마크 )
    sitemap.ts, robots.ts SEO
    not-found.tsx         브랜드 404
    [lang]/
      layout.tsx          Header/Footer/스킵링크
      page.tsx            홈(히어로·통계·후기 등)
      about|education|services|portfolio|contact/…
      education/[slug]/   과정 상세 + 관련 과정
  components/             Header, Footer, Logo, HeroCanvas(three.js),
                          Aurora, CountUp, CTA, ContactForm, PortfolioGrid …
  config/site.ts          브랜드/연락처/Formspree 엔드포인트(⚠️ 플레이스홀더)
  lib/i18n.ts             한/영 모든 UI 문구(사전)
  lib/content.ts          과목·포트폴리오·기술스택·후기 데이터(한/영)
```

- **모든 문구는 `src/lib/i18n.ts`**, **콘텐츠 데이터는 `src/lib/content.ts`** 한 곳에서 관리.
- **로고**: `src/components/Logo.tsx` — `>_` 마크 + 타이핑 워드마크(한글=손코딩 / 영문=SONCODING).

## 배포 (자동)

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가
빌드 → `out/` → GitHub Pages 배포. 수동 조작 불필요.

```bash
git push origin HEAD          # 작업 브랜치
git push origin HEAD:main     # 배포 트리거
```

- Pages 설정: 저장소 Settings → Pages → Source = **GitHub Actions** (이미 활성화됨).
- `basePath: /SONCODING` (프로젝트 경로), `trailingSlash: true`, `.nojekyll` 포함.

## ⚠️ 남은 작업 (TODO)

- **Formspree 엔드포인트**: `src/config/site.ts`의 `formspreeEndpoint`가 `your_form_id` **플레이스홀더**.
  [formspree.io](https://formspree.io)에서 폼 생성 후 실제 값으로 교체해야 문의 폼이 실제로 전송됨.
- `src/config/site.ts`의 회사명·이메일·전화·주소는 **예시값** → 실제 정보로 교체.
- `src/lib/content.ts`의 통계 수치·후기·포트폴리오는 **예시** → 실제 내용으로 교체.

## 디자인 개선 로그

반복 개선 이력과 점수는 [`DESIGN_SCORECARD.md`](DESIGN_SCORECARD.md) 참고.
세션 작업 히스토리 및 이어서 진행하는 방법은 [`WORKLOG.md`](WORKLOG.md) 참고.
