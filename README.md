Sora-Miro
=========

프로젝트 개요
--------------
Sora-Miro는 한국 관광 공공 API를 활용해 관광지, 행사, 숙박 등의 정보를 조회하는 React 기반 웹 애플리케이션입니다.

주요 기술 스택
--------------
- React 18
- TypeScript
- Vite
- TailwindCSS
- @tanstack/react-query
- Radix UI 컴포넌트

빠른 시작
--------
1. 의존성 설치

```powershell
npm install
```

2. 환경 변수

- `VITE_TOUR_WORKER_URL` : 클라이언트가 호출할 프록시(예: Cloudflare Worker) URL.
  - 실제 관광 공공 API 키(`serviceKey`)는 클라이언트에 노출하지 마시고 워커 또는 서버에서 관리하세요.

3. 개발 서버 실행

```powershell
npm run dev
```

4. 타입 체크

```powershell
npx tsc --noEmit
```