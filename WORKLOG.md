# WORKLOG — SONCODING 홈페이지 작업 기록

이 문서는 Claude Code 세션에서 진행한 작업 히스토리와, **다른 컴퓨터에서 이어서 작업하는 방법**을 정리합니다.

---

## 1. 프로젝트 개요

- IT 교육 + 개발 외주 회사 홈페이지. 한/영 이중언어, Next.js 정적 export, GitHub Pages 배포.
- 라이브: https://all-my-projects-2026.github.io/SONCODING/
- 저장소: `ALL-MY-PROJECTS-2026/SONCODING` (public), 기본 브랜치 `main`, 작업 브랜치 `claude/modest-morse-a4bd2d`.

## 2. 사용자 요청(명령) 타임라인

1. **초기 요청** — "IT 과목 교육 및 프로그램 개발 외주용 회사 홈페이지 개발 제안/제작."
2. 방향 결정 — 콘텐츠는 **코드로 관리**, 수강/결제는 **문의 폼**, **깔끔한 기술기업** 톤, **한/영** 이중언어.
3. **배포** — GitHub Pages 가능한지 확인 → 저장소 **public 전환** 후 GitHub Actions로 Pages 배포. 문의 폼은 **Formspree**(정적 호스팅 호환).
4. **디자인 개선 루프 시작** — "최신 UI/UX 2026 트렌드로 계속 개선, 매 회차 커밋·푸시·Pages 배포, 그만할 때까지." → `/loop` 연속모드(중간 대기 없이).
5. **로고 반복** — 너무 심플 → `</>` 코드브래킷 → 손(hand) 아이콘 → **한글 '손' 모노그램** → **`>_` 터미널 마크 + 타이핑 워드마크**(한글=손코딩/영문=SONCODING) → 폰트 **JetBrains Mono** → 타이핑 **천천히(200ms/글자)**.
6. **히어로 배경** — CSS 오로라 → **three.js 파티클 필드(마우스 패럴랙스)**. "점 잇는 네트워크" 효과는 시도 후 **사용자가 거부 → 되돌림**(재도입 금지).
7. **콘텐츠** — IT 과목 7종(네트워크 시스템 등), 포트폴리오 7종, 교육 강점 섹션, 문의 FAQ, 기술스택, 후기, 관련 과정 등 추가.
8. **체크포인트** — (현재) 작업 내용 md 저장 + 커밋/푸시, 다른 컴에서 이어작업 예정.

> 회차별 상세 개선 이력·점수는 [`DESIGN_SCORECARD.md`](DESIGN_SCORECARD.md)에 누적 기록되어 있습니다(회차 1~21+).

## 3. 고정된 결정/제약 (계속 유지할 것)

- 히어로 배너에 **"점 잇는 네트워크/선 연결(three.js LineSegments)" 효과 재도입 금지**. 히어로는 파티클 필드(마우스 패럴랙스) 유지.
- 로고는 **`>_` 터미널 마크 + 타이핑 워드마크**(JetBrains Mono, 200ms/글자). 언어별 **한글=손코딩 / 영문=SONCODING**. 로고·폰트·타이핑속도·파비콘은 사용자가 다시 요청할 때만 변경.
- 접근성(reduced-motion·포커스 링·aria) 존중, 정적 export 호환 유지.

## 4. 다른 컴퓨터에서 이어받기

```bash
git clone https://github.com/ALL-MY-PROJECTS-2026/SONCODING.git
cd SONCODING
git checkout main          # 최신 배포 상태
npm install
npm run dev                # http://localhost:3000
```

- 배포는 `main`에 push하면 자동(§배포). git push 자격증명(토큰)은 새 컴에서 별도 설정 필요.
- 디자인 개선 루프를 이어가려면 Claude Code에서 아래 프롬프트로 `/loop` 재개(프리뷰 serverId는 새로 시작해야 하므로 프롬프트의 serverId 부분은 무시/갱신).

## 5. 디자인 루프 재개용 프롬프트 (`/loop`에 붙여넣기)

```
[디자인 개선 루프 · 연속모드] SONCODING 회사 홈페이지(Next.js 정적 export, GitHub Pages, repo ALL-MY-PROJECTS-2026/SONCODING, 라이브 https://all-my-projects-2026.github.io/SONCODING/)를 최신 UI/UX 2026 트렌드로 한 회차 더 개선·배포한다. DESIGN_SCORECARD.md가 기준·기록.

제약: 히어로에 "점 잇는 네트워크/선 연결(three.js LineSegments)" 재도입 금지(파티클 필드 유지). 로고는 ">_ 터미널 마크 + 타이핑 워드마크(JetBrains Mono, 200ms/글자)", 한글=손코딩/영문=SONCODING(사용자 요청 시에만 변경). 매 회차 모든 페이지(ko·en 13개) 점검.

절차: (1) DESIGN_SCORECARD.md 점수·항목 갱신 (2) 아직 안 다룬 영역 1개 깔끔·접근성 개선(다크모드/About 시각화/신뢰배지 등) (3) npm run build + 프리뷰 검증 (4) 커밋 후 git push origin HEAD 및 HEAD:main (5) 배포 확인 (6) 라이브·전 페이지 curl 확인. 한국어로 짧게 보고.
```

## 6. 남은 작업(TODO)

- Formspree 엔드포인트 실제 값 교체 (`src/config/site.ts`).
- 회사 실제 정보(이름·연락처·주소)·통계·후기·포트폴리오 실제 내용 교체.
- (선택) 다크모드, About 팀/연혁 시각화 등 — 루프에서 이어서 진행 가능.
