var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentDataCtrl', ['$http', '$scope', '$filter', 'ngTableParams', function ($http, $scope, $filter, ngTableParams) {

    $http.get('/api/shipments').
    success(function(data) {
        $scope.shipments = data;

        $scope.tableParams = new ngTableParams(
            {
                page: 1,            // show first page
                count: 10,          // count per page
                filter: {
                    company: ''       // initial filter
                }
            }, {
                total: data.length, // length of data

                getData: function($defer, params) {
                    var orderedData = params.filter() ?
                           $filter('filter')(data, params.filter()) :
                           data;

                    $scope.shipments = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); 
                    $defer.resolve($scope.shipments );
                }
            });
    });


}]);

