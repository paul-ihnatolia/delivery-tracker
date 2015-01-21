(function () {
  'use strict';
  
  var dtracker = angular.module('dtracker');

  dtracker.controller('ApplicationCtrl', ['$scope', '$rootScope', 'user', '$state',
    function ($scope, $rootScope, user, $state) {
    $scope.currentUser = user.getCurrentUser();
    $scope.$state = $state;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
      return true;
    };

    $scope.getCurrentUser = function () {
      return $scope.currentUser;
    };

    $rootScope.$on('user:change', function () {
      console.log('user:change');
      console.log(user.getCurrentUser());
      $scope.setCurrentUser(user.getCurrentUser());
    });
  }]);
}());