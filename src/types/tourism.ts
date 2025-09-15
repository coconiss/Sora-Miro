export interface TourismItem {
  id: string;
  contentid?: string;
  contenttypeid?: string;
  title: string;
  address?: string;
  addr1?: string;
  addr2?: string;
  roadAddress?: string;
  jibunAddress?: string;
  tel?: string;
  infocenter?: string;
  infocentertourcourse?: string;
  bookingplace?: string;
  homepage?: string;
  firstimage?: string;
  image?: string;
  overview?: string;
  description?: string;
  expguide?: string;
  expagerange?: string;
  usetime?: string;
  parking?: string;
  restdate?: string;
  accomcount?: string;
  useseason?: string;
  chkcreditcard?: string;
  chkpet?: string;
  chkbabycarriage?: string;
  subfacility?: string;
  heritage1?: string;
  heritage2?: string;
  heritage3?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  category?: string;
  mapx?: string;
  mapy?: string;
  createdtime?: string;
  modifiedtime?: string;
}

export interface CategoryMap {
  [key: string]: string;
}

export interface ContentTypeMap {
  [key: string]: string;
}