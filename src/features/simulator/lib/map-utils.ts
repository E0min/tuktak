import { Coordinate } from "../../../types";

/**
 * 네이버 지도 위에 커스텀 마커를 생성합니다. (4.1.2.1)
 * @param map 네이버 지도 인스턴스
 * @param position 좌표
 * @param type 상차(Pickup) 또는 하차(Dropoff)
 * @param index 방문 순서 번호 (선택)
 */
export function createMarker(
  map: naver.maps.Map,
  position: Coordinate,
  type: "Pickup" | "Dropoff",
  index?: number
): naver.maps.Marker | null {
  if (!window.naver || !window.naver.maps || !map) return null;

  const color = type === "Pickup" ? "#fbbf24" : "#3b82f6"; // 주황(Amber-400) vs 파랑(Blue-500)
  
  return new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(position.lat, position.lng),
    map: map,
    icon: {
      content: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="width: 24px; height: 24px; background-color: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 12px; font-weight: 900; font-family: sans-serif;">${index || ""}</span>
          </div>
          <div style="position: absolute; bottom: -5px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid white;"></div>
        </div>
      `,
      anchor: new window.naver.maps.Point(12, 24),
    },
    zIndex: index ? 1000 + index : 100,
  });
}

/**
 * 네이버 지도 위에 경로(Polyline)를 그립니다. (4.1.2.2)
 * @param map 네이버 지도 인스턴스
 * @param path 좌표 배열
 * @param type 개별(Individual) 또는 합짐(Bundled)
 */
export function drawPath(
  map: naver.maps.Map,
  path: Coordinate[],
  type: "Individual" | "Bundled",
): naver.maps.Polyline | null {
  if (!window.naver || !window.naver.maps || !map || path.length < 2) return null;

  const color = type === "Bundled" ? "#10b981" : "#6366f1"; // 에메랄드(Emerald-500) vs 인디고(Indigo-500)
  const opacity = type === "Bundled" ? 0.9 : 0.2; // After는 진하게, Before는 아주 연하게
  const strokeWeight = type === "Bundled" ? 5 : 2;

  return new window.naver.maps.Polyline({
    map: map,
    path: path.map((p) => new window.naver.maps.LatLng(p.lat, p.lng)),
    strokeColor: color,
    strokeOpacity: opacity,
    strokeWeight: strokeWeight,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    // Before 모드일 경우 점선(Dash) 효과 고려 가능
    strokeStyle: type === "Individual" ? "shortdash" : "solid",
  });
}
