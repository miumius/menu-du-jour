'use strict';

describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('menuDuJourApp'));

  var $httpBackend,
    scope,
    $controller;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET','/api/user').respond([
      {_id:1, name: 'lemice', role:{_id: 1, libelle : 'administrator', level :100}},
      {_id:2, name: 'picach', role:{_id: 2, libelle : 'editor', level :10}},
    ]);
    
    $httpBackend.when('GET','/api/role').respond([
      {_id: 1, libelle : 'administrator', level :100},
      {_id: 2, libelle : 'editor', level :10},
    ]);
    $httpBackend.when('POST','/api/user/1/role/2').respond(200, {});
    $httpBackend.when('PUT','/api/user',  {name : 'toto', role: {_id: 1}} ).respond(200, {});
    $httpBackend.when('DELETE','/api/user/1').respond(200, {});

    var $rootScope = $injector.get('$rootScope');    
    scope = $rootScope.$new();
    
    //routeParams = {year: 2013, month: 5, day : 23};

    $controller =  $injector.get('$controller');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch the list of users and the list of roles', function () {
    $httpBackend.expectGET('/api/user');
    $httpBackend.expectGET('/api/role');
    $controller('UsersCtrl', {$scope: scope});
    $httpBackend.flush();
  });

  it('should attach 2 users to the scope', function(){
    $controller('UsersCtrl', {$scope: scope});
    expect(scope.users).toBeUndefined();
    $httpBackend.flush();
    expect(scope.users.length).toEqual(2);
  });

  it('should post the new role of user', function(){    
    $controller('UsersCtrl', {$scope: scope});
    $httpBackend.flush();
    $httpBackend.expectPOST('/api/user/1/role/2');
    scope.updateUser(1,2);
    $httpBackend.flush();
  });

  it('should put the new user', function(){    
    $controller('UsersCtrl', {$scope: scope});
    $httpBackend.flush();
    $httpBackend.expectPUT('/api/user', {name : 'toto', role: {_id: 1}});
    scope.newUser = {name : 'toto', role: 1};
    scope.addUser();
    $httpBackend.flush();
  });

  it('should delete the user', function(){    
    $controller('UsersCtrl', {$scope: scope});
    $httpBackend.flush();
    $httpBackend.expectDELETE('/api/user/1');    
    scope.deleteUser(1);
    $httpBackend.flush();
  });

});