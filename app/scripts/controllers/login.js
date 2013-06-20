'use strict';

angular.module('menuDuJourApp')
	.controller('LoginCtrl', function($scope, $window, $location, $http, $log, authService){
		$scope.master = {};
		$scope.loginErrorMessage = '';
		$scope.authentification = function(){
			$http.post('/auth/login', {username : $scope.user.name, password : $scope.user.password})
			.success(function(){
				$scope.loginErrorMessage = '';
				$log.log('authentification réussi');
				authService.loginConfirmed();
				$window.history.back();
			})
			.error(function(data){
				$scope.loginErrorMessage = data.error;
				$scope.reset();
				$log.log($scope.loginErrorMessage);
			});
		};

		$scope.reset = function(){
			$scope.user = angular.copy($scope.master);
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