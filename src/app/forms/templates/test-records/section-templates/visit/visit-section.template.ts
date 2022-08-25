import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';
import { SpecialRefData } from '@forms/services/multi-options.service';

export const VisitSection: FormNode = {
  name: 'visitSection',
  label: 'Visit',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'testFacilityCombination',
      label: 'Test facility name/number',
      type: FormNodeTypes.COMBINATION,
      options: {
        leftComponentName: 'testStationName',
        rightComponentName: 'testStationPNumber',
        separator: ' / '
      },
      disabled: true
    },
    {
      name: 'testStationPNumber',
      label: 'Test Station Details',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      referenceData: SpecialRefData.TEST_STATION_P_NUMBER,
      validators: [{ name: ValidatorNames.Required }],
      asyncValidators: [{ name: AsyncValidatorNames.UpdateTestStationDetails }]
    },
    {
      name: 'testStationType',
      label: 'Type of test facility',
      type: FormNodeTypes.CONTROL,
      disabled: true
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
