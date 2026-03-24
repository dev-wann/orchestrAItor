# M0-001: 프로젝트 스캐폴딩

- **날짜**: 2026-03-24
- **마일스톤**: M0 (기반 구축)
- **브랜치**: feat/m0-scaffold
- **PR**: [#1](https://github.com/dev-wann/orchestrAItor/pull/1)
- **상태**: 완료

## 작업 내용

### 완료
- [x] Rust 툴체인 설치 (rustc 1.94.0)
- [x] Git 초기화 + 로컬 유저 설정 (dev-wann)
- [x] Tauri v2 + React + TS 프로젝트 스캐폴딩
- [x] docs/PRD.md, docs/M0_KICKOFF.md 저장
- [x] CLAUDE.md — 컨벤션, Git 워크플로우, Dev Flow 정의
- [x] 로컬 스킬 생성 (/review, /pre-commit, /log, /write-pr)
- [x] Frontend 의존성 추가 (zustand, react-query, react-router-dom, lucide-react, clsx)
- [x] Tauri 플러그인 추가 (sql/sqlite, notification, single-instance)
- [x] Tailwind CSS v4 설정
- [x] 보일러플레이트 정리, orchestrAItor 네이밍 통일
- [x] `pnpm build` + `cargo check` 빌드 확인
- [x] PR #1 생성
- [x] PR #1 리뷰 피드백 반영 (플러그인 등록 + capabilities permissions)

## 리뷰 피드백 (PR #1)

| 심각도 | 이슈 | 조치 |
|--------|------|------|
| Critical | 플러그인 `.plugin()` 등록 누락 | **수정 완료** (ab6c46d) |
| Critical | capabilities permissions 누락 | **수정 완료** (ab6c46d) |
| Critical | CSP null 비활성화 | 후순위 — toy project, M1+ 에서 필요 시 설정 |
| Warning | README 템플릿 기본값 | 후순위 — 기능 완성 후 작성 |
| Warning | `.expect()` 패닉 가능성 | 수용 — Tauri 공식 패턴, 앱 초기화 실패 시 패닉이 적절 |

## 커밋 이력
- 6578662 chore: scaffold Tauri v2 + React + TypeScript project
- 860915d docs: add PRD, kickoff prompt, and project docs
- e7d3e98 chore: add local skills and development flow
- 70d72a8 docs: clarify work-logs process in CLAUDE.md
- 4d1c8ff docs: add session checklist, git identity, and PR plan
- b3e1e8e chore: add frontend dependencies
- 8930124 chore: add Tailwind CSS v4
- 2b2f499 chore: add Tauri plugins and fix package names
- f728488 chore: fix productName to OrchestrAItor
- b90e1de chore: rename to orchestrAItor and clean up boilerplate
- e13eec7 chore: add /write-pr local skill
- 9075e13 docs: add /write-pr to dev flow and skills list
- 92cc8ce docs: update PR plan and work-logs for PR #1
- ab6c46d fix: register Tauri plugins and add capabilities permissions

## 메모
- pnpm 10.28.2, Node.js v20.11.0, Rust 1.94.0
- React 19로 스캐폴딩됨 (템플릿 기본값)
- SSH: `github-swcho8220` 호스트 별칭 사용 (id_ed25519_swcho8220)
- gh CLI: dev-wann 계정으로 로그인
