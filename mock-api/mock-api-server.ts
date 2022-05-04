import * as jsonServer from 'json-server';
import { mockTestResultList } from '../src/mocks/mock-test-result';
import { mockVehicleTecnicalRecordList } from '../src/mocks/mock-vehicle-technical-record.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/:id/*', (req, res) => {
  // Switch on VIN
  switch (req.params.id) {
    case 'delayok':
      console.log('Delaying request');
      setTimeout(() => {res.jsonp(mockVehicleTecnicalRecordList())}, 2500);
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
        res.statusMessage = 'NotFound';
        res.jsonp('Error no vehicle found');
        break;
    default:
      res.jsonp(mockVehicleTecnicalRecordList());
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
      res.jsonp(mockTestResultList());
      break;
  }
});

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running on port 3005');
});
