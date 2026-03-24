# M1-003: 프로바이더별 모델 목록 fetch

- **날짜**: 2026-03-24
- **마일스톤**: M1 (Provider & Agent CRUD)
- **브랜치**: feat/m1-model-fetch
- **상태**: 진행 중

## 작업 내용

### 진행 예정
- [ ] Cargo: reqwest 크레이트 추가 (HTTP client)
- [ ] Rust: commands/models.rs (fetch_models 커맨드)
- [ ] Frontend: useModels 훅
- [ ] AgentForm model 필드를 select/combobox로 교체
- [ ] 빌드 확인

## 커밋 이력

## 메모
- Anthropic: 모델 목록 API 없음 → 하드코딩
- OpenAI: GET /v1/models (API Key 필요)
- Google: 하드코딩 또는 API
- Ollama: GET /api/tags (로컬, Key 불필요)
