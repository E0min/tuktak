"use client";

import { useEffect, useRef, useState } from "react";

interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMapLoad?: (map: any) => void;
}

/**
 * 네이버 지도 베이스 컴포넌트 (4.1.1)
 * layout.tsx에서 로드된 네이버 지도 SDK를 사용하여 지도를 초기화합니다.
 */
export default function NaverMap({
  center = { lat: 37.5665, lng: 126.978 }, // 서울 중심
  zoom = 11,
  className = "w-full h-full",
  onMapLoad,
}: NaverMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    if (!mapElement.current || !window.naver) return;

    // 지도 옵션 설정
    const mapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom: zoom,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    // 지도 인스턴스 생성
    const map = new window.naver.maps.Map(mapElement.current, mapOptions);
    setMapInstance(map);

    if (onMapLoad) {
      onMapLoad(map);
    }

    return () => {
      // 컴포넌트 언마운트 시 정리 로직이 필요할 경우 추가
    };
  }, []); // 초기 로드 시 1회 실행

  return <div ref={mapElement} className={className} />;
}
