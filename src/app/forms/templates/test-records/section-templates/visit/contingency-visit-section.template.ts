import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { SpecialRefData } from '@forms/services/multi-options.service';

export const ContingencyVisitSection: FormNode = {
  name: 'visitSection',
  label: 'Visit',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'testStationName',
      label: 'Test Station Name',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      referenceData: SpecialRefData.TEST_STATION_NAME,
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'testStationPNumber',
      label: 'Test Station Number',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      referenceData: SpecialRefData.TEST_STATION_P_NUMBER,
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'testStationType',
      label: 'Type of test facility',
      type: FormNodeTypes.CONTROL
    },
    {
      name: 'testerName',
      label: 'Tester name',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'testerEmailAddress',
      label: 'Tester email address',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [{ name: ValidatorNames.Required }]
    }
  ]
};
