/**
 * 화물 알뜰운송(TukTak) 시뮬레이션의 핵심 데이터 타입 정의
 * ALGORITHM_SPEC.md의 제약 조건과 CODE_CONVENTIONS.md의 규칙을 준수합니다.
 */

/** 위경도 좌표 정보 */
export interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

/** 화물 정보 (부피 및 무게 포함) */
export interface Cargo {
    type: 'appliance' | 'furniture' | 'general'; // 가전, 가구, 일반화물
    weight: number;  // 중량 (kg)
    volume: number;  // 부피 (0.0 ~ 1.0, 1톤 적재함 기준 점유율)
}

/** 화물 운송 주문 정보 */
export interface Order {
    id: string;
    pickup: Location;  // 상차지
    dropoff: Location; // 하차지
    cargo: Cargo;      // 화물 상세
    price: number;     // 운임 (원)
    deadline: string;  // 배송 마감 시간 (예: "21:00")
}

/** 경로 내 개별 단계 (상차 또는 하차) */
export interface RouteStep {
    type: 'pickup' | 'dropoff';
    orderId: string;
    location: Location;
    estimatedTime: string; // 예상 도착 시간
}

/** 시뮬레이션된 운송 경로 정보 */
export interface SimulationRoute {
    steps: RouteStep[];
    orders: Order[];
    totalDistance: number; // 총 이동 거리 (km)
    totalTime: number;     // 총 소요 시간 (분)
    loadFactor: number;    // 최종 적재율 (0.0 ~ 1.0)
    score: number;         // ALGORITHM_SPEC.md의 수식에 따른 효율성 점수
}

/** 시뮬레이션 전체 결과 리포트 */
export interface SimulationResult {
    individualRoutes: SimulationRoute[]; // 기존 방식 (건별 배송)
    bundledRoute: SimulationRoute;       // 알뜰운송 방식 (합짐)
    efficiency: {
        distanceReduction: number;        // 거리 절감률 (%)
        incomeIncreaseForDriver: number;  // 기사 수익 증대율 (%)
        costReductionForUser: number;     // 사용자 비용 절감률 (%)
        carbonReduction: number;          // 탄소 배출 감소량 (%)
    };
}
