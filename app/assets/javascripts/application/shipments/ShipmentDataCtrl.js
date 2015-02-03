var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentDataCtrl', ['$http', '$scope', '$filter', 'ngTableParams', function ($http, $scope, $filter, ngTableParams) {

    $http.get('/api/shipments').
    success(function(data) {
        $scope.shipments = data;

        $scope.tableParams = new ngTableParams(
            {
                page: 1,            
                count: 10,          
                filter: {
                    company: ''       
                },
                sorting: {
                    company: ''     
                }
            }, 
            {
                total: data.length, 

                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                       $filter('filter')(data, params.filter()) :
                       data;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        data;
       
                    $scope.shipments = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); 
                    $defer.resolve($scope.shipments );
                }
            });
    });


}]);

