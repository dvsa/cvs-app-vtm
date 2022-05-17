import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvBrakeSection: FormNode = {
  name: 'brakes',
  type: FormNodeTypes.GROUP,
  label: 'Brakes',
  viewType: FormNodeViewTypes.SUBHEADING,
  children: [
        {
            name: 'brakeCode',
            label: 'Brake Code',
            value: '',
            type: FormNodeTypes.CONTROL,
        },
        {
            name: 'dataTrBrakeOne',
            label: 'Service brake information',
            value: '',
            type: FormNodeTypes.CONTROL,
        },
        {
            name: 'dataTrBrakeTwo',
            label: 'Secondary brake information',
            value: '',
            type: FormNodeTypes.CONTROL,
        },
        {
            name: 'dataTrBrakeThree',
            label: 'Parking brake information',
            value: '',
            type: FormNodeTypes.CONTROL,
        },
        {
            name: 'retarderBrakeOne',
            label: 'Retarder brake one (optional)',
            value: '',
            type: FormNodeTypes.CONTROL,
        },
        {
            name: 'retarderBrakeTwo',
            label: 'Retarder brake two (optional)',
            value: '',
            type: FormNodeTypes.CONTROL,
        }
    ]
}