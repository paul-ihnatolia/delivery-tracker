(function () {
  'use strict';
  
  var dtracker = angular.module('dtracker');

  dtracker.controller('ApplicationCtrl', ['$scope', '$rootScope', '$state', '$location',
    function ($scope, $rootScope, $state, $location) {
    $scope.currentUser = null;

    $rootScope.$on('session:change', function (event, user) {
      $scope.currentUser = user;
    });

    // // Redirect to /new-password on $ng-auth
    // $rootScope.$on('auth:password-reset-confirm-success', function () {
    //   $location.path('/auth/new-pass');
    // });

    // // Redirect to /new-password on $ng-auth
    // $rootScope.$on('auth:password-reset-confirm-error', function () {
    //   console.log('Password reset error');
    // });
  }]);
}());