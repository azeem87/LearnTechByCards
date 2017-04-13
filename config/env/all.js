

'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  app: {
    title: 'LearnTechByCards',
    description: 'Learn Technology By Viewing Each Cards',
    keywords: 'Tech, Cards, Learn',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  root: rootPath,
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'CARDS-SECRET',
  sessionCollection: 'sessions',
  folders : {
    pub: 'pub',
    dist: 'dist',
    config: 'config',
    app: 'app'
  }
};
