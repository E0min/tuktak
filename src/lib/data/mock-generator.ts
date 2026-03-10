import { Coordinate, CargoCategory, Order, Cargo, TimeWindow } from "@/types";
import { getEstimatedRoadDistance, calculateBasePrice } from "@/lib/engine/calculator";

/**
 * 서울 지역 위경도 범위 (MOCK_DATA_SPEC.md 준수)
 */
export const SEOUL_BOUNDS = {
  LAT_MIN: 37.42,
  LAT_MAX: 37.7,
  LNG_MIN: 126.75,
  LNG_MAX: 127.2,
};

/**
 * 서울 지역 내 랜덤 좌표 생성
 */
export function getRandomCoordinate(): Coordinate {
  const lat = Math.random() * (SEOUL_BOUNDS.LAT_MAX - SEOUL_BOUNDS.LAT_MIN) + SEOUL_BOUNDS.LAT_MIN;
  const lng = Math.random() * (SEOUL_BOUNDS.LNG_MAX - SEOUL_BOUNDS.LNG_MIN) + SEOUL_BOUNDS.LNG_MIN;
  return { lat, lng };
}

/**
 * 랜덤 화물 정보 생성
 */
function getRandomCargo(): Cargo {
  const categories: CargoCategory[] = [
    "Appliance",
    "Furniture",
    "StoreFixture",
    "SmallOffice",
    "General",
  ];
  const category = categories[Math.floor(Math.random() * categories.length)];

  // 부피 점유율 (0.1 ~ 0.4) - 고밀도 합짐 시뮬레이션을 위해 하향 조정
  const volume = parseFloat((Math.random() * 0.3 + 0.1).toFixed(2));
  // 중량 (100kg ~ 400kg) - 부피에 맞춰 중량도 소폭 조정
  const weight = Math.floor(Math.random() * 300 + 100);

  return { category, volume, weight };
}

/**
 * 랜덤 시간 윈도우 생성 (당일 기준)
 */
function getRandomTimeWindow(): TimeWindow {
  const startHour = Math.floor(Math.random() * 10 + 8); // 08:00 ~ 18:00
  const duration = Math.floor(Math.random() * 4 + 2); // 2 ~ 6시간 후 하차

  const pickupAt = new Date();
  pickupAt.setHours(startHour, 0, 0, 0);

  const deadlineAt = new Date(pickupAt);
  deadlineAt.setHours(startHour + duration);

  return {
    pickupAt: pickupAt.toISOString(),
    deadlineAt: deadlineAt.toISOString(),
  };
}

/**
 * 좌표 기반 사실적인 서울 주소 생성 (12.1)
 */
const SEOUL_DISTRICTS = [
  { name: "강남구", dongs: ["역삼동", "삼성동", "논현동", "신사동", "도곡동"], lat: [37.46, 37.52], lng: [127.02, 127.10] },
  { name: "서초구", dongs: ["서초동", "반포동", "방배동", "양재동"], lat: [37.43, 37.51], lng: [126.98, 127.06] },
  { name: "송파구", dongs: ["잠실동", "가락동", "문정동", "방이동"], lat: [37.47, 37.54], lng: [127.08, 127.17] },
  { name: "마포구", dongs: ["서교동", "상암동", "합정동", "공덕동"], lat: [37.53, 37.58], lng: [126.88, 126.96] },
  { name: "용산구", dongs: ["한남동", "이태원동", "이촌동", "원효로"], lat: [37.51, 37.55], lng: [126.95, 127.01] },
  { name: "영등포구", dongs: ["여의도동", "당산동", "문래동", "신길동"], lat: [37.48, 37.55], lng: [126.88, 126.94] },
  { name: "성동구", dongs: ["성수동", "옥수동", "금호동", "행당동"], lat: [37.53, 37.57], lng: [127.02, 127.08] },
  { name: "강서구", dongs: ["화곡동", "가양동", "마곡동", "방화동"], lat: [37.53, 37.59], lng: [126.78, 126.86] },
];

function getAddressFromCoords(coord: Coordinate): string {
  // 좌표 범위에 맞는 구 찾기
  const district = SEOUL_DISTRICTS.find(d => 
    coord.lat >= d.lat[0] && coord.lat <= d.lat[1] && 
    coord.lng >= d.lng[0] && coord.lng <= d.lng[1]
  ) || SEOUL_DISTRICTS[Math.floor(Math.random() * SEOUL_DISTRICTS.length)]; // 못 찾으면 랜덤

  const dong = district.dongs[Math.floor(Math.random() * district.dongs.length)];
  const buildingNum = Math.floor(Math.random() * 150) + 1;
  
  return `서울특별시 ${district.name} ${dong} ${buildingNum}번지`;
}

/**
 * 100개 랜덤 배차 콜 생성 엔진 (2.2.2)
 */
export function generateMockOrders(count: number = 100): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const pickup = getRandomCoordinate();
    const dropoff = getRandomCoordinate();

    // 도로 보정 계수가 적용된 예상 주행 거리를 기반으로 기초 운임 산정 (7.2.1.2)
    const estimatedDistance = getEstimatedRoadDistance(pickup, dropoff);
    const basePrice = calculateBasePrice(estimatedDistance);

    return {
      id: `ORDER-${(i + 1).toString().padStart(3, "0")}`,
      pickup,
      dropoff,
      pickupAddress: getAddressFromCoords(pickup),
      dropoffAddress: getAddressFromCoords(dropoff),
      cargo: getRandomCargo(),
      timeWindow: getRandomTimeWindow(),
      basePrice,
    };
  });
}
