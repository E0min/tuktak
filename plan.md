# 📋 TukTak Simulator MVP 구현 계획

## 1. 프로젝트 기반 구축 및 환경 설정
- [ ] 1.1 디렉토리 구조 및 컨벤션 확립
    - [x] 1.1.1 Thin App Layer 폴더 구조 생성 (`PROJECT_STRUCTURE.md` 준수)
        - [x] 1.1.1.1 `src/features/simulator` (api, components, hooks, store, types) 폴더 생성
        - [x] 1.1.1.2 `src/components/ui` 및 `src/lib/engine` 폴더 생성
        - [x] 1.1.1.3 `src/services`, `src/types`, `src/hooks` 공통 폴더 생성
    - [x] 1.1.2 코드 품질 도구 및 컨벤션 검증 설정
        - [x] 1.1.2.1 `eslint.config.mjs`에 명명 규칙(camelCase 등) 관련 규칙 확인 및 보완
        - [x] 1.1.2.2 Prettier 설정 완료 및 `CODE_CONVENTIONS.md` 지침 숙지 완료
- [ ] 1.2 외부 API 및 SDK 연동 환경 구축
    - [x] 1.2.1 네이버 지도 클라이언트 SDK 설정 (`NAVER_MAPS_INTEGRATION.md`)
        - [x] 1.2.1.1 `.env.local` 생성 및 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 환경변수 등록
        - [x] 1.2.1.2 `src/app/layout.tsx`에 `next/script`를 사용하여 네이버 지도 SDK 비동기 로드 구현
        - [x] 1.2.1.3 `window.naver` 타입 확장을 위한 전역 타입 선언 파일 추가 (`src/types/naver-maps.d.ts`)
    - [x] 1.2.2 네이버 Direction API 서버 연동 준비
        - [x] 1.2.2.1 서버 사이드 API 호출을 위한 `NAVER_MAP_CLIENT_SECRET` 환경변수 등록
        - [x] 1.2.2.2 `src/services/naver-direction.ts`에 기본 fetcher 및 에러 핸들링 유틸리티 구현
        - [x] 1.2.2.3 API 쿼터 초과 대비를 위한 결과값 캐싱 로직 초기 설계 (src/services 내 구현)

## 2. 핵심 도메인 모델 및 Mock 데이터 엔진 구현
- [ ] 2.1 데이터 모델링 (Domain Types)
    - [x] 2.1.1 핵심 인터페이스 정의 (`src/types/index.ts`)
        - [x] 2.1.1.1 `Coordinate` (lat, lng) 및 `Cargo` (type, volume, weight) 타입 정의
        - [x] 2.1.1.2 `Order` 인터페이스 (id, pickup/dropoff Coordinate, cargo, timeWindow) 정의
        - [x] 2.1.1.3 `Route` 인터페이스 (id, orders, totalDistance, totalTime, pathPoints) 정의
        - [x] 2.1.1.4 `KPIMetrics` (totalDistance, fuelCost, carbonEmission, driverProfit) 비교 타입 정의
- [ ] 2.2 Mock 데이터 생성기 구현 (`src/lib/data/mock-generator.ts`)
    - [x] 2.2.1 서울 지역 좌표 및 구역 랜덤화 로직
        - [x] 2.2.1.1 `SEOUL_BOUNDS` 상수 정의 (Lat: 37.42~37.70, Lng: 126.75~127.20)
        - [x] 2.2.1.2 범위 내 랜덤 좌표 생성 함수 `getRandomCoordinate()` 구현
    - [x] 2.2.2 100개 랜덤 배차 콜(Order) 생성 엔진
        - [x] 2.2.2.1 `MOCK_DATA_SPEC.md`에 정의된 5개 카테고리별 화물 특성 랜덤화 로직 구현
        - [x] 2.2.2.2 시간 윈도우 (08:00~18:00 상차, 2~6시간 내 하차) 생성 함수 구현
        - [x] 2.2.2.3 `generateMockOrders(count: number)` 메인 함수 구현 (Order 객체 100개 생성)
    - [x] 2.2.3 데이터 유효성 검증 및 시드 관리
        - [x] 2.2.3.1 생성된 100개 오더의 무게/부피 합계 및 제약 조건 1차 검증 테스트
        - [x] 2.2.3.2 데이터 검증용 테스트 스크립트 작성 완료 (`src/lib/data/test-generator.ts`)

