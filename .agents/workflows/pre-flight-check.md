---
description: 작업 시작 전 DOCS 지침 확인 및 환경 점검 워크플로우
---

# 🛫 Pre-flight Check Workflow

이 워크플로우는 모든 새로운 작업(Task)이나 대화 세션의 시작 시점에서 안티그래비티가 반드시 수행해야 하는 품질 보증 절차의 첫 번째 단계입니다.

## 1. 품질 보증 단계
1.  **디렉토리 탐색:** `DOCS/` 디렉토리 존재 여부를 확인합니다.
2.  **지침 로드 (필요 시):** 아래 메타데이터를 참조하여 필요한 문서를 선택적으로 로드합니다.
3.  **다음 단계 연계:** 
    - 모든 계획 수립 시 [/docs-adherence](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/docs-adherence.md) 및 [/plan-mode](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/plan-mode.md)를 참조하여 `plan.md`에 4단계 계획을 수립합니다.
    - 프론트엔드 UI 작업 시 [/vercel-best-practices](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/vercel-best-practices.md)를 연이어 실행합니다.
    - 코드 변경 시 [/doc-sync](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/doc-sync.md) 및 [/workflow-sync](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/workflow-sync.md) 워크플로우를 통해 산출물 및 워크플로우를 최신화합니다.
4.  **상태 보고:** `task.md`를 생성하거나 업데이트할 때 "DOCS 지침 확인 완료" 항목을 체크하여 사용자에게 점검 완료를 알립니다.
5.  **일관성 검증:** 계획 단계(Planning)에서 로드된 지침들과 계획이 일치하는지 자가 진단합니다.

## 2. DOCS 메타데이터 (Context Optimization)

### 📁 01_Product (제품 기획)
-   **`MVP_PLAN.md`**: 예창패용 1차 MVP 계획. 서울 100개 배차 수요 시각화 및 합짐 효율성 증명 목표.
-   **`PRD_MVP_SIMULATOR.md`**: 요구사항 정의. 랜덤 수요 생성(F-1), 지도 시각화(F-2), 합짐 알고리즘(F-3), 결과 비교 리포트(F-4).
-   **`SIMULATION_METRICS.md`**: KPI 정의. 차량 감소, 거리/시간 감소율, 기사 시간당 수익, 화주 비용 절감액 공식.

### 📁 02_Design (UI/UX 가이드)
-   **`UI_UX_GUIDELINES.md`**: "Premium Logistics" 컨셉. Slate-950 다크 모드, Indigo/Emerald 액센트, 글래스모피즘.

### 📁 03_Engineering (엔지니어링 표준)
-   **`AGENT_INSTRUCTIONS.md`**: **에이전트 필수 행동 수칙.** 한국어 주석(이모지 금지), 4단계 계획(`plan.md`), `[N.N.N]` 단위 커밋.
-   **`CODE_CONVENTIONS.md`**: TS(PascalCase), kebab-case 컴포넌트, camelCase 변수. 콘솔 로그 사용 금지 규칙 포함.
-   **`GIT_CONVENTIONS.md`**: 한국어 커밋 규칙 (`feat`, `fix`, `docs`, `style`, `refactor`, `chore`).
-   **`PROJECT_STRUCTURE.md`**: **Thin App Layer 설계.** `app/`은 진입점, 로직은 `features/` 및 `lib/engine/`에 격리. 상향 참조 금지.
-   **`TDD_MVP_SIMULATOR.md`**: 기술 아키텍처. Naver Maps 비동기 로드, GlobalState 스키마, Route-Second 전략.

### 📁 04_Technical_Spec (기술 상세)
-   **`ALGORITHM_SPEC.md`**: 합짐 알고리즘. 1톤 적재/시간 윈도우 제약, 거리/시간/적재율 기반 $Score$ 함수.
-   **`MOCK_DATA_SPEC.md`**: 100개 랜덤 콜 생성 규칙. 서울 전역 좌표, 1톤 고정, 부피/무게 랜덤 설정.
-   **`NAVER_MAPS_INTEGRATION.md`**: 네이버 지도 연동. Client ID/Secret, 마커 색상(상차:주황, 하차:파랑), Polyline 색상 정의.
-   **`PRICING_MODEL.md`**: 운임 모델. 기본료 35,000원 + km당 1,500원. 합짐 시 15~25% 할인 적용.

### 📁 05_System_Architecture (시스템 자산 - 인수인계용)
-   **`SYSTEM_HANDOVER.md`**: 시스템 인수인계서. 아키텍처 원칙, 핵심 모듈 책임, 운영 지침 포함.
-   **`DATA_FLOW_DIAGRAM.md`**: 시스템 내 데이터 흐름 및 상태 관리 로직 명세.

---
*이 워크플로우는 `/ pre-flight-check` 명령으로 실행되거나 작업 시작 시 자동 참조됩니다.*
