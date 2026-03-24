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

### 작업 기록
- `work-logs/` 폴더에 작업 단위마다 진행상황 기록
- 파일명: `{마일스톤}-{번호}_{작업명}.md` (예: `M0-001_project-setup.md`)

## Current Phase: M0 (Foundation)
See `docs/M0_KICKOFF.md` for detailed task list and `docs/PRD.md` for full product spec.
