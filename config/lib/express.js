'use strict';

/**
 * Module dependencies.
 */

var config = require('../config'),
  express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  flash = require('connect-flash'),
  consolidate = require('consolidate'),
  path = require('path');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.secure = config.secure;
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Initialize favicon middleware
  app.use(favicon('./'+app.local.favicon));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());

  // Add multipart handling middleware
  // app.use(multer({
  //  dest: './uploads/',
  //  inMemory: true
  //}));

};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  // Set ejs as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', config.root + config.viewPath);
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessionCollection
    })
  }));
};

//todo
/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
  config.files.server.configs.forEach(function (configPath) {
    require(path.resolve(configPath))(app, db);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public')));

  // Globbing static routing
  config.folders.client.forEach(function (staticPath) {
    app.use(staticPath.replace('/client', ''), express.static(path.resolve('./' + staticPath)));
  });
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
  // Globbing policy files
  config.files.server.policies.forEach(function (policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
  // Globbing routing files
  config.files.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app, db);

  // Return server object
  return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes
  this.initModulesClientRoutes(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app, db);

  return app;
};


var express = require('express'),
  mongoStore = require('connect-mongo'),
  flash = require('connect-flash'),
  helpers = require('view-helpers'),
  config = require('./../config'),
  doT = require('express-dot'),
  path = require('path');

module.exports = function(app, passport, db) {
  app.set('showStackError', true);

  //Prettify HTML
  app.locals.pretty = true;

  //Should be placed before express.static
  /* app.use(express.compress({
   filter: function(req, res) {
   return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
   },
   level: 9
   }));
   */
  //Setting the fav icon and static folder
  // app.use(express.favicon());
  var appFolder = (process.env.NODE_ENV==='production') ? '/dist' : '/pub';

  app.use(express.static(config.root + appFolder));
  app.use("/bower_components",express.static(config.root + '/bower_components'));

  //Don't use logger for test env
  //  if (process.env.NODE_ENV !== 'test') {
  //    app.use(express.logger('dev'));
  //}
  //Set views path, template engine and default layout
  app.set('views', config.root + appFolder+'/views');
  app.set('view engine', 'dot');
  app.engine('html', doT.__express);
  doT.templateSettings = {
    varname: 'data'
  }

  //Enable jsonp
  app.enable("jsonp callback");

  /* app.configure(function() {


   });
   */

  //cookieParser should be above session
// app.use(express.cookieParser());

  // request body parsing middleware should be above methodOverride
  //app.use(express.urlencoded());
  //app.use(express.json());
  //app.use(express.methodOverride());

  //express/mongo session storage
  /*app.use(express.session({
   secret: 'CARDS-SECRET',
   store: new mongoStore({
   db: db.connection.db,
   collection: 'sessions'
   })
   }));
   */

  //connect flash for flash messages
// app.use(flash());

  //dynamic helpers
// app.use(helpers(config.app.name));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  //routes should be at the last
  //app.use(app.router);

  //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function(err, req, res, next) {
    //Treat as 404
    if (~err.message.indexOf('not found')) return next();

    //Log it
    console.error(err.stack);

    //Error page
    //res.status(500).render('500.html', {
    error: err.stack
    //});
  });

  //app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  // res.sendFile('index.html', { root: __dirname });
  //});


  //Assume 404 since no middleware responded
  //app.use(function(req, res, next) {
  //  res.status(404).render('404.html', {
  //    url: req.originalUrl,
  //    error: 'Not found'
  //  });
  //});
};
