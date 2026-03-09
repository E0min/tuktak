# 시스템 인수인계서 (SYSTEM_HANDOVER.md)

이 문서는 'TukTak' 시뮬레이터의 시스템 구조, 핵심 로직 및 운영 지침을 상술하여 원활한 유지보수와 인수인계를 돕는 것을 목적으로 합니다.

## 1. 시스템 개요
- **핵심 가치:** 데이터 기반 배차 효율성 시각화 및 알고리즘 검증.
- **주요 기술:** Next.js 15, TypeScript, Naver Maps API, Tailwind CSS.

## 2. 아키텍처 원칙 (Thin App Layer)
- `src/app`: 라우팅 및 엔트리 포인트 (로직 최소화).
- `src/features`: 도메인별 응집된 기능 단위 (Self-contained).
- `src/lib/engine`: 프레임워크 의존성 없는 순수 알고리즘 로직.

## 3. 핵심 데이터 모델 및 흐름
- [내용 업데이트 필요: 개발 진행에 따라 최신화]

## 4. 환경 설정 및 배포
- `.env.local`: Naver Maps API 키 필수 설정.
- Vercel을 통한 자동 배포 및 최적화.

---
*이 문서는 [doc-sync](file:///Users/leeyoungmin/깃허브/tuktak/.agents/workflows/doc-sync.md) 워크플로우에 의해 코드 변경 시마다 최신 상태로 유지됩니다.*
