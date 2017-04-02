var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 9000,
  title: 'LearnTechByCards',
  description: 'Learn Technology By Viewing Each Cards',
  keywords: 'Tech, Cards',
  googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID',
  db: process.env.MONGOHQ_URL,
  templateEngine: 'dot',
  sessionSecret: 'CARDS-SECRET',
  sessionCollection: 'sessions',
  logo: 'pub/images/logo.png',
  favicon: 'pub/favicon.ico'
};

