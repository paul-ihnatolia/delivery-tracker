(function () {
  'use strict';
  var dtracker = angular.module('dtracker');

  dtracker.directive('authError', [function () {
    return {
      restrict: 'AE',
      replace: true,
      scope: false,
      templateUrl: 'application/auth/templates/auth-error.html'
    };
  }]);
}());