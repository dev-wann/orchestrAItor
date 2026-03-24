# orchestrAItor — PRD v0.2

> **Mac-native Multi-Agent Orchestration Platform**
> Status: Draft · 2026-03-24

## 1. 제품 개요

### 1.1 배경 및 문제 정의

- 단일 Claude 세션은 Coder·Reviewer·Planner 역할을 동시에 잘 수행하지 못한다
- 여러 터미널을 열어 수동으로 에이전트를 관리하면 상태 추적이 어렵고 병목이 생긴다
- 승인(human-in-the-loop)이 필요한 시점을 개발자가 놓치는 경우가 발생한다

### 1.2 기술 스택

| 레이어 | 기술 |
|-------|------|
| UI Framework | Tauri v2 (Rust + WebView) |
| Frontend | React + TypeScript |
| 상태 관리 | Zustand |
| 워크플로우 에디터 | React Flow |
| State Bus | SQLite (via tauri-plugin-sql) |
| AI 연동 | Anthropic TS SDK + 프로바이더별 SDK |
| 알림 | tauri-plugin-notification |
| API Key 저장 | tauri-plugin-stronghold |

### 1.3 SQLite 스키마

**agents**: id, name, provider, model, system_prompt, color, status, current_output, token_count, created_at, updated_at

**workflows**: id, name, graph (React Flow JSON), is_active, created_at, updated_at

**agent_logs**: id, agent_id, level, message, payload, created_at

**app_settings**: key, value, updated_at

### 1.4 에이전트 상태

`idle` → `running` → `completed` | `error` | `approval_required` → (승인) → `running` | `paused`

### 1.5 UI 모드

- **메뉴바 모드**: 메뉴바 아이콘 상주, 클릭 시 팝오버
- **Floating 모드**: always-on-top 투명 윈도우, decorations: false
- 두 모드 동시 활성화 가능

### 1.6 워크플로우 실행 흐름

1. [Run Workflow] 클릭
2. DAG에서 시작 노드 탐색
3. system_prompt + 입력 → 프로바이더 API 전송
4. 스트리밍 응답 → State Bus 실시간 업데이트
5. APPROVAL_REQUIRED 패턴 감지 시 → 알림 + 승인 대기
6. 완료 → 다음 노드에 출력 주입
7. 전체 완료 → completed 상태

### 1.7 지원 프로바이더

| 프로바이더 | 인증 | 모델 예시 |
|-----------|------|---------|
| Anthropic | API Key | claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5 |
| OpenAI | API Key | gpt-4o, gpt-4o-mini, o3 |
| Google | API Key | gemini-2.0-pro, gemini-2.0-flash |
| Ollama | 로컬 엔드포인트 | llama3, mistral |

### 1.8 성능 목표

- 콜드 스타트 < 1.5초
- UI 응답 < 50ms
- 상태 업데이트 반영 < 100ms
- 메모리 < 80MB (유휴)
- 번들 크기 < 30MB

## 2. 마일스톤

### M0: 기반 구축
- Tauri v2 + React + TypeScript 프로젝트 초기화
- SQLite State Bus 스키마 및 마이그레이션 설정
- 메뉴바 앱 + Floating 윈도우 기본 구조
- Zustand 스토어 기본 구조
- 빌드 및 실행 확인

### M1: 프로바이더 및 에이전트 CRUD
- 프로바이더별 API Key 입력 UI + macOS Keychain 저장
- 에이전트 CRUD UI (추가/편집/삭제 패널)
- 프로바이더 모델 목록 자동 fetch

### M2: 워크플로우 에디터
- React Flow 기반 DAG 에디터
- 노드 = 에이전트, 엣지 = 데이터 흐름
- 워크플로우 저장/불러오기

### M3: 실행 엔진
- DAG 기반 실행 엔진
- 스트리밍 응답 처리
- Human-in-the-loop 승인 흐름
- 알림 시스템
