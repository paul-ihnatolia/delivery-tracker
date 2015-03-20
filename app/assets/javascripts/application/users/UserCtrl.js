(function(){
    angular.module('dtracker')
        .controller('UsersCtrl', ['$http', '$scope', '$filter', 'ngTableParams',
                                  function($http, $scope, $filter, ngTableParams){
            var data = [];
            $scope.tableParams = new ngTableParams(
                {
                    page: 1,
                    count: 10,
                    filter: {},
                    sorting: {
                        created_at: 'desc'
                    }
                },
                {
                    getData: function($defer, params){
                        $http.get('/api/users')
                            .success(function(data) {
                                data = data.carriers;
                                var filteredData = params.filter() ?
                                                    $filter('filter')(data, params.filter()) :
                                                    data;
                                var sortedData = params.sorting() ?
                                                    $filter('orderBy')(filteredData, params.orderBy()) :
                                                    filteredData;
                                $defer.resolve(sortedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            })
                            .error(function() {
                                alert('Error happens when retrieving users data');
                            });
                    }
                }
            );

            $scope.clearSorting = function() {
                $scope.tableParams.sorting({
                    created_at: 'desc'
                })
            };

            $scope.clearFilter = function() {
                $scope.tableParams.filter({})
            };
        }]);
}());