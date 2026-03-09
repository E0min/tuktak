import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_MAP_CLIENT_SECRET;

/**
 * 네이버 Directions API 프록시 핸들러 (7.1.1)
 * 클라이언트의 CORS 문제를 해결하고 API Secret을 보호합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const goal = searchParams.get("goal");
  const waypoints = searchParams.get("waypoints");

  if (!start || !goal) {
    return NextResponse.json(
      { message: "시작점과 도착점 좌표가 필요합니다." },
      { status: 400 }
    );
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { message: "서버 API Key 설정이 누락되었습니다." },
      { status: 500 }
    );
  }

  let url = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}`;
  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
        "X-NCP-APIGW-API-KEY": CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "네이버 API 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
