import { Coordinate } from "../../../types";

/**
 * 네이버 지도 위에 커스텀 마커를 생성합니다. (4.1.2.1)
 * @param map 네이버 지도 인스턴스
 * @param position 좌표
 * @param type 상차(Pickup) 또는 하차(Dropoff)
 */
export function createMarker(
  map: any,
  position: Coordinate,
  type: "Pickup" | "Dropoff",
) {
  if (!window.naver || !map) return null;

  const color = type === "Pickup" ? "#fbbf24" : "#3b82f6"; // 주황(Amber-400) vs 파랑(Blue-500)
  
  return new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(position.lat, position.lng),
    map: map,
    icon: {
      content: `
        <div style="width: 12px; height: 12px; background-color: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>
      `,
      anchor: new window.naver.maps.Point(6, 6),
    },
  });
}

/**
 * 네이버 지도 위에 경로(Polyline)를 그립니다. (4.1.2.2)
 * @param map 네이버 지도 인스턴스
 * @param path 좌표 배열
 * @param type 개별(Individual) 또는 합짐(Bundled)
 */
export function drawPath(
  map: any,
  path: Coordinate[],
  type: "Individual" | "Bundled",
) {
  if (!window.naver || !map || path.length < 2) return null;

  const color = type === "Bundled" ? "#10b981" : "#6366f1"; // 에메랄드(Emerald-500) vs 인디고(Indigo-500)
  const opacity = type === "Bundled" ? 0.9 : 0.4;
  const strokeWeight = type === "Bundled" ? 5 : 3;

  return new window.naver.maps.Polyline({
    map: map,
    path: path.map((p) => new window.naver.maps.LatLng(p.lat, p.lng)),
    strokeColor: color,
    strokeOpacity: opacity,
    strokeWeight: strokeWeight,
    strokeLineCap: "round",
    strokeLineJoin: "round",
  });
}
