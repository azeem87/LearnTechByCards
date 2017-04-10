'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..'),
  appRoot = path.resolve(__dirname);

module.exports = {
  app: {
    title: 'LearnTechByCards',
    description: 'Learn Technology By Viewing Each Cards',
    keywords: 'Tech, Cards, Learn',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  root: rootPath,
  rootPath : appRoot,
  port: process.env.PORT || 3000,
  templateEngine: 'ejs',
  sessionSecret: 'CARDS-SECRET',
  sessionCollection: 'sessions',
  files : {
    pub: 'pub',
    dist: 'dist',
    config: 'config',
    app: 'app'
  }
};

