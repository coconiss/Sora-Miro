// tourApi 모듈
// - 공공 관광 API(한국관광공사) 호출을 위한 헬퍼들을 제공합니다.
// - 클라이언트는 로컬/프록시(worker) URL을 통해 요청을 보냅니다. 민감한 키는 서버/워커에서 관리해야 합니다.
const BASE_URL = 'https://apis.data.go.kr/B551011';

// 클라이언트에서 호출하는 프록시(예: Cloudflare Worker) 기본 URL
// 환경 변수 VITE_TOUR_WORKER_URL이 설정되어 있으면 그 값을 사용하고, 없을 경우 기본 프록시 URL을 사용합니다.
const WORKER_URL = ((import.meta as any)?.env?.VITE_TOUR_WORKER_URL as string) || 'https://tour-api-proxy.lsd9901.workers.dev';

// 언어별 서비스명 매핑 (공공 API의 서비스 식별자)
const API_SERVICES = {
  ko: 'KorService2',
  en: 'EngService2',
  ja: 'JpnService2',
  zh: 'ChsService2',
  de: 'GerService2',
  fr: 'FreService2'
} as const;

export type Language = keyof typeof API_SERVICES;

/**
 * TourApiParams
 * - 공공 API에 넘기는 쿼리 파라미터들을 타입으로 정의합니다.
 * - 필요한 경우 추가 필드를 여기에 선언하세요.
 */
export interface TourApiParams {
  serviceKey?: string;
  numOfRows?: number;
  pageNo?: number;
  // MobileOS 값: IOS(아이폰), AND(안드로이드), WEB(웹), ETC(기타)
  MobileOS?: 'ETC' | 'IOS' | 'AND' | 'WEB';
  MobileApp?: string;
  _type?: 'json' | 'xml';
  listYN?: 'Y' | 'N';
  arrange?: 'A' | 'B' | 'C' | 'D' | 'E';
  contentTypeId?: string;
  areaCode?: string;
  sigunguCode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  keyword?: string;
  contentId?: string;
  mapX?: string;
  mapY?: string;
  radius?: number;
  defaultYN?: 'Y' | 'N';
  firstImageYN?: 'Y' | 'N';
  areacodeYN?: 'Y' | 'N';
  catcodeYN?: 'Y' | 'N';
  addrinfoYN?: 'Y' | 'N';
  mapinfoYN?: 'Y' | 'N';
  overviewYN?: 'Y' | 'N';
  imageYN?: 'Y' | 'N';
  subImageYN?: 'Y' | 'N';
  // 축제/행사 파라미터 (YYYYMMDD 형식)
  eventStartDate?: string;
  eventEndDate?: string;
}

/**
 * TourApiResponse
 * - 공공 API의 공통 응답 래퍼 구조를 표현합니다.
 * - 실제 item 타입은 제네릭으로 전달합니다.
 */
export interface TourApiResponse<T = any> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: T[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 인메모리 캐시 (개발 환경 HMR 시 유지되도록 globalThis에 저장)
const CACHE_TTL_MS = 5 * 60 * 1000; // 5분
if (!(globalThis as any).__tourApiCache) {
  (globalThis as any).__tourApiCache = new Map<string, { expiry: number; data: any }>();
}
const cache: Map<string, { expiry: number; data: any }> = (globalThis as any).__tourApiCache;

/**
 * fetchWithRetry
 * - 지정한 타임아웃과 재시도 수를 사용해 fetch를 수행합니다.
 * - 4xx 응답은 재시도하지 않으며, 타임아웃 발생 시 AbortController로 요청을 취소합니다.
 * @param url 요청 URL
 * @param options fetch 옵션
 * @param timeoutMs 타임아웃(ms)
 * @param retries 재시도 횟수
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, timeoutMs = 10000, retries = 1): Promise<Response> {
  const attempt = async (n: number): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!resp.ok) {
        // 4xx 에러의 경우 재시도하지 않음
        if (resp.status >= 400 && resp.status < 500) {
          return resp;
        }
        throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      }
      return resp;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        // 타임아웃으로 처리
        if (n <= 0) throw new Error('Request timed out');
      }
      if (n <= 0) throw err;
      // 지수 백오프
      const backoff = 200 * Math.pow(2, retries - n);
      await new Promise((res) => setTimeout(res, backoff));
      return attempt(n - 1);
    }
  };

  return attempt(retries + 1);
}

/**
 * callTourApi
 * - 언어별 서비스 엔드포인트에 요청을 보내고, 공통 응답 타입으로 반환합니다.
 * - 내부적으로 캐시 확인, fetchWithRetry 호출, 에러 표준화 처리를 수행합니다.
 * @param language 사용할 언어(서비스)
 * @param endpoint 서비스 엔드포인트 (예: '/areaBasedList2')
 * @param params API 파라미터
 */
export async function callTourApi<T>(
  language: Language,
  endpoint: string,
  params: TourApiParams = {}
): Promise<TourApiResponse<T>> {
  const serviceName = API_SERVICES[language];
  if (!serviceName) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // 기본 파라미터 설정 (웹에서는 MobileOS를 WEB으로 고정)
  const defaultParams: TourApiParams = {
    MobileOS: 'WEB',
    MobileApp: 'SoraMiro',
    _type: 'json',
    ...params,
  };

  // URLSearchParams를 사용하여 쿼리 파라미터 생성
  const queryParams = new URLSearchParams();
  Object.entries(defaultParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // 배열인 경우 각 요소를 반복하여 추가
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  // 엔드포인트 앞에 슬래시가 있으면 제거
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  const url = new URL(`${serviceName}/${cleanEndpoint}`, WORKER_URL);

  // 쿼리 파라미터 추가
  queryParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  // 캐시 확인
  const cacheKey = url.toString();
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > now) {
    return cached.data as TourApiResponse<T>;
  }
  // --- fetch 호출 (재시도 포함) ---
  const DEFAULT_TIMEOUT_MS = 10000; // 10초
  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  };

  try {
    const response = await fetchWithRetry(url.toString(), fetchOptions, DEFAULT_TIMEOUT_MS, 2);
    if (!response.ok) {
      // JSON 에러 본문이 있는 경우 파싱 시도
      let bodyText: string | undefined;
      try {
        bodyText = await response.text();
      } catch {}
      const err = new Error(`API request failed with status ${response.status}: ${bodyText || response.statusText}`);
      (err as any).status = response.status;
      (err as any).url = url.toString();
      throw err;
    }

    const json = await response.json();

    // 성공 응답 캐싱
    try {
      cache.set(cacheKey, { expiry: Date.now() + CACHE_TTL_MS, data: json });
    } catch (e) {
      console.warn('Failed to cache API response', e);
    }

    return json;
  } catch (error: any) {
    // 컨텍스트와 함께 오류 객체 표준화
    if (error.name === 'AbortError' || /timed out/i.test(error.message || '')) {
      const e = new Error('API 요청이 타임아웃되었습니다. 네트워크 상태를 확인하세요.');
      (e as any).original = error;
      (e as any).url = url.toString();
      throw e;
    }
    const e = new Error(error.message || 'API 호출 실패');
    (e as any).original = error;
    (e as any).url = url.toString();
    throw e;
  }
}

