import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';


export const PsvBrakeSectionWheelsHalfLocked: FormNode = {
    name: 'brakes',
    type: FormNodeTypes.GROUP,
    label: 'Brake force wheels up to half locked',
    children: [
        {
            name: 'brakeForceWheelsUpToHalfLocked',
            type: FormNodeTypes.GROUP,
            children: [
                {
                    name: 'serviceBrakeForceB',
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
                    name: 'parkingBrakeForceB',
                    label: 'Parking',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
            ]
        }
    ]
}
