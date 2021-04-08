const controllers = require('./controllers');
const Joi = require('joi');

const routes = [{
  method: 'GET',
  handler: controllers.getStatus,
  options: {
    auth: false,
    description: 'Checks if the service is alive'
  },
  path: '/status'
},
{
  method: 'GET',
  handler: controllers.getReport,
  options: {
    validate: {
      params: Joi.object({
        reportKey: Joi.string().required().valid(
          'unbilledActiveLicencesReport',
          'billedActiveLicencesReport',
          'uncreditedInactiveLicencesReport'
        )
      })
    },
    description: 'Grabs a report given its key'
  },
  path: '/reporting/1.0/report/{reportKey}'
}];

module.exports = routes;
