var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentDataCtrl', ['$http', '$scope', function ($http, $scope) {

	$http.get('/api/shipments').
	success(function(data, status, headers, config) {
		$scope.shipments = angular.fromJson(data);
		console.log(data);
	}).
	error(function(data, status, headers, config) {
		console.log(data);
	});

}]);

