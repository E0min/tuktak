/**
 * Naver Direction 5 API를 호출하기 위한 서비스 유틸리티
 */

interface DirectionResponse {
  route: any;
  code: number;
  message: string;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_MAP_CLIENT_SECRET;

/**
 * 상차지에서 하차지까지의 실제 주행 경로를 가져옵니다.
 * @param start - 시작 좌표 {lat, lng}
 * @param goal - 도착 좌표 {lat, lng}
 */
export async function getDirection(
  start: { lat: number; lng: number },
  goal: { lat: number; lng: number }
): Promise<DirectionResponse | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return null;
  }

  const url = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start.lng},${start.lat}&goal=${goal.lng},${goal.lat}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
        "X-NCP-APIGW-API-KEY": CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }}
