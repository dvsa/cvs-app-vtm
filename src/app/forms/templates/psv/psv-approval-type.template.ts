import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { approvalType } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const PsvTypeApprovalTemplate: FormNode = {
  name: 'approvalSection',
  label: 'Type approval',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_approvalType',
      label: 'Approval type',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(approvalType),
      validators: []
    },
    {
      name: 'techRecord_approvalTypeNumber',
      label: 'Approval type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
    },
    {
      name: 'techRecord_ntaNumber',
      label: 'National type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 40 }]
    },
    {
      name: 'techRecord_coifSerialNumber',
      label: 'COIF Serial number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.M,
      validators: [{ name: ValidatorNames.MaxLength, args: 8 }]
    },
    {
      name: 'techRecord_coifCertifierName',
      label: 'COIF Certifier name',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }]
    },
    {
      name: 'techRecord_coifDate',
      label: 'COIF Certifier date',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      isoDate: false
    },
    {
      name: 'techRecord_variantNumber',
      label: 'Variant number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }]
    },
    {
      name: 'techRecord_variantVersionNumber',
      label: 'Variant version number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 35 }]
    }
  ]
};
