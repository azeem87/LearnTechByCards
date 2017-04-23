'use strict';

module.exports = function (app) {
  // Root routing
  var rootController = require('../../app/controllers/root.controller');

  // Define error pages
  app.route('/server-error').get(rootController.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api)/*').get(rootController.renderNotFound);

  // Define application route
  app.route('/*').get(rootController.renderIndex);
};
