'use strict';

angular.module('menuDuJourFilters', [])
.filter('highlight', function () {
	return function (text, search, caseSensitive) {
		if (search || angular.isNumber(search)) {
			text = text.toString();
			search = search.toString();
			if (caseSensitive) {
				return text.split(search).join('<b>' + search + '</b>');
			}else {
				return text.replace(new RegExp(search, 'gi'), '<b>$&</b>');
			}
		}else {
			return text;
		}
	};
});
