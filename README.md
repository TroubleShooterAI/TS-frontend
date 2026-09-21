# TroubleShooter AI - Dashboard Frontend

운영 중인 백엔드 서비스에서 발생하는 예외(Exception) 및 스택 트레이스(Stack Trace)를 실시간으로 집계하고, **Gemini AI**를 통해 원인 분석 및 해결 가이드를 제공하는 모니터링 대시보드입니다.

---

## 🌟 주요 기능

* **실시간 로그 모니터링:** 수집된 에러 발생 현황(전체, 미해결, 해결 완료) 지표 한눈에 확인
* **Gemini AI 원인 분석:** 예외 스택 트레이스 바탕의 원인 파악 및 해결 가이드 자동 제시
* **다크 / 라이트 테마 지원:** 사용자 취향 및 환경에 맞춘 완벽한 테마 스위칭 (`useDarkMode` 구현)
* **완벽한 반응형 Layout:** 모바일, 태블릿, 데스크톱 화면 크기에 맞춘 유연한 레이아웃 제공
* **TroubleShooter SDK 연동 모달:** 단일 파일 SDK(`troubleshooter.py`) 및 프레임워크별 적용 코드 복사 기능 지원

---

## 🛠️ 기술 스택

* **Core:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS v4, Lucide React (Icons)
* **State & Routing:** React Router v6

---

## 📁 프로젝트 구조

```text
src/
├── api/              # 백엔드 REST API 연동 모듈 (errors.ts, auth.ts)
├── components/       # 공통 UI 컴포넌트 (OnboardingModal.tsx 등)
├── hooks/            # 커스텀 훅 (useDarkMode.ts)
├── pages/            # 주요 페이지 컴포넌트 (DashboardPage.tsx, LoginPage.tsx 등)
├── index.css         # Tailwind v4 및 테마 전역 CSS 설정
└── App.tsx           # 라우팅 및 루트 레이아웃 설정