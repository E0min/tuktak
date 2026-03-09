import { Location, Order, SimulationResult, SimulationRoute, RouteStep } from '../types/simulation';

// 서울 중심 좌표 (시뮬레이션 기준점)
const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 };

/**
 * 하버사인(Haversine) 공식을 이용한 두 지점 간의 직선 거리 계산
 * @param loc1 시작 지점 위경도
 * @param loc2 도착 지점 위경도
 * @returns 거리 (km)
 */
export function getDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * ALGORITHM_SPEC.md에 정의된 가중치 기반 스코어링 함수
 * Score = w1(ΔDistance) + w2(ΔTime) + w3(1 - Load Factor)
 * 값이 낮을수록 효율적인 경로로 판단합니다.
 */
export function calculateScore(
    distanceDiff: number,
    timeDiff: number,
    loadFactor: number
): number {
    const w1 = 0.5; // 거리 가중치
    const w2 = 0.3; // 시간 가중치
    const w3 = 0.2; // 적재율 가중치 (1-적재율이므로 낮을수록 좋음)

    return w1 * distanceDiff + w2 * timeDiff + w3 * (1 - loadFactor);
}

/**
 * 서울 시내 범위에서 랜덤한 위치를 생성합니다.
 * @param id 위치 ID
 * @param name 위치 이름
 */
export function getRandomSeoulLocation(id: string, name: string): Location {
    return {
        id,
        name,
        lat: SEOUL_CENTER.lat + (Math.random() - 0.5) * 0.1, // 약 10km 범위
        lng: SEOUL_CENTER.lng + (Math.random() - 0.5) * 0.1,
    };
}

/**
 * 시뮬레이션을 위한 가상 화물 주문 생성
 * @param count 생성할 주문 수
 */
export function generateMockOrders(count: number): Order[] {
    const orders: Order[] = [];
    const types: ('appliance' | 'furniture' | 'general')[] = ['appliance', 'furniture', 'general'];

    for (let i = 0; i < count; i++) {
        const pickup = getRandomSeoulLocation(`p-${i}`, `상차지 ${i + 1}`);
        const dropoff = getRandomSeoulLocation(`d-${i}`, `하차지 ${i + 1}`);

        orders.push({
            id: `order-${i}`,
            pickup,
            dropoff,
            cargo: {
                type: types[Math.floor(Math.random() * types.length)],
                weight: Math.floor(Math.random() * 500) + 100, // 100~600kg
                volume: Number((Math.random() * 0.4 + 0.1).toFixed(2)), // 10~50% 부피
            },
            price: 40000 + Math.floor(Math.random() * 20000), // 4~6만원
            deadline: "21:00",
        });
    }
    return orders;
}

/**
 * 알뜰운송 알고리즘 시뮬레이션 실행
 * @param orders 대상 화물 주문 목록
 */
export function runSimulation(orders: Order[]): SimulationResult {
    // 1. 기존 방식: 각 오더를 개별적으로 배송 (상차 -> 하차)
    const individualRoutes: SimulationRoute[] = orders.map(order => {
        const distance = getDistance(order.pickup, order.dropoff);
        return {
            steps: [
                { type: 'pickup', orderId: order.id, location: order.pickup, estimatedTime: "10:00" },
                { type: 'dropoff', orderId: order.id, location: order.dropoff, estimatedTime: "11:00" },
            ],
            orders: [order],
            totalDistance: distance,
            totalTime: Math.round(distance * 2), // 단순 시속 30km 가정
            loadFactor: order.cargo.volume,
            score: 0, // 개별 운송은 비교 기준이므로 0
        };
    });

    // 2. 합짐 방식: 모든 상차지를 먼저 들르고 모든 하차지를 순차 방문 (가정)
    // TODO: ALGORITHM_SPEC.md의 Cluster-First 기법에 따른 정교한 경로 생성 필요
    const bundledSteps: RouteStep[] = [
        ...orders.map(o => ({ type: 'pickup' as const, orderId: o.id, location: o.pickup, estimatedTime: "10:00" })),
        ...orders.map(o => ({ type: 'dropoff' as const, orderId: o.id, location: o.dropoff, estimatedTime: "12:00" })),
    ];

    let bundledDistance = 0;
    for (let i = 0; i < bundledSteps.length - 1; i++) {
        bundledDistance += getDistance(bundledSteps[i].location, bundledSteps[i + 1].location);
    }

    const totalVolume = orders.reduce((sum, o) => sum + o.cargo.volume, 0);
    const bundledRoute: SimulationRoute = {
        steps: bundledSteps,
        orders: orders,
        totalDistance: bundledDistance,
        totalTime: Math.round(bundledDistance * 2.5), // 우회 가중치
        loadFactor: totalVolume,
        score: calculateScore(
            bundledDistance - individualRoutes[0].totalDistance,
            0, // 시간 차이는 나중에 정교화
            totalVolume
        ),
    };

    // 3. 효율성 메트릭 산출
    const totalIndividualDistance = individualRoutes.reduce((sum, r) => sum + r.totalDistance, 0);

    return {
        individualRoutes,
        bundledRoute,
        efficiency: {
            distanceReduction: Math.round(((totalIndividualDistance - bundledDistance) / totalIndividualDistance) * 100),
            incomeIncreaseForDriver: 35, // 가중 고정 수익 증대율 가정
            costReductionForUser: 15,    // 합짐 할인율 가정
            carbonReduction: Math.round(((totalIndividualDistance - bundledDistance) / totalIndividualDistance) * 100),
        }
    };
}
