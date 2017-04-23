'use strict';

// Setting up route
angular.module('main').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise('not-found');

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/client/home.html'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'views/client/404.html'
      });
  }
]);
