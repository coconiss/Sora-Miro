import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { Language } from "@/services/tourApi";

export const LanguageSelector = () => {
  const { language, setLanguage, getLanguageLabel } = useLanguage();

  return (
    <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
      <SelectTrigger className="w-[140px] bg-background/90 backdrop-blur-sm border-border/50">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(LANGUAGES).map(([key, { label, flag }]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              <span>{flag}</span>
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};