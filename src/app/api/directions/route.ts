import { NextRequest, NextResponse } from "next/server";

/**
 * 네이버 Directions 5 API 프록시 핸들러 (공식 문서 curl 예시 100% 복제 버전)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const goal = searchParams.get("goal");
  const waypoints = searchParams.get("waypoints");

  // 환경 변수를 핸들러 내부에서 매번 읽어 오버헤드 방지 및 최신화 보장
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID?.trim();
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET?.trim();

  if (!start || !goal) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing API keys in server" }, { status: 500 });
  }

  // 공식 문서 curl 예시 주소: https://maps.apigw.ntruss.com/map-direction/v1/driving
  let url = `https://maps.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=traoptimal`;
  
  if (waypoints) {
    // 파이프(|) 기호가 포함된 waypoints를 안전하게 인코딩 (필요 시)
    url += `&waypoints=${waypoints}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // 공식 문서 curl 예시의 소문자 헤더 규격 준수
        "x-ncp-apigw-api-key-id": clientId,
        "x-ncp-apigw-api-key": clientSecret,
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: "Naver API 401 Unauthorized", 
          naver_response: data 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Server Fetch Error", message }, { status: 500 });
  }
}
