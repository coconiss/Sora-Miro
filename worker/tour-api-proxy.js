// 캐시 TTL 설정 (초 단위)
const CACHE_TTL = 60 * 10; // 5분 캐시

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24시간 캐시
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const origin = request.headers.get('Origin') || '*';
  
  // CORS 프리플라이트 요청 처리
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  // GET 요청만 허용
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json',
      },
    });
  }

  // 요청 URL 파싱
  const url = new URL(request.url);
  const path = url.pathname;
  
  // API 키 확인
  const API_KEY = TOUR_API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json',
      },
    });
  }

  // 캐시 키 생성 (URL 기반)
  const cacheKey = new Request(request.url, request);
  const cache = caches.default;

  // 캐시에서 응답 확인
  let response = await cache.match(cacheKey);
  if (response) {
    console.log('Cache hit!');
    return response;
  }
  
  console.log('Cache miss, fetching from API...');
  
  try {
    const encodedKey = encodeURIComponent(API_KEY);
    // 실제 API로 요청 전달
    const apiUrl = `https://apis.data.go.kr/B551011${path}?serviceKey=${encodedKey}&${url.searchParams.toString()}`;
    
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // 응답 본문 가져오기
    const responseText = await apiResponse.text();

    if (!apiResponse.ok) {
      throw new Error(`API request failed (${apiResponse.status}): ${responseText}`);
    }

    // JSON 파싱
    const data = JSON.parse(responseText);
    
    // 응답 생성 및 캐싱 설정
    const response = new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_TTL}`,
      },
    });
    
    // 응답을 캐시에 저장 (비동기로 처리)
    event.waitUntil(cache.put(cacheKey, response.clone()));
    event.waitUntil(cache.put(cacheKey, response.clone()));
    
    return response;
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack,
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json',
      },
    });
  }
}

// OPTIONS 요청 처리 함수
function handleOptions(request) {
  const origin = request.headers.get('Origin') || '*';
  
  return new Response(null, {
    headers: {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || '*',
    },
  });
}
