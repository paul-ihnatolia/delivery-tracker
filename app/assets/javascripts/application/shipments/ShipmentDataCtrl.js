var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentDataCtrl', ['$http', '$scope', '$filter', 'ngTableParams', function ($http, $scope, $filter, ngTableParams) {
	var statistics = this;
    statistics.shipments = [];
    statistics.tableParams = new ngTableParams(
        {
            page: 1,
            count: 10,
            filter: {
                company: '',
                category: 'shipping'
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

    $scope.date_range = {
        startDate: moment(),
        endDate: moment()
    };

    $scope.getShipmentClass = function(category){
        if(category == 'shipping') {
            return 'label label-warning';
        } else {
            return 'label label-success';
        }
    };

    var preventFirstLoading = true;
    $scope.$watch("date_range", function (new_date) {
        if (preventFirstLoading) {
            preventFirstLoading = false;
            return;
        }
        statistics.tableParams.reload();


    }, false);

    statistics.clearFilters = function() {
        if ($('.wrapper ul.nav-tabs li:first-child').hasClass('active')) {
            statistics.tableParams.filter({category: 'shipping'});
        } else if ($('.wrapper ul.nav-tabs li:last-child').hasClass('active')) {
            statistics.tableParams.filter({category: 'receiving'});
        }
        $scope.date_range = {
            startDate: moment(),
            endDate: moment()
        };
    };

    statistics.filterByCategory =function(category) {
        if (category == 'shipping') {
            statistics.tableParams.filter({category: category});
            $('.wrapper ul.nav-tabs li:first-child').addClass('active');
            $('.wrapper ul.nav-tabs li:last-child').removeClass('active');
        } else if (category == 'receiving') {
            statistics.tableParams.filter({category: category});
            $('.wrapper ul.nav-tabs li:first-child').removeClass('active');
            $('.wrapper ul.nav-tabs li:last-child').addClass('active');
        }
    };
}]);
