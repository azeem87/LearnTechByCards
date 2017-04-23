'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'views/client/authentication.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'views/client/signup.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'views/client/signin.html'
      });
  }
]);
