import { AsyncValidatorNames } from '@forms/models/async-validators.enum';
import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { SpecialRefData } from '@forms/services/multi-options.service';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const VisitSection: FormNode = {
  name: 'visitSection',
  label: 'Visit',
  type: FormNodeTypes.GROUP,
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
      name: 'testStationName',
      label: 'Test Station Name',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testStationPNumber',
      label: 'Test Station Details',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      referenceData: SpecialRefData.TEST_STATION_P_NUMBER,
      validators: [{ name: ValidatorNames.Required }],
      asyncValidators: [{ name: AsyncValidatorNames.UpdateTestStationDetails }],
      width: FormNodeWidth.XXL
    },
    {
      name: 'testStationType',
      label: 'Type of test facility',
      type: FormNodeTypes.CONTROL,
      disabled: true,
      width: FormNodeWidth.S
    },
    {
      name: 'testerStaffId',
      type: FormNodeTypes.CONTROL,
      label: 'Tester details',
      width: FormNodeWidth.XXL,
      viewType: FormNodeViewTypes.HIDDEN,
      editType: FormNodeEditTypes.AUTOCOMPLETE,
      referenceData: ReferenceDataResourceType.User,
      validators: [{ name: ValidatorNames.Required }],
      asyncValidators: [{ name: AsyncValidatorNames.UpdateTesterDetails }]
    },
    {
      name: 'testerName',
      label: 'Tester name',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN
    },
    {
      name: 'testerEmailAddress',
      label: 'Tester email address',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.HIDDEN
    }
  ]
};
