'use strict';

angular.module('menuDuJourApp')
	.controller('LoginCtrl', function($scope, $window, $location, $http, $log, authService){

		$scope.authentification = function(){
			$http.post('/auth/login', {username : $scope.user.name, password : $scope.user.password})
			.success(function(){
				$log.log('authentification réussi');
				authService.loginConfirmed();
				$window.history.back();
			})
			.error(function(data, status, headers, config){
				$log.log(JSON.stringify(data));
				$log.log(JSON.stringify(status));
				$log.log(JSON.stringify(headers));
				$log.log(JSON.stringify(config));
			});
		};
	})
	.controller('LogoutCtrl', function($scope, $window, $location, $http, $log){
		$http.get('/auth/logout')
		.success(function(){
			$log.log('déconnexion réussi');
			$location.path('/');
		})
		.error(function(data, status, headers, config){
			$log.log(JSON.stringify(data));
			$log.log(JSON.stringify(status));
			$log.log(JSON.stringify(headers));
			$log.log(JSON.stringify(config));
		});
	});