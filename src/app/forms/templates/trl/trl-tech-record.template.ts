import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { CouplingTypeOptions } from '@models/coupling-type-enum';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories, FrameDescriptions } from '@models/vehicle-tech-record.model';
import { TagTypeLabels, FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import { TagType } from '@shared/components/tag/tag.component';

export const TrlTechRecordTemplate: FormNode = {
  name: 'techRecordSummary',
  type: FormNodeTypes.GROUP,
  label: 'Vehicle Summary',
  children: [
    {
      name: 'techRecord_vehicleType',
      label: 'Vehicle type',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE,
      disabled: true,
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }]
    },
    {
      name: 'techRecord_statusCode',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }]
    },
    {
      name: 'techRecord_regnDate',
      label: 'Date of first registration',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,

      isoDate: false
    },
    {
      name: 'techRecord_manufactureYear',
      label: 'Year of manufacture',
      value: null,
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [
        { name: ValidatorNames.Max, args: 9999 },
        { name: ValidatorNames.Min, args: 1000 }
      ]
    },
    {
      name: 'techRecord_firstUseDate',
      label: 'Date of first use',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,

      isoDate: false
    },
    {
      name: 'techRecord_noOfAxles',
      label: 'Number of axles',
      value: null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      disabled: true,
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }]
    },
    {
      name: 'techRecord_roadFriendly',
      label: 'Road friendly suspension',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      class: 'flex--half'
    },
    {
      name: 'techRecord_suspensionType',
      label: 'Suspension type (optional)',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: [
        { value: 'S', label: 'Steel' },
        { value: 'R', label: 'Rubber' },
        { value: 'A', label: 'Air' },
        { value: 'H', label: 'Hydraulic' },
        { value: 'O', label: 'Other' }
      ],
      class: 'flex--half'
    },
    {
      name: 'techRecord_vehicleClass_description',
      label: 'Vehicle class',
      value: '',
      customId: 'vehicleClassDescription',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      editType: FormNodeEditTypes.SELECT,
      options: [
        { label: 'motorbikes over 200cc or with a sidecar', value: 'motorbikes over 200cc or with a sidecar' },
        { label: 'not applicable', value: 'not applicable' },
        { label: 'small psv (ie: less than or equal to 22 passengers)', value: 'small psv (ie: less than or equal to 22 seats)' },
        { label: 'motorbikes up to 200cc', value: 'motorbikes up to 200cc' },
        { label: 'trailer', value: 'trailer' },
        { label: 'large psv(ie: greater than or equal to 23 passengers)', value: 'large psv(ie: greater than 23 seats)' },
        { label: '3 wheelers', value: '3 wheelers' },
        { label: 'heavy goods vehicle', value: 'heavy goods vehicle' },
        { label: 'MOT class 4', value: 'MOT class 4' },
        { label: 'MOT class 7', value: 'MOT class 7' },
        { label: 'MOT class 5', value: 'MOT class 5' }
      ],
      validators: [{ name: ValidatorNames.Required }],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }]
    },
    {
      name: 'techRecord_couplingType',
      label: 'Coupling type (optional)',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: CouplingTypeOptions,
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }],
      class: 'flex--half'
    },
    {
      name: 'techRecord_maxLoadOnCoupling',
      label: 'Max load on coupling (optional)',
      value: null,
      width: FormNodeWidth.M,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
      class: 'flex--half'
    },
    {
      name: 'techRecord_vehicleConfiguration',
      label: 'Vehicle configuration',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration),
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }]
    },
    {
      name: 'techRecord_frameDescription',
      label: 'Frame description (optional)',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FrameDescriptions)
    },
    {
      name: 'techRecord_departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    {
      name: 'techRecord_euVehicleCategory',
      label: 'EU vehicle category',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(EuVehicleCategories).filter(
        option => option.value !== EuVehicleCategories.O1 && option.value !== EuVehicleCategories.O2
      ),
      width: FormNodeWidth.S
    },
    {
      name: 'techRecord_alterationMarker',
      label: 'Alteration marker',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    }
  ]
};
