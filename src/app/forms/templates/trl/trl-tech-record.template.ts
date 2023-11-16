import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationTrl.enum.js';
import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { CouplingTypeOptions } from '@models/coupling-type-enum';
import { FrameDescriptions } from '@models/vehicle-tech-record.model';
import { TagType } from '@shared/components/tag/tag.component';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth, TagTypeLabels,
} from '../../services/dynamic-form.types';

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
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_statusCode',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN,
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_regnDate',
      label: 'Date of first registration',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
      validators: [
        { name: ValidatorNames.PastDate },
      ],
      isoDate: false,
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
        { name: ValidatorNames.Min, args: 1000 },
        { name: ValidatorNames.PastYear },
      ],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_firstUseDate',
      label: 'Date of first use',
      value: null,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,

      isoDate: false,
    },
    {
      name: 'techRecord_noOfAxles',
      label: 'Number of axles',
      value: null,
      width: FormNodeWidth.XXS,
      type: FormNodeTypes.CONTROL,
      disabled: true,
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_roadFriendly',
      label: 'Road friendly suspension',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
      class: 'flex--half',
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
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
        { value: 'O', label: 'Other' },
      ],
      class: 'flex--half',
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
        { label: 'trailer', value: 'trailer' },
      ],
      validators: [{ name: ValidatorNames.Required }],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
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
      class: 'flex--half',
    },
    {
      name: 'techRecord_maxLoadOnCoupling',
      label: 'Max load on coupling (optional)',
      value: null,
      width: FormNodeWidth.M,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.NUMBER,
      validators: [{ name: ValidatorNames.Max, args: 99999 }],
      class: 'flex--half',
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_vehicleConfiguration',
      label: 'Vehicle configuration',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration),
      validators: [{ name: ValidatorNames.UpdateFunctionCode }],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }, { colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_frameDescription',
      label: 'Frame description (optional)',
      value: null,
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FrameDescriptions),
    },
    {
      name: 'techRecord_departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      name: 'techRecord_euVehicleCategory',
      label: 'EU vehicle category',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(EUVehicleCategory).filter(
        (option) => option.value !== EUVehicleCategory.O1 && option.value !== EUVehicleCategory.O2,
      ),
      width: FormNodeWidth.S,
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
        { value: false, label: 'No' },
      ],
    },
    {
      name: 'techRecord_functionCode',
      label: 'Function code',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN,
    },
  ],
};
