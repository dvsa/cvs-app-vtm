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
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_approvalType',
            value: [
              'NTA',
              'ECTA',
              'IVA',
              'NSSTA',
              'GB WVTA',
              'UKNI WVTA',
              'EU WVTA Pre 23',
              'EU WVTA 23',
              'QNIG',
              'Prov.GB WVTA',
              'Small series',
              'IVA – VCA',
              'IVA – DVSA/NI'
            ]
          }
        },
        { name: ValidatorNames.MaxLength, args: 25 }
      ]
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
              'IVA',
              'NSSTA',
              'GB WVTA',
              'UKNI WVTA',
              'EU WVTA Pre 23',
              'EU WVTA 23',
              'QNIG',
              'Prov.GB WVTA',
              'Small series',
              'IVA – VCA',
              'IVA – DVSA/NI'
            ]
          }
        },
        { name: ValidatorNames.MaxLength, args: 25 }
      ]
    },
    {
      name: 'techRecord_ntaNumber',
      label: 'National type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_approvalType',
            value: [
              'NTA',
              'ECTA',
              'IVA',
              'NSSTA',
              'GB WVTA',
              'UKNI WVTA',
              'EU WVTA Pre 23',
              'EU WVTA 23',
              'QNIG',
              'Prov.GB WVTA',
              'Small series',
              'IVA – VCA',
              'IVA – DVSA/NI'
            ]
          }
        },
        { name: ValidatorNames.MaxLength, args: 40 }
      ]
    },
    {
      name: 'techRecord_variantNumber',
      label: 'Variant number',
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
              'IVA',
              'NSSTA',
              'GB WVTA',
              'UKNI WVTA',
              'EU WVTA Pre 23',
              'EU WVTA 23',
              'QNIG',
              'Prov.GB WVTA',
              'Small series',
              'IVA – VCA',
              'IVA – DVSA/NI'
            ]
          }
        },
        { name: ValidatorNames.MaxLength, args: 25 }
      ]
    },
    {
      name: 'techRecord_variantVersionNumber',
      label: 'Variant version number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [
        {
          name: ValidatorNames.RequiredIfEquals,
          args: {
            sibling: 'techRecord_approvalType',
            value: [
              'NTA',
              'ECTA',
              'IVA',
              'NSSTA',
              'GB WVTA',
              'UKNI WVTA',
              'EU WVTA Pre 23',
              'EU WVTA 23',
              'QNIG',
              'Prov.GB WVTA',
              'Small series',
              'IVA – VCA',
              'IVA – DVSA/NI'
            ]
          }
        },
        { name: ValidatorNames.MaxLength, args: 35 }
      ]
    }
  ]
};
