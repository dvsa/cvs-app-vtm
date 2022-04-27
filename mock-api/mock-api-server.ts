import * as jsonServer from 'json-server';
import { mockTestResultList } from '../src/mocks/mock-test-result';
import { mockVehicleTecnicalRecordList } from '../src/mocks/mock-vehicle-technical-record.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

const args = require('minimist')(process.argv.slice(2));

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/*', (req, res) => {
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
      res.jsonp(mockVehicleTecnicalRecordList());
      break;
  };
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
