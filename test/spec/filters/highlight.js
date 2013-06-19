'use strict';

describe('Filter: highlight', function () {

  // load the filter's module
  beforeEach(module('menuDuJourApp'));

  // initialize a new instance of the filter before each test
  var highlight;
  beforeEach(inject(function ($filter) {
    highlight = $filter('highlight');
  }));

  it('should return the input in bold', function () {
    var text = 'angularjs';
    var textToHilight = 'gular';
    expect(highlight(text, textToHilight)).toBe('an<b>gular</b>js');
  });

  it('should not return the input in bold', function(){
    var text = 'angularjs';
    var textToHilight = 'Gular';
    expect(highlight(text, textToHilight, true)).toBe('angularjs');
  });

});
