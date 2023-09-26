import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { approvalType } from '@models/vehicle-tech-record.model';
import { TagType } from '@shared/components/tag/tag.component';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth, TagTypeLabels } from '../../services/dynamic-form.types';

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
      validators: [],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }]
    },
    {
      name: 'techRecord_approvalTypeNumber',
      label: 'Approval type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
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
              'Small series',
              'IVA - VCA',
              'IVA - DVSA/NI'
            ]
          }
        }
      ]
    },
    {
      name: 'techRecord_ntaNumber',
      label: 'National type number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 40 }]
    },
    {
      name: 'techRecord_variantNumber',
      label: 'Variant number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XL,
      validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }]
    },
    {
      name: 'techRecord_variantVersionNumber',
      label: 'Variant version number',
      type: FormNodeTypes.CONTROL,
      width: FormNodeWidth.XXL,
      validators: [{ name: ValidatorNames.MaxLength, args: 35 }]
    }
  ]
};
