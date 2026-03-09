"use client";

import { useCallback, useState } from "react";

/**
 * 네이버 지도 인스턴스 관리를 위한 커스텀 훅 (4.1.1.2)
 */
export function useNaverMap() {
  const [map, setMap] = useState<any>(null);

  const handleMapLoad = useCallback((mapInstance: any) => {
    setMap(mapInstance);
  }, []);

  return {
    map,
    handleMapLoad,
  };
}
