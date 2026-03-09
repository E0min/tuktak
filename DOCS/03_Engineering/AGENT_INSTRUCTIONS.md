# AI 에이전트 작업 지침 (AGENT_INSTRUCTIONS.md)

이 문서는 AI 에이전트(Antigravity)가 이 프로젝트에서 작업을 수행할 때 반드시 준수해야 하는 지침을 정의합니다.

## 1. 지침 자동 참조 및 준수 규칙
- **최우선 워크플로우:** 작업을 시작할 때 항상 [pre-flight-check](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/pre-flight-check.md) 워크플로우를 실행합니다.
- **DOCS 엄격 준수:** `DOCS/` 내의 모든 지침은 절대적인 기준입니다. 임의로 변경하여 개발할 수 없습니다.
- **Living Docs (살아있는 문서):** 개발 중 `DOCS` 내용의 수정이 필요하거나 지침에서 벗어나야 할 경우, 반드시 사용자에게 **설명하고 허락**을 받은 뒤 문서를 먼저 수정하고 코드를 작성합니다.
- **등록된 워크플로우 준수:** 아래 정의된 전용 워크플로우들을 작업 단계마다 반드시 호출하여 실행합니다.

## 2. 작업 프로세스
1. **분석 및 사전 점검:** [/pre-flight-check](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/pre-flight-check.md)를 통해 지침을 로드하고 준수 여부를 확인합니다.
2. **지침 동기화:** 코드 변경 시 [/docs-adherence](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/docs-adherence.md), [/doc-sync](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/doc-sync.md), [/system-arch-sync](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/system-arch-sync.md), [/handover-sync](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/handover-sync.md), [/workflow-sync](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/workflow-sync.md) 워크플로우를 실행하여 문서와 실행 지침을 모두 최신화합니다. 특히 시스템 구조 변화 시 `05_System_Architecture` 업데이트는 필수입니다.
3. **계획 (Planning Mode):** 
    - 사용자가 "구현해줘"라고 하기 전까지는 항상 계획 모드입니다.
    - 모든 작업은 `plan.md`에 `N.N.N.N` (4단계) 수준으로 세분화하며, 모든 단계에 체크박스(`- [ ]`)를 포함합니다.
    - 사용자 승인 후 구현을 시작합니다.
4. **실행 및 커밋:** 
    - 승인된 계획에 따라 `N.N.N` 단위로 커밋을 수행하며 코드를 작성합니다.
    - 작업 완료 시 `plan.md`의 체크박스를 즉시 업데이트(`[x]`)합니다.
    - 모든 주석은 한국어로 작성하며 커밋 컨벤션을 준수합니다.
5. **검증 및 리뷰:** 보고 전 반드시 [/code-review](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/code-review.md) 워크플로우를 실행합니다.

## 3. 핵심 체크리스트
- [ ] 모든 주석이 한국어로 작성되었으며 이모지(Emoji)를 포함하지 않는가?
- [ ] 코드 내에 잔류하는 콘솔 로그(`console.log`)가 없는가?
- [ ] TypeScript 타입이 명확히 정의되었는가? (PascalCase vs kebab-case 등 규칙 준수)
- [ ] 알고리즘이 `ALGORITHM_SPEC.md`의 수식을 따르는가?
- [ ] 커밋 메시지가 `태그: [N.N.N] 요약`(한국어) 형식을 따르는가?
- [ ] Vercel 베스트 프랙티스 및 코드 리뷰 워크플로우가 완료되었는가?
