"use client";

import { useEffect, useRef, useState } from "react";

interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMapLoad?: (map: naver.maps.Map) => void;
}

/**
 * 네이버 지도 베이스 컴포넌트
 * SDK 로딩 시점을 고려하여 window.naver 객체가 준비될 때까지 재시도합니다.
 */
export default function NaverMap({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 11,
  className = "w-full h-full",
  onMapLoad,
}: NaverMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  // 1. SDK 로드 상태 감시 (Polling)
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      setIsSdkLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setIsSdkLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 2. SDK 로드 완료 후 지도 초기화
  useEffect(() => {
    if (!isSdkLoaded || !mapElement.current || !window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom: zoom,
      zoomControl: false,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_LEFT,
      },
    };

    const map = new window.naver.maps.Map(mapElement.current, mapOptions);

    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [isSdkLoaded]); // SDK 로드 완료 시 실행

  return (
    <div 
      ref={mapElement} 
      className={className} 
      style={{ width: "100%", height: "100vh" }} 
    />
  );
}
