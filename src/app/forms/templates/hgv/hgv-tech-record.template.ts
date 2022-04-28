import { FormNode, FormNodeTypes, FormNodeViewTypes } from '../../services/dynamic-form.service';

export const HgvTechRecord: FormNode = {
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
            viewType: FormNodeViewTypes.STRING
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
            name: 'speedLimiterMrk',
            label: 'Speed limiter exempt',
            value: '',
            children: [],
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING
        },
        {
            name: 'tachoExemptMrk',
            label: 'Tacho exempt',
            value: '',
            children: [],
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING
        },
        {
            name: 'euroStandard',
            label: 'Euro standard',
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
            name: 'fuelpropulsionsystem',
            label: 'Fuel / propulsion system',
            value: '',
            children: [],
            type: FormNodeTypes.CONTROL,
            viewType: FormNodeViewTypes.STRING
        },
        {
            name: 'drawbarCouplingFitted',
            label: 'Drawbar coupling fitted',
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
            name: 'offRoad',
            label: 'Off road vehicle',
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
            name: 'emissionsLimit',
            label: 'Emission limit (plate value)',
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
}