'use strict';

angular.module('menuDuJourApp', ['menuDuJourFilters', 'ui.date', 'ui.bootstrap', 'http-auth-interceptor'])
  .config(function($routeProvider) {
    var currentDate = new Date();
    $routeProvider
      .when('/menus/create/:year/:month/:day', {
        templateUrl: 'views/menuCreate.html',
        controller: 'MenuCreateCtrl'
      })
      .when('/menus/view/:year/:month/:day', {
        templateUrl: 'views/menus.html',
        controller: 'MenuViewCtrl'
      })
      .when('/plats/create', {
        templateUrl: 'views/platCreate.html',
        controller: 'PlatCreateCtrl'
      })
      .when('/login', {
        templateUrl:'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/logout', {
        templateUrl:'views/logout.html',
        controller: 'LogoutCtrl'
      })
      .when('/users', {
        templateUrl : 'views/users.html',
        controller : 'UsersCtrl'
      })
      .otherwise({
        redirectTo: '/menus/view/' + currentDate.getFullYear() + '/' +  (parseInt(currentDate.getMonth(),10) + 1) + '/' + currentDate.getDate()
      });
  });
