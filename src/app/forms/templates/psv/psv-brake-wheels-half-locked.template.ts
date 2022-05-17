import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';


export const PsvBrakeSectionWheelsHalfLocked: FormNode = {
    name: 'brakes',
    type: FormNodeTypes.GROUP,
    label: 'Brake force wheels up to half locked',
    viewType: FormNodeViewTypes.SUBHEADING,
    children: [
        {
            name: 'brakeForceWheelsUpToHalfLocked',
            type: FormNodeTypes.GROUP,
            children: [
                {
                    name: 'parkingBrakeForceB',
                    label: 'Service',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'secondaryBrakeForceB',
                    label: 'Secondary',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'serviceBrakeForceB',
                    label: 'Parking',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
            ]
        }
    ]
}