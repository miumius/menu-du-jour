'use strict';

angular.module('menuDuJourApp')
.controller('PlatCreateCtrl', function ($scope, $routeParams, $http, dialog, name, $log) {
	$scope.plat = {name : name};
	$scope.close = function(){
		dialog.close();
	};

	$http.get('/api/type').success(function(data) {
		$scope.types = data;
	});

	$scope.create = function(){
		$http.put('/api/plat', $scope.plat)
		.success(function(){
			$log.log('création du plat : ' + JSON.stringify($scope.plat));
			dialog.close();
		});
	};
});
