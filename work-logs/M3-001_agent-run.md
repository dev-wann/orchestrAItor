# M3-001: 단일 에이전트 스트리밍 실행

- **날짜**: 2026-03-24
- **마일스톤**: M3 (Execution Engine)
- **브랜치**: feat/m3-agent-run
- **상태**: 진행 중

## 작업 내용

### 진행 예정
- [ ] @anthropic-ai/sdk 설치
- [ ] 에이전트 실행 서비스 (src/lib/agentRunner.ts)
- [ ] 스트리밍 응답 → agentStore 실시간 업데이트
- [ ] agent_logs DB 기록
- [ ] AgentNode 실시간 상태 반영 (running, output)
- [ ] 캔버스 Run 버튼 (단일 노드 실행)
- [ ] 빌드 확인

## 커밋 이력

## 메모
- M3-001은 Anthropic만 지원. 다른 프로바이더는 M3-002+ 에서
- 스트리밍: SDK의 stream() 메서드 사용
- 상태 흐름: idle → running → completed/error
