# NEXT STEPS — 다음 작업

SONCODING 홈페이지 이어서 진행할 내용. 완료 내역은 [`WORKLOG.md`](WORKLOG.md), 회차별 상세는 [`DESIGN_SCORECARD.md`](DESIGN_SCORECARD.md).

## A. 실제 데이터 교체 (배포 전 필수)

1. **Formspree 엔드포인트** — `src/config/site.ts`의 `formspreeEndpoint`가 `your_form_id` **플레이스홀더**.
   [formspree.io](https://formspree.io) 가입 → 폼 생성 → 엔드포인트(`https://formspree.io/f/xxxx`)로 교체해야 문의 폼이 실제로 전송됨.
2. **회사 실제 정보** — `src/config/site.ts`의 이름·이메일·전화·주소가 예시값 → 실제로 교체.
3. **콘텐츠** — `src/lib/content.ts`의 통계 수치·후기·포트폴리오, 각 과목 상세가 예시 → 실제 내용으로.
4. (선택) OG 이미지(`app/opengraph-image.png`) 실제 이미지 추가 — 현재 텍스트 메타만 있음.

## B. 후보 디자인 개선 (다음 루프 회차)

- **다크모드 토글** — 큰 작업(전 컴포넌트 `dark:` 변형 필요). 별도 회차로 신중히. `next-themes` 없이 CSS 변수/class 전략 권장.
- 홈 **신뢰 배지/파트너 로고** 스트립.
- 교육 **과정 비교표**(기간·난이도·대상 한눈에).
- **breadcrumb**(과정 상세 등).
- 문의 **성공 후 UX** 개선(애니메이션·다시 문의).
- 이미지/에셋 최적화, 성능(Lighthouse) 점검.

## C. 다른 컴퓨터에서 이어받기

```bash
git clone https://github.com/ALL-MY-PROJECTS-2026/SONCODING.git
cd SONCODING
git checkout main
npm install
npm run dev            # http://localhost:3000
```

- 배포는 `main` push 시 자동(GitHub Actions). **새 컴에서 git push 자격증명(토큰) 설정 필요.**
  ```bash
  git push origin HEAD:main   # 배포 트리거
  ```
- 프리뷰 serverId는 머신마다 다르므로, 아래 재개 프롬프트의 serverId는 새로 시작한 값으로 대체/무시.

## D. 디자인 루프 재개용 프롬프트 (`/loop` 에 붙여넣기)

```
[디자인 개선 루프 · 연속모드] SONCODING 회사 홈페이지(Next.js 정적 export, GitHub Pages, repo ALL-MY-PROJECTS-2026/SONCODING, 라이브 https://all-my-projects-2026.github.io/SONCODING/)를 최신 UI/UX 2026 트렌드로 한 회차 더 개선·배포한다. DESIGN_SCORECARD.md가 기준·기록.

제약: 히어로에 "점 잇는 네트워크/선 연결(three.js LineSegments)" 재도입 금지(파티클 필드 유지). 로고는 ">_ 터미널 마크 + 타이핑 워드마크(JetBrains Mono, 200ms/글자)", 한글=손코딩/영문=SONCODING(사용자 요청 시에만 변경). 매 회차 모든 페이지(ko·en 13개) 점검. 완료: WORKLOG.md 회차 1~22 참고.

절차: (1) DESIGN_SCORECARD.md 점수·항목 갱신 (2) 아직 안 다룬 영역 1개 깔끔·접근성 개선(위 B 후보 참고) (3) npm run build + 프리뷰 검증 (4) 커밋 후 git push origin HEAD 및 HEAD:main (5) 배포 확인 (gh run watch) (6) 라이브·전 페이지 curl 확인. 한국어로 짧게 보고.
```
