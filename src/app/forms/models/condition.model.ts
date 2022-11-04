export enum operatorEnum {
  Equals = 'equals',
  NotEquals = 'not equals'
}

export interface Condition {
  field: string;
  operator: operatorEnum,
  value: any;
  //value: string | number | boolean | string[] | number[] | boolean[];
}
