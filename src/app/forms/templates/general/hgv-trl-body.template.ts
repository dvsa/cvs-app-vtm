import { ValidatorNames } from '@forms/models/validators.enum';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { BodyTypeDescription } from '@models/body-type-enum';
import { TagType } from '@shared/components/tag/tag.component';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth, TagTypeLabels,
} from '../../services/dynamic-form.types';

export const HgvAndTrlBodyTemplate: FormNode = {
  name: 'bodySection',
  label: 'Body',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'techRecord_brakes_dtpNumber',
      label: 'DTp number',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 6 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_make',
      label: 'Body make',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 50 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_model',
      label: 'Body model',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.MaxLength, args: 30 }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_bodyType_description',
      label: 'Body type',
      value: null,
      customId: 'techRecord_bodyType_description',
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      validators: [{ name: ValidatorNames.Required }],
      customTags: [{ colour: TagType.RED, label: TagTypeLabels.REQUIRED }],
    },
    {
      name: 'techRecord_bodyType_code',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN,
    },
    {
      name: 'techRecord_functionCode',
      label: 'Function code',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.DROPDOWN,
      width: FormNodeWidth.S,
      options: [
        { value: 'r', label: 'R' },
        { value: 'a', label: 'A' },
      ],
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }, { name: ValidatorNames.UpdateFunctionCode }],
      customTags: [{ colour: TagType.PURPLE, label: TagTypeLabels.PLATES }],
    },
    {
      name: 'techRecord_conversionRefNo',
      label: 'Conversion ref no',
      value: null,
      width: FormNodeWidth.L,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.CustomPattern, args: ['^[A-Z0-9 ]{0,10}$', 'max length 10 uppercase letters or numbers'] }],
    },
    {
      name: 'techRecord_vehicleConfiguration',
      label: 'Vehicle configuration',
      value: null,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN,
      viewType: FormNodeViewTypes.HIDDEN,
    },
  ],
};
