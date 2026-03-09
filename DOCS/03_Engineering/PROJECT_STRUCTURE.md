# 프로젝트 구조 정의 (PROJECT_STRUCTURE.md)

이 문서는 'TukTak' 프로젝트의 디렉토리 계층 구조와 각 폴더의 역할 및 책임을 정의합니다.

영민 님의 의도는 **"프레임워크(Next.js)에 대한 의존성을 최소화하고, 순수 비즈니스 로직과 UI 구성 요소를 완전히 독립시키겠다"**는 강력한 설계 원칙으로 이해됩니다.

이 경우 `app` 디렉토리는 오직 **Entry Point(진입점)**와 **Glue Code(결합 코드)** 역할만 수행하게 됩니다. 이를 위해 `src/features` (또는 `src/modules`) 패턴을 극대화한 구조를 제안합니다.

---

## 1. 개요
프로젝트는 Next.js App Router 아키텍처를 기반으로 하며, 데이터 로직과 UI를 엄격히 분리합니다.

## 2. 'Thin App Layer' 디렉토리 계층 구조

`app` 폴더에는 로직이 거의 없고, 각 페이지는 `features`에서 완성된 '페이지 컴포넌트'를 불러와서 배치만 합니다.

```text
src/
├── app/                  # [Routing Layer] 오직 라우팅과 레이아웃만 존재
│   ├── layout.tsx        # 전역 Provider 및 폰트 설정
│   ├── page.tsx          # Home 페이지 조립
│   └── simulation/
│       └── page.tsx      # <SimulationPage /> 호출 (로직 0%)
├── features/             # [Feature Layer] 도메인별 응집된 기능 단위
│   └── simulator/        # 시뮬레이션 관련 모든 자산
│       ├── api/          # 해당 기능 전용 API 호출
│       ├── components/   # 내부 UI (Canvas, Dashboard 등)
│       ├── hooks/        # 비즈니스 상태 로직 (useSimulator)
│       ├── store/        # 상태 관리 (Zustand 등)
│       ├── types.ts      # 도메인 전용 타입
│       └── index.tsx     # 메인 페이지 컴포넌트 (Public API)
├── components/           # [Shared UI Layer] 도메인을 모르는 순수 UI (Design System)
│   └── ui/               # Button, Input, Modal (Shadcn/ui 스타일)
├── lib/                  # [Infrastructure/Core Layer]
│   ├── engine/           # 'TukTak'의 핵심 알고리즘 (Framework-agnostic)
│   └── utils.ts          # 순수 유틸리티
└── services/             # [Data Layer] API 클라이언트 설정 및 공통 인터셉터
DOCS/                 # 프로젝트 가이드라인 및 명세서
├── 01_Product/       # 제품 기획 (PRD, MVP 기획, 지표 정의)
├── 02_Design/        # 디자인 가이드 (UI/UX, 스타일 가이드)
├── 03_Engineering/   # 개발 가이드 (컨벤션, 구조, 에이전트 지침)
└── 04_Technical_Spec/# 기술 명세 (알고리즘, API 연동, 데이터 명세)
```

---

## 3. 핵심 구현 전략

### 1. `app/simulation/page.tsx` (극한의 단순화)

페이지 파일은 정말 이렇게만 작성합니다. 데이터를 페칭해야 한다면 여기서 `Server Component`로서 데이터를 받아 `props`로 넘겨주는 역할만 수행합니다.

```tsx
// src/app/simulation/page.tsx
import { SimulationPage } from "@/features/simulator";

export default function Page() {
  // 로직은 features 내부에서 처리하거나, 
  // 필요 시 여기서 데이터만 fetch하여 주입합니다.
  return <SimulationPage />;
}
```

### 2. `features/`의 캡슐화 (Public API)

`features/simulator/index.tsx`에서만 외부로 노출할 컴포넌트를 정의합니다.

* **장점**: `app` 디렉토리에서는 `features` 내부의 복잡한 폴더 구조를 알 필요가 없습니다.
* **응집도**: 시뮬레이션 엔진 수정 시 `features/simulator` 폴더만 보면 됩니다.

### 3. 결합도 낮추기 (Dependency Rule)

* **상향 참조 금지**: `features`는 `app`을 참조할 수 없습니다.
* **횡향 참조 최소화**: `features/simulator`가 `features/auth`를 직접 참조하기보다, 필요한 데이터는 `app` 레벨에서 주입받거나 공통 `store`를 통합니다.

---

## 4. 수정된 Responsibility (Strict Version)

| 계층 | 책임 (Responsibility) | 규칙 |
| --- | --- | --- |
| **`app/`** | **Routing & Mapping**: URL과 도메인 기능을 연결. | 비즈니스 로직 작성 금지. |
| **`features/`** | **Domain Service**: 실제 사용자가 사용하는 기능 단위. | 도메인 완결성(Self-contained). |
| **`components/`** | **UI Library**: 재사용 가능한 레고 블록. | 도메인 지식(비즈니스 로직) 포함 금지. |
| **`lib/engine/`** | **Pure Logic**: 프로젝트의 핵심 계산 엔진. | React/Next.js 의존성 금지 (Pure JS/TS). |
