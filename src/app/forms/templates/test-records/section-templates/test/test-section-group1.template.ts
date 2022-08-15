import { ValidatorNames } from '@forms/models/validators.enum';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes } from '@forms/services/dynamic-form.types';

export const TestSectionGroup1: FormNode = {
  name: 'testSection',
  label: 'Test',
  type: FormNodeTypes.GROUP,
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'createdAt',
      label: 'Created',
      disabled: true,

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE
    },

    {
      name: 'testStartTimestamp',
      label: 'Test Date',
      value: '',
      disabled: true,

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE
    },
    {
      name: 'testTypes',
      label: 'Test Types',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0', // it is important here that the name of the node for an ARRAY type should be an index value
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'testCode',
              label: 'Test Code',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testResult',
              label: 'Result',
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 'fail', label: 'Fail' },
                { value: 'pass', label: 'Pass' },
                { value: 'prs', label: 'PRS' },
                { value: 'abandoned', label: 'Abandoned' }
              ],
              validators: [
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'reasonForAbandoning', value: 'abandoned' } },
                { name: ValidatorNames.HideIfNotEqual, args: { sibling: 'additionalCommentsForAbandon', value: 'abandoned' } }
              ],
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              label: 'Reason for abandoning',
              editType: FormNodeEditTypes.RADIO,
              options: [
                {
                  value: 'The vehicle was not submitted for test at the appointed time',
                  label: 'The vehicle was not submitted for test at the appointed time'
                },
                { value: 'The relevant test fee has not been paid', label: 'The relevant test fee has not been paid' },
                {
                  value:
                    'There was no means of identifying the vehicle i.e. the vehicle chassis/serial number was missing or did not relate to the vehicle',
                  label:
                    'There was no means of identifying the vehicle i.e. the vehicle chassis/serial number was missing or did not relate to the vehicle'
                },
                {
                  value: 'The registration document or other evidence of the date of first registration was not presented when requested',
                  label: 'The registration document or other evidence of the date of first registration was not presented when requested'
                },
                {
                  value: 'The vehicle was emitting substantial amounts of exhaust smoke so as to make it unreasonable for the test to be carried out',
                  label: 'The vehicle was emitting substantial amounts of exhaust smoke so as to make it unreasonable for the test to be carried out'
                },
                {
                  value: 'The vehicle was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
                  label: 'The vehicle was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out'
                },
                {
                  value: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
                  label: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out'
                },
                {
                  value:
                    'The test could not be completed due to a failure of a part of the vehicle which made movement under its own power impossible',
                  label:
                    'The test could not be completed due to a failure of a part of the vehicle which made movement under its own power impossible'
                },
                {
                  value: 'Current Health and Safety legislation cannot be met in testing the vehicle',
                  label: 'Current Health and Safety legislation cannot be met in testing the vehicle'
                },
                {
                  value:
                    'The driver and/or presenter of the vehicle declined either to remain in the vehicle or in its vicinity throughout the examination or to drive it or to operate controls or doors or to remove or refit panels after being requested to do so',
                  label:
                    'The driver and/or presenter of the vehicle declined either to remain in the vehicle or in its vicinity throughout the examination or to drive it or to operate controls or doors or to remove or refit panels after being requested to do so'
                },
                {
                  value: 'The vehicle exhaust outlet has been modified in such a way as to prevent a metered smoke check being conducted',
                  label: 'The vehicle exhaust outlet has been modified in such a way as to prevent a metered smoke check being conducted'
                },
                {
                  value:
                    'A proper examination cannot be readily carried out as any door, engine cover, hatch or other access device designed to be opened is locked or otherwise cannot be opened',
                  label:
                    'A proper examination cannot be readily carried out as any door, engine cover, hatch or other access device designed to be opened is locked or otherwise cannot be opened'
                }
              ]
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Additional details for abandoning',
              editType: FormNodeEditTypes.TEXTAREA
            },
            {
              name: 'reasonForAbandoning',
              type: FormNodeTypes.CONTROL,
              label: 'Reason for abandoning',
              editType: FormNodeEditTypes.RADIO,
              options: [
                {
                  value: 'The vehicle was not submitted for test at the appointed time',
                  label: 'The vehicle was not submitted for test at the appointed time'
                },
                { value: 'The relevant test fee has not been paid', label: 'The relevant test fee has not been paid' },
                {
                  value:
                    'There was no means of identifying the vehicle i.e. the vehicle chassis/serial number was missing or did not relate to the vehicle',
                  label:
                    'There was no means of identifying the vehicle i.e. the vehicle chassis/serial number was missing or did not relate to the vehicle'
                },
                {
                  value: 'The registration document or other evidence of the date of first registration was not presented when requested',
                  label: 'The registration document or other evidence of the date of first registration was not presented when requested'
                },
                {
                  value: 'The vehicle was emitting substantial amounts of exhaust smoke so as to make it unreasonable for the test to be carried out',
                  label: 'The vehicle was emitting substantial amounts of exhaust smoke so as to make it unreasonable for the test to be carried out'
                },
                {
                  value: 'The vehicle was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out',
                  label: 'The vehicle was in such a dirty or dangerous condition as to make it unreasonable for the test to be carried out'
                },
                {
                  value: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out',
                  label: 'The vehicle did not have sufficient fuel and oil to allow the test to be carried out'
                },
                {
                  value:
                    'The test could not be completed due to a failure of a part of the vehicle which made movement under its own power impossible',
                  label:
                    'The test could not be completed due to a failure of a part of the vehicle which made movement under its own power impossible'
                },
                {
                  value: 'Current Health and Safety legislation cannot be met in testing the vehicle',
                  label: 'Current Health and Safety legislation cannot be met in testing the vehicle'
                },
                {
                  value:
                    'The driver and/or presenter of the vehicle declined either to remain in the vehicle or in its vicinity throughout the examination or to drive it or to operate controls or doors or to remove or refit panels after being requested to do so',
                  label:
                    'The driver and/or presenter of the vehicle declined either to remain in the vehicle or in its vicinity throughout the examination or to drive it or to operate controls or doors or to remove or refit panels after being requested to do so'
                },
                {
                  value: 'The vehicle exhaust outlet has been modified in such a way as to prevent a metered smoke check being conducted',
                  label: 'The vehicle exhaust outlet has been modified in such a way as to prevent a metered smoke check being conducted'
                },
                {
                  value:
                    'A proper examination cannot be readily carried out as any door, engine cover, hatch or other access device designed to be opened is locked or otherwise cannot be opened',
                  label:
                    'A proper examination cannot be readily carried out as any door, engine cover, hatch or other access device designed to be opened is locked or otherwise cannot be opened'
                }
              ]
            },
            {
              name: 'additionalCommentsForAbandon',
              type: FormNodeTypes.CONTROL,
              value: '',
              label: 'Additional details for abandoning',
              editType: FormNodeEditTypes.TEXTAREA
            },
            {
              name: 'testTypeName',
              label: 'Description',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'certificateNumber',
              label: 'Certificate number',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testNumber',
              label: 'Test Number',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL
            },
            {
              name: 'testExpiryDate',
              label: 'Expiry Date',
              value: '',
              disabled: true,
              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE
            },
            {
              name: 'testAnniversaryDate',
              type: FormNodeTypes.CONTROL,
              value: null,
              disabled: true,
              label: 'Anniversary date',
              viewType: FormNodeViewTypes.DATE,
              editType: FormNodeEditTypes.DATE
            },
            {
              name: 'testTypeStartTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              disabled: true,
              label: 'Start time',
              viewType: FormNodeViewTypes.TIME
            },
            {
              name: 'testTypeEndTimestamp',
              type: FormNodeTypes.CONTROL,
              value: '',
              disabled: true,
              label: 'End time',
              viewType: FormNodeViewTypes.TIME
            }
          ]
        }
      ]
    }
  ]
};
