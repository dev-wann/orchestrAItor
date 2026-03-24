# OrchestrAItor — M0 킥오프 프롬프트

## 역할 및 목표

시니어 풀스택 엔지니어로서 Mac-native 멀티에이전트 AI 오케스트레이션 앱을 구축합니다.

**M0: 기반 구축** 단계 목표:
1. Tauri v2 + React + TypeScript 프로젝트 초기화
2. SQLite State Bus 스키마 및 마이그레이션 설정
3. 메뉴바 앱 + Floating 윈도우 기본 구조
4. Zustand 스토어 기본 구조
5. 빌드 및 실행 확인

## 기술 스택 (변경 불가)

- **UI Framework**: Tauri v2 (Rust + WebView)
- **Frontend**: React 18 + TypeScript + Vite
- **상태 관리**: Zustand
- **워크플로우 에디터**: React Flow (M2에서 추가)
- **DB**: SQLite via `tauri-plugin-sql`
- **AI SDK**: `@anthropic-ai/sdk` (M1에서 추가)
- **알림**: `tauri-plugin-notification`
- **Keychain**: `tauri-plugin-stronghold` 또는 `tauri-plugin-keychain`
- **패키지 매니저**: pnpm

## M0 작업 목록

### 1. 프로젝트 초기화
```bash
pnpm create tauri-app orchestraitor --template react-ts --manager pnpm --identifier com.orchestraitor.app
```

### 2. 의존성 추가

**Frontend (pnpm)**
```
zustand, @tanstack/react-query, react-router-dom, lucide-react, clsx, tailwindcss, @tailwindcss/vite
```

**Tauri plugins (Cargo.toml + pnpm)**
```
tauri-plugin-sql (SQLite feature), tauri-plugin-notification, tauri-plugin-single-instance
```

### 3. SQLite State Bus 스키마
`src-tauri/migrations/001_initial.sql` — agents, workflows, agent_logs, app_settings 테이블

### 4. Zustand 스토어
`src/store/` — agentStore.ts, workflowStore.ts, uiStore.ts

### 5. Tauri 윈도우 설정
Main window (1200x800) + Floating window (280x500, transparent, always-on-top) + Tray icon

### 6. 기본 레이아웃 컴포넌트
`src/components/layout/` — AppShell, Sidebar, Canvas, Panel, FloatingWindow, TitleBar

### 7. Tauri Rust 커맨드
`src-tauri/src/commands/` — db.rs (CRUD), window.rs (윈도우 전환)

## 완료 기준

- `pnpm tauri dev` 실행 시 오류 없이 메인 윈도우 표시
- SQLite DB 파일 생성 및 스키마 마이그레이션 정상 동작
- 메뉴바 아이콘 표시 및 클릭 이벤트 동작
- Floating 윈도우 토글 동작
- 3-column 레이아웃 렌더링 (빈 상태 OK)
- Zustand 스토어 초기화 및 SQLite 데이터 로딩 확인

## 파일 구조 (M0 완료 시)

```
orchestraitor/
├── src/
│   ├── components/layout/ (AppShell, Sidebar, Canvas, Panel, FloatingWindow, TitleBar)
│   ├── store/ (agentStore, workflowStore, uiStore)
│   ├── hooks/useDatabase.ts
│   ├── lib/db.ts
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/
│   ├── src/commands/ (db.rs, window.rs)
│   ├── src/lib.rs, main.rs
│   ├── migrations/001_initial.sql
│   └── tauri.conf.json
├── docs/ (PRD.md, M0_KICKOFF.md)
├── work-logs/ (작업 진행상황 기록)
└── package.json
```
