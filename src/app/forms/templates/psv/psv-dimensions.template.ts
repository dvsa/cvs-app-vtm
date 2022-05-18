import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.types';

export const PsvDimensionsSection: FormNode = {
    name: 'dimensionsSection',
    label: 'Dimensions',
    type: FormNodeTypes.GROUP,
    viewType: FormNodeViewTypes.SUBHEADING,
    children: [
        {
            name: 'dimensions',
            label: 'Dimensions',
            value: '',
            type: FormNodeTypes.GROUP,
            children: [
                {
                    name: 'height',
                    label: 'Height',
                    value: '',

                    type: FormNodeTypes.CONTROL,
                    viewType: FormNodeViewTypes.STRING
                },
                {
                    name: 'length',
                    label: 'Length',
                    value: '',

                    type: FormNodeTypes.CONTROL,
                    viewType: FormNodeViewTypes.STRING
                },
                {
                    name: 'width',
                    label: 'Width',
                    value: '',

                    type: FormNodeTypes.CONTROL,
                    viewType: FormNodeViewTypes.STRING
                }
            ]
        },
        {
            name: 'frontAxleToRearAxle',
            label: 'Front axle to rear axle',
            value: '',

            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING
        }
    ]
};




