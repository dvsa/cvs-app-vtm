import { VehicleTechRecordModel } from '../app/models/vehicle-tech-record.model';

export default <VehicleTechRecordModel>{
  systemNumber: '11000001',
  vin: 'XMGDE02FS0H012345',
  trailerId: '09876543',
  vrms: [
    {
      vrm: 'KP01 ABC',
      isPrimary: true
    },
    {
      vrm: '609859Z',
      isPrimary: false
    }
  ]
};
