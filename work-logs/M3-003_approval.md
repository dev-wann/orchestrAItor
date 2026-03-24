# M3-003: Human-in-the-loop 승인 + 알림

- **날짜**: 2026-03-25
- **마일스톤**: M3 (Execution Engine)
- **브랜치**: feat/m3-approval
- **상태**: 진행 중

## 작업 내용

### 진행 예정
- [ ] 승인 감지: 출력에서 APPROVAL_REQUIRED 패턴 감지
- [ ] agentStore에 approval 상태 관리
- [ ] 승인 UI (ApprovalBanner 컴포넌트)
- [ ] macOS 알림 (tauri-plugin-notification)
- [ ] DAG 엔진에 승인 대기 로직 통합
- [ ] 빌드 확인

## 커밋 이력

## 메모
- 상태 흐름: running → approval_required → (승인) → running → completed
- 알림: macOS 네이티브 알림으로 사용자 어텐션 요청
