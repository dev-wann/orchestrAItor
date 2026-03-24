# M0-002: SQLite State Bus

- **날짜**: 2026-03-24
- **마일스톤**: M0 (기반 구축)
- **브랜치**: feat/m0-sqlite
- **PR**: [#2](https://github.com/dev-wann/orchestrAItor/pull/2)
- **상태**: PR 리뷰 중

## 작업 내용

### 완료
- [x] SQLite 마이그레이션 파일 (001_initial.sql) — 4개 테이블 + 시드 데이터
- [x] Rust: include_str! + tauri_plugin_sql::Migration 연결
- [x] Rust: commands/db.rs 플레이스홀더 (M0에서는 JS 측 쿼리 패턴)
- [x] Frontend: src/types/database.ts — 스키마 매칭 타입
- [x] Frontend: src/lib/db.ts — 싱글톤 Database 래퍼
- [x] Frontend: src/hooks/useDatabase.ts — react-query 기반 훅
- [x] `cargo check` + `pnpm build` 빌드 확인
- [x] PR #2 생성

## 설계 결정

- **tauri-plugin-sql v2 패턴**: Rust에서는 마이그레이션만, 쿼리는 JS 측에서 실행
- **서브에이전트 병렬화**: Rust 커맨드 + Frontend 훅을 동시 작성 후 통합

## 커밋 이력
- ed82b6b feat: add SQLite schema migration
- 46f5605 feat: wire SQLite migrations in Rust and add commands module
- 76b714f feat: add database type definitions
- b4b2308 feat: add frontend DB wrapper and query hooks

## 메모
- DB URL: `sqlite:orchestraitor.db` (tauri 앱 데이터 디렉토리에 자동 생성)
- react-query 쿼리 키: `['agents']`, `['app_setting', key]`