## 3. 시뮬레이션 엔진 및 알고리즘 프로토타입 (`src/lib/engine`)
- [ ] 3.1 거리 및 운임 계산 로직
    - [x] 3.1.1 하버사인 거리 및 기본 운임 엔진
        - [x] 3.1.1.1 `PRICING_MODEL.md` 기반의 기본 배송 요금 산정 함수 구현 (`src/lib/engine/calculator.ts`)
- [ ] 3.2 합짐(Bundling) 알고리즘 1차 구현
    - [x] 3.2.1 제약 조건 검증 로직
        - [x] 3.2.1.1 1톤 적재량 및 시간 윈도우(Hard Constraints) 체크 함수 구현 (`src/lib/engine/bundler.ts`)
    - [x] 3.2.2 클러스터링 기반 합짐 시뮬레이터
        - [x] 3.2.2.1 `ALGORITHM_SPEC.md`의 스코어링 함수($Score$)를 적용한 기초 합짐 엔진 (`src/lib/engine/bundler.ts`)

## 4. UI/UX 구현 및 시각화 (`src/features/simulator`)
- [ ] 4.1 지도 시각화 레이어 구현
    - [x] 4.1.1 네이버 지도 베이스 컴포넌트 (`components/naver-map.tsx`)
        - [x] 4.1.1.1 `NaverMap` 컴포넌트 구현 및 서울 중심부 (`37.5665, 126.9780`) 초기화
        - [x] 4.1.1.2 `useNaverMap` 커스텀 훅을 통한 지도 인스턴스 관리 로직 분리
    - [x] 4.1.2 오더 마커 및 경로 렌더링
        - [x] 4.1.2.1 `MOCK_DATA_SPEC.md` 규격에 맞춘 상차(주황색), 하차(파란색) 커스텀 마커 구현 (`lib/map-utils.ts`)
        - [x] 4.1.2.2 `Polyline`을 활용한 개별 배송(남색, 40% 투명도) 및 합짐(에메랄드색) 경로 렌더링
- [ ] 4.2 프리미엄 대시보드 및 지표 리포트 구현
    - [x] 4.2.1 글래스모피즘 기반 레이아웃 (`components/dashboard.tsx`)
        - [x] 4.2.1.1 `Slate-950` 배경 및 `backdrop-blur`가 적용된 사이드 패널 UI 구현
        - [x] 4.2.1.2 Framer Motion을 활용한 패널 등장/퇴장 애니메이션 적용
    - [x] 4.2.2 KPI 카드 및 애니메이션 위젯
        - [x] 4.2.2.1 `SIMULATION_METRICS.md` 지표(거리 절감, 수익 등)를 표시하는 `KPICard` 컴포넌트 구현
        - [x] 4.2.2.2 `framer-motion`의 `animate` 기능을 활용한 숫자 카운팅 애니메이션 구현
- [ ] 4.3 시뮬레이션 제어 및 상태 관리
    - [x] 4.3.1 제어 패널 (`components/control-panel.tsx`)
        - [x] 4.3.1.1 '시뮬레이션 실행', '초기화' 버튼 및 진행 상태(IDLE, LOADING, DONE) 표시
        - [x] 4.3.1.2 `Zustand`를 활용한 전역 시뮬레이션 상태 관리 스토어 구현 (`store/use-simulator-store.ts`)
    - [ ] 4.3.2 페이지 조립 및 엔트리 포인트 (`index.tsx`)
        - [ ] 4.3.2.1 `SimulatorPage` 컴포넌트에서 지도와 대시보드 결합
        - [ ] 4.3.2.2 `app/page.tsx`에서 `features/simulator`를 불러와 최종 화면 구성
