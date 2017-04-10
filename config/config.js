'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  glob = require('glob'),
  path = require('path');

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {

  // Get the default config
  var allConfig = require(path.join(process.cwd(), 'config/env/all'));

  // Get the current config
  var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  var config = _.merge(allConfig, environmentConfig);

  // Setting Globbed model files
  config.files = {
    models : getGlobbedPaths("app/models/*.js")
  };

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths
  };

  console.log("root -----> "+config.root);
  console.log("rootPath -----> "+config.rootPath);

  return config;
}

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              file = file.replace(excludes[i], '');
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();

