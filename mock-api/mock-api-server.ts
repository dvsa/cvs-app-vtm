import { VehicleTypes } from '../src/app/models/vehicle-tech-record.model';
import * as jsonServer from 'json-server';
import { mockTestResultList } from '../src/mocks/mock-test-result';
import { mockVehicleTechnicalRecordList } from '../src/mocks/mock-vehicle-technical-record.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/:vin/*', (req, res) => {
  switch (req.params.vin) {
    case 'delayok':
      console.log('Delaying request');
      setTimeout(() => {
        res.jsonp(mockVehicleTechnicalRecordList());
      }, 2500);
      break;
    case 'delayservererror':
      console.log('Delaying not found request');
      setTimeout(() => {
        res.status(500);
        res.statusMessage = 'Unavailable';
        res.jsonp('Error service unavailable');
      }, 2500);
      break;
    case 'servererror':
      res.status(500);
      res.statusMessage = 'Unavailable';
      res.jsonp('Error service unavailable');
      break;
    case 'notfound':
      res.status(404);
      res.statusMessage = 'Not Found';
      res.jsonp({ errors: ['No resources match the search criteria.'] });
      console.log('No vehicle found');
      break;
    case 'HGV':
      res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.HGV));
      console.log('HGV technical record');
      break;
    case 'XMGDE03FS0H012345':
      res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.HGV));
      console.log('HGV technical record');
      break;
    case 'TRL':
      res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.TRL));
      console.log('TRL technical record');
      break;
    case 'XMGDE04FS0H012345':
      res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.TRL));
      console.log('TRL technical record');
      break;
    default:
      res.jsonp(mockVehicleTechnicalRecordList());
      break;
  }
});

server.get('/test-results/:systemId', (req, res) => {
  switch (req.params.systemId) {
    case 'notfound':
      res.status(404);
      res.statusMessage = 'NotFound';
      res.jsonp('Error no test records found');
      break;
    case 'servererror':
      res.status(500);
      res.statusMessage = 'Unavailable';
      res.jsonp('Error service unavailable');
      break;
    default:
      res.jsonp(mockTestResultList(1, req.params.systemId));
      break;
  }
});

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running on port 3005');
});
