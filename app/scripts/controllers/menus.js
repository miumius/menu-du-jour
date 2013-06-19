'use strict';

angular.module('menuDuJourApp')
.controller('MenuCreateCtrl', function($scope,$rootScope, $routeParams, $http, $dialog, $location, $log) {

	var date = new Date($routeParams.year, $routeParams.month - 1, $routeParams.day);
	$log.log('Parsing date from URL : ' + date);

	$log.log('on appel l\'url ' + '/api/menu/'+date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate());
	$http.get('/api/menu/'+date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate())
	.success(function(data){

		$log.log('succes de l\'appel : /api/menu/'+date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate() );
		$scope.dateOptions = { dateFormat: 'dd/mm/yy' };

		$log.log('le menu est le suivant : ' + JSON.stringify(data));

		$scope.menu = data;

		$log.log('on récupère lintégralité des plats non inclus dans le menu {id : ' + $scope.menu._id +'}');
		$http.get('/api/menu/' + $scope.menu._id + '/plats-non-inclus')
		.success(function(data) {
			$log.log('succes de l\'appel /api/menu/' + $scope.menu._id + '/plats-non-inclus');
			$scope.plats = data;
			$log.log('les plats non inclus pour le menu {id : ' + $scope.menu._id +'} sont : '  + JSON.stringify(data));
		});
	});

	$rootScope.$on('event:auth-loginRequired', function(){
		$location.path('/login');
	});

	$scope.addPlat = function(plat){
		//on sauvegarde
		$http.put('/api/menu/'+ $scope.menu._id + '/add/'+plat._id)
		.success(function(data) {
			$log.log('ajout du plat : ' + plat + ' au menu');
			$scope.menu.plats.push(plat);
			$log.log('suppression du plat : ' + plat + ' de la liste des plats non inclus');
			$scope.plats.splice($scope.plats.indexOf(plat), 1);
			console.log(data);
		});
	};

	$scope.createPlat = function(name){

		$scope.opts = {
			backdrop: true,
			keyboard: true,
			backdropClick: true,
			templateUrl:  '/views/platCreate.html',
			controller: 'PlatCreateCtrl',
			resolve: {name : function(){ return angular.copy(name);}}
		};

		var d = $dialog.dialog($scope.opts);
		d.open().then(function(){
			$http.get('/api/menu/' + $scope.menu._id + '/plats-non-inclus')
			.success(function(data) {
				$log.log('mise à jour de la liste des plats non inclus : ' +JSON.stringify(data));
				$scope.plats = data;
			});
		});
	};

	$scope.removePlat = function(plat){
		//on sauvegarde
		$http.delete('/api/menu/'+ $scope.menu._id + '/remove/'+plat._id)
		.success(function() {
			$log.log('suppression du plat : ' + JSON.stringify(plat));
			$log.log('ajout du plat : ' + JSON.stringify(plat)  +' à la liste des plats non inclus');
			$scope.plats.push(plat);
			$log.log('suppression du plat : ' + JSON.stringify(plat) + ' du menu');
			$scope.menu.plats.splice($scope.menu.plats.indexOf(plat), 1);
		});
	};

	$scope.changeDate = function(){
		var newDate = new Date($scope.menu.date);
		$log.log('changement de la date : ' + newDate);
		$log.log('on va à l\'url : /menus/create/' +  newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDate());
		$location.path('/menus/create/' +  newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDate());
	};
})

.controller('MenuViewCtrl', function($scope, $routeParams, $http, $log, $location) {

	$scope.date = new Date($routeParams.year, $routeParams.month - 1, $routeParams.day);
	$http.get('/api/menu/' + $scope.date.getFullYear()+ '/' + $scope.date.getMonth() + '/' + $scope.date.getDate())
	.success(function(data){
		$scope.menu = data;
		$log.log('affichage du menu : ' + JSON.stringify($scope.menu));
	});

	$scope.editMenu = function(){
		$location.path('/menus/create/' +  $scope.date.getFullYear() + '/' + ($scope.date.getMonth() + 1) + '/' + $scope.date.getDate());
	};

	$scope.previousDate = function(){
		var previousDate = new Date($scope.date);
		previousDate.setDate( previousDate.getDate() - 1);
		$location.path('/menus/view/' +  previousDate.getFullYear() + '/' + (previousDate.getMonth() + 1) + '/' + previousDate.getDate());
	};

	$scope.nextDate = function(){
		var nextDate = new Date($scope.date);
		nextDate.setDate( nextDate.getDate() + 1);
		$location.path('/menus/view/' +  nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + nextDate.getDate());
	};
});
