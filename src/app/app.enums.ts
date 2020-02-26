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
