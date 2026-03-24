현재 브랜치의 변경사항을 분석하여 GitHub PR을 작성하고 생성합니다.

## 인자 파싱

`$ARGUMENTS`로 base 브랜치를 받을 수 있습니다 (기본값: `main`).

예시:
- `/write-pr` → base: main
- `/write-pr develop` → base: develop

## 분석 절차

1. `git log <base>..HEAD --oneline`로 커밋 목록 확인
2. `git diff <base>...HEAD --stat`로 변경 파일 요약
3. `git diff <base>...HEAD`로 전체 변경사항 확인
4. 변경된 파일의 컨텍스트를 파악하여 PR 제목과 본문 작성

## PR 본문 템플릿

```markdown
## Summary
<!-- 이 PR의 목적과 배경을 1-3줄로 설명 -->

## Changes
<!-- 변경사항을 의미 단위로 그룹화 -->

### 1. 주요 변경사항 제목
- 세부 내용

### Changed files
| 파일 | 변경 내용 |
|------|----------|
| `경로` | 설명 |

## Test plan
- [ ] 테스트 항목

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## 작성 지침

- **why**를 먼저 설명, how는 코드가 말해줌
- 커밋 메시지를 단순 나열하지 말고, 리뷰어 관점에서 의미있게 그룹화
- PR 제목: 70자 이내, Conventional Commits (`feat:`, `fix:`, `chore:` 등)
- work-logs에 해당 PR 로그가 있으면 참고하여 작성

## 실행 흐름

### Step 1: PR 내용 출력

- `## PR 제목` 헤더 아래에 코드블록으로 제목 출력
- `## PR 본문` 헤더 아래에 마크다운 코드블록으로 본문 출력

### Step 2: 사용자 확인

"위 내용으로 PR 생성할까요? 수정할 부분이 있으면 알려주세요."

### Step 3: 승인 시 실행

1. 리모트에 push 여부 확인
2. push 안 되어 있으면 `git push -u origin <현재브랜치>`
3. `gh pr create --title "<제목>" --body "<본문>" --base <base>`
4. 생성된 PR URL 출력
5. CLAUDE.md의 PR Plan 테이블 상태 업데이트
6. `/log`로 work-logs 업데이트

수정 요청 시 반영 후 다시 확인 요청.
