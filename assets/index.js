var mainApp = angular.module("mainApp", []);

mainApp.controller('mainAppController', function($rootScope, $scope, $compile, $q) {
	
	let cols1 = 1;
	let cols2 = 1;
	let cols3 = 1;
	const length = 12;
	const API_KEY = 'AIzaSyCG6wKJIQq70n8YFrkF1jC97jxjxBjK7BM';
	
	$scope.options = [
		{
			'name': 'Map of a place or address',
			'src': 'https://www.google.com/maps/embed/v1/place?key=' + API_KEY + '&q=Thessaloniki'
		},
		{
			'name': 'Map of search results',
			'src': 'https://www.google.com/maps/embed/v1/search?key=' + API_KEY + '&q=record+stores+in+Seattle'
		},
		{
			'name': 'Map of driving directions',
			'src': 'https://www.google.com/maps/embed/v1/directions?key=' + API_KEY + '&origin=Oslo+Norway&destination=Telemark+Norway'
		},
		{
			'name': 'Map of specific area',
			'src': 'https://www.google.com/maps/embed/v1/view?key=' + API_KEY + '&center=-33.8569,151.2152&zoom=18'
		},
		{
			'name': 'Street View or custom panorama of Google Maps',
			'src': 'https://www.google.com/maps/embed/v1/streetview?key=' + API_KEY + '&location=46.414382,10.013988'
		},
		{
			'name': 'Temperature Map',
			'src': 'https://darksky.net/map-embed/@temperature,39.000,-95.000,4.js?embed=true&timeControl=true&fieldControl=true&defaultField=temperature&defaultUnits=_c'
		}
	];
	
	$scope.addColumn = function(area, row) {
		$('#' + row).empty();
		
		if (area == 'area1') {
			if (cols1 <= 11) cols1 += 1;
			appendToElement(row, cols1, 1);
		} else if (area == 'area2') {
			if (cols2 <= 11) cols2 += 1;
			appendToElement(row, cols2, 2);
			
		} else {
			if (cols3 <= 11) cols3 += 1
			appendToElement(row, cols3, 3);
		}
			
	};
	
	appendToElement = function(row, col, type) {
		let pieces = Math.floor(length/col);
		let start;
		
		if (type == 1) start = 0;
		else if (type == 2) start = 12;
		else start = 24;
		
		for (let i = start; i < start + col; i++) {
			let select = '<select style="width: 15%" class="float-lg-right" ng-options="option.name for option in options" ng-model="selected' + i + '" ng-click="selectService(selected' + i + '.src,\'select' + i + '\')"><option value="" disabled selected> Select Service </option></select><br><br>';
			let temp = '<div id="select' + i + '" class="col-md-' + pieces + ' text-center" style="word-break: break-all;">' + select + '</div>';

			$('#' + row).append(temp);
		}
		$compile($('#' + row))($scope);
	};
	
	$scope.selectService = function(src, id) {
		$('#' + id + id).remove();
	
		let width = parseInt($('#' + id).width()) - 10;
		let tmp = '<iframe id="' + id + id + '" frameborder="0" width="' + width + '" height="' + width + '" style="border:0" src="' + src + '" allowfullscreen></iframe>';
		
		$('#' + id).append(tmp);
		$compile($('#' + id))($scope);
	};
});

