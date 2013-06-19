'use strict';

angular.module('menuDuJourApp')
  .controller('UsersCtrl', function ($scope, $http, $log) {

	$scope.loadRoles = function(){
		$http.get('/api/role')
		.success(function(data){
			$log.log('succes de l\'appel : /api/role' );

			$log.log('les roles sont : ' + JSON.stringify(data));

			$scope.roles = data;
		});
	};


	$scope.loadUsers = function(){
		$http.get('/api/user')
		.success(function(data){
			$log.log('succes de l\'appel : /api/user' );

			$log.log('les utilistateurs sont : ' + JSON.stringify(data));

			$scope.users = data;
			$scope.selectRole = {};
			for(var i=0; i < $scope.users.length; i++){
				$scope.selectRole[$scope.users[i]._id] = $scope.users[i].role._id;
			}
		});
	};

	$scope.updateUser = function(userId, roleId){
		$http.post('/api/user/'+userId+'/role/'+roleId)
		.success(function(){
			$log.log('succes de l\'appel : api/user/'+userId+'/role/'+roleId );
			$scope.loadUsers();
		});
	};

	$scope.addUser = function(){
		$http.put('/api/user', {name : $scope.newUser.name, role : {_id : $scope.newUser.role}}).success(function(){
			$log.log('succes de l\'ajout de l\'utilisateur : ' + $scope.newUser.name );
			$scope.loadUsers();
		});
	};

	$scope.deleteUser = function(userId){
		$http.delete('/api/user/' + userId).success(function(){
			$log.log('succes de la suppression de l\'utilisateur : ' + userId );
			$scope.loadUsers();
		});
	};

	$scope.loadUsers();
	$scope.loadRoles();
});
