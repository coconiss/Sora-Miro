import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

type Option = {
  value: string;
  label: string;
  en?: string;  // English label
  ja?: string;  // Japanese label
  zh?: string;  // Chinese label
  de?: string;  // German label
  fr?: string;  // French label
};

export const useTourismOptions = () => {
  const { language } = useLanguage();

  const categories = useMemo<Option[]>(() => ([
    { 
      value: "all", 
      label: "전체 카테고리",
      en: "All Categories",
      ja: "すべてのカテゴリ",
      zh: "所有类别",
      de: "Alle Kategorien",
      fr: "Toutes les catégories"
    },
    { 
      value: "A01", 
      label: "자연",
      en: "Nature",
      ja: "自然",
      zh: "自然",
      de: "Natur",
      fr: "Nature"
    },
    { 
      value: "A02", 
      label: "인문(문화/예술)",
      en: "Culture & Arts",
      ja: "人文（文化/芸術）",
      zh: "人文（文化/艺术）",
      de: "Kultur & Kunst",
      fr: "Culture et Arts"
    },
    { 
      value: "A03", 
      label: "레포츠",
      en: "Sports",
      ja: "スポーツ",
      zh: "运动",
      de: "Sport",
      fr: "Sports"
    },
    { 
      value: "A04", 
      label: "쇼핑",
      en: "Shopping",
      ja: "ショッピング",
      zh: "购物",
      de: "Einkaufen",
      fr: "Shopping"
    },
    { 
      value: "A05", 
      label: "음식",
      en: "Food",
      ja: "食べ物",
      zh: "美食",
      de: "Essen",
      fr: "Nourriture"
    },
    { 
      value: "B01", 
      label: "숙박",
      en: "Accommodation",
      ja: "宿泊",
      zh: "住宿",
      de: "Unterkunft",
      fr: "Hébergement"
    },
    { 
      value: "C01", 
      label: "축제/공연",
      en: "Festival/Performance",
      ja: "祭り/公演",
      zh: "节日/表演",
      de: "Festival/Aufführung",
      fr: "Festival/Performance"
    },
  ]), []);

  const regions = useMemo<Option[]>(() => ([
    { 
      value: "all", 
      label: "전체 지역",
      en: "All Regions",
      ja: "すべての地域",
      zh: "所有地区",
      de: "Alle Regionen",
      fr: "Toutes les régions"
    },
    { 
      value: "seoul", 
      label: "서울",
      en: "Seoul",
      ja: "ソウル",
      zh: "首尔",
      de: "Seoul",
      fr: "Séoul"
    },
    { 
      value: "busan", 
      label: "부산",
      en: "Busan",
      ja: "釜山",
      zh: "釜山",
      de: "Busan",
      fr: "Pusan"
    },
    { 
      value: "daegu", 
      label: "대구",
      en: "Daegu",
      ja: "大邱",
      zh: "大邱",
      de: "Daegu",
      fr: "Daegu"
    },
    { 
      value: "incheon", 
      label: "인천",
      en: "Incheon",
      ja: "仁川",
      zh: "仁川",
      de: "Incheon",
      fr: "Incheon"
    },
    { 
      value: "gwangju", 
      label: "광주",
      en: "Gwangju",
      ja: "光州",
      zh: "光州",
      de: "Gwangju",
      fr: "Gwangju"
    },
    { 
      value: "daejeon", 
      label: "대전",
      en: "Daejeon",
      ja: "大田",
      zh: "大田",
      de: "Daejeon",
      fr: "Daejeon"
    },
    { 
      value: "ulsan", 
      label: "울산",
      en: "Ulsan",
      ja: "蔚山",
      zh: "蔚山",
      de: "Ulsan",
      fr: "Ulsan"
    },
    { 
      value: "gyeonggi", 
      label: "경기도",
      en: "Gyeonggi-do",
      ja: "京畿道",
      zh: "京畿道",
      de: "Gyeonggi-do",
      fr: "Gyeonggi-do"
    },
    { 
      value: "gangwon", 
      label: "강원도",
      en: "Gangwon-do",
      ja: "江原道",
      zh: "江原道",
      de: "Gangwon-do",
      fr: "Gangwon-do"
    },
    { 
      value: "chungbuk", 
      label: "충청북도",
      en: "North Chungcheong",
      ja: "忠清北道",
      zh: "忠清北道",
      de: "Nord-Chungcheong",
      fr: "Chungcheong du Nord"
    },
    { 
      value: "chungnam", 
      label: "충청남도",
      en: "South Chungcheong",
      ja: "忠清南道",
      zh: "忠清南道",
      de: "Süd-Chungcheong",
      fr: "Chungcheong du Sud"
    },
    { 
      value: "jeonbuk", 
      label: "전라북도",
      en: "North Jeolla",
      ja: "全羅北道",
      zh: "全罗北道",
      de: "Nord-Jeolla",
      fr: "Jeolla du Nord"
    },
    { 
      value: "jeonnam", 
      label: "전라남도",
      en: "South Jeolla",
      ja: "全羅南道",
      zh: "全罗南道",
      de: "Süd-Jeolla",
      fr: "Jeolla du Sud"
    },
    { 
      value: "gyeongbuk", 
      label: "경상북도",
      en: "North Gyeongsang",
      ja: "慶尚北道",
      zh: "庆尚北道",
      de: "Nord-Gyeongsang",
      fr: "Gyeongsang du Nord"
    },
    { 
      value: "gyeongnam", 
      label: "경상남도",
      en: "South Gyeongsang",
      ja: "慶尚南道",
      zh: "庆尚南道",
      de: "Süd-Gyeongsang",
      fr: "Gyeongsang du Sud"
    },
    { 
      value: "jeju", 
      label: "제주도",
      en: "Jeju Island",
      ja: "済州島",
      zh: "济州岛",
      de: "Jeju-Insel",
      fr: "Île de Jeju"
    },
  ]), []);

  // Get localized labels based on current language
  const getLocalizedLabel = (option: Option) => {
    if (language === 'ko') return option.label;
    return option[language as keyof Omit<Option, 'value' | 'label'>] || option.label;
  };

  return {
    categories: categories.map(cat => ({
      ...cat,
      displayLabel: getLocalizedLabel(cat)
    })),
    regions: regions.map(reg => ({
      ...reg,
      displayLabel: getLocalizedLabel(reg)
    }))
  };
};
