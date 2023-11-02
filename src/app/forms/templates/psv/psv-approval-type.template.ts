import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth,
} from '../../services/dynamic-form.types';

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
      options: getOptionsFromEnum(ApprovalType),
      validators: [{ name: ValidatorNames.Enum, args: { enum: ApprovalType, options: { allowFalsy: true } } }],
    },
    {
      name: 'techRecord_approvalTypeNumber',
      label: 'Approval type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_approvalType',
            value: [
              'NTA',
              'ECTA',
              'ECSSTA',
              'IVA',
              'NSSTA',
              'GB WVTA',
              'UKNI WVTA',
              'EU WVTA Pre 23',
              'EU WVTA 23 on',
              'QNIG',
              'Prov.GB WVTA',
              'Small series NKSXX',
              'Small series NKS',
              'IVA - VCA',
              'IVA - DVSA/NI',
            ],
          },
        },
      ],
    },
    {
      name: 'techRecord_ntaNumber',
      label: 'National type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 40 }],
    },
    {
      name: 'techRecord_coifSerialNumber',
      label: 'COIF Serial number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.M,
      validators: [{ name: ValidatorNames.MaxLength, args: 8 }],
    },
    {
      name: 'techRecord_coifCertifierName',
      label: 'COIF Certifier name',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 20 }],
    },
    {
      name: 'techRecord_coifDate',
      label: 'COIF Certifier date',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      validators: [],
      isoDate: false,
    },
    {
      name: 'techRecord_variantNumber',
      label: 'Variant number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
    },
    {
      name: 'techRecord_variantVersionNumber',
      label: 'Variant version number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 35 }],
    },
  ],
};
