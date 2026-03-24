# orchestrAItor

Mac-native Multi-Agent AI Orchestration Platform built with Tauri v2 + React + TypeScript.

## Session Start Checklist

새 세션 시작 시 반드시 아래 순서로 상태를 파악한다:

1. `git config user.name && git config user.email` — Git identity 확인 (없으면 로컬 설정)
2. `git branch && git log --oneline -5` — 현재 브랜치와 최근 커밋 확인
3. `work-logs/` 최신 파일 읽기 — 마지막 작업 상태, 남은 TODO 파악
4. 아래 PR Plan 테이블에서 현재 진행 중인 PR 확인
5. 미완료 작업부터 이어서 진행

## Git Identity (local)

이 프로젝트에서 사용하는 Git 계정:
- **name**: dev-wann
- **email**: swcho8220@gmail.com

세션 시작 시 `git config user.email`이 위와 다르면 로컬 설정할 것.

## Tech Stack
- **Runtime**: Tauri v2 (Rust backend + WebView frontend)
- **Frontend**: React 18 + TypeScript + Vite
- **State**: Zustand
- **DB**: SQLite via tauri-plugin-sql
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4

## Project Structure
- `src/` — React frontend
- `src-tauri/` — Rust backend (Tauri)
- `docs/` — PRD and milestone docs

## Conventions
- No `any` types — all Tauri IPC interfaces must be typed
- Tauri commands return `Result<T, String>`
- Frontend must catch all IPC errors
- Rust comments only for complex logic; React components should be self-documenting

## Git Workflow

### Commits
- **매우 작은 논리 단위**로 커밋. "이 커밋이 뭘 했는지" 한 문장으로 설명 가능해야 함.
- 예: "파일 3개 생성 + 설정 변경 + 의존성 추가"는 너무 큼 → 쪼개기
- Conventional Commits 사용: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- 작업 진행 중 중간 커밋도 자유롭게 (squash하지 않음)

### Branches & PRs
- 브랜치: `feat/<기능>`, `fix/<이슈>`, `chore/<작업>` 형식
- PR은 **사람이 리뷰할 수 있는 기능 단위**로 분리. 하나의 마일스톤을 여러 PR로 쪼갬.
- PR 본문에 변경사항 요약 + 테스트 계획 포함
- `main` ← feature branch 머지

### 작업 기록 (`work-logs/`)

작업 기록은 PR 단위로 1개 파일을 생성하고, 작업 진행에 따라 업데이트한다.

**파일명**: `{마일스톤}-{번호}_{작업명}.md` (예: `M0-001_project-scaffold.md`)

**기록 시점**:
- PR 작업 시작 시 → 새 로그 파일 생성 (목표, 예정 작업 목록)
- 의미 있는 커밋마다 → 체크리스트 업데이트, 커밋 이력 추가
- PR 완료 시 → 상태를 "완료"로, 최종 메모 정리

**기록 방법**: `/log` 스킬 실행, 또는 수동 편집

**번호 규칙**: 마일스톤 내 순번. `M0-001`, `M0-002`, ... PR과 1:1 대응.

## Development Flow

### 코드 작성 루프 (커밋 단위)
1. **Write**: 코드 작성 (의미 있는 단위에서 서브에이전트 병렬 활용)
2. **Review**: `/review` 로 풀스택 코드 리뷰 (Rust + TypeScript 모두 커버)
3. **Fix**: 리뷰 피드백 반영
4. **Pre-commit**: `/pre-commit` 으로 커밋 전 최종 체크
5. **Commit**: 통과 시 커밋
6. **Log**: `/log` 로 작업 기록 업데이트

### PR 루프 (PR 단위)
1. **Create**: PR 범위 작업 완료 시 `/write-pr` 로 PR 생성
2. **PR Review**: 서브에이전트로 리뷰어 실행 → PR에 인라인 코멘트 + 전체 리뷰 작성
3. **Fix**: Critical/Warning 이슈 수정, 커밋 & push
4. **Reply**: 각 리뷰 코멘트에 답글 (수정 완료 / 수용 / 후순위 사유)
5. **Log**: work-logs에 리뷰 피드백 테이블 기록
6. **Merge**: 사용자 승인 후 머지, PR Plan 상태 업데이트

### 서브에이전트 활용 원칙
- **병렬 코딩**: 독립적인 파일/모듈 작업만 병렬 실행 (예: 스토어 3개 동시 작성)
- **PR 리뷰어**: PR 생성 후 서브에이전트로 리뷰 실행. diff 분석 → PR에 직접 코멘트 작성
- **순차 실행**: 의존성 있는 작업은 순서대로 (예: 코드 → 리뷰)
- **직접 처리**: 설정 파일, 1파일 수정 등 사소한 작업은 메인에서 직접

### 로컬 스킬 (`.claude/commands/`)
- `/review` — Rust + TypeScript 풀스택 코드 리뷰
- `/pre-commit` — 커밋 전 품질 체크
- `/log` — work-logs 작업 기록 생성/업데이트
- `/write-pr` — PR 분석, 작성, push, 생성까지 일괄 수행

## Current Phase: M3 (Execution Engine)

See `docs/PRD.md` for full product spec.

### Prerequisites
- Rust toolchain (rustup + cargo)
- Node.js >= 20
- pnpm

### PR Plan

**M0 (Foundation)** — all merged

| PR | 브랜치 | 범위 | 상태 |
|----|--------|------|------|
| PR1 | `feat/m0-scaffold` | 프로젝트 초기화 + 의존성 + Tailwind 설정 | merged |
| PR2 | `feat/m0-sqlite` | SQLite 스키마 마이그레이션 + Rust DB CRUD 커맨드 + 프론트 DB 훅 | merged |
| PR3 | `feat/m0-window` | 트레이 + Floating 윈도우 + 윈도우 전환 커맨드 | merged |
| PR4 | `feat/m0-ui` | Zustand 스토어 + 레이아웃 컴포넌트 + 앱 연결 | merged |

**M1 (Provider & Agent CRUD)** — all merged

| PR | 브랜치 | 범위 | 상태 |
|----|--------|------|------|
| PR5 | `feat/m1-provider-keys` | Rust keyring 크레이트 + API Key CRUD 커맨드 + 프로바이더 설정 UI | merged |
| PR6 | `feat/m1-agent-crud` | 에이전트 추가/편집/삭제 UI + DB 연동 | merged |
| PR7 | `feat/m1-model-fetch` | 프로바이더별 모델 목록 fetch + 모델 선택 UI | merged |

**M2 (Workflow Editor)** — all merged

| PR | 브랜치 | 범위 | 상태 |
|----|--------|------|------|
| PR8 | `feat/m2-react-flow` | React Flow 설치 + DAG 에디터 + 에이전트 노드 컴포넌트 | merged |
| PR9 | `feat/m2-workflow-crud` | 워크플로우 CRUD (DB 저장/로딩) + 목록/선택 UI | merged |

**M3 (Execution Engine)**

| PR | 브랜치 | 범위 | 상태 |
|----|--------|------|------|
| PR10 | `feat/m3-agent-run` | Anthropic SDK + 단일 에이전트 스트리밍 실행 + 실시간 UI | merged |
| PR11 | `feat/m3-dag-engine` | DAG 실행 엔진 (토폴로지 정렬, 순차/병렬, 출력 체이닝) | 대기 |
| PR12 | `feat/m3-approval` | Human-in-the-loop 승인 흐름 + macOS 알림 | 대기 |
