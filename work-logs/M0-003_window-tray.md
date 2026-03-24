# M0-003: 트레이 + Floating 윈도우

- **날짜**: 2026-03-24
- **마일스톤**: M0 (기반 구축)
- **브랜치**: feat/m0-window
- **PR**: [#3](https://github.com/dev-wann/orchestrAItor/pull/3)
- **상태**: PR 리뷰 중

## 작업 내용

### 완료
- [x] tauri.conf.json: main(1200x800, hidden) + floating(280x500, transparent, aot)
- [x] 트레이 아이콘 설정 (iconAsTemplate)
- [x] Rust: commands/window.rs (toggle_floating, show_main)
- [x] Rust: lib.rs setup — 트레이 메뉴 + 이벤트 핸들링
- [x] Cargo.toml: tray-icon feature 활성화
- [x] capabilities: floating 윈도우 권한 추가
- [x] `cargo check` 빌드 확인
- [x] PR #3 생성

## 커밋 이력
- 3073375 feat: configure main + floating windows and tray icon
- 7dc3a3c feat: add window toggle commands
- 77d49f3 feat: add tray icon with menu and window event handling

## 메모
- tray.png은 32x32 placeholder (기존 아이콘 복사)
- main 윈도우는 시작 시 hidden → 트레이 클릭으로 show
- floating 윈도우: decorations=false, transparent=true, alwaysOnTop=true
