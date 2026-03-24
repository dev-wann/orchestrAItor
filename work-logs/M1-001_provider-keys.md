# M1-001: 프로바이더 API Key 관리

- **날짜**: 2026-03-24
- **마일스톤**: M1 (Provider & Agent CRUD)
- **브랜치**: feat/m1-provider-keys
- **상태**: 진행 중

## 작업 내용

### 진행 예정
- [ ] Cargo: keyring 크레이트 추가
- [ ] Rust: commands/keyring.rs (set_api_key, get_api_key, delete_api_key, has_api_key)
- [ ] Frontend: 프로바이더 설정 UI (API Key 입력/저장/삭제)
- [ ] Frontend: useApiKey 훅
- [ ] 빌드 확인

## 커밋 이력

## 메모
- keyring 크레이트: macOS Keychain, Windows Credential Store, Linux Secret Service 지원
- 서비스명: "com.orchestraitor.app"
- 키 이름: "api_key_{provider}" (e.g., "api_key_anthropic")
