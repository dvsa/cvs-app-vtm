export enum VEHICLE_TYPES {
  PSV = 'psv',
  HGV = 'hgv',
  TRL = 'trl'
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
  NO_INPUT = 'Enter a vehicle registration mark, trailer ID or vehicle identification number',
}
