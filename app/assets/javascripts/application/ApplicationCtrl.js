(function () {
  'use strict';
  
  var dtracker = angular.module('dtracker');

  dtracker.controller('ApplicationCtrl', ['$scope', '$rootScope', 'user', '$state', '$location',
    function ($scope, $rootScope, user, $state, $location) {
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

    // Redirect to /new-password on $ng-auth
    $rootScope.$on('auth:password-reset-confirm-success', function () {
      $location.path('/auth/new-pass');
    });

    // Redirect to /new-password on $ng-auth
    $rootScope.$on('auth:password-reset-confirm-error', function () {
      console.log('Password reset error');
    });
  }]);
}());