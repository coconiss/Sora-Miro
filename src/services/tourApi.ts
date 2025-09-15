const BASE_URL = 'https://apis.data.go.kr/B551011';

// API 서비스 객체 - 언어별 endpoint와 서비스키를 관리
const API_SERVICES = {
ko: {
    name: 'KorService2',
endpoint: `${BASE_URL}/KorService2`,
serviceKey: 'YourApiKey' // 실제 서비스키로 교체 필요
},
en: {
name: 'EngService2',
endpoint: `${BASE_URL}/EngService2`,
serviceKey: 'YourApiKey' // 실제 서비스키로 교체 필요
},
ja: {
name: 'JpnService2',
endpoint: `${BASE_URL}/JpnService2`,
serviceKey: 'YourApiKey' // 실제 서비스키로 교체 필요
},
zh: {
name: 'ChsService2',
endpoint: `${BASE_URL}/ChsService2`,
serviceKey: 'YourApiKey' // 실제 서비스키로 교체 필요
},
de: {
name: 'GerService2',
endpoint: `${BASE_URL}/GerService2`,
serviceKey: 'YourApiKey' // 실제 서비스키로 교체 필요
},
fr: {
name: 'FreService2',
endpoint: `${BASE_URL}/FreService2`,
serviceKey: 'YourApiKey' // 실제 서비스키로 교체 필요
}
} as const;

export type Language = keyof typeof API_SERVICES;

export interface TourApiParams {
serviceKey?: string;
numOfRows?: number;
pageNo?: number;
MobileOS?: 'ETC' | 'IOS' | 'AND' | 'WIN';
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
}

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

// API 호출 공통 함수
async function callTourApi<T = any>(
language: Language,
endpoint: string,
params: TourApiParams = {}
): Promise<TourApiResponse<T>> {
const service = API_SERVICES[language];

// Set default parameters
const defaultParams: TourApiParams = {
serviceKey: service.serviceKey,
numOfRows: 12,
pageNo: 1,
MobileOS: 'ETC',
MobileApp: 'TourismApp',
_type: 'json'
};

// Only include listYN if explicitly provided in params
const requestParams = {
...defaultParams,
...params
};

// Convert to URLSearchParams, filtering out undefined values
const queryParams = new URLSearchParams();
Object.entries(requestParams).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });

  const url = `${service.endpoint}${endpoint}?${queryParams}`;
  
  // Request URL

  try {
    const response = await fetch(url);
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      // Failed to parse API response
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }


    return data;
  } catch (error: any) {
    // Handle error

    // Enhance the error with more context
    const enhancedError = new Error(`API call failed: ${error.message}`);
    (enhancedError as any).originalError = error;
    (enhancedError as any).url = url;
    throw enhancedError;
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