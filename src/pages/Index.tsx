import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { TourismCard } from "@/components/tourism/TourismCard";
import { TourismDetailModal } from "@/components/tourism/TourismDetailModal";
import { SearchBar } from "@/components/tourism/SearchBar";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { Pagination } from "@/components/common/Pagination";
import { TourismItem } from "@/types/tourism";
import { useTourismData, SearchFilters } from "@/hooks/useTourismData";
import { Compass, MapPin, Image, Users, Star } from "lucide-react";
import heroTemple from "@/assets/hero-temple.jpg";

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<TourismItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items, loading, searchTourism, getItemDetail, totalCount, currentPage } = useTourismData();
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    region: ''
  });

  const handleShowDetails = async (id: string) => {
    const item = items.find(item => item.id === id || item.contentid === id);
    if (item) {
      // API에서 상세 정보를 가져옵니다
      const detailItem = await getItemDetail(item.contentid || item.id, item.contenttypeid);
      setSelectedItem(detailItem || item);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    searchTourism(filters, 1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    searchTourism(currentFilters, page);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const { t } = useLanguage();
  
  const stats = [
    { icon: MapPin, label: t('stats.attractions'), value: "50,000+" },
    { icon: Image, label: t('stats.images'), value: "5,000+" },
    { icon: Users, label: t('stats.visitors'), value: "1,600만+" },
    { icon: Compass, label: t('stats.tours'), value: "1,000+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroTemple})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
        
        {/* Language Selector */}
        <div className="absolute top-6 right-6 z-20">
          <LanguageSelector />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {t('hero.title').split(' ')[0]} <span className="bg-gradient-accent bg-clip-text text-transparent">{t('hero.title').split(' ')[1]}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('search.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('search.subtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">
              {items.length > 0 ? '최신 여행지' : '검색 결과'}
            </h3>
            <div className="text-muted-foreground">
              총 {totalCount}개의 결과
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-lg mb-4"></div>
                  <div className="bg-muted h-4 rounded mb-2"></div>
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <TourismCard
                  key={item.id}
                  item={item}
                  onShowDetails={handleShowDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-muted-foreground">다른 검색어나 필터를 시도해보세요</p>
            </div>
          )}
          
          {items.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalCount}
              itemsPerPage={12}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </div>
      </section>

      {/* Modal */}
      <TourismDetailModal
        item={selectedItem}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
