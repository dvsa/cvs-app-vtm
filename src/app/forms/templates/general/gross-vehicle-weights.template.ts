import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';
import { generateWeights } from '../general/weights.template';

export function getGrossVehicleWeightsTemplate(vehicleType: VehicleTypes): FormNode {
    return {
        name: 'grossVehicleWeight',
        label: 'Gross Vehicle Weight',
        value: '',
        type: FormNodeTypes.GROUP,
        children: vehicleType !== VehicleTypes.PSV ?
            generateWeights(vehicleType, 'gross') :
            generateWeights(VehicleTypes.PSV, 'gross').concat([
                {
                name: 'unladenWeight',
                label: 'Unladen weight',
                value: '',
                type: FormNodeTypes.CONTROL
                }
            ])
    };
}
