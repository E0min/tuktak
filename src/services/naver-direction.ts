/**
 * 내장 API Route Handler를 통해 네이버 Directions 5 API를 호출하는 서비스
 */

export interface DirectionSummary {
  distance: number;
  duration: number;
  bbox: number[][];
}

export interface DirectionRoute {
  summary: DirectionSummary;
  path: [number, number][];
}

interface DirectionResponse {
  route: {
    traoptimal: DirectionRoute[];
  };
  code: number;
  message: string;
}

/**
 * 상차지에서 하차지까지의 실제 주행 경로를 가져옵니다. (7.1.1 로직 이관 반영)
 * @param start - 시작 좌표 {lat, lng}
 * @param goal - 도착 좌표 {lat, lng}
 * @param waypoints - 경유지 좌표 배열 (선택)
 */
export async function getDirection(
  start: { lat: number; lng: number },
  goal: { lat: number; lng: number },
  waypoints?: { lat: number; lng: number }[]
): Promise<DirectionResponse | null> {
  const startParam = `${start.lng},${start.lat}`;
  const goalParam = `${goal.lng},${goal.lat}`;
  
  let url = `/api/directions?start=${startParam}&goal=${goalParam}`;
  
  if (waypoints && waypoints.length > 0) {
    const waypointsParam = waypoints
      .map((p) => `${p.lng},${p.lat}`)
      .join("|");
    url += `&waypoints=${waypointsParam}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}
