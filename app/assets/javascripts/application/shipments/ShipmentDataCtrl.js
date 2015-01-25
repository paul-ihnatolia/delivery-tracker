var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentDataCtrl', ['$http', '$scope', '$filter', 'ngTableParams', function ($http, $scope, $filter, ngTableParams) {

	$http.get('/api/shipments').
	success(function(data, status, headers, config) {
    $scope.shipments = data;

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter: {
            company: 'M'       // initial filter
        },
        sorting: {
            company: 'asc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var filteredData = params.filter() ?
                    $filter('filter')(data, params.filter()) :
                    data;
            var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    data;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

	}).
	error(function(data, status, headers, config) {
		console.log(data);
	});

}]);

