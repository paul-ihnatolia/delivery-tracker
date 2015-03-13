var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentDataCtrl', ['$http', '$scope', '$filter', 'ngTableParams', function ($http, $scope, $filter, ngTableParams) {
	var statistics = this;
    statistics.shipments = [];
    statistics.tableParams = new ngTableParams(
        {
            page: 1,
            count: 25,
            filter: {
                company: ''
            },
            sorting: {
                user: 'asc',
                company: 'asc'
            }
        },
        {
            total: 0,

            getData: function($defer, params) {
                var new_date = $scope.date_range;
                var start_date = moment(new_date.startDate).format('YYYY/MM/DD');
                var end_date = moment(new_date.endDate).format('YYYY/MM/DD');
                var date_range = start_date + '-' + end_date;
                
                var http_service = $http.get('/api/shipments?date_range=' + date_range).success(function(sdata) {
                    var data = sdata;
                    var filteredData = params.filter() ?
                       $filter('filter')(data, params.filter()) :
                       data;
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        filteredData;
                    statistics.shipments = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    statistics.tableParams.total(orderedData.length);
                    $defer.resolve(statistics.shipments);
                }).error(function (error) {
                    alert('Some error happened!');
                });
            }
        });

    $scope.getShipmentClass = function(status){
        if(status == 'shipping') {
            return 'label label-warning';
        } else {
            return 'label label-success';
        }
    };

    $scope.date_range = {
        startDate: moment().subtract("days", 1),
        endDate: moment()
    };

    var preventFirstLoading = true;
    $scope.$watch("date_range", function (new_date) {
        if (preventFirstLoading) {
            preventFirstLoading = false;
            return;
        }
        statistics.tableParams.reload();


    }, false);
}]);
