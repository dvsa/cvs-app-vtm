import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createMock, createMockList } from 'ts-auto-mock';

export const mockVehicleTecnicalRecord = (systemNumber: number = 0) =>
  createMock<VehicleTechRecordModel>({
    systemNumber: `SYS${String(systemNumber + 1).padStart(4, '0')}`,
    vin: `XMGDE02FS0H0${12344 + systemNumber + 1}`,

    vrms: [
      {
        vrm: `KP${String(systemNumber + 1).padStart(2, '0')} ABC`,
        isPrimary: true
      },
      {
        vrm: '609859Z',
        isPrimary: false
      }
    ]
  });

export const mockVehicleTechnicalRecordList = (items: number = 1) => createMockList<VehicleTechRecordModel>(items, (systemNumber) => mockVehicleTecnicalRecord(systemNumber));
