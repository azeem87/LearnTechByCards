'use strict';

module.exports = function (app) {
  // Root routing
  var rootController = require('../controllers/root.controller');

  // Define error pages
  app.route('/server-error').get(rootController.renderServerError);

  // Define application route
  app.route('/*').get(rootController.renderIndex);
};
