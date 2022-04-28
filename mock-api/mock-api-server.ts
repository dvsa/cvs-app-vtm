import * as jsonServer from 'json-server';
import { mockTestResultList } from '../src/mocks/mock-test-result';
import { mockVehicleTecnicalRecordList } from '../src/mocks/mock-vehicle-technical-record.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

const args = require('minimist')(process.argv.slice(2));

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/:id/*', (req, res) => {
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
      // Switch on VIN
      switch (req.params.id) {
        case 'delayfound':
          console.log('Delaying request');
          setTimeout(() => {res.jsonp(mockVehicleTecnicalRecordList())}, 2500);
          break;
        case 'delaynotfound':
          console.log('Delaying not found request');
          setTimeout(() => {
            res.status(500);
            res.statusMessage = 'Unavailable';
            res.jsonp('Error service unavailable');
          }, 2500);
          break;
        default:
          res.jsonp(mockVehicleTecnicalRecordList());
      }
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
