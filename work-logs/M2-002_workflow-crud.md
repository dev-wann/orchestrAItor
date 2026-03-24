# M2-002: 워크플로우 CRUD

- **날짜**: 2026-03-24
- **마일스톤**: M2 (Workflow Editor)
- **브랜치**: feat/m2-workflow-crud
- **상태**: 진행 중

## 작업 내용

### 진행 예정
- [ ] DB 훅: useWorkflows, useCreateWorkflow, useUpdateWorkflow, useDeleteWorkflow
- [ ] 워크플로우 저장: 현재 nodes/edges를 graph JSON으로 직렬화하여 DB 저장
- [ ] 워크플로우 로딩: DB에서 graph JSON 로드 → workflowStore에 반영
- [ ] 워크플로우 목록/선택 UI (TitleBar 또는 Toolbar)
- [ ] 빌드 확인

## 커밋 이력

## 메모
- workflows.graph 컬럼: JSON string {"nodes":[], "edges":[]}
