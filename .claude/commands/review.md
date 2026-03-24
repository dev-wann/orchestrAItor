현재 브랜치의 변경사항을 풀스택 시니어 엔지니어 관점에서 코드 리뷰합니다.

## 리뷰 절차

1. `git diff HEAD` 또는 `git diff main...HEAD`로 변경사항 확인
2. 변경된 파일을 모두 읽고 아래 관점에서 리뷰

## 리뷰 관점

### TypeScript / React
- 타입 안전성: `any` 사용 여부, 타입 누락
- 컴포넌트 구조: 책임 분리, props 설계
- 상태 관리: Zustand 스토어 사용 패턴
- 에러 처리: Tauri IPC 호출의 catch 여부
- 성능: 불필요한 리렌더링, 메모이제이션 필요 여부

### Rust / Tauri
- 메모리 안전성: 소유권, 라이프타임 이슈
- 에러 처리: `Result<T, String>` 반환, unwrap 남용
- Tauri 커맨드: State 접근 패턴, 비동기 처리
- SQL 쿼리: 인젝션 방지, 파라미터 바인딩

### 공통
- CLAUDE.md 컨벤션 준수 여부
- 보안: 하드코딩된 시크릿, XSS, 인젝션
- 불필요한 코드: 미사용 import, dead code
- 네이밍: 일관성, 명확성

## 출력 형식

```
## Review Summary
[전체 요약 1-2줄]

## Issues
### Critical (반드시 수정)
- [파일:라인] 설명

### Warning (권장 수정)
- [파일:라인] 설명

### Nit (사소한 개선)
- [파일:라인] 설명

## Verdict
[ APPROVE | REQUEST_CHANGES | COMMENT ]
```

이슈가 있으면 수정 코드도 함께 제안합니다.
