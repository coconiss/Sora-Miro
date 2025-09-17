interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  ko: {
    'hero.title': '한국을 발견하세요',
    'hero.subtitle': '아름다운 자연, 깊은 역사, 맛있는 음식이 어우러진 대한민국의 숨겨진 보석을 찾아보세요',
    'stats.attractions': '관광지',
    'stats.images': '사진',
    'stats.visitors': '관광객',
    'stats.tours': '여행코스',
    'search.title': '어디를 가고 싶으세요?',
    'search.subtitle': '전국의 관광지, 맛집, 숙박시설을 쉽게 검색하고 정보를 확인해보세요'
  },
  en: {
    'hero.title': 'Discover Korea',
    'hero.subtitle': 'Explore the hidden gems of South Korea where beautiful nature, deep history, and delicious food come together',
    'stats.attractions': 'Attractions',
    'stats.images': 'Images',
    'stats.visitors': 'Tourists',
    'stats.tours': 'Tours',
    'search.title': 'Where would you like to go?',
    'search.subtitle': 'Easily search and explore tourist attractions, restaurants, and accommodations across the country'
  },
  ja: {
    'hero.title': '韓国を発見する',
    'hero.subtitle': '美しい自然、深い歴史、おいしい料理が調和した韓国の隠れた宝石を探してみましょう',
    'stats.attractions': '観光地',
    'stats.images': '画像',
    'stats.visitors': '観光客',
    'stats.tours': 'ツアー',
    'search.title': 'どこに行きたいですか？',
    'search.subtitle': '韓国全国の観光地、レストラン、宿泊施設を簡単に検索して情報を確認できます'
  },
  zh: {
    'hero.title': '发现韩国',
    'hero.subtitle': '探索韩国的隐藏宝藏，那里有美丽的自然风光、悠久的历史和美味的美食',
    'stats.attractions': '景点',
    'stats.images': '图片',
    'stats.visitors': '游客',
    'stats.tours': '旅游路线',
    'search.title': '您想去哪里？',
    'search.subtitle': '轻松搜索和探索全国各地的旅游景点、餐厅和住宿设施'
  },
  de: {
    'hero.title': 'Entdecken Sie Korea',
    'hero.subtitle': 'Entdecken Sie die verborgenen Schätze Südkoreas, wo wunderschöne Natur, tiefe Geschichte und köstliches Essen zusammenkommen',
    'stats.attractions': 'Sehenswürdigkeiten',
    'stats.images': 'Bilder',
    'stats.visitors': 'Touristen',
    'stats.tours': 'Touren',
    'search.title': 'Wohin möchten Sie reisen?',
    'search.subtitle': 'Durchsuchen und entdecken Sie einfach Touristenattraktionen, Restaurants und Unterkünfte im ganzen Land'
  },
  fr: {
    'hero.title': 'Découvrez la Corée',
    'hero.subtitle': 'Explorez les joyaux cachés de la Corée du Sud où se mêlent une nature magnifique, une histoire riche et une délicieuse cuisine',
    'stats.attractions': 'Attractions',
    'stats.images': 'Images',
    'stats.visitors': 'Touristes',
    'stats.tours': 'Circuits',
    'search.title': 'Où souhaitez-vous aller ?',
    'search.subtitle': 'Recherchez et explorez facilement les attractions touristiques, restaurants et hébergements à travers le pays'
  }
};

export const t = (key: string, language: string = 'ko'): string => {
  // 간단한 경우 직접 접근
  if (translations[language] && translations[language][key]) {
    return translations[language][key];
  }
  
  // 번역을 찾을 수 없는 경우 한국어로 폴백
  if (language !== 'ko' && translations.ko[key]) {
    return translations.ko[key];
  }
  
  // 키를 찾을 수 없는 경우 키 자체 반환
  return key;
};

export default translations;
