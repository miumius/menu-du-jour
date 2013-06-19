'use strict';

describe('Controller: MenuCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('menuDuJourApp'));

  var scope,
      $httpBackend,
      $controller,
      routeParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {    
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET','/api/menu/2013/4/23').respond({_id:1, plats:[], date: '2013-05-22T22:00:00.000Z'});
    $httpBackend.when('GET','/api/menu/1/plats-non-inclus').respond([
      { _id : 1, name : 'dessert', type : {_id : 6, name: 'dessert', order : '6'}},
      { _id : 2, name : 'riz créole', type : {_id : 3, name: 'accompaniement', order : '3'}},
      { _id : 3, name : 'haricots verts', type : {_id : 3, name: 'accompaniement', order : '3'}},
      { _id : 4, name : 'lentilles cuisinées', type : {_id : 3, name: 'accompaniement', order : '3'}},
      { _id : 5, name : 'duo de carottes et navets', type : {_id : 3, name: 'accompaniement', order : '3'}},
      { _id : 6, name : 'frites', type : {_id : 3, name: 'accompaniement', order : '3'}},
      { _id : 7, name : 'ratatouille cuisinée', type : {_id : 3, name: 'accompaniement', order : '3'}},
      { _id : 8, name : 'coquillettes', type : {_id : 3, name: 'accompaniement', order : '3'}},
      { _id : 9, name : 'salade niçoise', type : {_id : 1, name: 'starter', order : '1'}},
      { _id : 10, name : 'mousse de foie de canard', type : {_id : 1, name: 'starter', order : '1'}},
      { _id : 11, name : 'concombres à l\'estragon', type : {_id : 1, name: 'starter', order : '1'}},
      { _id : 12, name : 'grillade du jour', type : {_id : 2, name: 'dish', order : '2'}},
      { _id : 13, name : 'Jambon', type : {_id : 2, name: 'dish', order : '2'}},
      { _id : 14, name : 'steack de porc dijonnaise', type : {_id : 2, name: 'dish', order : '2'}},
      { _id : 15, name : 'lasagnes bolognaises', type : {_id : 2, name: 'dish', order : '2'}}
    ]);
    
    $httpBackend.when('PUT','/api/menu/1/add/1').respond(200, {});

    $httpBackend.when('DELETE','/api/menu/1/remove/1').respond(200, {});

    var $rootScope = $injector.get('$rootScope');    
    scope = $rootScope.$new();
    
    routeParams = {year: 2013, month: 5, day : 23};

    $controller =  $injector.get('$controller');
    //controller = $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch menu', function () {
    $httpBackend.expectGET('/api/menu/2013/4/23');
    $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});
    $httpBackend.flush();
  });

  it('should fetch plats non inclus', function () {
    $httpBackend.expectGET('/api/menu/1/plats-non-inclus');
    $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});
    $httpBackend.flush();
  });

  it('should create a menu with empty plats', function(){
    expect(scope.menu).toBeUndefined();
    $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});
    $httpBackend.flush();
    expect(scope.menu.plats.length).toEqual(0);
  });

  it('should create 15 plats non inclus', function(){
    expect(scope.plats).toBeUndefined();
    $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});
    $httpBackend.flush();
    expect(scope.plats.length).toEqual(15);
  });
  
  it('should put the plat into the menu', function(){
    $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});
    $httpBackend.flush();

    var plat = scope.plats[0];

    $httpBackend.expectPUT('/api/menu/1/add/' + plat._id);

    scope.addPlat(plat);
    $httpBackend.flush();
  });

  it('should add the plat into the menu', function(){
    $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});
    $httpBackend.flush();    
    var plat = scope.plats[0];
    expect(scope.menu.plats.length).toEqual(0);
    scope.addPlat(plat);
    $httpBackend.flush();
    expect(scope.menu.plats[0]).toEqual(plat);
  });

  describe('Delete', function(){
    
    var plat;

    beforeEach(function(){
      $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});
      $httpBackend.flush();
      plat = scope.plats[0];
      scope.addPlat(plat);
      $httpBackend.flush();
    });

    it('should delete plat from menu', function(){
      $httpBackend.expectDELETE('/api/menu/1/remove/' + plat._id);
      scope.removePlat(plat);
      $httpBackend.flush();
    });

    it('should remove plat from menu', function(){      
      scope.removePlat(plat);
      expect(scope.menu.plats.length).toEqual(1);
      $httpBackend.flush();
      expect(scope.menu.plats.length).toEqual(0);
    });

  });

});

describe('Controller: MenuCreateCtrl', function () {
  // load the controller's module
  beforeEach(module('menuDuJourApp'));

  var scope,
      $httpBackend,
      $controller,
      routeParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {    
    
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET','/api/menu/2013/4/23')
    .respond({  _id:1, 
                plats:[
                { _id : 1, name : 'dessert', type : {_id : 6, name: 'dessert', order : '6'}},
                { _id : 2, name : 'riz créole', type : {_id : 3, name: 'accompaniement', order : '3'}}
                ], 
                date: '2013-05-22T22:00:00.000Z'});
    
    var $rootScope = $injector.get('$rootScope');    
    scope = $rootScope.$new();
    
    routeParams = {year: 2013, month: 5, day : 23};

    $controller =  $injector.get('$controller');
    //controller = $controller('MenuCreateCtrl', {$scope : scope, $routeParams : routeParams});

  }));

  it('should fetch the menu', function(){    
    $httpBackend.expectGET('/api/menu/2013/4/23');
    $controller('MenuViewCtrl', {$scope: scope, $routeParams : routeParams});
    $httpBackend.flush();

  });

  it('should have 2 plats in the menu', function(){
    $controller('MenuViewCtrl', {$scope: scope, $routeParams : routeParams});
    expect(scope.menu).toBeUndefined();
    $httpBackend.flush();
    expect(scope.menu.plats.length).toEqual(2);
  });
});


