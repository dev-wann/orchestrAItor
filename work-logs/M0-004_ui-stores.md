# M0-004: Zustand 스토어 + 레이아웃 컴포넌트

- **날짜**: 2026-03-24
- **마일스톤**: M0 (기반 구축)
- **브랜치**: feat/m0-ui
- **PR**: [#4](https://github.com/dev-wann/orchestrAItor/pull/4)
- **상태**: PR 리뷰 중

## 작업 내용

### 완료
- [x] Zustand 스토어 3개 (agentStore, workflowStore, uiStore)
- [x] 레이아웃 컴포넌트 6개 (AppShell, Sidebar, Canvas, Panel, FloatingWindow, TitleBar)
- [x] App.tsx: QueryClientProvider + 윈도우 분기 렌더링
- [x] `pnpm build` 빌드 확인
- [x] PR #4 생성

## 설계 결정
- 윈도우 분기: `getCurrentWebviewWindow().label`로 main/floating 판별
- 서브에이전트 병렬화: 스토어 3개 + 컴포넌트 6개 동시 작성

## 커밋 이력
- ac395c9 feat: add Zustand stores
- 931f81f feat: add layout components
- d565813 feat: wire App with QueryClient and window-based routing

## 메모
- AppShell: uiStore의 sidebarOpen/panelOpen으로 조건부 렌더링
- FloatingWindow: 반투명 배경(neutral-900/90), 드래그 가능
