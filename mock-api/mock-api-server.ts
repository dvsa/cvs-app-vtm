import { VehicleTypes } from '../src/app/models/vehicle-tech-record.model';
import * as jsonServer from 'json-server';
import { mockTestResultList } from '../src/mocks/mock-test-result';
import { mockVehicleTechnicalRecordList } from '../src/mocks/mock-vehicle-technical-record.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

const args = require('minimist')(process.argv.slice(2));

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/:vin/*', (req, res) => {
  switch (args['tech-record']) {
    case 'NotFound':
      res.status(404);
      res.statusMessage = 'NotFound';
      res.jsonp('Error no vehicle found');
      break;
    case 'ServiceError':
      res.status(500);
      res.statusMessage = 'Unavailable';
      res.jsonp('Error service unavailable');
      break;
    default:
      if (req.params['vin'] === "12345") {
        res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.HGV));
      } else if (req.params['vin'] === "78910") {
        res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.TRL));
      } else {
        res.jsonp(mockVehicleTechnicalRecordList());
      }
      break;
  }
});

server.get('/test-results/:systemId', (req, res) => {

  switch (args['test-result']) {
    case 'NotFound':
      res.status(404);
      res.statusMessage = 'NotFound';
      res.jsonp('Error no test records found');
      break;
    case 'ServiceError':
      res.status(500);
      res.statusMessage = 'Unavailable';
      res.jsonp('Error service unavailable');
      break;
    default:
      res.jsonp(mockTestResultList());
      break;
  }
});

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running on port 3005');
});
