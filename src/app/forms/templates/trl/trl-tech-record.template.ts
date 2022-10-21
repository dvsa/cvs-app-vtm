import { ValidatorNames } from '@forms/models/validators.enum';
import getOptionsFromEnum from '@forms/utils/enum-map';
import { VehicleClass } from '@models/vehicle-class.model';
import { VehicleConfiguration } from '@models/vehicle-configuration.enum';
import { EuVehicleCategories, FrameDescriptions } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeEditTypes, FormNodeTypes, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';

export const TrlTechRecordTemplate: FormNode = {
  name: 'techRecordSummary',
  type: FormNodeTypes.GROUP,
  label: 'Vehicle Summary',
  children: [
    {
      name: 'vehicleType',
      label: 'Vehicle type',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.VEHICLETYPE,
      validators: [{ name: ValidatorNames.Required }],
    },
    {
      name: 'regnDate',
      label: 'Date of first registration',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      validators: [{ name: ValidatorNames.Required }],
      isoDate: false
    },
    { ///// null in data obj
      name: 'manufactureYear',
      label: 'Year of manufacture',
      value: '',
      width: FormNodeWidth.XS,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.TEXT,
      validators: [
        { name: ValidatorNames.MaxLength, args: 4 },
        { name: ValidatorNames.Required }]
    },
    {
      name: 'firstUseDate',
      label: 'Date of first use',
      value: '',
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.DATE,
      editType: FormNodeEditTypes.DATE,
      validators: [{ name: ValidatorNames.Required }],
      isoDate: false
    },

    // {   ///// not on UI model
    //   name: 'noOfAxles',
    //   label: 'Number of axles',
    //   value: '',
    //   type: FormNodeTypes.CONTROL,
    // },
    // {    /////////////// not on UI model
    //   name: 'brakes',
    //   label: 'DTP number',
    //   value: '',
    //   children: [
    //     {
    //       name: 'dtpNumber',
    //       label: 'DTP number',
    //       value: '',
    //       width: FormNodeWidth.L,
    //       type: FormNodeTypes.CONTROL,
    //       viewType: FormNodeViewTypes.STRING
    //     }
    //   ],
    //   type: FormNodeTypes.GROUP,
    //   viewType: FormNodeViewTypes.STRING
    // },
    // {    /////////////// not on ui
    //   name: 'axles',
    //   value: '',
    //   type: FormNodeTypes.ARRAY,
    //   children: [
    //     {
    //       name: '0',
    //       label: 'Axel',
    //       value: '',
    //       type: FormNodeTypes.GROUP,
    //       children: [
    //         {
    //           name: 'parkingBrakeMrk',
    //           label: 'Axles fitted with a parking brake',
    //           value: '',
    //           type: FormNodeTypes.CONTROL,
    //           viewType: FormNodeViewTypes.STRING
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      name: 'suspensionType',
      label: 'Suspension type (optional)',
      value: '',
      width: FormNodeWidth.L,
      editType: FormNodeEditTypes.TEXT,
      type: FormNodeTypes.CONTROL,
      viewType: FormNodeViewTypes.STRING,
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }]
      // id: 'style-float-right-small' //// will work on merge with 5695
    },
    {
      name: 'roadFriendly',
      label: 'Road friendly suspension',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
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
          viewType: FormNodeViewTypes.STRING,
          editType: FormNodeEditTypes.SELECT,
          options: getOptionsFromEnum(VehicleClass.DescriptionEnum)
        }
      ],
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'maxLoadOnCoupling',
      label: 'Max load on coupling (optional)',
      value: '',
      width: FormNodeWidth.S,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 5 }]
      // id: 'style-float-right-small' //// will work on merge with 5695
    },
    {
      name: 'couplingType',
      label: 'Coupling type (optional)',
      value: '',
      width: FormNodeWidth.S,
      type: FormNodeTypes.CONTROL,
      validators: [{ name: ValidatorNames.MaxLength, args: 1 }]
    },
    {
      name: 'vehicleConfiguration',
      label: 'Vehicle configuration',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(VehicleConfiguration),
      validators: [{ name: ValidatorNames.Required }]
    },
    {
      name: 'frameDescription',
      label: 'Frame description (optional)',
      value: '',
      width: FormNodeWidth.XL,
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(FrameDescriptions),
    },
    {
      name: 'departmentalVehicleMarker',
      label: 'Departmental vehicle marker',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.RADIO,
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
    },
    {
      name: 'euVehicleCategory',
      label: 'EU vehicle category',
      value: '',
      type: FormNodeTypes.CONTROL,
      editType: FormNodeEditTypes.SELECT,
      options: getOptionsFromEnum(EuVehicleCategories),
      validators: [{ name: ValidatorNames.Required }]
    }
  ]
};
