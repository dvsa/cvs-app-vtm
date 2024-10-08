export enum operatorEnum {
	Equals = 'equals',
	NotEquals = 'not equals',
}

export interface Condition {
	field: string;
	operator: operatorEnum;
	value: unknown;
}
