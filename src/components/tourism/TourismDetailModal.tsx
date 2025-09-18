import { useState, useEffect } from 'react';
import { getDetailPetTour } from '@/services/tourApi';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// HTML 콘텐츠를 안전하게 렌더링하기 위한 유틸리티 함수
const renderHtmlContent = (htmlString: string) => {
  if (!htmlString) return null;
  
  // 먼저 <br>과 같은 특수 케이스와 목록을 처리합니다
  let processedHtml = htmlString
    .replace(/<br\s*\/?>/gi, '\n') // <br> 태그를 개행문자로 변환
    .replace(/<\/p>|<\/div>|<\/li>/gi, '\n') // 블록 요소 뒤에 개행 문자 추가
    .replace(/<li>/gi, '• ') // 목록 항목을 불릿 포인트로 변환
    .replace(/<[^>]+>/g, '') // 기타 모든 HTML 태그 제거
    .replace(/&nbsp;/g, ' ') // 줄바꿈 없는 공백을 일반 공백으로 변환
    .replace(/&amp;/g, '&') // HTML 엔티티 변환
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
    
  // 연속된 개행 문자 정리
  processedHtml = processedHtml
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
    
  return processedHtml;
};
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Clock,
  Globe,
  Info,
  Calendar,
  Car,
  Users,
  CreditCard,
  PawPrint,
  Baby,
  Star,
  ExternalLink,
  Map
} from "lucide-react";
import { TourismItem } from "@/types/tourism";

interface TourismDetailModalProps {
  item: TourismItem | null;
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  petInfo?: {
    acmpyPsblCpam?: string;      // 동반가능동물
    relaRentlPrdlst?: string;    // 관련렌탈품목
    acmpyNeedMtr?: string;       // 동반시필요사항
    relaFrnshPrdlst?: string;    // 관련 비치 품목
    etcAcmpyInfo?: string;       // 기타 동반 정보
    relaPurcPrdlst?: string;     // 관련 구매 품목
    relaAcdntRiskMtr?: string;   // 관련 사고 대비사항
    acmpyTypeCd?: string;        // 동반유형
    relaPosesFclty?: string;     // 관련 구비 시설
  } | null;
}

const getCategoryName = (catCode?: string): string => {
  if (!catCode) return '기타';

  const categories: { [key: string]: string } = {
    'A01': '자연', 'A02': '인문', 'A03': '레포츠', 'A04': '쇼핑', 'A05': '음식',
    'B01': '숙박', 'B02': '캠핑', 'B03': '휴양', 'B04': '이색숙박',
    'C01': '축제', 'C02': '공연', 'C03': '전시', 'C04': '체험', 'C05': '행사',
    'D01': '레포츠시설', 'D02': '레포츠강습', 'D03': '레포츠대회',
    'E01': '의료시설', 'E02': '보건위생', 'E03': '공공기관', 'E04': '은행/금융',
    'F01': '카페', 'F02': '식당', 'F03': '주점', 'F04': '전통음식', 'F05': '기타'
  };
  return categories[catCode] || catCode;
};

const getContentTypeName = (contentTypeId?: string): string => {
  if (!contentTypeId) return '';

  const contentTypes: { [key: string]: string } = {
    '12': '관광지', '14': '문화시설', '15': '행사/공연/축제',
    '25': '여행코스', '28': '레포츠', '32': '숙박',
    '38': '쇼핑', '39': '음식점'
  };
  return contentTypes[contentTypeId.toString()] || '';
};

