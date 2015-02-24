var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentDataCtrl', ['$http', '$scope', '$filter', 'ngTableParams', function ($http, $scope, $filter, ngTableParams) {
	var statistics = this;
    statistics.shipments = [];
    $scope.date_range = { 
        startDate: moment().subtract("days", 1),
        endDate: moment()
    };

    // $http.get('/api/shipments').
    // success(setTable);
    var first = true;
    $scope.$watch("date_range", function (new_date) {
        var start_date = moment(new_date.startDate).format('YYYY/MM/DD');
        var end_date = moment(new_date.endDate).format('YYYY/MM/DD');
        var date_range = start_date + '-' + end_date;
        $http.get('/api/shipments?date_range=' + date_range).success(function(data) {
            if (first) {
            first = false;
            setTable(data);
            } else {
               statistics.shipments = data;
               statistics.tableParams.reload(); 
            }
        }).error(function (error) {
            alert('Some error happened!');
        });
    }, false);

    function setTable (data) {
        statistics.shipments = data;
        statistics.tableParams = new ngTableParams(
            {
                page: 1,            
                count: 25,          
                filter: {
                    company: ''       
                },
                sorting: {
                    company: 'asc'     
                }
            }, 
            {
                total: statistics.shipments.length,

                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                       $filter('filter')(statistics.shipments, params.filter()) :
                       statistics.shipments;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        statistics.shipments;
       
                    statistics.shipments = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); 
                    $defer.resolve(statistics.shipments );
                }
            });
    }

    $scope.$watch(statistics.tableParams, function (params) {
                    if (!params)
                        return;
                    var filteredData = params.filter() ?
                       $filter('filter')(data, params.filter()) :
                       data;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        data;
       
                    statistics.shipments = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); 

    });
}]);
