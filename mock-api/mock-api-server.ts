import * as jsonServer from 'json-server';
import { VehicleTypes } from '../src/app/models/vehicle-tech-record.model';
import { mockTestResultList } from '../src/mocks/mock-test-result';
import { mockVehicleTechnicalRecord } from '../src/mocks/mock-vehicle-technical-record.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/:systemNumber/*', (req, res) => {
  switch (req.params.systemNumber) {
    case 'delayok':
      console.log('Delaying request');
      setTimeout(() => {
        res.jsonp(mockVehicleTechnicalRecord());
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
    case 'XMGDE02FS0H012345':
    case 'PSV':
      res.jsonp(mockVehicleTechnicalRecord());
      console.log('PSV technical record');
      break;
    case 'XMGDE03FS0H012345':
    case 'HGV':
      res.jsonp(mockVehicleTechnicalRecord(VehicleTypes.HGV));
      console.log('HGV technical record');
      break;
    case 'XMGDE04FS0H012345':
    case 'TRL':
      res.jsonp(mockVehicleTechnicalRecord(VehicleTypes.TRL));
      console.log('TRL technical record');
      break;
    default:
      res.status(404);
      res.statusMessage = 'NotFound';
      res.jsonp('Error no tech records found');
      break;
  }
});

server.get('/test-results/:systemNumber', (req, res) => {
  switch (req.params.systemNumber) {
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
      res.jsonp(mockTestResultList(1, req.params.systemNumber));
      break;
  }
});

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running on port 3005');
});
