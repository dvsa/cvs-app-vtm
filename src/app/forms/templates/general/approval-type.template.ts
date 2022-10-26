import { ValidatorNames } from '@forms/models/validators.enum';
import { VehicleTypes, approvalType } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import getOptionsFromEnum from '@forms/utils/enum-map';

export function getTypeApprovalSection(vehicleType: VehicleTypes): FormNode {
  const approvalTypeSection: FormNode = {
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
        validators: [{ name: ValidatorNames.Required }],
      },
      {
        name: 'approvalTypeNumber',
        label: 'Approval type number',
        type: FormNodeTypes.CONTROL,
        width: FormNodeWidth.XL,
        validators: [
          { name: ValidatorNames.MaxLength, args: 25 }]
      },
      {
        name: 'ntaNumber',
        label: 'National type number',
        type: FormNodeTypes.CONTROL,
        width: FormNodeWidth.XXL,
        validators: [
          { name: ValidatorNames.MaxLength, args: 40 }
        ],
      },
      {
        name: 'variantNumber',
        label: 'Variant number',
        type: FormNodeTypes.CONTROL,
        width: FormNodeWidth.XL,
        validators: [
          { name: ValidatorNames.MaxLength, args: 25 }
        ],
      },
      {
        name: 'variantVersionNumber',
        label: 'Variant version number',
        type: FormNodeTypes.CONTROL,
        width: FormNodeWidth.XXL,
        validators: [
          { name: ValidatorNames.MaxLength, args: 35 }
        ],
      }
    ]
  };

  if (vehicleType === VehicleTypes.PSV) {
    const COIFSection = [
      {
        name: 'coifSerialNumber',
        label: 'COIF Serial number',
        type: FormNodeTypes.CONTROL
      },
      {
        name: 'coifCertifierName',
        label: 'COIF Certifier name',
        type: FormNodeTypes.CONTROL
      },
      {
        name: 'coifDate',
        label: 'COIF Certifier date',
        type: FormNodeTypes.CONTROL,
        viewType: FormNodeViewTypes.DATE
      }
    ]

    approvalTypeSection.children!.splice(3, 0, ...COIFSection)
  }

  return approvalTypeSection;
}


