export enum VEHICLE_TYPES {
  PSV = 'psv',
  HGV = 'hgv',
  TRL = 'trl',
  Car = 'car',
  LGV = 'lgv',
  Moto = 'motorcycle'
}

export enum RECORD_STATUS {
  CURRENT = 'current',
  PROVISIONAL = 'provisional',
  ARCHIVED = 'archived'
}

export enum SEARCH_CRITERIA {
  ALL_CRITERIA = 'Vehicle registration mark, trailer ID or vehicle identification number',
  VRM_CRITERIA = 'Vehicle registration mark (VRM)',
  FULL_VIN_CRITERIA = 'Full vehicle identification number (VIN)',
  PARTIAL_VIN_CRITERIA = 'Partial VIN (last 6 characters)',
  TRL_CRITERIA = 'Trailer ID'
}

export enum CREATE_PAGE_LABELS {
  CREATE_VRM_LABEL = 'Vehicle registration mark (VRM)',
  CREATE_VRM_LABEL_OPTIONAL = 'Vehicle registration mark (VRM - optional)',
  CREATE_VIN_LABEL_ERROR = 'A technical record with this VIN already exists, check the VIN or change the existing technical record',
  CREATE_VRM_LABEL_ERROR = 'A technical record with this VRM already exists, check the VRM or change the existing technical record'
}

export enum VEHICLE_TECH_RECORD_SEARCH_ERRORS {
  NOT_FOUND = 'Vehicle not found, check the vehicle registration mark, trailer ID, vehicle identification number or change the search criteria to find a vehicle',
  MULTIPLE_FOUND = 'Multiple vehicles found, search using the full vehicle identification number',
  NO_INPUT = 'Enter a vehicle registration mark, trailer ID or vehicle identification number'
}

export enum SUBSTANCES {
  PERMITTED_TEXT = 'Substances permitted under the tank code and any special provisions specified in 9 may be carried',
  PERMITTED_CODE = 'substancespermittedunderthetankcodeandanyspecialprovisionsspecifiedin9maybecarried',
  PERMITTED = 'permitted',
  CLASSNUMBER_TEXT = 'Substances (Class UN number and if necessary packing group and proper shipping name) may be carried',
  CLASSNUMBER_CODE = 'substances(classunnumberandifnecessarypackinggroupandpropershippingname)maybecarried',
  CLASSNUMBER = 'classnumber'
}

export enum INSPECTION_TYPES {
  Intermediate = 'intermediate',
  Periodic = 'periodic',
  Exceptional = 'exceptional'
}

export enum NOTES {
  GUIDANCENOTE = 'New certificate requested',
  GUIDANCENOTE_CODE = 'newcertificaterequested'
}

export enum MEMOS {
  MEMOSAPPLY = '07/09 3mth leak ext',
  MEMOSAPPLY_CODE = '07/093mthleakext'
}

export enum VIEW_STATE {
  VIEW_ONLY = 0,
  EDIT = 1,
  CREATE = 2
}

export enum COUNTRY_OF_REGISTRATION {
  gb = 'Great Britain and Northern Ireland - GB',
  gba = 'Alderney - GBA',
  gbg = 'Guernsey - GBG',
  gbj = 'Jersey - GBJ',
  gbm = 'Isle of Man - GBM',
  gbz = 'Gibraltar - GBZ',
  a = 'Austria - A',
  b = 'Belgium - B',
  bih = 'Bosnia and Herzegovina - BIH',
  bg = 'Bulgaria - BG',
  hr = 'Croatia - HR',
  cy = 'Cyprus - CY',
  cz = 'Czech Republic - CZ',
  dk = 'Denmark - DK',
  est = 'Estonia - EST',
  fin = 'Finland - FIN',
  f = 'France - F',
  d = 'Germany - D',
  gr = 'Greece - GR',
  h = 'Hungary - H',
  irl = 'Ireland - IRL',
  i = 'Italy - I',
  lv = 'Latvia - LV',
  lt = 'Lithuania - LT',
  l = 'Luxembourg - L',
  m = 'Malta - M',
  nl = 'Netherlands - NL',
  n = 'Norway - N',
  pl = 'Poland - PL',
  p = 'Portugal - P',
  ro = 'Romania - RO',
  sk = 'Slovakia - SK',
  slo = 'Slovenia - SLO',
  e = 'Spain - E',
  s = 'Sweden - S',
  ch = 'Switzerland - CH',
  'non-eu' = 'Non EU',
  'not-known' = 'Country Not Known'
}
