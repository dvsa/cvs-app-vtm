import * as jsonServer from 'json-server';
import * as mockTechRecord from '../src/mocks/vehicleTechnicalRecord.mock';
const server = jsonServer.create();
const router = jsonServer.router('{}');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/vehicles/*', (req, res) => {
  res.jsonp([mockTechRecord.default]);
});

server.use(router);
server.listen(3005, () => {
  console.log('JSON Server is running');
});
