const controllers = require('./controllers');

const routes = [{
  method: 'GET',
  handler: controllers.getStatus,
  options: {
    auth: false,
    description: 'Checks if the service is alive'
  },
  path: '/status'
}];

module.exports = routes;
