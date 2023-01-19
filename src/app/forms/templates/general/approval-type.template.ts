import { ValidatorNames } from '@forms/models/validators.enum';
import { approvalType } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import { getOptionsFromEnum } from '@forms/utils/enum-map';

export const HgvAndTrlTypeApprovalTemplate: FormNode = {
  name: 'approvalSection',
  label: 'Type approval',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'approvalType',
      label: 'Approval type',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(approvalType),
      validators: []
    },
    {
      name: 'approvalTypeNumber',
      label: 'Approval type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
    },
    {
      name: 'ntaNumber',
      label: 'National type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 40 }]
    },
    {
      name: 'variantNumber',
      label: 'Variant number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
    },
    {
      name: 'variantVersionNumber',
      label: 'Variant version number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 35 }]
    }
  ]
};
