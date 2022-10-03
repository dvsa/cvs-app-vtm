import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';


export const PsvBrakeSectionWheelsNotLocked: FormNode = {
    name: 'brakes',
    type: FormNodeTypes.GROUP,
    label: 'Brake force wheels not locked',
    children: [
        {
            name: 'brakeForceWheelsNotLocked',
            type: FormNodeTypes.GROUP,
            children: [
                {
                    name: 'serviceBrakeForceA',
                    label: 'Service',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'secondaryBrakeForceA',
                    label: 'Secondary',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
                {
                    name: 'parkingBrakeForceA',
                    label: 'Parking',
                    value: '',
                    type: FormNodeTypes.CONTROL,
                },
            ]
        }
    ]
}
