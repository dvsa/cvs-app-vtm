import { ValidatorNames } from '@forms/models/validators.enum';
import {
  FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeWidth,
} from '../../services/dynamic-form.types';

export const AdrTemplate: FormNode = {
  name: 'adrSection',
  type: FormNodeTypes.SECTION,
  label: 'ADR',
  children: [
    {
      name: 'dangerous_goods',
      label: 'Able to carry dangerous goods',
      width: FormNodeWidth.XS,
      value: false,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
      validators: [{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'dangerousGoodsSection', value: true } }],
    },
    {
      name: 'dangerousGoodsSection',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'applicantDetailsSection',
          type: FormNodeTypes.GROUP,
          children: [
            { name: 'applicationDetailsSectionTitle', type: FormNodeTypes.TITLE, label: 'Applicant Details' },
            {
              name: 'techRecord_adrDetails_applicantDetails_name',
              label: 'Name',
              value: null,
              width: FormNodeWidth.XXL,
              type: FormNodeTypes.CONTROL,
              validators: [
                { name: ValidatorNames.MaxLength, args: 150 },
              ],
              customId: 'adrName',
            },
            {
              name: 'techRecord_adrDetails_applicantDetails_street',
              label: 'Street',
              value: null,
              width: FormNodeWidth.XXL,
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 150 }],
              customId: 'adrStreet',
            },
            {
              name: 'techRecord_adrDetails_applicantDetails_town',
              label: 'Town',
              value: null,
              width: FormNodeWidth.XXL,
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              customId: 'adrPostTown',
            },
            {
              name: 'techRecord_adrDetails_applicantDetails_city',
              label: 'City',
              value: null,
              width: FormNodeWidth.XL,
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 100 }],
              customId: 'adrPostCity',
            },
            {
              name: 'techRecord_adrDetails_applicantDetails_postcode',
              label: 'Postcode',
              value: null,
              width: FormNodeWidth.L,
              type: FormNodeTypes.CONTROL,
              validators: [{ name: ValidatorNames.MaxLength, args: 25 }],
              customId: 'adrPostCode',
            },
          ],
        },
        {
          name: 'substancesPermittedSection',
          type: FormNodeTypes.GROUP,
          nestingLevel: 1,
          children: [
            {
              name: 'substancesPermitted',
              label: 'Substances Permitted',
              width: FormNodeWidth.XS,
              value: 1,
              type: FormNodeTypes.CONTROL,
              editType: FormNodeEditTypes.RADIO,
              options: [
                { value: 1, label: 'Substances permitted under the tankcode and any special provisions specified in 9 may be carried' },
                { value: 2, label: 'Substances (Class UN number and if necessary packing group and proper shippingname) may be carried' },
              ],
              validators: [{ name: ValidatorNames.HideIfNotEqual, args: { sibling: 'substancesStatementOrProductListSection', value: 2 } }],
            },
            {
              name: 'substancesStatementOrProductListSection',
              type: FormNodeTypes.GROUP,
              nestingLevel: 2,
              children: [
                {
                  name: 'substancesPermittedSelect',
                  label: 'Select: ',
                  width: FormNodeWidth.XS,
                  value: 1,
                  type: FormNodeTypes.CONTROL,
                  editType: FormNodeEditTypes.RADIO,
                  options: [
                    { value: 1, label: 'Statement' },
                    { value: 2, label: 'Product List' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