export const TourismDetailModal = ({ item, open, onClose, loading = false }: TourismDetailModalProps) => {
  const { language } = useLanguage();
  const [petInfo, setPetInfo] = useState<{
    acmpyPsblCpam?: string;      // 동반가능동물
    relaRentlPrdlst?: string;    // 관련렌탈품목
    acmpyNeedMtr?: string;       // 동반시필요사항
    relaFrnshPrdlst?: string;    // 관련 비치 품목
    etcAcmpyInfo?: string;       // 기타 동반 정보
    relaPurcPrdlst?: string;     // 관련 구매 품목
    relaAcdntRiskMtr?: string;   // 관련 사고 대비사항
    acmpyTypeCd?: string;        // 동반유형
    relaPosesFclty?: string;     // 관련 구비 시설
  } | null>(null);
  const [loadingPetInfo, setLoadingPetInfo] = useState(false);

  useEffect(() => {
    const fetchPetInfo = async () => {
      if (!open || !item?.contentid) {
        setPetInfo(null);
        return;
      }

      try {
        setLoadingPetInfo(true);
        const response = await getDetailPetTour(language as any, item.contentid);
        if (response?.response?.body?.items?.item?.[0]) {
          setPetInfo(response.response.body.items.item[0]);
        } else {
          setPetInfo(null);
        }
      } catch (error) {
        console.error('Failed to fetch pet info:', error);
        setPetInfo(null);
      } finally {
        setLoadingPetInfo(false);
      }
    };

    fetchPetInfo();
  }, [open, item?.contentid, language]);

  if (!item && !loading) return null;

  const formatAddress = (item: TourismItem): string => {
    if (item.addr1) {
      let address = item.addr1.trim();
      if (item.addr2 && item.addr2.trim()) {
        address += ' ' + item.addr2.trim();
      }
      return address;
    }
    if (item.address) return item.address.trim();
    if (item.roadAddress) return item.roadAddress.trim();
    if (item.jibunAddress) return item.jibunAddress.trim();
    return '주소 정보 없음';
  };

  // Format festival date range (YYYYMMDD → YYYY.MM.DD)
  const formatDateRange = (start: string, end: string): string => {
    if (!start || !end) return '';

    const formatDate = (dateStr: string) => {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${year}년 ${month}월 ${day}일`;
    };

    return `${formatDate(start)} ~ ${formatDate(end)}`;
  };

  const festivalDateRange = (item && (item as any).eventstartdate && (item as any).eventenddate)
    ? formatDateRange((item as any).eventstartdate, (item as any).eventenddate)
    : '';

  const address = formatAddress(item);
  const category = item.cat1 ? getCategoryName(item.cat1) : (item.category || '기타');
  const contentType = getContentTypeName(item.contenttypeid);

  const mapUrl = address && address !== '주소 정보 없음'
    ? `https://map.naver.com/p/search/${encodeURIComponent(address)}`
    : '#';

  let homepage = item.homepage || '';
  if (homepage && !homepage.startsWith('http')) {
    homepage = 'http://' + homepage;
  }

  const InfoSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );

  const InfoItem = ({ icon: Icon, label, value, link }: { icon: any, label: string, value: string, link?: string }) => {
    // 앵커 태그에서 제목 추출
    const getLinkTitle = (html: string) => {
      // 1. title 속성에서 제목 추출 시도
      const titleMatch = html.match(/title="([^"]*)"/);
      if (titleMatch && titleMatch[1]) {
        return titleMatch[1];
      }

      // 2. title이 없으면 >와 < 사이의 링크 텍스트 추출 시도
      const textMatch = html.match(/>([^<]*)</);
      if (textMatch && textMatch[1]) {
        return textMatch[1].trim();
      }

      // 3. 텍스트가 없으면 URL을 대체값으로 사용
      const urlMatch = html.match(/href="([^"]*)"/);
      return urlMatch ? urlMatch[1].replace(/^https?:\/\//, '') : html;
    };

    // 앵커 태그에서 URL 추출
    const getLinkHref = (html: string) => {
      const match = html.match(/href="([^"]*)"/);
      return match ? match[1] : html;
    };

    const isHtmlLink = value.includes('<a href=');
    const displayText = isHtmlLink ? getLinkTitle(value) : renderHtmlContent(value);
    const href = isHtmlLink ? getLinkHref(value) : (link || value);
    const isExternalLink = isHtmlLink || link;

    return (
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
        <Icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground">{label}</div>
          {isExternalLink ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover flex items-center gap-1 mt-1 break-all"
            >
              {displayText} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          ) : (
            <div className="text-muted-foreground mt-1 whitespace-pre-line">
              {displayText}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-left pr-8">{loading ? '로딩 중...' : item?.title}</DialogTitle>
          <div className="flex flex-col gap-3 mt-3">
            <div className="flex gap-2">
              <Badge variant="secondary">{category}</Badge>
              {contentType && <Badge variant="outline">{contentType}</Badge>}
            </div>
            {festivalDateRange && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{festivalDateRange}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6">
          <div className="space-y-6 pb-6">
            {/* Hero Image */}
            <div className="relative -mx-6 overflow-hidden bg-muted/20">
              <div className="w-full aspect-video max-h-[500px] flex items-center justify-center">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-pulse w-11/12 h-48 bg-muted rounded" />
                  </div>
                ) : item.firstimage || item.image ? (
                  <img
                    src={item.firstimage || item.image}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                    <Star className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <InfoSection icon={Info} title="기본 정보">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <InfoItem
                    icon={MapPin}
                    label="주소"
                    value={address}
                    link={mapUrl !== '#' ? mapUrl : undefined}
                  />

                  {item.tel && (
                    <InfoItem icon={Phone} label="전화번호" value={item.tel} />
                  )}

                  {item.infocenter && item.infocenter !== item.tel && (
                    <InfoItem icon={Phone} label="문의처" value={item.infocenter} />
                  )}

                  {item.bookingplace && (
                    <InfoItem icon={Phone} label="예약처" value={item.bookingplace} />
                  )}

                  {homepage && (
                    <InfoItem
                      icon={Globe}
                      label="홈페이지"
                      value={homepage}
                    />
                  )}
                </>
              )}
            </InfoSection>

            {/* Description */}
            {(item.overview || item.description) && (
              <>
                <Separator />
                <InfoSection icon={Info} title="상세 설명">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {renderHtmlContent(item.overview || item.description || '')}
                    </p>
                    {item.expguide && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="font-medium mb-2">체험 안내</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {renderHtmlContent(item.expguide || '')}
                        </p>
                      </div>
                    )}
                    {item.expagerange && (
                      <div className="mt-3">
                        <span className="font-medium">체험 가능 연령:</span> {item.expagerange}
                      </div>
                    )}
                  </div>
                </InfoSection>
              </>
            )}

            {/* Usage Information */}
            {(item.usetime || item.restdate || item.parking || item.useseason || item.accomcount) && (
              <>
                <Separator />
                <InfoSection icon={Clock} title="이용 안내">
                  {item.usetime && (
                    <InfoItem icon={Clock} label="이용시간" value={item.usetime} />
                  )}

                  {item.restdate && (
                    <InfoItem icon={Calendar} label="휴무일" value={item.restdate} />
                  )}

                  {item.parking && (
                    <InfoItem icon={Car} label="주차 정보" value={item.parking} />
                  )}

                  {item.useseason && (
                    <InfoItem icon={Calendar} label="이용 시기" value={item.useseason} />
                  )}

                  {item.accomcount && (
                    <InfoItem icon={Users} label="수용 인원" value={item.accomcount} />
                  )}
                </InfoSection>
              </>
            )}

            {/* Facilities */}
            {(item.chkcreditcard === 'Y' || item.chkpet === 'Y' || item.chkbabycarriage === 'Y' || item.subfacility) && (
              <>
                <Separator />
                <InfoSection icon={Star} title="시설 안내">
                  {item.subfacility && (
                    <InfoItem icon={Star} label="부대시설" value={item.subfacility} />
                  )}

                  {(item.chkcreditcard === 'Y' || item.chkpet === 'Y' || item.chkbabycarriage === 'Y') && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium mb-2">이용 가능 서비스</div>
                      <div className="space-y-1">
                        {item.chkcreditcard === 'Y' && (
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-4 w-4" />
                            <span>신용카드 가능</span>
                          </div>
                        )}
                        {item.chkpet === 'Y' && (
                          <div className="flex items-center gap-2 text-sm">
                            <PawPrint className="h-4 w-4" />
                            <span>애완동물 동반 가능</span>
                          </div>
                        )}
                        {item.chkbabycarriage === 'Y' && (
                          <div className="flex items-center gap-2 text-sm">
                            <Baby className="h-4 w-4" />
                            <span>유모차 대여 가능</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </InfoSection>
              </>
            )}

            {/* 반려동물 동반 정보 */}
            {petInfo && (
              <>
                <Separator />
                <InfoSection icon={PawPrint} title="반려동물 동반 정보">
                  <div className="space-y-3">
                    {petInfo.acmpyPsblCpam && (
                      <InfoItem
                        icon={PawPrint}
                        label="동반 가능한 동물"
                        value={petInfo.acmpyPsblCpam}
                      />
                    )}
                    {petInfo.acmpyTypeCd && (
                      <InfoItem
                        icon={PawPrint}
                        label="동반 유형"
                        value={petInfo.acmpyTypeCd}
                      />
                    )}
                    {petInfo.acmpyNeedMtr && (
                      <InfoItem
                        icon={PawPrint}
                        label="동반 시 필요사항"
                        value={petInfo.acmpyNeedMtr}
                      />
                    )}
                    {petInfo.relaRentlPrdlst && (
                      <InfoItem
                        icon={PawPrint}
                        label="관련 렌탈 품목"
                        value={petInfo.relaRentlPrdlst}
                      />
                    )}
                    {petInfo.relaFrnshPrdlst && (
                      <InfoItem
                        icon={PawPrint}
                        label="관련 비치 품목"
                        value={petInfo.relaFrnshPrdlst}
                      />
                    )}
                    {petInfo.relaPurcPrdlst && (
                      <InfoItem
                        icon={PawPrint}
                        label="관련 구매 품목"
                        value={petInfo.relaPurcPrdlst}
                      />
                    )}
                    {petInfo.relaPosesFclty && (
                      <InfoItem
                        icon={PawPrint}
                        label="관련 구비 시설"
                        value={petInfo.relaPosesFclty}
                      />
                    )}
                    {petInfo.relaAcdntRiskMtr && (
                      <InfoItem
                        icon={PawPrint}
                        label="사고 대비사항"
                        value={petInfo.relaAcdntRiskMtr}
                      />
                    )}
                    {petInfo.etcAcmpyInfo && (
                      <InfoItem
                        icon={PawPrint}
                        label="기타 동반 정보"
                        value={petInfo.etcAcmpyInfo}
                      />
                    )}
                  </div>
                </InfoSection>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};