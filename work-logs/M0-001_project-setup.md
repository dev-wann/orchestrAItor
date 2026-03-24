# M0-001: 프로젝트 스캐폴딩

- **날짜**: 2026-03-24
- **마일스톤**: M0 (기반 구축)
- **브랜치**: feat/m0-scaffold
- **상태**: 진행 중

## 작업 내용

### 완료
- [x] Rust 툴체인 설치 (rustc 1.94.0)
- [x] Git 초기화 + 로컬 유저 설정 (dev-wann)
- [x] Tauri v2 + React + TS 프로젝트 스캐폴딩
- [x] docs/PRD.md, docs/M0_KICKOFF.md 저장
- [x] CLAUDE.md — 컨벤션, Git 워크플로우, Dev Flow 정의
- [x] 로컬 스킬 생성 (/review, /pre-commit, /log)

### 진행 예정
- [ ] Frontend 의존성 추가 (zustand, tailwindcss 등)
- [ ] Tauri 플러그인 추가 (sql, notification, single-instance)
- [ ] Tailwind CSS v4 설정
- [ ] 빌드 확인 (`pnpm tauri dev`)

## 커밋 이력
- 6578662 chore: scaffold Tauri v2 + React + TypeScript project
- 860915d docs: add PRD, kickoff prompt, and project docs
- e7d3e98 chore: add local skills and development flow
- 70d72a8 docs: clarify work-logs process in CLAUDE.md

## 메모
- pnpm 10.28.2, Node.js v20.11.0, Rust 1.94.0
- React 19로 스캐폴딩됨 (템플릿 기본값)
