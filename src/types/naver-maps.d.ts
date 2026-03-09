export {};

declare global {
  interface Window {
    naver: typeof naver;
  }
  
  namespace naver.maps {
    class Map {
      constructor(element: string | HTMLElement, options: MapOptions);
      setOptions(options: MapOptions): void;
      panToBounds(bounds: LatLngBounds, padding?: Padding | number): void;
    }
    
    interface MapOptions {
      center: LatLng;
      zoom: number;
      zoomControl?: boolean;
      zoomControlOptions?: {
        position: Position;
      };
    }

    interface Padding {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }
    class LatLngBounds {
      constructor(sw: LatLng, ne: LatLng);
      extend(latlng: LatLng): void;
    }
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }
    interface MarkerOptions {
      position: LatLng;
      map: Map;
      icon?: {
        content: string;
        anchor: Point;
      };
      zIndex?: number;
    }
    class Polyline {
      constructor(options: PolylineOptions);
      setMap(map: Map | null): void;
      setOptions(options: Partial<PolylineOptions>): void;
    }
    interface PolylineOptions {
      map: Map;
      path: LatLng[];
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      strokeLineCap?: string;
      strokeLineJoin?: string;
      strokeStyle?: string;
      zIndex?: number;
    }
    class Point {
      constructor(x: number, y: number);
    }
    enum Position {
      TOP_LEFT,
      TOP_RIGHT,
      BOTTOM_LEFT,
      BOTTOM_RIGHT
    }
  }
}
