import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.service';

export const TrlTechRecord: FormNode = {
  name: 'techRecordSummary',
  label: 'Summary',
  type: FormNodeTypes.GROUP,
  children: [
    {
      name: 'vehicleType',
      label: 'Vehicle type',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE
    },
    {
      name: 'regnDate',
      label: 'Date of first registration',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'firstUseDate',
      label: 'First use date',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'manufactureYear',
      label: 'Year of manufacture',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'noOfAxles',
      label: 'Number of axles',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'dtpNumber',
      label: 'DTP number',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'parkingBrakeMrk',
      label: 'Axles fitted with a parking brake',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'suspensionType',
      label: 'Suspension type (optional)',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'roadFriendly',
      label: 'Road friendly suspension',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'description',
      label: 'Vehicle class',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'vehicleConfiguration',
      label: 'Vehicle configuration',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'couplingType',
      label: 'Coupling type (optional)',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'maxLoadOnCoupling',
      label: 'Max load on coupling (optional)',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'frameDescription',
      label: 'Frame description (optional)',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    },
    {
      name: 'departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: '',
      children: [],
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING
    }
  ]
};
