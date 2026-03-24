# OrchestrAItor

Mac-native Multi-Agent AI Orchestration Platform built with Tauri v2 + React + TypeScript.

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

### 코드 작성 → 리뷰 루프
1. **Write**: 코드 작성 (의미 있는 단위에서 서브에이전트 병렬 활용)
2. **Review**: `/review` 로 풀스택 코드 리뷰 (Rust + TypeScript 모두 커버)
3. **Fix**: 리뷰 피드백 반영
4. **Pre-commit**: `/pre-commit` 으로 커밋 전 최종 체크
5. **Commit**: 통과 시 커밋
6. **Log**: `/log` 로 작업 기록 업데이트

### 서브에이전트 활용 원칙
- **병렬화**: 독립적인 파일/모듈 작업만 병렬 실행 (예: 스토어 3개 동시 작성)
- **순차 실행**: 의존성 있는 작업은 순서대로 (예: 코드 → 리뷰)
- **직접 처리**: 설정 파일, 1파일 수정 등 사소한 작업은 메인에서 직접

### 로컬 스킬 (`.claude/commands/`)
- `/review` — Rust + TypeScript 풀스택 코드 리뷰
- `/pre-commit` — 커밋 전 품질 체크
- `/log` — work-logs 작업 기록 생성/업데이트

## Current Phase: M0 (Foundation)
See `docs/M0_KICKOFF.md` for detailed task list and `docs/PRD.md` for full product spec.
