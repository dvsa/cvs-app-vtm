import * as jsonServer from 'json-server';
import { mockTestResult } from '../src/mocks/mock-test-result';
import * as mockTechRecord from '../src/mocks/vehicleTechnicalRecord.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/*', (req, res) => {
  res.jsonp([mockTechRecord.default]);
});

server.get('/test-results/:systemId', (req, res) => {
  res.jsonp(mockTestResult())
})

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running on port 3005');
});
