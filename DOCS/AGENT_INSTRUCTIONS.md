# AI 에이전트 작업 지침 (AGENT_INSTRUCTIONS.md)

이 문서는 AI 에이전트(Antigravity)가 이 프로젝트에서 작업을 수행할 때 반드시 준수해야 하는 지침을 정의합니다.

## 1. 지침 자동 참조 규칙
- **최우선 워크플로우:** 작업을 시작할 때 항상 [pre-flight-check](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/pre-flight-check.md) 워크플로우를 실행합니다.
- **DOCS 최우선 참조:** `DOCS/` 디렉토리 내의 모든 `.md` 파일들을 먼저 읽고(`view_file` 등 활용), 해당 내용에 맞춰 계획(Planning) 및 실행(Execution)을 진행합니다.
- **일관성 유지:** `CODE_CONVENTIONS.md`, `ALGORITHM_SPEC.md`, `GIT_CONVENTIONS.md`에 명시된 규칙을 절대적으로 준수합니다.

## 2. 작업 프로세스
1. **분석:** `DOCS/` 내용을 바탕으로 요청 사항을 분석합니다.
2. **계획:** `implementation_plan.md`를 작성하여 사용자 승인을 받습니다.
3. **실행:** 승인된 계획에 따라 코드를 작성하며, 작업 단위마다 가이드라인에 맞춰 커밋 및 푸시를 수행합니다.
4. **검증:** 작업 완료 후 `walkthrough.md`를 통해 결과를 보고합니다.

## 3. 핵심 체크리스트
- [ ] 모든 주석이 한국어로 작성되었는가?
- [ ] TypeScript 타입이 명확히 정의되었는가?
- [ ] 알고리즘이 `ALGORITHM_SPEC.md`의 수식을 따르는가?
- [ ] 커밋 메시지가 `태그: 요약`(한국어) 형식을 따르는가?
