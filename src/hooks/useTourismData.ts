import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

//gpt
import { getAreaBasedList, getDetailCommon, getDetailInfo, getDetailIntro, searchKeyword, searchFestival, AREA_CODES, CONTENT_TYPE_CODES, type TourApiParams } from '@/services/tourApi';
import { TourismItem } from '@/types/tourism';
import { useToast } from '@/hooks/use-toast';

//export interface SearchFilters {
//  query: string;
//  category: string;
//  region: string;
//}
//gpt
export interface SearchFilters {
  query: string;
  category: string;
  region: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export const useTourismData = () => {
  const [items, setItems] = useState<TourismItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { language } = useLanguage();
  const { toast } = useToast();

  // API 응답 데이터를 TourismItem 형식으로 변환
  const transformApiData = (apiData: any[]): TourismItem[] => {
    return apiData.map((item: any) => ({
      id: item.contentid || item.contentId || Math.random().toString(),
      contentid: item.contentid,
      contenttypeid: item.contenttypeid,
      title: item.title,
      addr1: item.addr1,
      addr2: item.addr2,
      address: item.addr1 || item.address,
      roadAddress: item.roadaddress,
      jibunAddress: item.jibunaddress,
      tel: item.tel,
      infocenter: item.infocenter,
      infocentertourcourse: item.infocentertourcourse,
      bookingplace: item.bookingplace,
      homepage: item.homepage,
      firstimage: item.firstimage,
      image: item.firstimage2 || item.image,
      overview: item.overview,
      description: item.overview,
      expguide: item.expguide,
      expagerange: item.expagerange,
      usetime: item.usetime,
      parking: item.parking,
      restdate: item.restdate,
      accomcount: item.accomcount,
      useseason: item.useseason,
      chkcreditcard: item.chkcreditcard,
      chkpet: item.chkpet,
      chkbabycarriage: item.chkbabycarriage,
      subfacility: item.subfacility,
      heritage1: item.heritage1,
      heritage2: item.heritage2,
      heritage3: item.heritage3,
      cat1: item.cat1,
      cat2: item.cat2,
      cat3: item.cat3,
      category: item.cat1,
      mapx: item.mapx,
      mapy: item.mapy,
      createdtime: item.createdtime,
      modifiedtime: item.modifiedtime,
      eventstartdate: item.eventstartdate,
      eventenddate: item.eventenddate
    }));
  };

  // 관광 정보 검색
  const searchTourism = async (filters: SearchFilters, page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params: TourApiParams = {
        pageNo: page,
        numOfRows: 12,
        _type: 'json', // Ensure JSON response
        arrange: 'C', // Sort by modified date (most recent first)
      };
      
      // Reset to first page if filters change
      if (page === 1) {
        setItems([]);
      }

      // 지역 필터 적용
      if (filters.region && filters.region !== 'all') {
        params.areaCode = AREA_CODES[filters.region as keyof typeof AREA_CODES];
      }

      // 카테고리 필터 적용
      if (filters.category && filters.category !== 'all') {
        params.cat1 = filters.category;
      }

      let response;
      
      try {
        // 키워드가 있으면 키워드 검색, 없으면 지역기반 목록 조회
//        if (filters.query.trim()) {
//          response = await searchKeyword(language, filters.query, params);
//        } else {
//          response = await getAreaBasedList(language, params);
//        }

        // gpt
        // 축제/공연 분기: searchFestival2 (행사정보 조회)
        if (filters.category === 'C01') {
          const toYmd = (d?: string) => d ? d.replace(/-/g, '') : undefined;
          // Create a new params object with only the required parameters for festival API
          const festParams: TourApiParams = {
            numOfRows: params.numOfRows,
            pageNo: params.pageNo,
            MobileOS: 'ETC',
            MobileApp: 'TourismApp',
            AreaCode: params.areaCode,
            _type: 'json',
            eventStartDate: toYmd(filters.startDate),
            ...(filters.endDate ? { eventEndDate: toYmd(filters.endDate) } : {}),
          };
          
          response = await searchFestival(language, festParams);
        } else if (filters.query.trim()) {
          // 기존 로직: 키워드 검색
          response = await searchKeyword(language, filters.query, params);
        } else {
          // 기존 로직: 지역기반 목록 조회
          response = await getAreaBasedList(language, params);
        }


        // Handle case where response is in the error format
        if (response && response.responseTime && response.resultCode) {
          
          throw new Error(`API Error (${response.resultCode}): ${response.resultMsg || 'Unknown error'}`);
        }

        if (!response) {
          throw new Error('No response received from API');
        }

        // Handle different possible response formats
        if (response.response) {
          // Expected success format
          if (response.response.header?.resultCode === '0000') {
            const apiItems = Array.isArray(response.response.body?.items?.item)
              ? response.response.body.items.item
              : [];

            const transformedItems = transformApiData(apiItems);
            setItems(transformedItems);
            setTotalCount(response.response.body?.totalCount || 0);
            setCurrentPage(page);
            return;
          } else if (response.response.header) {
            // API returned an error
            throw new Error(
              response.response.header.resultMsg ||
              `API Error (${response.response.header.resultCode || 'unknown'})`
            );
          }
        }

        // If we get here, the response format is unexpected
        
        throw new Error('Unexpected response format from API');
      } catch (apiError) {
        
        throw apiError;
      }
    } catch (err: any) {
      
      let errorMessage = '데이터를 불러오는데 실패했습니다.';

      if (err.response) {
        // If we have a response, try to extract meaningful error info
        const { header, body } = err.response.response || {};
        if (header) {
          errorMessage = header.resultMsg || errorMessage;
        } else if (body) {
          errorMessage = body.message || JSON.stringify(body);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setLoading(false);
    }
  };

  // 상세 정보 조회
  const getItemDetail = async (contentId: string, contentTypeId?: string): Promise<TourismItem | null> => {
    try {
      if (!contentTypeId) {
        throw new Error('Content type ID is required');
      }

      // 공통 정보와 소개 정보, 상세 정보를 순차적으로 조회 (병렬 호출 대신 순차 호출로 변경)
      let combinedData: any = { contentid: contentId, contenttypeid: contentTypeId };

      try {
        // 1. 공통 정보 조회
        const commonResponse = await getDetailCommon(language, contentId, contentTypeId);
        
        if (commonResponse?.response?.header?.resultCode === '0000' && commonResponse.response.body?.items?.item?.[0]) {
          combinedData = { ...combinedData, ...commonResponse.response.body.items.item[0] };
        } else {
          
        }
      } catch (commonError) {
        
      }

      try {
        // 2. 소개 정보 조회
        const introResponse = await getDetailIntro(language, contentId, contentTypeId);
        if (introResponse?.response?.header?.resultCode === '0000' && introResponse.response.body?.items?.item?.[0]) {
          combinedData = { ...combinedData, ...introResponse.response.body.items.item[0] };
        } else {
          
        }
      } catch (introError) {
        
      }

      try {
        // 3. 상세 정보 조회
        const detailResponse = await getDetailInfo(language, contentId, contentTypeId);
        
        if (detailResponse?.response?.header?.resultCode === '0000' && Array.isArray(detailResponse.response.body?.items?.item)) {
          detailResponse.response.body.items.item.forEach((item: any) => {
            if (item.infoname && item.infotext) {
              combinedData[item.infoname] = item.infotext;
            }
          });
        } else {
          
        }
      } catch (detailError) {
        
      }

      return transformApiData([combinedData])[0] || null;
    } catch (err: any) {
      
      toast({
        title: "오류",
        description: "상세 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
      return null;
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    searchTourism({ query: '', category: 'all', region: 'all' });
  }, [language]);

  return {
    items,
    loading,
    error,
    totalCount,
    currentPage,
    searchTourism,
    getItemDetail,
    setCurrentPage
  };
};