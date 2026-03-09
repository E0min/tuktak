"use client";

import { useEffect, useState } from "react";
import { Order, Route } from "@/types";
import { createMarker, drawPath } from "@/features/simulator/lib/map-utils";

interface UseMapOverlaysProps {
  map: naver.maps.Map | null;
  status: string;
  orders: Order[];
  bundledRoutes: Route[];
  selectedRouteId: string | null;
  isRouteListOpen: boolean;
}

/**
 * 지도 오버레이(마커, 폴리라인) 생명주기 및 뷰포트 관리를 전담하는 훅 (13.2)
 */
export function useMapOverlays({
  map,
  status,
  orders,
  bundledRoutes,
  selectedRouteId,
  isRouteListOpen,
}: UseMapOverlaysProps) {
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
  const [polylines, setPolylines] = useState<naver.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || orders.length === 0) return;

    // 1. 기존 오버레이 제거
    markers.forEach((m) => m.setMap(null));
    polylines.forEach((p) => p.setMap(null));

    const newMarkers: naver.maps.Marker[] = [];
    const newPolylines: naver.maps.Polyline[] = [];

    // 2. 집중 표시 모드 (특정 루트 선택 시)
    if (selectedRouteId && bundledRoutes.length > 0) {
      const selectedRoute = bundledRoutes.find(r => r.id === selectedRouteId);
      if (selectedRoute) {
        // 경로 그리기
        const p = drawPath(map, selectedRoute.pathPoints, "Bundled");
        if (p) {
          p.setOptions({ strokeWeight: 8, strokeOpacity: 1, zIndex: 1000 });
          newPolylines.push(p);
        }

        // 방문 순서 마커 생성
        const sequence = selectedRoute.optimalSequence || [];
        sequence.forEach((point, idx) => {
          const m = createMarker(map, point.coordinate, point.type, idx + 1);
          if (m) newMarkers.push(m);
        });

        // 뷰포트 이동 (패딩 적용)
        const bounds = new window.naver.maps.LatLngBounds(
          new window.naver.maps.LatLng(selectedRoute.pathPoints[0].lat, selectedRoute.pathPoints[0].lng),
          new window.naver.maps.LatLng(selectedRoute.pathPoints[0].lat, selectedRoute.pathPoints[0].lng)
        );
        selectedRoute.pathPoints.forEach(pt => bounds.extend(new window.naver.maps.LatLng(pt.lat, pt.lng)));
        
        map.panToBounds(bounds, { top: 50, right: 480, bottom: 50, left: 50 });
      }
    } 
    // 3. 전체 표시 모드
    else if (status === "DONE" && bundledRoutes.length > 0) {
      const allBounds = new window.naver.maps.LatLngBounds(
        new window.naver.maps.LatLng(37.42, 126.75),
        new window.naver.maps.LatLng(37.70, 127.20)
      );
      map.panToBounds(allBounds, { top: 50, right: isRouteListOpen ? 480 : 50, bottom: 50, left: 50 });

      bundledRoutes.forEach((route) => {
        const p = drawPath(map, route.pathPoints, "Bundled");
        if (p) newPolylines.push(p);
        
        route.orders.forEach(order => {
          const pm = createMarker(map, order.pickup, "Pickup");
          const dm = createMarker(map, order.dropoff, "Dropoff");
          if (pm) newMarkers.push(pm);
          if (dm) newMarkers.push(dm);
        });
      });
    } else {
      // 초기 상태: 개별 배송 경로
      orders.forEach((order) => {
        const p = drawPath(map, [order.pickup, order.dropoff], "Individual");
        if (p) newPolylines.push(p);
        const pm = createMarker(map, order.pickup, "Pickup");
        const dm = createMarker(map, order.dropoff, "Dropoff");
        if (pm) newMarkers.push(pm);
        if (dm) newMarkers.push(dm);
      });
    }

    setMarkers(newMarkers);
    setPolylines(newPolylines);
  }, [map, orders, bundledRoutes, status, selectedRouteId, isRouteListOpen]);

  return { markers, polylines };
}
