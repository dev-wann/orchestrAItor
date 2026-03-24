커밋 전에 변경사항의 품질을 빠르게 검증합니다.

## 체크 절차

1. `git diff --cached`로 스테이징된 변경사항 확인 (없으면 `git diff`)
2. 변경된 파일을 읽고 아래 항목 체크

## 체크리스트

### Must Pass (하나라도 실패 시 커밋 차단 권고)
- [ ] `any` 타입 사용 없음
- [ ] 하드코딩된 시크릿/API 키 없음
- [ ] Tauri 커맨드에 Result 반환 타입 있음
- [ ] SQL 쿼리에 파라미터 바인딩 사용
- [ ] unwrap() 사용 시 명확한 사유 있음

### Should Pass (경고만)
- [ ] 미사용 import 없음
- [ ] console.log / println! 디버그 코드 없음
- [ ] CLAUDE.md 컨벤션 준수

## 출력 형식

```
## Pre-commit Check
- [PASS|FAIL] 항목명: 설명
...

## Result: [OK to commit | Fix before commit]
```

FAIL 항목이 있으면 수정 방법을 간단히 안내합니다.
