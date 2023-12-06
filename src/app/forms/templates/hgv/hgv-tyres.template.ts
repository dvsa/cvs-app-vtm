import { TyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeHgv.enum.js';
import { ValidatorNames } from '@forms/models/validators.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';

export const tyresTemplateHgv: FormNode = {
  name: 'tyreSection',
  type: FormNodeTypes.GROUP,
  label: 'Tyres',
  children: [
    {
      name: 'techRecord_tyreUseCode',
      label: 'Tyre use code',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      width: FormNodeWidth.XS,
      options: getOptionsFromEnum(TyreUseCode),
      validators: [
        { name: ValidatorNames.MaxLength, args: 2 },
        { name: ValidatorNames.Min, args: 0 },
      ],
    },
    {
      name: 'techRecord_axles',
      value: '',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          label: 'Axle',
          value: '',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'axleNumber',
              label: 'Axle Number',
              type: FormNodeTypes.CONTROL,
            },
            {
              name: 'tyres_tyreCode',
              label: 'Tyre Code',
              value: null,
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.NUMBER,
              validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Max, args: 99999 }, { name: ValidatorNames.Min, args: 0 }],
            },
            {
              name: 'tyres_tyreSize',
              label: 'Tyre Size',
              value: null,
              type: FormNodeTypes.CONTROL,
              disabled: true,
              validators: [
                { name: ValidatorNames.MaxLength, args: 12 },
                { name: ValidatorNames.Min, args: 0 },
              ],
            },
            {
              name: 'tyres_plyRating',
              label: 'Ply Rating',
              value: null,
              type: FormNodeTypes.CONTROL,
              disabled: true,
              validators: [
                { name: ValidatorNames.MaxLength, args: 2 },
                { name: ValidatorNames.Min, args: 0 },
              ],
            },
            {
              name: 'tyres_fitmentCode',
              label: 'Fitment code',
              value: null,
              type: FormNodeTypes.CONTROL,
              validators: [],
            },
            {
              name: 'tyres_dataTrAxles',
              label: 'Load index',
              value: null,
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.NUMBER,
              disabled: true,
              validators: [{ name: ValidatorNames.Numeric }, { name: ValidatorNames.Max, args: 999 }, { name: ValidatorNames.Min, args: 0 }],
            },
          ],
        },
      ],
    },
  ],
};
