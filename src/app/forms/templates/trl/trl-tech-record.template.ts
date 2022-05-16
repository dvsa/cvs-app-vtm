import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const TrlTechRecord: FormNode = {
  name: 'techRecordSummary',
  type: FormNodeTypes.GROUP,
  label: 'Vehicle Summary',
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
    {
      name: 'vehicleType',
      label: 'Vehicle type',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE
    },
    {
      name: 'regnDate',
      label: 'Date of first registration',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE
    },
    {
      name: 'firstUseDate',
      label: 'First use date',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'manufactureYear',
      label: 'Year of manufacture',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'noOfAxles',
      label: 'Number of axles',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'brakes',
      label: 'DTP number',
      value: '',
      children: [
        {
          name: 'dtpNumber',
          label: 'DTP number',
          value: '',

          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        }
      ],
      type: FormNodeTypes.GROUP,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'axles',
      value: '',
      type: FormNodeTypes.ARRAY,
      children: [
        {
          name: '0',
          label: 'Axel',
          value: '',
          type: FormNodeTypes.GROUP,
          children: [
            {
              name: 'parkingBrakeMrk',
              label: 'Axles fitted with a parking brake',
              value: '',

              type: FormNodeTypes.CONTROL,
              viewType: FormNodeViewTypes.STRING
            }
          ]
        }
      ]
    },
    {
      name: 'suspensionType',
      label: 'Suspension type (optional)',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'roadFriendly',
      label: 'Road friendly suspension',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'vehicleClass',
      label: 'Vehicle class',
      value: '',
      type: FormNodeTypes.GROUP,
      children: [
        {
          name: 'description',
          label: 'Vehicle class',
          value: '',

          type: FormNodeTypes.CONTROL,
          viewType: FormNodeViewTypes.STRING
        }
      ]
    },
    {
      name: 'vehicleConfiguration',
      label: 'Vehicle configuration',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'couplingType',
      label: 'Coupling type (optional)',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'maxLoadOnCoupling',
      label: 'Max load on coupling (optional)',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'frameDescription',
      label: 'Frame description (optional)',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: '',

      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    }
  ]
};
