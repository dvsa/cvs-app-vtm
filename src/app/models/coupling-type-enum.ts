import { MultiOption } from '@forms/models/options.model';
import { MultiOptions } from '@forms/models/options.model';

export enum CouplingTypeCodeEnum {
  F = 'F',
  B = 'B',
  O = 'O',
  A = 'A',
  D = 'D',
  S = 'S'
}

export const CouplingTypeCodeToDescription = new Map<CouplingTypeCodeEnum, string>([
  [CouplingTypeCodeEnum.F, 'Fifth wheel'],
  [CouplingTypeCodeEnum.B, 'Drawbar'],
  [CouplingTypeCodeEnum.O, 'Other'],
  [CouplingTypeCodeEnum.A, 'Automatic'],
  [CouplingTypeCodeEnum.D, 'Dolly'],
  [CouplingTypeCodeEnum.S, 'Semi']
]);

export const CouplingTypeOptions: MultiOptions = [
  { label: 'Fifth wheel', value: CouplingTypeCodeEnum.F },
  { label: 'Drawbar', value: CouplingTypeCodeEnum.B },
  { label: 'Other', value: CouplingTypeCodeEnum.O },
  { label: 'Automatic', value: CouplingTypeCodeEnum.A },
  { label: 'Dolly', value: CouplingTypeCodeEnum.D },
  { label: 'Semi', value: CouplingTypeCodeEnum.S }
];
