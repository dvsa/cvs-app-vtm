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
  if (req.params['vin'] === "12345") {
    res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.HGV));
  } else if (req.params['vin'] === "78910") {
    res.jsonp(mockVehicleTechnicalRecordList(VehicleTypes.TRL));
  } else {
    res.jsonp(mockVehicleTechnicalRecordList());
  }
});

server.get('/test-results/:systemId', (req, res) => {
  res.jsonp(mockTestResultList());
});

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running on port 3005');
});
