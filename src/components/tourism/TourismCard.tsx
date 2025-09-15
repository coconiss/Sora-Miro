import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, Calendar } from "lucide-react";
import { TourismItem } from "@/types/tourism";

interface TourismCardProps {
  item: TourismItem;
  onShowDetails: (id: string) => void;
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

export const TourismCard = ({ item, onShowDetails }: TourismCardProps) => {
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

  const category = item.cat1 ? getCategoryName(item.cat1) : (item.category || '기타');
  const address = formatAddress(item);

  // Format festival date range (YYYYMMDD → YYYY.MM.DD)
  const formatDateRange = (start: string, end: string): string => {
    if (!start || !end) return '';
    
    const formatDate = (dateStr: string) => {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${year}.${month}.${day}`;
    };
    
    return `${formatDate(start)} ~ ${formatDate(end)}`;
  };
  
  const festivalDateRange = item.eventstartdate && item.eventenddate 
    ? formatDateRange(item.eventstartdate, item.eventenddate)
    : '';

  return (
    <Card className="group cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        {item.firstimage || item.image ? (
          <img
            src={item.firstimage || item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <Star className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-accent text-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            {category}
          </span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </div>
          
          {item.tel && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{item.tel}</span>
            </div>
          )}
          
          {festivalDateRange && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{festivalDateRange}</span>
            </div>
          )}
          {item.usetime && !festivalDateRange && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="line-clamp-1">{item.usetime}</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => onShowDetails(item.id)}
          variant="hero"
          className="w-full"
          size="sm"
        >
          자세히 보기
        </Button>
      </CardContent>
    </Card>
  );
};