// 지역기반 관광정보 조회
export async function getAreaBasedList(
  language: Language,
  params: TourApiParams = {}
): Promise<TourApiResponse> {
  return callTourApi(language, '/areaBasedList2', params);
}

// 키워드 검색
export async function searchKeyword(
  language: Language,
  keyword: string,
  params: TourApiParams = {}
): Promise<TourApiResponse> {
  return callTourApi(language, '/searchKeyword2', {
    ...params,
    keyword
  });
}

// 지역코드 조회
export async function getAreaCode(
  language: Language,
  areaCode?: string
): Promise<TourApiResponse> {
  return callTourApi(language, '/areaCode2', {
    areaCode,
    numOfRows: 20
  });
}

// 서비스분류코드 조회
export async function getCategoryCode(
  language: Language,
  contentTypeId?: string,
  cat1?: string,
  cat2?: string
): Promise<TourApiResponse> {
  return callTourApi(language, '/categoryCode2', {
    contentTypeId,
    cat1,
    cat2,
    numOfRows: 20
  });
}

// 공통정보 상세조회
export async function getDetailCommon(
  language: Language,
  contentId: string,
  contentTypeId?: string
): Promise<TourApiResponse> {
  return callTourApi(language, '/detailCommon2', {
    contentId
  });
}

// 소개정보 조회
export async function getDetailIntro(
  language: Language,
  contentId: string,
  contentTypeId: string
): Promise<TourApiResponse> {
  return callTourApi(language, '/detailIntro2', {
    contentId,
    contentTypeId
  });
}

// 반복정보 조회 (상세정보)
export async function getDetailInfo(
  language: Language,
  contentId: string,
  contentTypeId: string
): Promise<TourApiResponse> {
  return callTourApi(language, '/detailInfo2', {
    contentId,
    contentTypeId
  });
}

// 이미지정보 조회
export async function getDetailImage(
  language: Language,
  contentId: string
): Promise<TourApiResponse> {
  return callTourApi(language, '/detailImage2', {
    contentId,
    imageYN: 'Y',
    subImageYN: 'Y',
    numOfRows: 20
  });
}

// 행사정보 조회
export async function searchFestival(
  language: Language,
  params: TourApiParams = {}
): Promise<TourApiResponse> {
  return callTourApi(language, '/searchFestival2', params);
}

// 숙박정보 조회  
export async function searchStay(
  language: Language,
  params: TourApiParams = {}
): Promise<TourApiResponse> {
  return callTourApi(language, '/searchStay2', params);
}

// 위치기반 관광정보 조회
export async function getLocationBasedList(
  language: Language,
  mapX: string,
  mapY: string,
  radius: number = 1000,
  params: TourApiParams = {}
): Promise<TourApiResponse> {
  return callTourApi(language, '/locationBasedList2', {
    ...params,
    mapX,
    mapY,
    radius
  });
}

// 지역 코드 매핑 (한국 지역)
export const AREA_CODES = {
  seoul: '1',
  incheon: '2', 
  daejeon: '3',
  daegu: '4',
  gwangju: '5',
  busan: '6',
  ulsan: '7',
  sejong: '8',
  gyeonggi: '31',
  gangwon: '32',
  chungbuk: '33',
  chungnam: '34',
  gyeongbuk: '35',
  gyeongnam: '36',
  jeonbuk: '37',
  jeonnam: '38',
  jeju: '39'
} as const;

// 콘텐츠 타입 코드
export const CONTENT_TYPE_CODES = {
  tourist_spot: '12',      // 관광지
  cultural_facility: '14', // 문화시설
  festival: '15',          // 행사/공연/축제
  travel_course: '25',     // 여행코스
  leports: '28',          // 레포츠
  accommodation: '32',     // 숙박
  shopping: '38',         // 쇼핑
  restaurant: '39'        // 음식점
} as const;