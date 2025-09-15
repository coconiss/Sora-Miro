import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilters } from "@/hooks/useTourismData";
import { useTourismOptions } from "@/hooks/useTourismOptions";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

export const SearchBar = ({ onSearch, loading = false }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");

  // Format: YYYY-MM-DD
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [showDateError, setShowDateError] = useState(false);
  const startDateRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (category === 'C01' && !startDate) {
      setShowDateError(true);
      startDateRef.current?.focus();
      return;
    }
    setShowDateError(false);
    onSearch({ query, category, region, startDate, endDate });
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const { categories, regions } = useTourismOptions();

  return (
    <div className="w-full bg-background/95 backdrop-blur-sm border rounded-xl p-6 shadow-card">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          {category === "C01" ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm text-muted-foreground mb-1">시작일 <span className="text-red-500">*</span></label>
                <Input 
                  ref={startDateRef}
                  type="date" 
                  value={startDate || ""} 
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setShowDateError(false);
                  }}
                  className={showDateError ? 'border-red-500' : ''}
                />
                {showDateError && (
                  <p className="mt-1 text-sm text-red-500">시작일을 입력해주세요.</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm text-muted-foreground mb-1">종료일 (선택)</label>
                <Input type="date" value={endDate || ""} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="관광지, 음식점, 숙박 등을 검색해보세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9 h-12"
              />
            </div>
          )}
        </div>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="lg:w-48 h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.displayLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="lg:w-48 h-12">
            <MapPin className="h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((reg) => (
              <SelectItem key={reg.value} value={reg.value}>
                {reg.displayLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleSearch}
          variant="hero"
          size="lg"
          className="h-12 px-8"
          disabled={loading}
        >
          {loading ? "검색 중..." : "검색"}
        </Button>
      </div>
    </div>
  );
};