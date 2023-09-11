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
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'ECTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NSSTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'UKNI WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA Pre 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'QNIG' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Prov.GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Small series' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – VCA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – DVSA/NI' } },
        { name: ValidatorNames.MaxLength, args: 25 }
      ]
    },
    {
      name: 'techRecord_approvalTypeNumber',
      label: 'Approval type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'ECTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NSSTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'UKNI WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA Pre 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'QNIG' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Prov.GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Small series' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – VCA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – DVSA/NI' } },
        { name: ValidatorNames.MaxLength, args: 25 }
      ]
    },
    {
      name: 'techRecord_ntaNumber',
      label: 'National type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'ECTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NSSTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'UKNI WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA Pre 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'QNIG' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Prov.GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Small series' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – VCA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – DVSA/NI' } },
        { name: ValidatorNames.MaxLength, args: 40 }
      ]
    },
    {
      name: 'techRecord_variantNumber',
      label: 'Variant number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'ECTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NSSTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'UKNI WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA Pre 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'QNIG' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Prov.GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Small series' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – VCA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – DVSA/NI' } },
        { name: ValidatorNames.MaxLength, args: 25 }
      ]
    },
    {
      name: 'techRecord_variantVersionNumber',
      label: 'Variant version number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'ECTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'NSSTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'UKNI WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA Pre 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'EU WVTA 23' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'QNIG' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Prov.GB WVTA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'Small series' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – VCA' } },
        { name: ValidatorNames.RequiredIfEquals, args: { sibling: 'techRecord_approvalType', value: 'IVA – DVSA/NI' } },
        { name: ValidatorNames.MaxLength, args: 35 }
      ]
    }
  ]
};
