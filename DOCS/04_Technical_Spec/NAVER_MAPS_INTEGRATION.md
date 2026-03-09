# 네이버 지도 API 연동 명세 (NAVER_MAPS_INTEGRATION.md)

이 문서는 'TukTak' 플랫폼에 네이버 지도(Naver Maps) API 및 네비게이션 데이터를 연동하기 위한 기술 명세를 정의합니다.

## 1. 개요
서울 시내 100개의 배차 수요(마커)를 시각화하고, 알고리즘에 의해 생성된 합짐 경로를 지도로 표현하기 위해 네이버 지도 SDK를 사용합니다.

## 2. 필수 요구사항
- **Client ID:** 네이버 클라우드 플랫폼(NCP) 콘솔에서 발급받은 'Maps' 서비스 클라이언트 ID.
- **Client Secret:** 경로 계산(Direction 5/15) API 호출을 위한 시크릿 키.
- **환경 변수:** `.env.local` 파일에 다음과 같이 저장합니다.
  ```env
  NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id
  NAVER_MAP_CLIENT_SECRET=your_client_secret
  ```

## 3. 핵심 기능 명세

### 3.1 지도 로드 (Map Loading)
- **초기 뷰:** 서울 중심 좌표 (`37.5665, 126.9780`) 및 줌 레벨 `11`.
- **스크립트 로드:** `src/app/layout.tsx` 또는 전용 `Script` 컴포넌트를 통해 비동기로 SDK 로드.

### 3.2 마커 시각화 (Marker Visualization)
- **상차지(Pickup):** 주황색 마커 또는 전용 아이콘.
- **하차지(Dropoff):** 파란색 마커 또는 전용 아이콘.
- **클러스터링:** 100개의 점이 찍힐 경우 가독성을 위해 근접 마커는 클러스터링 처리 고려.

### 3.3 경로 렌더링 (Polyline)
- **Direction API:** 상차지-하차지 간의 실제 주행 경로 데이터를 받아 `Polyline`으로 렌더링.
- **색상 구분:** 
  - 개별 배송 경로: 흐린 남색 (`#6366f1` 50% 투명도)
  - 합짐 최적 경로: 짙은 에메랄드색 (`#10b981`)

## 4. 데이터 연동 구조
1. **Mock 데이터 생성:** `src/lib/mock-data.ts`에서 100개의 위경도 오더 생성.
2. **API 호출:** 네이버 Direction API를 호출하여 세부 경로 좌표(Path Points) 획득.
3. **렌더링:** `src/components/simulation/NaverMap.tsx`에서 네이버 지도 객체 위에 마커와 경로를 그림.
